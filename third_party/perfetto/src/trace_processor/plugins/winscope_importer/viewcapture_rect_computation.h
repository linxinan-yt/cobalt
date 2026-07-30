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

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_rect_computation.h
#ifndef SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_RECT_COMPUTATION_H_
#define SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_RECT_COMPUTATION_H_
=======
#ifndef SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_RECT_COMPUTATION_H_
#define SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_RECT_COMPUTATION_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_rect_computation.h

#include <optional>
#include <unordered_map>
#include <vector>
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_rect_computation.h
#include "protos/third_party/android/frameworks/base/proto/tracing/winscope/viewcapture.pbzero.h"
#include "src/trace_processor/plugins/winscope_importer/winscope_geometry.h"
#include "src/trace_processor/plugins/winscope_importer/winscope_rect_tracker.h"
=======
#include "protos/perfetto/trace/android/viewcapture.pbzero.h"
#include "src/trace_processor/importers/proto/winscope/winscope_geometry.h"
#include "src/trace_processor/importers/proto/winscope/winscope_rect_tracker.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_rect_computation.h
#include "src/trace_processor/tables/winscope_tables_py.h"

namespace perfetto::trace_processor::winscope::viewcapture {

namespace {
using TraceRectTableId = tables::WinscopeTraceRectTable::Id;
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_rect_computation.h
using SnapshotDecoder = com::android::internal::pbzero::ViewCapture::Decoder;
using ViewDecoder = com::android::internal::pbzero::ViewCapture::View::Decoder;
=======
using SnapshotDecoder = protos::pbzero::ViewCapture::Decoder;
using ViewDecoder = protos::pbzero::ViewCapture::View::Decoder;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_rect_computation.h
}  // namespace

struct SurfaceFlingerRects {
  std::optional<TraceRectTableId> layer_rect = std::nullopt;
  std::optional<TraceRectTableId> input_rect = std::nullopt;
};

class RectComputation {
 public:
  explicit RectComputation(
      const std::vector<ViewDecoder>& views_top_to_bottom,
      const std::unordered_map<int32_t, bool>& computed_visibility,
      WinscopeRectTracker& rect_tracker);

  const std::unordered_map<int32_t, TraceRectTableId> Compute();

 private:
  const std::vector<ViewDecoder>& views_top_to_bottom_;
  const std::unordered_map<int32_t, bool>& computed_visibility_;
  WinscopeRectTracker& rect_tracker_;

  TraceRectTableId InsertTraceRectRow(const ViewDecoder& view,
                                      geometry::Rect& rect,
                                      int32_t depth);
};
}  // namespace perfetto::trace_processor::winscope::viewcapture

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_rect_computation.h
#endif  // SRC_TRACE_PROCESSOR_PLUGINS_WINSCOPE_IMPORTER_VIEWCAPTURE_RECT_COMPUTATION_H_
=======
#endif  // SRC_TRACE_PROCESSOR_IMPORTERS_PROTO_WINSCOPE_VIEWCAPTURE_RECT_COMPUTATION_H_
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_rect_computation.h
