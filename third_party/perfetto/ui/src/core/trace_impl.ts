// Copyright (C) 2024 The Android Open Source Project
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

import {DisposableStack} from '../base/disposable_stack';
import {createStore, type Migrate, type Store} from '../base/store';
import {TimelineImpl} from './timeline';
import type {Command} from '../public/commands';
import type {Trace} from '../public/trace';
import type {ScrollToArgs} from '../public/scroll_helper';
import type {Engine, EngineBase} from '../trace_processor/engine';
import type {CommandManagerImpl} from './command_manager';
import {NoteManagerImpl} from './note_manager';
import type {OmniboxManagerImpl} from './omnibox_manager';
import {SearchManagerImpl} from './search_manager';
import {SelectionManagerImpl} from './selection_manager';
import type {SidebarManagerImpl} from './sidebar_manager';
import {TabManagerImpl} from './tab_manager';
import {TrackManagerImpl} from './track_manager';
import {WorkspaceManagerImpl} from './workspace_manager';
import type {SidebarMenuItem} from '../public/sidebar';
import {ScrollHelper} from './scroll_helper';
import type {Selection, SelectionOpts} from '../public/selection';
import type {SearchResult} from '../public/search';
import {FlowManager} from './flow_manager';
import type {AppImpl, OpenTraceArrayBufArgs} from './app_impl';
import type {PluginManagerImpl} from './plugin_manager';
import type {RouteArgs} from '../public/route_schema';
import type {Analytics} from '../public/analytics';
import {fetchWithProgress} from '../base/http_utils';
import {tarFileListToBlob} from './trace_stream';
import type {TraceInfoImpl} from './trace_info_impl';
import type {PageHandler, PageManager} from '../public/page';
import {createProxy} from '../base/utils';
import type {PageManagerImpl} from './page_manager';
import type {FeatureFlagManager, FlagSettings} from '../public/feature_flag';
import type {SerializedAppState} from './state_serialization_schema';
import {featureFlags} from './feature_flags';
import {EvtSource} from '../base/events';
import type {Raf} from '../public/raf';
import {StatusbarManagerImpl} from './statusbar_manager';
import type {SettingDescriptor} from '../public/settings';
import type {SettingsManagerImpl} from './settings_manager';
import {MinimapManagerImpl} from './minimap_manager';
<<<<<<< HEAD
import {InitialPageManagerImpl} from './initial_page_manager';
import type {TraceStream} from '../public/stream';
import type {OmniboxModeDescriptor} from '../public/omnibox';
import type {SidePanelManagerImpl} from './side_panel_manager';
import type {SidePanelTabDescriptor} from '../public/side_panel';
import type {Route} from '../public/app';
=======
import {isStartupCommandAllowed} from './startup_command_allowlist';
import {TraceStream} from '../public/stream';

/**
 * Handles the per-trace state of the UI
 * There is an instance of this class per each trace loaded, and typically
 * between 0 and 1 instances in total (% brief moments while we swap traces).
 * 90% of the app state live here, including the Engine.
 * This is the underlying storage for AppImpl, which instead has one instance
 * per trace per plugin.
 */
export class TraceContext implements Disposable {
  private readonly pluginInstances = new Map<string, TraceImpl>();
  readonly appCtx: AppContext;
  readonly engine: EngineBase;
  readonly omniboxMgr = new OmniboxManagerImpl();
  readonly searchMgr: SearchManagerImpl;
  readonly selectionMgr: SelectionManagerImpl;
  readonly tabMgr = new TabManagerImpl();
  readonly timeline: TimelineImpl;
  readonly traceInfo: TraceInfoImpl;
  readonly trackMgr = new TrackManagerImpl();
  readonly workspaceMgr = new WorkspaceManagerImpl();
  readonly noteMgr = new NoteManagerImpl();
  readonly flowMgr: FlowManager;
  readonly pluginSerializableState = createStore<{[key: string]: {}}>({});
  readonly scrollHelper: ScrollHelper;
  readonly trash = new DisposableStack();
  readonly onTraceReady = new EvtSource<void>();
  readonly statusbarMgr = new StatusbarManagerImpl();
  readonly minimapManager = new MinimapManagerImpl();

  // List of errors that were encountered while loading the trace by the TS
  // code. These are on top of traceInfo.importErrors, which is a summary of
  // what TraceProcessor reports on the stats table at import time.
  readonly loadingErrors: string[] = [];

  constructor(gctx: AppContext, engine: EngineBase, traceInfo: TraceInfoImpl) {
    this.appCtx = gctx;
    this.engine = engine;
    this.trash.use(engine);
    this.traceInfo = traceInfo;

    this.timeline = new TimelineImpl(
      traceInfo,
      this.appCtx.timestampFormat,
      this.appCtx.durationPrecision,
      this.appCtx.timezoneOverride,
    );

    this.scrollHelper = new ScrollHelper(
      this.traceInfo,
      this.timeline,
      this.workspaceMgr,
      this.trackMgr,
    );

    this.selectionMgr = new SelectionManagerImpl(
      this.engine,
      this.timeline,
      this.trackMgr,
      this.noteMgr,
      this.scrollHelper,
      this.onSelectionChange.bind(this),
    );

    this.noteMgr.onNoteDeleted = (noteId) => {
      if (
        this.selectionMgr.selection.kind === 'note' &&
        this.selectionMgr.selection.id === noteId
      ) {
        this.selectionMgr.clearSelection();
      }
    };

    this.flowMgr = new FlowManager(
      engine.getProxy('FlowManager'),
      this.trackMgr,
      this.selectionMgr,
    );

    this.searchMgr = new SearchManagerImpl({
      timeline: this.timeline,
      trackManager: this.trackMgr,
      engine: this.engine,
      workspace: this.workspaceMgr.currentWorkspace,
      onResultStep: this.onResultStep.bind(this),
    });
  }

  // This method wires up changes to selection to side effects on search and
  // tabs. This is to avoid entangling too many dependencies between managers.
  private onSelectionChange(selection: Selection, opts: SelectionOpts) {
    const {clearSearch = true, switchToCurrentSelectionTab = true} = opts;
    if (clearSearch) {
      this.searchMgr.reset();
    }
    if (switchToCurrentSelectionTab && selection.kind !== 'empty') {
      this.tabMgr.showCurrentSelectionTab();
    }

    this.flowMgr.updateFlows(selection);
  }

  private onResultStep(searchResult: SearchResult) {
    this.selectionMgr.selectSearchResult(searchResult);
  }

  // Gets or creates an instance of TraceImpl backed by the current TraceContext
  // for the given plugin.
  forPlugin(pluginId: string) {
    return getOrCreate(this.pluginInstances, pluginId, () => {
      const appForPlugin = this.appCtx.forPlugin(pluginId);
      return new TraceImpl(appForPlugin, this);
    });
  }

  // Called by AppContext.closeCurrentTrace().
  [Symbol.dispose]() {
    this.trash.dispose();
  }
}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

/**
 * This implementation provides the plugin access to trace related resources,
 * such as the engine and the store. This exists for the whole duration a plugin
 * is active AND a trace is loaded.
 * There are N+1 instances of this for each trace, one for each plugin plus one
 * for the core.
 */
export class TraceImpl implements Trace, Disposable {
  readonly engine: Engine;
  readonly search: SearchManagerImpl;
  readonly selection: SelectionManagerImpl;
  readonly tabs = new TabManagerImpl();
  readonly timeline: TimelineImpl;
  readonly traceInfo: TraceInfoImpl;
  readonly tracks = new TrackManagerImpl();
  readonly workspaces = new WorkspaceManagerImpl();
  readonly notes = new NoteManagerImpl();
  readonly flows: FlowManager;
  readonly scrollHelper: ScrollHelper;
  readonly trash = new DisposableStack();
  readonly onTraceReady = new EvtSource<void>();
  readonly statusbar = new StatusbarManagerImpl();
  readonly minimap = new MinimapManagerImpl();
  readonly initialPage = new InitialPageManagerImpl();
  readonly loadingErrors: string[] = [];
  readonly app: AppImpl;
  readonly store = createStore<Record<string, unknown>>({});

  // Do we need this?
  readonly pluginSerializableState = createStore<{[key: string]: {}}>({});

  constructor(app: AppImpl, engine: EngineBase, traceInfo: TraceInfoImpl) {
    this.app = app;
    this.engine = engine;
    this.trash.use(engine);
    this.traceInfo = traceInfo;

    this.timeline = new TimelineImpl(
      traceInfo,
      app.timestampFormat,
      app.durationPrecision,
      app.timezoneOverride,
    );

    this.scrollHelper = new ScrollHelper(
      this.timeline,
      this.workspaces,
      this.tracks,
    );

    this.selection = new SelectionManagerImpl(
      this.engine,
      this.tracks,
      this.notes,
      this.scrollHelper,
      this.onSelectionChange.bind(this),
    );

<<<<<<< HEAD
    this.notes.onNoteDeleted = (noteId) => {
      if (
        this.selection.selection.kind === 'note' &&
        this.selection.selection.id === noteId
      ) {
        this.selection.clearSelection();
      }
    };

    this.flows = new FlowManager(
      engine.getProxy('FlowManager'),
      this.tracks,
      this.selection,
    );

    this.search = new SearchManagerImpl({
      timeline: this.timeline,
      trackManager: this.tracks,
      engine: this.engine,
      workspace: this.workspaces.currentWorkspace,
      onResultStep: this.onResultStep.bind(this),
    });

=======
    // Intercept the registerTrack() method to inject the pluginId into tracks.
    this.trackMgrProxy = createProxy(ctx.trackMgr, {
      registerTrack(trackDesc: Track): Disposable {
        return ctx.trackMgr.registerTrack({...trackDesc, pluginId});
      },
    });

    // CRITICAL ORDER: URL commands MUST execute before settings commands!
    // This ordering has subtle but important implications:
    // - URL commands are trace-specific and should establish initial state
    // - Settings commands are user preferences that should override URL defaults
    // - Changing this order could break trace sharing and user customization
    // DO NOT REORDER without understanding the full impact!
    const urlCommands =
      parseUrlCommands(ctx.appCtx.initialRouteArgs.startupCommands) ?? [];
    const settingsCommands = ctx.appCtx.startupCommandsSetting.get();

    // Combine URL and settings commands - runtime allowlist checking will handle filtering
    const allStartupCommands = [...urlCommands, ...settingsCommands];
    const enforceAllowlist =
      ctx.appCtx.enforceStartupCommandAllowlistSetting.get();

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    // CommandManager is global. Here we intercept the registerCommand() because
    // we want any commands registered via the Trace interface to be
    // unregistered when the trace unloads (before a new trace is loaded) to
    // avoid ending up with duplicate commands.
    this.commandMgrProxy = createProxy(app.commands, {
      registerCommand: (cmd: Command) => {
        const disposable = app.commands.registerCommand(cmd);
        this.trash.use(disposable);
        return disposable;
      },
<<<<<<< HEAD
      registerMacro: (macro, source) => {
        const disposable = app.commands.registerMacro(macro, source);
        this.trash.use(disposable);
        return disposable;
=======

      hasStartupCommands(): boolean {
        return allStartupCommands.length > 0;
      },

      async runStartupCommands(): Promise<void> {
        // Execute startup commands in trace context after everything is ready.
        // This simulates user actions taken after trace load is complete,
        // including any saved app state restoration. At this point:
        // - All plugins have loaded and registered their commands
        // - Trace data is fully accessible
        // - UI state has been restored from any saved workspace
        // - Commands can safely query trace data and modify UI state

        // Set allowlist checking during startup if enforcement enabled
        if (enforceAllowlist) {
          ctx.appCtx.commandMgr.setAllowlistCheck(isStartupCommandAllowed);
        }

        try {
          for (const command of allStartupCommands) {
            try {
              // Execute through proxy to access both global and trace-specific
              // commands.
              await ctx.appCtx.commandMgr.runCommand(
                command.id,
                ...command.args,
              );
            } catch (error) {
              // TODO(stevegolton): Add a mechanism to notify users of startup
              // command errors. This will involve creating a notification UX
              // similar to VSCode where there are popups on the bottom right
              // of the UI.
              console.warn(`Startup command ${command.id} failed:`, error);
            }
          }
        } finally {
          // Always restore default (allow all) behavior when done
          ctx.appCtx.commandMgr.setAllowlistCheck(() => true);
        }
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      },
    });

    // Likewise, remove all trace-scoped sidebar entries when the trace unloads.
    this.sidebarProxy = createProxy(app.sidebar, {
      addMenuItem: (menuItem: SidebarMenuItem) => {
        const disposable = app.sidebar.addMenuItem(menuItem);
        this.trash.use(disposable);
        return disposable;
      },
    });

    this.pageMgrProxy = createProxy(app.pages, {
      registerPage: (pageHandler: PageHandler) => {
        const disposable = app.pages.registerPage(pageHandler);
        this.trash.use(disposable);
        return disposable;
      },
    });

    this.settingsProxy = createProxy(app.settings, {
      register: <T>(setting: SettingDescriptor<T>) => {
        const disposable = app.settings.register(setting);
        this.trash.use(disposable);
        return disposable;
      },
    });

    this.omniboxProxy = createProxy(app.omnibox, {
      registerMode: (descriptor: OmniboxModeDescriptor) => {
        const disposable = app.omnibox.registerMode(descriptor);
        this.trash.use(disposable);
        return disposable;
      },
    });

    this.sidePanelProxy = createProxy(app.sidePanel, {
      registerTab: (tab: SidePanelTabDescriptor) => {
        const disposable = app.sidePanel.registerTab(tab);
        this.trash.use(disposable);
        return disposable;
      },
    });
  }

  // This method wires up changes to selection to side effects on search and
  // tabs. This is to avoid entangling too many dependencies between managers.
  private onSelectionChange(selection: Selection, opts: SelectionOpts) {
    const {clearSearch = true, switchToCurrentSelectionTab = true} = opts;
    if (clearSearch) {
      this.search.reset();
    }
    if (switchToCurrentSelectionTab && selection.kind !== 'empty') {
      this.tabs.showCurrentSelectionTab();
    }

    this.flows.updateFlows(selection);
  }

  private onResultStep(searchResult: SearchResult) {
    this.selection.selectSearchResult(searchResult);
  }

  [Symbol.dispose]() {
    this.trash.dispose();
  }

  private readonly commandMgrProxy: CommandManagerImpl;
  private readonly sidebarProxy: SidebarManagerImpl;
  private readonly sidePanelProxy: SidePanelManagerImpl;
  private readonly pageMgrProxy: PageManagerImpl;
  private readonly settingsProxy: SettingsManagerImpl;
  private readonly omniboxProxy: OmniboxManagerImpl;

  scrollTo(where: ScrollToArgs): void {
    this.scrollHelper.scrollTo(where);
  }

  async getTraceFile(): Promise<Blob> {
    const src = this.traceInfo.source;
    if (this.traceInfo.downloadable) {
      if (src.type === 'ARRAY_BUFFER') {
        return new Blob([src.buffer]);
      } else if (src.type === 'FILE') {
        return src.file;
      } else if (src.type === 'URL') {
        return await fetchWithProgress(src.url, (progressPercent: number) =>
          this.omnibox.showStatusMessage(
            `Downloading trace ${progressPercent}%`,
          ),
        );
      } else if (src.type === 'MULTIPLE_FILES') {
        // Re-materialize the merged TAR (manifest + traces) from the retained
        // file list; reopening it reproduces the merge.
        return await tarFileListToBlob(src.files);
      }
    }
    // Not available in HTTP+RPC mode. Rather than propagating an undefined,
    // show a graceful error (the ERR:trace_src will be intercepted by
    // error_dialog.ts). We expect all users of this feature to not be able to
    // do anything useful if we returned undefined (other than showing the same
    // dialog).
    // The caller was supposed to check that traceInfo.downloadable === true
    // before calling this. Throwing while downloadable is true is a bug.
    throw new Error(`Cannot getTraceFile(${src.type})`);
  }

  get trace() {
    return this;
  }

  get taskTracker() {
    return this.app.taskTracker;
  }

  get currentWorkspace() {
    return this.workspaces.currentWorkspace;
  }

<<<<<<< HEAD
  get defaultWorkspace() {
    return this.workspaces.defaultWorkspace;
=======
  get timeline() {
    return this.traceCtx.timeline;
  }

  get tracks() {
    return this.trackMgrProxy;
  }

  get tabs() {
    return this.traceCtx.tabMgr;
  }

  get currentWorkspace() {
    return this.traceCtx.workspaceMgr.currentWorkspace;
  }

  get defaultWorkspace() {
    return this.traceCtx.workspaceMgr.defaultWorkspace;
  }

  get workspaces() {
    return this.traceCtx.workspaceMgr;
  }

  get search() {
    return this.traceCtx.searchMgr;
  }

  get selection() {
    return this.traceCtx.selectionMgr;
  }

  get traceInfo(): TraceInfoImpl {
    return this.traceCtx.traceInfo;
  }

  get statusbar(): StatusbarManagerImpl {
    return this.traceCtx.statusbarMgr;
  }

  get notes() {
    return this.traceCtx.noteMgr;
  }

  get flows() {
    return this.traceCtx.flowMgr;
  }

  get loadingErrors(): ReadonlyArray<string> {
    return this.traceCtx.loadingErrors;
  }

  addLoadingError(err: string) {
    this.traceCtx.loadingErrors.push(err);
  }

  // App interface implementation.

  get pluginId(): string {
    return this.appImpl.pluginId;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }

  get commands(): CommandManagerImpl {
    return this.commandMgrProxy;
  }

  get sidebar(): SidebarManagerImpl {
    return this.sidebarProxy;
  }

  get sidePanel(): SidePanelManagerImpl {
    return this.sidePanelProxy;
  }

  get pages(): PageManager {
    return this.pageMgrProxy;
  }

  get omnibox(): OmniboxManagerImpl {
    return this.omniboxProxy;
  }

  get plugins(): PluginManagerImpl {
    return this.app.plugins;
  }

  get analytics(): Analytics {
    return this.app.analytics;
  }

  get initialRouteArgs(): RouteArgs {
    return this.app.initialRouteArgs;
  }

  get featureFlags(): FeatureFlagManager {
    return {
      register: (settings: FlagSettings) => featureFlags.register(settings),
    };
  }

  get raf(): Raf {
    return this.app.raf;
  }

  navigate(newHash: string): void {
    this.app.navigate(newHash);
  }

<<<<<<< HEAD
  getCurrentRoute(): Route {
    return this.app.getCurrentRoute();
  }

  openTraceFromFile(file: File) {
    return this.app.openTraceFromFile(file);
  }

  openTraceFromUrl(url: string, serializedAppState?: SerializedAppState) {
    return this.app.openTraceFromUrl(url, serializedAppState);
  }

  openTraceFromStream(stream: TraceStream) {
    return this.app.openTraceFromStream(stream);
=======
  openTraceFromFile(file: File) {
    return this.appImpl.openTraceFromFile(file);
  }

  openTraceFromUrl(url: string, serializedAppState?: SerializedAppState) {
    return this.appImpl.openTraceFromUrl(url, serializedAppState);
  }

  openTraceFromStream(stream: TraceStream) {
    return this.appImpl.openTraceFromStream(stream);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }

  openTraceFromBuffer(
    args: OpenTraceArrayBufArgs,
    serializedAppState?: SerializedAppState,
  ) {
<<<<<<< HEAD
    return this.app.openTraceFromBuffer(args, serializedAppState);
=======
    return this.appImpl.openTraceFromBuffer(args, serializedAppState);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }

  closeCurrentTrace(): void {
    this.app.closeCurrentTrace();
  }

  get settings(): SettingsManagerImpl {
    return this.settingsProxy;
  }

  get isInternalUser(): boolean {
    return this.app.isInternalUser;
  }

  get perfDebugging() {
    return this.app.perfDebugging;
  }

  mountStore<T>(id: string, migrate: Migrate<T>): Store<T> {
    return this.store.createSubStore([id], migrate);
  }
}

// A convenience interface to inject the App in Mithril components.
export interface TraceImplAttrs {
  trace: TraceImpl;
}

export interface OptionalTraceImplAttrs {
  trace?: TraceImpl;
}
