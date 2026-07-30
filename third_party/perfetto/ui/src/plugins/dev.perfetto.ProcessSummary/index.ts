// Copyright (C) 2021 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type {PerfettoPlugin} from '../../public/plugin';
import type {Trace} from '../../public/trace';
import {getThreadOrProcUri} from '../../public/utils';
import {
  LONG_NULL,
  NUM,
  NUM_NULL,
  STR,
} from '../../trace_processor/query_result';
import ThreadPlugin from '../dev.perfetto.Thread';
import {
<<<<<<< HEAD
  type Config,
  SLICE_TRACK_SUMMARY_KIND,
  GroupSummaryTrack,
} from './group_summary_track';
=======
  Config as ProcessSchedulingTrackConfig,
  PROCESS_SCHEDULING_TRACK_KIND,
  ProcessSchedulingTrack,
} from './process_scheduling_track';
import {
  Config as ProcessSummaryTrackConfig,
  PROCESS_SUMMARY_TRACK_KIND,
  ProcessSummaryTrack,
} from './process_summary_track';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

// This plugin is responsible for adding summary tracks for process and thread
// groups.
export default class implements PerfettoPlugin {
  static readonly id = 'dev.perfetto.ProcessSummary';
  static readonly dependencies = [ThreadPlugin];

  async onTraceLoad(ctx: Trace): Promise<void> {
    await this.addProcessTrackGroups(ctx);
<<<<<<< HEAD
=======
    await this.addKernelThreadSummary(ctx);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }

  private async addProcessTrackGroups(ctx: Trace): Promise<void> {
    const threads = ctx.plugins.getPlugin(ThreadPlugin).getThreadMap();
    const result = await ctx.engine.query(`
      INCLUDE PERFETTO MODULE android.process_metadata;

      WITH machine_cpu_counts AS (
        SELECT
<<<<<<< HEAD
          machine_id AS machine,
=======
          IFNULL(machine_id, 0) AS machine,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          COUNT(*) AS cpu_count
        FROM cpu
        GROUP BY machine
      )
<<<<<<< HEAD
=======

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      select *
      from (
        select
          _process_available_info_summary.upid,
          null as utid,
          process.pid,
          null as tid,
          process.name as processName,
          null as threadName,
          sum_running_dur > 0 as hasSched,
          android_process_metadata.debuggable as isDebuggable,
          case
            when process.name = 'system_server' then
              ifnull(extract_metadata_for_machine(machine_id, 'android_profile_system_server'), 0)
            when process.name GLOB 'zygote*' then
              ifnull(extract_metadata_for_machine(machine_id, 'android_profile_boot_classpath'), 0)
            else 0
          end as isBootImageProfiling,
          ifnull((
            select group_concat(string_value)
            from args
            where
              process.arg_set_id is not null and
              arg_set_id = process.arg_set_id and
              flat_key = 'chrome.process_label'
          ), '') as chromeProcessLabels,
<<<<<<< HEAD
          machine_id as machine,
=======
          ifnull(machine_id, 0) as machine,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          IFNULL(machine_cpu_counts.cpu_count, 0) AS cpuCount
        from _process_available_info_summary
        join process using(upid)
        left join android_process_metadata using(upid)
        LEFT JOIN machine_cpu_counts
<<<<<<< HEAD
          ON machine_cpu_counts.machine = machine_id
=======
          ON machine_cpu_counts.machine = IFNULL(machine_id, 0)
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      )
      union all
      select *
      from (
        select
          null,
          utid,
          null as pid,
          tid,
          null as processName,
          thread.name threadName,
          sum_running_dur > 0 as hasSched,
          0 as isDebuggable,
          0 as isBootImageProfiling,
          '' as chromeProcessLabels,
<<<<<<< HEAD
          machine_id as machine,
=======
          ifnull(machine_id, 0) as machine,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          IFNULL(machine_cpu_counts.cpu_count, 0) AS cpuCount
        from _thread_available_info_summary
        join thread using (utid)
        LEFT JOIN machine_cpu_counts
<<<<<<< HEAD
          ON machine_cpu_counts.machine = machine_id
=======
          ON machine_cpu_counts.machine = IFNULL(machine_id, 0)
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
        where upid is null
      )
    `);
    const it = result.iter({
      upid: NUM_NULL,
      utid: NUM_NULL,
      pid: LONG_NULL,
      tid: LONG_NULL,
      hasSched: NUM_NULL,
      isDebuggable: NUM_NULL,
      isBootImageProfiling: NUM_NULL,
      chromeProcessLabels: STR,
      machine: NUM,
      cpuCount: NUM,
    });
    for (; it.valid(); it.next()) {
      const upid = it.upid;
      const utid = it.utid;
      const pid = it.pid;
      const tid = it.tid;
      const hasSched = Boolean(it.hasSched);
      const isDebuggable = Boolean(it.isDebuggable);
      const isBootImageProfiling = Boolean(it.isBootImageProfiling);
      const subtitle = it.chromeProcessLabels;
      const cpuCount = it.cpuCount;

      // Group by upid if present else by utid.
      const pidForColor = pid ?? tid ?? upid ?? utid ?? 0;
      const uri = getThreadOrProcUri(upid, utid);

      const chips: string[] = [];
      isDebuggable && chips.push('debuggable');

      // When boot image profiling is enabled for the bootclasspath or system
      // server, performance characteristics of the device can vary wildly.
      // Surface that detail in the process tracks for zygote and system_server
      // to make it clear to the user.
      // See https://source.android.com/docs/core/runtime/boot-image-profiles
      // for additional details.
      isBootImageProfiling && chips.push('boot image profiling');

      const config: Config = {
        pidForColor,
        upid,
        utid,
      };
      const track = new GroupSummaryTrack(
        ctx,
        config,
        cpuCount,
        threads,
        hasSched,
      );
      ctx.tracks.registerTrack({
        uri,
        tags: {
          kinds: [SLICE_TRACK_SUMMARY_KIND],
        },
        renderer: track,
      });

<<<<<<< HEAD
      // TODO(stevegolton): Probably add these when we create the process group
      // node to begin with.
      const trackNode = ctx.defaultWorkspace.getTrackByUri(uri);
      if (trackNode) {
        trackNode.subtitle = subtitle;
        trackNode.chips = chips;
      }
    }
  }
=======
        ctx.tracks.registerTrack({
          uri,
          tags: {
            kinds: [PROCESS_SCHEDULING_TRACK_KIND],
          },
          chips,
          renderer: new ProcessSchedulingTrack(ctx, config, cpuCount, threads),
          subtitle,
        });
      } else {
        const config: ProcessSummaryTrackConfig = {
          pidForColor,
          upid,
          utid,
        };

        ctx.tracks.registerTrack({
          uri,
          tags: {
            kinds: [PROCESS_SUMMARY_TRACK_KIND],
          },
          chips,
          renderer: new ProcessSummaryTrack(ctx.engine, config),
          subtitle,
        });
      }
    }
  }

  private async addKernelThreadSummary(ctx: Trace): Promise<void> {
    const {engine} = ctx;

    // Identify kernel threads if this is a linux system trace, and sufficient
    // process information is available. Kernel threads are identified by being
    // children of kthreadd (always pid 2).
    // The query will return the kthreadd process row first, which must exist
    // for any other kthreads to be returned by the query.
    // TODO(rsavitski): figure out how to handle the idle process (swapper),
    // which has pid 0 but appears as a distinct process (with its own comm) on
    // each cpu. It'd make sense to exclude its thread state track, but still
    // put process-scoped tracks in this group.
    const result = await engine.query(`
      select
        t.utid, p.upid, (case p.pid when 2 then 1 else 0 end) isKthreadd
      from
        thread t
        join process p using (upid)
        left join process parent on (p.parent_upid = parent.upid)
        join
          (select true from metadata m
             where (m.name = 'system_name' and m.str_value = 'Linux')
           union
           select 1 from (select true from sched limit 1))
      where
        p.pid = 2 or parent.pid = 2
      order by isKthreadd desc
    `);

    const it = result.iter({
      utid: NUM,
      upid: NUM,
    });

    // Not applying kernel thread grouping.
    if (!it.valid()) {
      return;
    }

    const config: ProcessSummaryTrackConfig = {
      pidForColor: 2,
      upid: it.upid,
      utid: it.utid,
    };

    ctx.tracks.registerTrack({
      uri: '/kernel',
      tags: {
        kinds: [PROCESS_SUMMARY_TRACK_KIND],
      },
      renderer: new ProcessSummaryTrack(ctx.engine, config),
    });
  }
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}
