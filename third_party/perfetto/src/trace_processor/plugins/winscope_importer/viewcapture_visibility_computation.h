/*
 * Copyright (C) 2025 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation.h
#ifndef SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
#define SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
=======
#ifndef SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
#define SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation.h

#include <unordered_map>
#include <unordered_set>
#include "perfetto/protozero/field.h"
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation.h
#include "protos/third_party/android/frameworks/base/proto/tracing/winscope/viewcapture.pbzero.h"
=======
#include "protos/perfetto/trace/android/viewcapture.pbzero.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation.h

namespace perfetto::trace_processor::winscope::viewcapture {

namespace {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation.h
using ViewDecoder = com::android::internal::pbzero::ViewCapture::View::Decoder;
=======
using ViewDecoder = protos::pbzero::ViewCapture::View::Decoder;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation.h
}

// Computes visibility for every view in hierarchy, based on its properties and
// position in the hierarchy.

class VisibilityComputation {
 public:
  explicit VisibilityComputation(
      const std::vector<ViewDecoder>& views_top_to_bottom);

  std::unordered_map<int32_t, bool> Compute();

 private:
  const std::vector<ViewDecoder>& views_top_to_bottom_;
};

}  // namespace perfetto::trace_processor::winscope::viewcapture

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation.h
#endif  // SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
=======
#endif  // SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_VISIBILITY_COMPUTATION_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation.h
