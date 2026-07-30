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

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
#include "src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation.h"
=======
#include "src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

#include <unordered_map>
#include <vector>

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
#include "src/trace_processor/plugins/winscope_importer/viewcapture_test_utils.h"
#include "src/trace_processor/plugins/winscope_importer/viewcapture_views_extractor.h"
=======
#include "src/trace_processor/importers/proto/winscope/viewcapture_test_utils.h"
#include "src/trace_processor/importers/proto/winscope/viewcapture_views_extractor.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc
#include "test/gtest_and_gmock.h"

namespace perfetto::trace_processor::winscope::viewcapture::test {

namespace {

std::unordered_map<int32_t, bool> ComputeVisibility(
    const std::string& snapshot) {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
  com::android::internal::pbzero::ViewCapture::Decoder snapshot_decoder(
      snapshot);
=======
  protos::pbzero::ViewCapture::Decoder snapshot_decoder(snapshot);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc
  const std::vector<ViewDecoder> views_top_to_bottom =
      ExtractViewsTopToBottom(snapshot_decoder);
  return VisibilityComputation(views_top_to_bottom).Compute();
}

}  // namespace

TEST(ViewCaptureVisibilityComputation, RootNodeVisible) {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(-1))
          .Build();
=======
  const auto snapshot = SnapshotProtoBuilder()
                            .AddView(View().SetVisibility(0).SetParentId(-1))
                            .Build();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

  auto result = ComputeVisibility(snapshot);
  ASSERT_TRUE(result.at(0));
}

TEST(ViewCaptureVisibilityComputation, ChildNodeVisible) {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(-1))
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(0))
          .Build();
=======
  const auto snapshot = SnapshotProtoBuilder()
                            .AddView(View().SetVisibility(0).SetParentId(-1))
                            .AddView(View().SetVisibility(0).SetParentId(0))
                            .Build();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

  auto result = ComputeVisibility(snapshot);
  ASSERT_TRUE(result.at(0));
  ASSERT_TRUE(result.at(1));
}

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
TEST(ViewCaptureVisibilityComputation, RootNodeNotVisibleDueToVisibility) {
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(
              View().SetVisibility(4).SetHeight(1).SetWidth(1).SetParentId(-1))
          .Build();

  auto result = ComputeVisibility(snapshot);
  ASSERT_FALSE(result.at(0));
}

TEST(ViewCaptureVisibilityComputation, RootNodeVisibleDueToZeroWidth) {
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(View().SetVisibility(0).SetWidth(1).SetParentId(-1))
          .Build();

  auto result = ComputeVisibility(snapshot);
  ASSERT_FALSE(result.at(0));
}

TEST(ViewCaptureVisibilityComputation, RootNodeVisibleDueToZeroHeight) {
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(View().SetVisibility(0).SetHeight(1).SetParentId(-1))
          .Build();
=======
TEST(ViewCaptureVisibilityComputation, RootNodeNotVisible) {
  const auto snapshot = SnapshotProtoBuilder()
                            .AddView(View().SetVisibility(4).SetParentId(-1))
                            .Build();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

  auto result = ComputeVisibility(snapshot);
  ASSERT_FALSE(result.at(0));
}

TEST(ViewCaptureVisibilityComputation, ChildNodeNotVisibleDueToParent) {
<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(
              View().SetVisibility(4).SetHeight(1).SetWidth(1).SetParentId(-1))
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(0))
          .Build();
=======
  const auto snapshot = SnapshotProtoBuilder()
                            .AddView(View().SetVisibility(4).SetParentId(-1))
                            .AddView(View().SetVisibility(0).SetParentId(0))
                            .Build();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

  auto result = ComputeVisibility(snapshot);
  ASSERT_FALSE(result.at(0));
  ASSERT_FALSE(result.at(1));
}

<<<<<<< HEAD:third_party/perfetto/src/trace_processor/plugins/winscope_importer/viewcapture_visibility_computation_unittest.cc
TEST(ViewCaptureVisibilityComputation, ChildNodeVisibleWithZeroSizeParent) {
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(View().SetVisibility(0).SetParentId(-1))
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(0))
          .Build();

  auto result = ComputeVisibility(snapshot);
  ASSERT_FALSE(result.at(0));
  ASSERT_TRUE(result.at(1));
}

TEST(ViewCaptureVisibilityComputation, ChildNodeNotVisibleButParentVisible) {
  const auto snapshot =
      SnapshotProtoBuilder()
          .AddView(
              View().SetVisibility(0).SetHeight(1).SetWidth(1).SetParentId(-1))
          .AddView(
              View().SetVisibility(4).SetHeight(1).SetWidth(1).SetParentId(0))
          .Build();
=======
TEST(ViewCaptureVisibilityComputation, ChildNodeNotVisibleButParentVisible) {
  const auto snapshot = SnapshotProtoBuilder()
                            .AddView(View().SetVisibility(0).SetParentId(-1))
                            .AddView(View().SetVisibility(4).SetParentId(0))
                            .Build();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/src/trace_processor/importers/proto/winscope/viewcapture_visibility_computation_unittest.cc

  auto result = ComputeVisibility(snapshot);
  ASSERT_TRUE(result.at(0));
  ASSERT_FALSE(result.at(1));
}
}  // namespace perfetto::trace_processor::winscope::viewcapture::test
