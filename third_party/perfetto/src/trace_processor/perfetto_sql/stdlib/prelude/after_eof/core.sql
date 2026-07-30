--
-- Copyright 2024 The Android Open Source Project
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     https://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

-- @module prelude.after_eof.core
-- Fundamental trace concepts and infrastructure.
--
-- This module provides the core tables and views that represent fundamental
-- trace concepts like trace boundaries and available metrics.

-- Lists all metrics built-into trace processor.
<<<<<<< HEAD
CREATE PERFETTO VIEW trace_metrics(
  -- The name of the metric.
  name STRING
)
AS
SELECT name FROM _trace_metrics;
=======
CREATE PERFETTO VIEW trace_metrics (
  -- The name of the metric.
  name STRING
) AS
SELECT
  name
FROM _trace_metrics;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

-- Definition of `trace_bounds` table. The values are being filled by Trace
-- Processor when parsing the trace.
-- It is recommended to depend on the `trace_start()` and `trace_end()`
-- functions rather than directly on `trace_bounds`.
<<<<<<< HEAD
CREATE PERFETTO VIEW trace_bounds(
=======
CREATE PERFETTO VIEW trace_bounds (
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  -- First ts in the trace.
  start_ts TIMESTAMP,
  -- End of the trace.
  end_ts TIMESTAMP
<<<<<<< HEAD
)
AS
SELECT start_ts, end_ts FROM _trace_bounds;
=======
) AS
SELECT
  start_ts,
  end_ts
FROM _trace_bounds;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
