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

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
#ifndef SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_WINDOWMANAGER_HIERARCHY_WALKER_H_
#define SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_WINDOWMANAGER_HIERARCHY_WALKER_H_
=======
#ifndef SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_WINDOWMANAGER_HIERARCHY_WALKER_H_
#define SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_WINDOWMANAGER_HIERARCHY_WALKER_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h

#include <optional>
#include <vector>

#include "perfetto/base/status.h"
#include "perfetto/ext/base/status_or.h"
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
#include "protos/third_party/android/frameworks/base/proto/tracing/winscope/server/windowmanagerservice.pbzero.h"
#include "protos/third_party/android/frameworks/base/proto/tracing/winscope/windowmanager.pbzero.h"
=======
#include "protos/perfetto/trace/android/server/windowmanagerservice.pbzero.h"
#include "protos/perfetto/trace/android/windowmanager.pbzero.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
#include "src/trace_processor/containers/string_pool.h"

namespace perfetto::trace_processor::winscope {

class WindowManagerHierarchyWalker {
 public:
  struct ExtractedRect {
    int32_t x;
    int32_t y;
    int32_t w;
    int32_t h;
    int32_t display_id;
    uint32_t depth;
    bool is_visible;
    std::optional<double> opacity;
  };

  struct ExtractedWindowContainer {
    StringPool::Id title;
    int32_t token;
    std::optional<int32_t> parent_token;
    std::optional<uint32_t> child_index;
    bool is_visible;
    std::optional<ExtractedRect> rect;
    std::optional<StringPool::Id> name_override;
    std::vector<uint8_t> pruned_proto;    // proto without children submessages
    const StringPool::Id container_type;  // container proto type e.g.
                                          // DisplayContent, ActivityRecord
  };

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
  struct ExtractResult {
    std::vector<ExtractedWindowContainer> window_containers;
    bool has_parse_error;
  };

=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
  static constexpr const char* kErrorMessageMissingField =
      "Protobuf message is missing expected field";

  explicit WindowManagerHierarchyWalker(StringPool* pool);

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
  ExtractResult ExtractWindowContainers(
      const com::android::internal::pbzero::WindowManagerTraceEntry::Decoder&
          entry);
=======
  base::StatusOr<std::vector<ExtractedWindowContainer>> ExtractWindowContainers(
      const protos::pbzero::WindowManagerTraceEntry::Decoder& entry);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h

 private:
  struct TokenAndTitle {
    int32_t token;
    StringPool::Id title;
  };

  base::Status ParseRootWindowContainer(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::RootWindowContainerProto::Decoder&
          root,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowContainerChildren(
      const com::android::internal::pbzero::WindowContainerProto::Decoder&
          window_container,
=======
      const protos::pbzero::RootWindowContainerProto::Decoder& root,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowContainerChildren(
      const protos::pbzero::WindowContainerProto::Decoder& window_container,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowContainerChildProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowContainerProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseDisplayContentProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseDisplayAreaProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseTaskProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseActivityRecordProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowTokenProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseWindowStateProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::Status ParseTaskFragmentProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::WindowContainerChildProto::Decoder&
          child,
=======
      const protos::pbzero::WindowContainerChildProto::Decoder& child,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
      int32_t parent_token,
      uint32_t child_index,
      std::vector<ExtractedWindowContainer>* result);

  base::StatusOr<TokenAndTitle> ParseIdentifierProto(
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
      const com::android::internal::pbzero::IdentifierProto::Decoder&
          identifier);
=======
      const protos::pbzero::IdentifierProto::Decoder& identifier);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h

  StringPool* pool_{nullptr};
  int32_t current_display_id_{-1};
  uint32_t current_rect_depth_{0};
  const StringPool::Id kRootWindowContainerId;
  const StringPool::Id kDisplayContentId;
  const StringPool::Id kDisplayAreaId;
  const StringPool::Id kTaskId;
  const StringPool::Id kTaskFragmentId;
  const StringPool::Id kActivityId;
  const StringPool::Id kWindowTokenId;
  const StringPool::Id kWindowStateId;
  const StringPool::Id kWindowContainerId;
};

}  // namespace perfetto::trace_processor::winscope

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/windowmanager_hierarchy_walker.h
#endif  // SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_WINDOWMANAGER_HIERARCHY_WALKER_H_
=======
#endif  // SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_WINDOWMANAGER_HIERARCHY_WALKER_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/windowmanager_hierarchy_walker.h
