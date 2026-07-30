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
import type {Trace} from '../../public/trace';
import {TabStrip, type TabOption} from '../../widgets/tab_strip';
import {EmptyState} from '../../widgets/empty_state';
import type {TabKey} from './utils';
import {isValidTabKey} from './utils';
import {OverviewTab} from './tabs/overview';
import {type OverviewData, loadOverviewData} from './tabs/overview_data';
import {ConfigTab, type ConfigData, loadConfigData} from './tabs/config';
import {
  AndroidTab,
  type AndroidData,
  loadAndroidData,
  hasAndroidData,
} from './tabs/android';
import {
  MachinesTab,
  type MachinesData,
  loadMachinesData,
} from './tabs/machines';
import {TracesTab, type TracesData, loadTracesData} from './tabs/traces';
import {
  ImportErrorsTab,
  type ImportErrorsData,
=======
import {Trace} from '../../public/trace';
import {TabStrip, TabOption} from '../../widgets/tabs';
import {EmptyState} from '../../widgets/empty_state';
import type {TabKey} from './utils';
import {isValidTabKey} from './utils';
import {OverviewTab, OverviewData, loadOverviewData} from './tabs/overview';
import {ConfigTab, ConfigData, loadConfigData} from './tabs/config';
import {AndroidTab, AndroidData, loadAndroidData} from './tabs/android';
import {MachinesTab, MachinesData, loadMachinesData} from './tabs/machines';
import {
  ImportErrorsTab,
  ImportErrorsData,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  loadImportErrorsData,
} from './tabs/import_errors';
import {
  DataLossesTab,
<<<<<<< HEAD
  type DataLossesData,
=======
  DataLossesData,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  loadDataLossesData,
} from './tabs/data_losses';
import {
  TraceErrorsTab,
<<<<<<< HEAD
  type TraceErrorsData,
  loadTraceErrorsData,
} from './tabs/trace_errors';
import {NoticesTab, type NoticesData, loadNoticesData} from './tabs/notices';
import {
  UiLoadingErrorsTab,
  type UiLoadingErrorsData,
} from './tabs/ui_loading_errors';
import {StatsTab, type StatsData, loadStatsData} from './tabs/stats';
import {
  TraceDoctorTab,
  type Diagnostic,
  loadTraceDiagnostics,
} from './diagnostics';
import {
  MetadataTab,
  type MetadataData,
  loadMetadataData,
  hasMetadataData,
} from './tabs/metadata';
=======
  TraceErrorsData,
  loadTraceErrorsData,
} from './tabs/trace_errors';
import {
  UiLoadingErrorsTab,
  UiLoadingErrorsData,
} from './tabs/ui_loading_errors';
import {StatsTab, StatsData, loadStatsData} from './tabs/stats';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

export interface TraceInfoPageAttrs {
  readonly trace: Trace;
  readonly subpage: string | undefined;
}

interface AllTabData {
  overview: OverviewData;
<<<<<<< HEAD
  diagnostics: ReadonlyArray<Diagnostic>;
  config: ConfigData;
  android: AndroidData;
  machines: MachinesData;
  traces: TracesData;
  metadata: MetadataData;
  importErrors: ImportErrorsData;
  traceErrors: TraceErrorsData;
  dataLosses: DataLossesData;
  notices: NoticesData;
=======
  config: ConfigData;
  android: AndroidData;
  machines: MachinesData;
  importErrors: ImportErrorsData;
  traceErrors: TraceErrorsData;
  dataLosses: DataLossesData;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  uiLoadingErrors: UiLoadingErrorsData;
  stats: StatsData;
}

export class TraceInfoPage implements m.ClassComponent<TraceInfoPageAttrs> {
  // All tab data
  private tabData?: AllTabData;
  private currentTab: TabKey = 'overview';
  private lastSubpage?: string;

  oninit({attrs}: m.CVnode<TraceInfoPageAttrs>) {
    this.loadAllData(attrs.trace);
  }

  view({attrs}: m.CVnode<TraceInfoPageAttrs>) {
    if (attrs.subpage !== this.lastSubpage) {
      this.lastSubpage = attrs.subpage;
      this.currentTab = getTab(attrs.subpage);
    }
    return m(
      '.pf-trace-info-page',
      m(
        '.pf-trace-info-page__inner',
        m(
          '.pf-trace-info-page__header',
          m('h1.pf-trace-info-page__header-title', 'Overview'),
          m(
            '.pf-trace-info-page__subtitle',
            'High-level summary of trace health, metrics, and system information',
          ),
        ),
        m(TabStrip, {
          tabs: this.getTabs(),
          currentTabKey: this.currentTab,
          onTabChange: (key: string) => {
            this.currentTab = isValidTabKey(key) ? key : 'overview';
          },
        }),
        this.renderCurrentTab(attrs.trace, this.currentTab),
      ),
    );
  }

  private renderCurrentTab(trace: Trace, currentTab: TabKey): m.Children {
    if (!this.tabData) {
      return m(EmptyState, {
        icon: 'hourglass_empty',
        title: 'Loading trace info...',
      });
    }
    switch (currentTab) {
      case 'overview':
        return m(OverviewTab, {
          trace,
          data: this.tabData.overview,
<<<<<<< HEAD
          diagnostics: this.tabData.diagnostics,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          onTabChange: (key: TabKey) => {
            this.currentTab = key;
          },
        });
<<<<<<< HEAD
      case 'trace_doctor':
        return m(TraceDoctorTab, {
          diagnostics: this.tabData.diagnostics,
          isMultiTrace: this.tabData.overview.traceCount > 1,
        });
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      case 'config':
        return m(ConfigTab, {
          data: this.tabData.config,
        });
      case 'android':
        return m(AndroidTab, {
          data: this.tabData.android,
        });
<<<<<<< HEAD
      case 'traces':
        return m(TracesTab, {
          data: this.tabData.traces,
        });
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      case 'machines':
        return m(MachinesTab, {
          data: this.tabData.machines,
        });
<<<<<<< HEAD
      case 'metadata':
        return m(MetadataTab, {
          data: this.tabData.metadata,
        });
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      case 'import_errors':
        return m(ImportErrorsTab, {
          data: this.tabData.importErrors,
        });
      case 'trace_errors':
        return m(TraceErrorsTab, {
          data: this.tabData.traceErrors,
        });
      case 'data_losses':
        return m(DataLossesTab, {
          data: this.tabData.dataLosses,
        });
<<<<<<< HEAD
      case 'notices':
        return m(NoticesTab, {
          data: this.tabData.notices,
        });
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      case 'ui_loading_errors':
        return m(UiLoadingErrorsTab, {
          data: this.tabData.uiLoadingErrors,
        });
      case 'stats':
        return m(StatsTab, {
          data: this.tabData.stats,
        });
    }
  }

  private async loadAllData(trace: Trace): Promise<void> {
    const engine = trace.engine;
    this.tabData = {
      overview: await loadOverviewData(trace),
<<<<<<< HEAD
      diagnostics: await loadTraceDiagnostics(engine),
      config: await loadConfigData(engine),
      android: await loadAndroidData(engine),
      machines: await loadMachinesData(engine),
      traces: await loadTracesData(engine),
      metadata: await loadMetadataData(engine),
      importErrors: await loadImportErrorsData(engine),
      traceErrors: await loadTraceErrorsData(engine),
      dataLosses: await loadDataLossesData(engine),
      notices: await loadNoticesData(engine),
=======
      config: await loadConfigData(engine),
      android: await loadAndroidData(engine),
      machines: await loadMachinesData(engine),
      importErrors: await loadImportErrorsData(engine),
      traceErrors: await loadTraceErrorsData(engine),
      dataLosses: await loadDataLossesData(engine),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      uiLoadingErrors: {errors: trace.loadingErrors},
      stats: await loadStatsData(engine),
    };
    m.redraw();
  }

  private getTabs(): TabOption[] {
    const tabs: TabOption[] = [{key: 'overview', title: 'Overview'}];
<<<<<<< HEAD
    if ((this.tabData?.config?.configs?.length ?? 0) > 0) {
=======
    if (this.tabData?.config?.configText) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      tabs.push({key: 'config', title: 'Trace Config'});
    }
    if ((this.tabData?.overview?.importErrors ?? 0) > 0) {
      tabs.push({key: 'import_errors', title: 'Import Errors'});
    }
    if ((this.tabData?.traceErrors?.errors?.length ?? 0) > 0) {
      tabs.push({key: 'trace_errors', title: 'Trace Errors'});
    }
<<<<<<< HEAD
    if ((this.tabData?.diagnostics?.length ?? 0) > 0) {
      tabs.push({key: 'trace_doctor', title: 'Trace Doctor'});
    }
    if ((this.tabData?.overview?.dataLosses ?? 0) > 0) {
      tabs.push({key: 'data_losses', title: 'Data Losses'});
    }
    if ((this.tabData?.notices?.categories?.length ?? 0) > 0) {
      tabs.push({key: 'notices', title: 'Notices'});
    }
    if ((this.tabData?.overview?.uiLoadingErrorCount ?? 0) > 0) {
      tabs.push({key: 'ui_loading_errors', title: 'UI Loading Errors'});
    }
    if (hasAndroidData(this.tabData?.android)) {
      tabs.push({key: 'android', title: 'Android'});
    }
    if ((this.tabData?.overview?.traceCount ?? 0) > 1) {
      tabs.push({key: 'traces', title: 'Traces'});
    }
    if ((this.tabData?.machines?.machineCount ?? 0) > 1) {
      tabs.push({key: 'machines', title: 'Machines'});
    }
    if (hasMetadataData(this.tabData?.metadata)) {
      tabs.push({key: 'metadata', title: 'Metadata'});
    }
    tabs.push({key: 'stats', title: 'Statistics'});
=======
    if ((this.tabData?.overview?.dataLosses ?? 0) > 0) {
      tabs.push({key: 'data_losses', title: 'Data Losses'});
    }
    if ((this.tabData?.overview?.uiLoadingErrorCount ?? 0) > 0) {
      tabs.push({key: 'ui_loading_errors', title: 'UI Loading Errors'});
    }
    const hasAndroid =
      (this.tabData?.android?.packageList?.length ?? 0) > 0 ||
      (this.tabData?.android?.gameInterventions?.length ?? 0) > 0;
    if (hasAndroid) {
      tabs.push({key: 'android', title: 'Android'});
    }
    if ((this.tabData?.machines?.machineCount ?? 0) > 1) {
      tabs.push({key: 'machines', title: 'Machines'});
    }
    tabs.push({key: 'stats', title: 'Info and Stats (advanced)'});
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    return tabs;
  }
}

function getTab(subpage: string | undefined): TabKey {
  if (!subpage) {
    return 'overview';
  }
  const res = subpage.substring(1);
  return isValidTabKey(res) ? res : 'overview';
}
