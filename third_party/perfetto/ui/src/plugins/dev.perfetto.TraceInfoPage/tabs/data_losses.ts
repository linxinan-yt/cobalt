// Copyright (C) 2025 The Android Open Source Project
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

import m from 'mithril';
<<<<<<< HEAD
import type {Engine} from '../../../trace_processor/engine';
import {Section} from '../../../widgets/section';
import {GridLayout} from '../../../widgets/grid_layout';
import {
  type StatsSectionRow,
=======
import {Engine} from '../../../trace_processor/engine';
import {Section} from '../../../widgets/section';
import {GridLayout} from '../../../widgets/grid_layout';
import {
  StatsSectionRow,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  loadStatsWithFilter,
  groupByCategory,
  renderErrorCategoryCard,
  renderCategorySection,
} from '../utils';

export interface DataLossesData {
  losses: StatsSectionRow[];
<<<<<<< HEAD
  isMultiTrace: boolean;
  isMultiMachine: boolean;
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

export async function loadDataLossesData(
  engine: Engine,
): Promise<DataLossesData> {
  const losses = await loadStatsWithFilter(
    engine,
    "severity = 'data_loss' AND value > 0",
  );
<<<<<<< HEAD
  const traceIds = new Set<number>();
  const machineIds = new Set<number>();
  for (const l of losses) {
    if (l.traceId !== null) traceIds.add(l.traceId);
    if (l.machineId !== null) machineIds.add(l.machineId);
  }
  return {
    losses,
    isMultiTrace: traceIds.size > 1,
    isMultiMachine: machineIds.size > 1,
  };
=======
  return {losses};
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

export interface DataLossesTabAttrs {
  data: DataLossesData;
}

export class DataLossesTab implements m.ClassComponent<DataLossesTabAttrs> {
  view({attrs}: m.CVnode<DataLossesTabAttrs>) {
    const categories = groupByCategory(attrs.data.losses);

    return m(
      '.pf-trace-info-page__tab-content',
      // Category cards at the top
      m(
        Section,
        {
          title: 'Data Loss Categories',
          subtitle:
            'Summary of data loss events grouped by category. These counters are collected at trace recording time',
        },
        categories.length === 0
          ? m('')
          : m(
              GridLayout,
              {},
              categories.map((cat) =>
                renderErrorCategoryCard(cat, 'warning', 'warning'),
              ),
            ),
      ),
      // Detailed breakdown by category
      categories.length > 0 &&
        m(
          Section,
          {
            title: 'Detailed Breakdown',
            subtitle: 'Individual data loss entries grouped by category',
          },
          categories.map((cat) =>
            renderCategorySection(cat, {
              className: 'pf-trace-info-page__logs-grid',
<<<<<<< HEAD
              isMultiTrace: attrs.data.isMultiTrace,
              isMultiMachine: attrs.data.isMultiMachine,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
            }),
          ),
        ),
    );
  }
}
