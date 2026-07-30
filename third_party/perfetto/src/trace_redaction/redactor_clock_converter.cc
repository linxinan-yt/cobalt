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

#include "src/trace_redaction/redactor_clock_converter.h"
<<<<<<< HEAD

#include <cinttypes>
#include <cstddef>
=======
#include <cinttypes>
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#include <cstdint>
#include <memory>
#include <optional>
#include <vector>
<<<<<<< HEAD

=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#include "perfetto/base/logging.h"
#include "perfetto/base/status.h"
#include "perfetto/ext/base/status_macros.h"
#include "perfetto/ext/base/status_or.h"
<<<<<<< HEAD
=======
#include "perfetto/public/compiler.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#include "protos/perfetto/common/builtin_clock.pbzero.h"

namespace perfetto::trace_redaction {

<<<<<<< HEAD
RedactorClockSynchronizerListenerImpl::RedactorClockSynchronizerListenerImpl() =
    default;
=======
using ClockId = RedactorClockSynchronizer::ClockId;

RedactorClockSynchronizerListenerImpl::RedactorClockSynchronizerListenerImpl()
    : trace_time_updates_(0) {}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

base::Status RedactorClockSynchronizerListenerImpl::OnClockSyncCacheMiss() {
  return base::OkStatus();
}

base::Status RedactorClockSynchronizerListenerImpl::OnInvalidClockSnapshot() {
  return base::ErrStatus("Invalid clocks snapshot found during redaction");
}

<<<<<<< HEAD
RedactorClockConverter::RedactorClockConverter()
    : trace_time_state_{ClockId::Machine(
          protos::pbzero::BuiltinClock::BUILTIN_CLOCK_BOOTTIME)},
      clock_synchronizer_(
          &trace_time_state_,
=======
base::Status RedactorClockSynchronizerListenerImpl::OnTraceTimeClockIdChanged(
    ClockId) {
  ++trace_time_updates_;
  if (PERFETTO_UNLIKELY(trace_time_updates_ > 1)) {
    // We expect the trace time to remain constant for a trace.
    return base::ErrStatus(
        "Redactor clock conversion trace time unexpectedly changed %u times",
        trace_time_updates_);
  }
  return base::OkStatus();
}

base::Status RedactorClockSynchronizerListenerImpl::OnSetTraceTimeClock(
    ClockId) {
  return base::OkStatus();
}

void RedactorClockSynchronizerListenerImpl::RecordConversionError(
    Synchronizer::ErrorType,
    Synchronizer::ClockId,
    Synchronizer::ClockId,
    int64_t,
    std::optional<size_t>) {
  // Redactor doesn't need to record conversion errors to a database
  // Errors are handled via status returns in ConvertToTrace
}

bool RedactorClockSynchronizerListenerImpl::IsLocalHost() {
  // Redactor does not support multi-machine clock conversion
  return true;
}

RedactorClockConverter::RedactorClockConverter()
    : clock_synchronizer_(
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          std::make_unique<RedactorClockSynchronizerListenerImpl>()) {}

base::StatusOr<ClockId> RedactorClockConverter::GetTraceClock() {
  if (!primary_trace_clock_.has_value()) {
    // Set the default clocks if none has been provided.
<<<<<<< HEAD
    RETURN_IF_ERROR(SetTraceClock(ClockId::Machine(
        protos::pbzero::BuiltinClock::BUILTIN_CLOCK_BOOTTIME)));
=======
    RETURN_IF_ERROR(
        SetTraceClock(protos::pbzero::BuiltinClock::BUILTIN_CLOCK_BOOTTIME));
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
  PERFETTO_DCHECK(primary_trace_clock_.has_value());
  return primary_trace_clock_.value();
}

base::Status RedactorClockConverter::SetTraceClock(ClockId clock_id) {
  primary_trace_clock_ = clock_id;
<<<<<<< HEAD
  trace_time_state_.clock_id = clock_id;
=======
  RETURN_IF_ERROR(clock_synchronizer_.SetTraceTimeClock(clock_id));
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  return base::OkStatus();
}

void RedactorClockConverter::SetDefaultDataSourceClock(
    DataSourceType clock_type,
    ClockId clock_id,
    SequenceId trusted_seq_id) {
  seq_to_default_clocks_[trusted_seq_id].SetClock(clock_type, clock_id);
}

std::optional<ClockId>
RedactorClockConverter::GetSequenceDefaultDataSourceClock(
    SequenceId trusted_seq_id,
    DataSourceType source_type) const {
  SequenceClocks* sequence_clocks = seq_to_default_clocks_.Find(trusted_seq_id);
  if (sequence_clocks == nullptr) {
    return std::nullopt;
  }
  return sequence_clocks->GetClockId(source_type);
}

base::StatusOr<ClockId> RedactorClockConverter::GetGlobalDefaultDataSourceClock(
    const DataSourceType& clock_type) const {
  switch (clock_type) {
    case DataSourceType::kPerfDataSource:
<<<<<<< HEAD
      return ClockId::Machine(
          protos::pbzero::BuiltinClock::BUILTIN_CLOCK_MONOTONIC_RAW);
=======
      return protos::pbzero::BuiltinClock::BUILTIN_CLOCK_MONOTONIC_RAW;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    case DataSourceType::kUnknown:
      // A default needs to be set for the data source if you get here.
      return base::ErrStatus(
          "Failed to retrieve a global default clock for data source=%d",
          static_cast<int>(clock_type));
  }

  return base::ErrStatus("Data source %d global default has not been defined.",
                         static_cast<int>(clock_type));
}

base::StatusOr<ClockId> RedactorClockConverter::GetDataSourceClock(
    SequenceId trusted_seq_id,
    DataSourceType clock_type) const {
  auto default_seq_clock =
      GetSequenceDefaultDataSourceClock(trusted_seq_id, clock_type);
  if (PERFETTO_UNLIKELY(!default_seq_clock.has_value())) {
    return GetGlobalDefaultDataSourceClock(clock_type);
  }
  return default_seq_clock.value();
}

base::Status RedactorClockConverter::AddClockSnapshot(
<<<<<<< HEAD
    std::vector<ClockTimestamp>& clock_snapshot) {
=======
    std::vector<RedactorClockSynchronizer::ClockTimestamp>& clock_snapshot) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  base::StatusOr<uint32_t> snapshot_id =
      clock_synchronizer_.AddSnapshot(clock_snapshot);
  RETURN_IF_ERROR(snapshot_id.status());
  return base::OkStatus();
}

base::StatusOr<uint64_t> RedactorClockConverter::ConvertToTrace(
    ClockId source_clock_id,
    uint64_t source_ts) const {
<<<<<<< HEAD
  if (!primary_trace_clock_.has_value()) {
    return base::ErrStatus(
        "Cannot convert timestamp: no trace clock has been set");
  }
  std::optional<int64_t> trace_ts = clock_synchronizer_.Convert(
      source_clock_id, static_cast<int64_t>(source_ts), *primary_trace_clock_);
  if (!trace_ts.has_value()) {
    return base::ErrStatus("Failed to convert timestamp from clock id=%" PRIu32
                           " to trace time clock",
                           source_clock_id.clock_id);
=======
  std::optional<int64_t> trace_ts = clock_synchronizer_.ToTraceTime(
      source_clock_id, static_cast<int64_t>(source_ts));
  if (!trace_ts.has_value()) {
    return base::ErrStatus("Failed to convert timestamp from clock id=%" PRId64
                           " to trace time clock",
                           source_clock_id);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
  return static_cast<uint64_t>(trace_ts.value());
}

}  // namespace perfetto::trace_redaction
