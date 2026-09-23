// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "components/update_client/op_zucchini.h"

#include <string>
#include <utility>

#include "base/files/file.h"
#include "base/files/file_path.h"
#include "base/functional/bind.h"
#include "base/functional/callback.h"
#include "base/functional/callback_helpers.h"
#include "base/types/expected.h"
#include "base/values.h"
#include "components/update_client/crx_cache.h"
#include "components/update_client/delta_patch_operation.h"
#include "components/update_client/patcher.h"
#include "components/update_client/protocol_definition.h"
#include "components/update_client/update_client.h"
#include "components/update_client/update_client_errors.h"

namespace update_client {

base::OnceClosure ZucchiniOperation(
    scoped_refptr<CrxCache> crx_cache,
    scoped_refptr<Patcher> patcher,
    base::RepeatingCallback<void(base::DictValue)> event_adder,
    base::RepeatingCallback<void(ComponentState)> state_tracker,
    const std::string& previous_hash,
    const std::string& output_hash,
    bool is_foreground,
#if BUILDFLAG(IS_STARBOARD)
    const OperationResult& patch_operation_result,
    base::OnceCallback<void(base::expected<OperationResult, CategorizedError>)>
#else
    const base::FilePath& patch_file,
    base::OnceCallback<void(base::expected<base::FilePath, CategorizedError>)>
#endif
        callback) {
#if BUILDFLAG(IS_STARBOARD)
  // Cobalt's pipeline passes an OperationResult around, but DeltaPatchOperation
  // only deals in file paths. Unwrap the input and re-wrap the output.
  const base::FilePath& patch_file = patch_operation_result.response;
  base::OnceCallback<void(base::expected<base::FilePath, CategorizedError>)>
      patch_callback = base::BindOnce(
          [](OperationResult previous_result,
             base::OnceCallback<void(
                 base::expected<OperationResult, CategorizedError>)> callback,
             base::expected<base::FilePath, CategorizedError> result) {
            if (!result.has_value()) {
              std::move(callback).Run(base::unexpected(result.error()));
              return;
            }
            previous_result.response = result.value();
            std::move(callback).Run(previous_result);
          },
          patch_operation_result, std::move(callback));
#else
  base::OnceCallback<void(base::expected<base::FilePath, CategorizedError>)>
      patch_callback = std::move(callback);
#endif
  base::MakeRefCounted<DeltaPatchOperation>(
      crx_cache, event_adder, state_tracker, previous_hash,
      base::File::FLAG_CREATE | base::File::FLAG_READ | base::File::FLAG_WRITE |
          base::File::FLAG_WIN_EXCLUSIVE_WRITE |
          base::File::FLAG_WIN_SHARE_DELETE |
          base::File::FLAG_CAN_DELETE_ON_CLOSE | base::File::FLAG_NO_FOLLOW,
      output_hash, 0, patch_file, protocol_request::kEventZucchini,
      is_foreground, std::move(patch_callback))
      ->Operation(
          base::BindOnce(&Patcher::PatchZucchini, patcher, is_foreground));
  return base::DoNothing();
}

}  // namespace update_client
