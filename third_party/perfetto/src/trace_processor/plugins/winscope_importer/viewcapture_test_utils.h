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

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h
#ifndef SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_TEST_UTILS_H_
#define SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_TEST_UTILS_H_
=======
#ifndef SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_TEST_UTILS_H_
#define SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_TEST_UTILS_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h

#include <cstdint>
#include <optional>
#include <vector>

#include "perfetto/protozero/scattered_heap_buffer.h"
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h
#include "protos/third_party/android/frameworks/base/proto/tracing/winscope/viewcapture.pbzero.h"
=======
#include "protos/perfetto/trace/android/viewcapture.pbzero.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h

namespace perfetto::trace_processor::winscope::viewcapture::test {

namespace {}  // namespace

class View {
 public:
  explicit View() = default;

  View& SetId(int32_t value) {
    id_ = value;
    return *this;
  }

  View& SetParentId(int32_t value) {
    parent_id_ = value;
    return *this;
  }

  View& SetVisibility(int32_t value) {
    visibility_ = value;
    return *this;
  }

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h
  View& SetWidth(int32_t value) {
    width_ = value;
    return *this;
  }

  View& SetHeight(int32_t value) {
    height_ = value;
    return *this;
  }

  std::optional<int32_t> id_;
  std::optional<int32_t> parent_id_;
  std::optional<int32_t> visibility_;
  std::optional<int32_t> width_;
  std::optional<int32_t> height_;
=======
  std::optional<int32_t> id_;
  std::optional<int32_t> parent_id_;
  std::optional<int32_t> visibility_;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h
};

class SnapshotProtoBuilder {
 public:
  explicit SnapshotProtoBuilder() = default;

  SnapshotProtoBuilder& AddView(const View& value) {
    views_.push_back(value);
    return *this;
  }

  std::string Build() {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h
    protozero::HeapBuffered<com::android::internal::pbzero::ViewCapture>
        snapshot_proto;
=======
    protozero::HeapBuffered<protos::pbzero::ViewCapture> snapshot_proto;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h

    int32_t i = 0;
    for (const auto& view : views_) {
      auto* view_proto = snapshot_proto->add_views();

      view_proto->set_id(view.id_.has_value() ? view.id_.value() : i);
      i++;

      if (view.parent_id_.has_value()) {
        view_proto->set_parent_id(view.parent_id_.value());
      }

      if (view.visibility_.has_value()) {
        view_proto->set_visibility(view.visibility_.value());
      }
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h

      if (view.width_.has_value()) {
        view_proto->set_width(view.width_.value());
      }

      if (view.height_.has_value()) {
        view_proto->set_height(view.height_.value());
      }
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h
    }

    return snapshot_proto.SerializeAsString();
  }

 private:
  std::vector<View> views_;
};

}  // namespace perfetto::trace_processor::winscope::viewcapture::test

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h
#endif  // SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_TEST_UTILS_H_
=======
#endif  // SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_TEST_UTILS_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h
