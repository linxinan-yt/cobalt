// Copyright (C) 2025 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import m from 'mithril';
<<<<<<< HEAD
import type {Engine} from '../../../trace_processor/engine';
import {NUM_NULL} from '../../../trace_processor/query_result';
import {Button} from '../../../widgets/button';
import {Section} from '../../../widgets/section';
import {Grid, GridCell, GridHeaderCell} from '../../../widgets/grid';
import {Icon} from '../../../widgets/icon';
import {Tooltip} from '../../../widgets/tooltip';
import {statsSpec, type StatsSectionRow} from '../utils';

export interface StatsData {
  allStats: StatsSectionRow[];
  isMultiTrace: boolean;
  isMultiMachine: boolean;
=======
import {Engine} from '../../../trace_processor/engine';
import {UNKNOWN} from '../../../trace_processor/query_result';
import {Section} from '../../../widgets/section';
import {Icon} from '../../../widgets/icon';
import {Tooltip} from '../../../widgets/tooltip';
import {statsSpec, StatsSectionRow} from '../utils';

// Trace metadata row spec and type
const traceMetadataRowSpec = {name: UNKNOWN, value: UNKNOWN};
type TraceMetadataRow = typeof traceMetadataRowSpec;

export interface StatsData {
  traceMetadata: TraceMetadataRow[];
  allStats: StatsSectionRow[];
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

export async function loadStatsData(engine: Engine): Promise<StatsData> {
  // Load all stats
  const allStatsResult = await engine.query(`
    select
      name,
      value,
      cast(ifnull(idx, '') as text) as idx,
      description,
      severity,
<<<<<<< HEAD
      source,
      machine_id as machineId,
      trace_id as traceId
    from stats
    order by trace_id, machine_id, name, idx
=======
      source
    from stats
    order by name, idx
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  `);
  const allStats: StatsSectionRow[] = [];
  for (const iter = allStatsResult.iter(statsSpec); iter.valid(); iter.next()) {
    allStats.push({
      name: iter.name,
      value: iter.value,
      description: iter.description,
      idx: iter.idx,
      severity: iter.severity,
      source: iter.source,
<<<<<<< HEAD
      machineId: iter.machineId,
      traceId: iter.traceId,
    });
  }

  // Determine whether the trace spans multiple traces/machines so we know
  // whether to show the per-trace/per-machine columns. The metadata table is
  // the authoritative source of trace/machine ids; supplement it with any ids
  // observed only in the stats rows.
  const traceIds = new Set<number>();
  const machineIds = new Set<number>();

  const idResult = await engine.query(`
    select distinct trace_id as traceId, machine_id as machineId
    from metadata
  `);
  for (
    const iter = idResult.iter({traceId: NUM_NULL, machineId: NUM_NULL});
    iter.valid();
    iter.next()
  ) {
    if (iter.traceId !== null) {
      traceIds.add(iter.traceId);
    }
    if (iter.machineId !== null) {
      machineIds.add(iter.machineId);
    }
  }
  for (const stat of allStats) {
    if (stat.machineId !== null) {
      machineIds.add(stat.machineId);
    }
    if (stat.traceId !== null) {
      traceIds.add(stat.traceId);
    }
  }

  return {
    allStats,
    isMultiTrace: traceIds.size > 1,
    isMultiMachine: machineIds.size > 1,
=======
    });
  }

  // Load trace metadata
  const traceMetadataResult = await engine.query(`
    with metadata_with_priorities as (
      select
        name,
        ifnull(str_value, cast(int_value as text)) as value,
        name in (
          "trace_size_bytes",
          "cr-os-arch",
          "cr-os-name",
          "cr-os-version",
          "cr-physical-memory",
          "cr-product-version",
          "cr-hardware-class"
        ) as priority
      from metadata
    )
    select
      name,
      value
    from metadata_with_priorities
    order by
      priority desc,
      name
  `);
  const traceMetadata: TraceMetadataRow[] = [];
  for (
    const iter = traceMetadataResult.iter(traceMetadataRowSpec);
    iter.valid();
    iter.next()
  ) {
    traceMetadata.push({
      name: iter.name,
      value: iter.value,
    });
  }

  return {
    traceMetadata,
    allStats,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  };
}

export interface StatsTabAttrs {
  data: StatsData;
}

export class StatsTab implements m.ClassComponent<StatsTabAttrs> {
  view({attrs}: m.CVnode<StatsTabAttrs>) {
    return m(
      '.pf-trace-info-page__tab-content',
      m(
        Section,
        {
<<<<<<< HEAD
=======
          title: 'Trace Metadata',
          subtitle: 'All metadata key-value pairs recorded in the trace',
        },
        m(TraceMetadata, {data: attrs.data.traceMetadata}),
      ),
      m(
        Section,
        {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          title: 'Statistics',
          subtitle:
            'Complete dump of all trace statistics including errors, data losses, and debugging info',
        },
<<<<<<< HEAD
        m(StatsSection, {
          data: attrs.data.allStats,
          isMultiTrace: attrs.data.isMultiTrace,
          isMultiMachine: attrs.data.isMultiMachine,
        }),
=======
        m(StatsSection, {data: attrs.data.allStats}),
      ),
    );
  }
}

// Trace Metadata Section
interface TraceMetadataAttrs {
  data: TraceMetadataRow[];
}

class TraceMetadata implements m.ClassComponent<TraceMetadataAttrs> {
  view({attrs}: m.CVnode<TraceMetadataAttrs>) {
    const data = attrs.data;
    if (data === undefined || data.length === 0) {
      return m('');
    }

    const tableRows = data.map((row) => {
      return m(
        'tr.pf-trace-info-page__stats-table-row',
        m(
          'td.pf-trace-info-page__stats-table-cell.pf-trace-info-page__stats-table-cell--name',
          `${row.name}`,
        ),
        m('td.pf-trace-info-page__stats-table-cell', `${row.value}`),
      );
    });

    return m(
      'section.pf-trace-info-page__stats-section',
      m(
        'table.pf-trace-info-page__stats-table',
        m(
          'thead',
          m(
            'tr',
            m('td.pf-trace-info-page__stats-table-head-cell', 'Name'),
            m('td.pf-trace-info-page__stats-table-head-cell', 'Value'),
          ),
        ),
        m('tbody', tableRows),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      ),
    );
  }
}

// Stats Section
interface StatsSectionAttrs {
  data: StatsSectionRow[];
<<<<<<< HEAD
  isMultiTrace: boolean;
  isMultiMachine: boolean;
}

class StatsSection implements m.ClassComponent<StatsSectionAttrs> {
  private hideZeroValues = true;

=======
}

class StatsSection implements m.ClassComponent<StatsSectionAttrs> {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  view({attrs}: m.CVnode<StatsSectionAttrs>) {
    const data = attrs.data;
    if (data === undefined || data.length === 0) {
      return m('');
    }

<<<<<<< HEAD
    const filtered = this.hideZeroValues
      ? data.filter((row) => row.value !== 0 && row.value !== null)
      : data;

    const columns = [
      ...(attrs.isMultiTrace
        ? [{key: 'trace', header: m(GridHeaderCell, 'Trace')}]
        : []),
      ...(attrs.isMultiMachine
        ? [{key: 'machine', header: m(GridHeaderCell, 'Machine')}]
        : []),
      {key: 'name', header: m(GridHeaderCell, 'Name')},
      {key: 'value', header: m(GridHeaderCell, 'Value')},
      {key: 'type', header: m(GridHeaderCell, 'Type')},
    ];

    const rowData = filtered.map((row) => {
      const idx = row.idx !== '' ? `[${row.idx}]` : '';
      const help = Boolean(row.description)
        ? m(
=======
    const tableRows = data.map((row) => {
      const help = [];
      if (Boolean(row.description)) {
        help.push(
          m(
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
            Tooltip,
            {
              trigger: m(Icon, {
                icon: 'help_outline',
                className: 'pf-trace-info-page__help-icon',
              }),
            },
            `${row.description}`,
<<<<<<< HEAD
          )
        : undefined;
      const cells = [];
      if (attrs.isMultiTrace) {
        cells.push(m(GridCell, row.traceId === null ? '-' : row.traceId));
      }
      if (attrs.isMultiMachine) {
        cells.push(m(GridCell, row.machineId === null ? '-' : row.machineId));
      }
      cells.push(
        m(
          GridCell,
          {className: 'pf-trace-info-page__grid-key'},
          `${row.name}${idx}`,
          help,
        ),
        m(GridCell, `${row.value}`),
        m(GridCell, `${row.severity} (${row.source})`),
      );
      return cells;
=======
          ),
        );
      }
      const idx = row.idx !== '' ? `[${row.idx}]` : '';
      return m(
        'tr.pf-trace-info-page__stats-table-row',
        m(
          'td.pf-trace-info-page__stats-table-cell.pf-trace-info-page__stats-table-cell--name',
          `${row.name}${idx}`,
          help,
        ),
        m('td.pf-trace-info-page__stats-table-cell', `${row.value}`),
        m(
          'td.pf-trace-info-page__stats-table-cell',
          `${row.severity} (${row.source})`,
        ),
      );
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    });

    return m(
      'section.pf-trace-info-page__stats-section',
<<<<<<< HEAD
      m(Button, {
        label: this.hideZeroValues ? 'Show zero values' : 'Hide zero values',
        icon: this.hideZeroValues ? 'visibility' : 'visibility_off',
        onclick: () => {
          this.hideZeroValues = !this.hideZeroValues;
        },
      }),
      m(Grid, {
        columns,
        rowData,
        className: 'pf-trace-info-page__dense-grid',
      }),
=======
      m(
        'table.pf-trace-info-page__stats-table',
        m(
          'thead',
          m(
            'tr',
            m('td.pf-trace-info-page__stats-table-head-cell', 'Name'),
            m('td.pf-trace-info-page__stats-table-head-cell', 'Value'),
            m('td.pf-trace-info-page__stats-table-head-cell', 'Type'),
          ),
        ),
        m('tbody', tableRows),
      ),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    );
  }
}
