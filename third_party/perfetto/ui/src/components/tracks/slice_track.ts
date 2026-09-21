// Copyright (C) 2023 The Android Open Source Project
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
import {Button} from '../../widgets/button';
import {Icons} from '../../base/semantic_icons';
import type {ColorScheme} from '../../base/color_scheme';
import type {
  Point2D,
  Size2D,
  Transform1D,
  VerticalBounds,
} from '../../base/geom';
import {ensureExists} from '../../base/assert';
import {Monitor} from '../../base/monitor';
import {
  type CancellationSignal,
  AsyncMemo,
  TASK_CANCELLED,
  AtomicTaskQueue,
} from '../../base/async_memo';
import {type duration, Time, type time} from '../../base/time';
import type {TimeScale} from '../../base/time_scale';
import {clamp, floatEqual} from '../../base/math_utils';
import {exists} from '../../base/utils';
import {deferChunkedTask} from '../../base/chunked_task';
import type {TrackEventDetailsPanel} from '../../public/details_panel';
import type {
  TrackEventDetails,
  TrackEventSelection,
} from '../../public/selection';
import type {Trace} from '../../public/trace';
import type {
  SnapPoint,
  TrackMouseEvent,
  TrackRenderContext,
  TrackRenderer,
} from '../../public/track';
import {type DatasetSchema, SourceDataset} from '../../trace_processor/dataset';
import {
  type SqlValue,
  LONG,
  NUM,
  LONG_NULL,
  NUM_NULL,
} from '../../trace_processor/query_result';
import {
  createPerfettoTable,
  createVirtualTable,
  type DisposableSqlEntity,
} from '../../trace_processor/sql_utils';
import {checkerboardExcept} from '../checkerboard';
import {getColorForSlice} from '../colorizer';
import {formatDuration} from '../time_utils';
import {BufferedBounds} from './buffered_bounds';
import {CHUNKED_TASK_BACKGROUNDPRIORITY, CHUNKED_TASK_BACKGROUND_PRIORITY} from './feature_flags';
import {SliceTrackDetailsPanel} from './slice_track_details_panel';
import {
  RECT_PATTERN_FADE_RIGHT,
  type RowLayout,
  rowHeightFromLayout,
  rowTopFromLayout,
} from '../../base/renderer';
import {cropText} from '../../base/string_utils';

const SLICE_MIN_WIDTH_FOR_TEXT_PX = 5;
const CHEVRON_WIDTH_PX = 10;

export const enum ColorVariant {
  BASE = 0,
  VARIANT = 1,
  DISABLED = 2,
}

interface Slice<T> {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly count: number; // Number of slices in this bucket
  readonly colorScheme: ColorScheme;
  readonly fillRatio: number;
  readonly row: T; // The raw dataset row
}

interface SliceBuffers<T> {
  readonly starts: Float32Array;
  readonly ends: Float32Array;
  readonly depths: Uint16Array;
  readonly patterns: Uint8Array;
  readonly slices: readonly Slice<T>[];
  readonly count: number;
}

interface Instant<T> {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly count: number; // Number of slices in this bucket
  readonly colorScheme: ColorScheme;
  readonly row: T; // The raw dataset row
}

interface InstantBuffers<T> {
  readonly xs: Float32Array;
  readonly depths: Uint16Array;
  readonly instants: readonly Instant<T>[];
  readonly count: number;
}

interface DataFrame<T> {
  readonly start: time;
  readonly end: time;
  readonly slices: SliceBuffers<T>;
  readonly instants: InstantBuffers<T>;
}

type SliceOrInstant<T> = Slice<T> | Instant<T>;

// Height of collapsed (non-top) rows in pixels.
const COLLAPSED_ROW_HEIGHT = 3;

export interface SliceLayout {
  // Vertical spacing between slices and track.
  readonly padding: number;

  // Spacing between rows.
  readonly rowGap: number;

  // Height of each slice (i.e. height of each row).
  readonly sliceHeight: number;

  // Title font size.
  readonly titleSizePx: number;

  // Subtitle font size.
  readonly subtitleSizePx: number;

  // When true, depth 0 uses sliceHeight but all deeper rows use a compact
  // height (COLLAPSED_ROW_HEIGHT), giving a summary view that still shows
  // nesting activity.
  readonly collapsed: boolean;
}

// Callback argument types - use SliceBase to support both complete and incomplete slices
export interface OnSliceOverArgs<T> {
  slice: SliceOrInstant<T>;
  tooltip?: string[];
}

export interface OnSliceOutArgs<T> {
  slice: SliceOrInstant<T>;
}

export interface OnSliceClickArgs<T> {
  slice: SliceOrInstant<T>;
}
export interface InstantStyle {
  /**
   * Defines the width of an instant event. This, combined with the row height,
   * defines the event's hitbox. This width is forwarded to the render function.
   */
  readonly width: number;

  /**
   * Customize how instant events are rendered.
   *
   * @param ctx - CanvasRenderingContext to draw to.
   * @param rect - Position of the TL corner & size of the instant event's
   * bounding box.
   */
  render(ctx: CanvasRenderingContext2D, rect: Size2D & Point2D): void;
}

export interface SliceTrackAttrs<T extends DatasetSchema> {
  /**
   * The trace object used by the track for accessing the query engine and other
   * trace-related resources.
   */
  readonly trace: Trace;

  /**
   * The URI of this track, which must match the URI specified in the track
   * descriptor.
*
   * TODO(stevegolton): Sort out `Track` and `TrackRenderer` to avoid
   * duplication.   */
  readonly uri: string;

  /**
   * The source dataset defining the content of this track.
   *
   * A source dataset consists of a SQL select statement or table name with a
   * column schema and optional filtering information. It represents a set of
   * instructions to extract slice-like rows from trace processor that
   * represents the content of this track, which avoids the need to materialize
* all slices into JavaScript beforehand. This approach minimizes memory usage
   * and improves performance by only materializing the necessary rows on
   * demand.
   *
   * Required columns:
   * - `ts` (LONG): Timestamp of each event (in nanoseconds). Serves as the
   *   start time for slices with a `dur` column or the instant time otherwise.
   *
   * Auto-generated columns (if not provided):
   * - `id` (NUM): Unique identifier for slices in the track. If not provided
   *   in the dataset, will be automatically generated using ROW_NUMBER()
   *   ordered by timestamp.
   *
   * Optional columns:
   * - `dur` (LONG): Duration of each event (in nanoseconds). Without this
   *   column, all slices are treated as instant events and rendered as
   *   chevrons. With this column, each slice is rendered as a box where the
   *   width corresponds to the duration of the slice.
   * - `depth` (NUM): Depth of each event, used for vertical arrangement. Higher
   *   depth values are rendered lower down on the track.
   * - `layer` (NUM): This layer value influences the mipmap function. Slices in
   *   different layers will be mipmapped independency of each other, and the
   *   buckets of higher layers will be rendered on top of lower layers.   */
  readonly dataset: SourceDataset<T> | (() => SourceDataset<T>);

  /**
* An optional initial estimate for the maximum depth value. Helps minimize
   * flickering while scrolling by stabilizing the track height before all
   * slices are loaded. Even without this value, the height of the track still
   * adjusts dynamically as slices are loaded to accommodate the highest depth
   * value.   */
  readonly initialMaxDepth?: number;

  /**
   * An optional root table name for the track's data source.
*
   * This typically represents a well-known table name and serves as the root
   * `id` namespace for the track. It is primarily used for resolving events
   * with a combination of table name and `id`.
   *
   * TODO(stevegolton): Consider moving this to dataset.   */
  readonly rootTableName?: string;

  /**
* Override the default geometry and layout of the slices rendered on the
   * track.   */
  readonly sliceLayout?: Partial<SliceLayout>;

  /**
   * Override the appearance of instant events.
   */
  readonly instantStyle?: InstantStyle;

  /**
* Events are usually rendered in color order for performance. However for
   * tracks that have a lot of overlapping event such as those full of instant
   * events, this can look odd, so this setting forces events to be rendered in
   * timestamp order, potentially at the cost of a bit of performance.
   */
  readonly forceTsRenderOrder?: boolean;

  /**
   * An optional function to override the color scheme for each event.
   * If omitted, the default slice color scheme is used.   */
  colorizer?(row: T): ColorScheme;

  /**
* Optional function returning a key for invalidating cached slice data frames when track attributes/modes change.
   */
  readonly getKey?: () => string;

  /**
   * Override the text displayed on each event (title).   */
  sliceName?(row: T): string;

  /**
* Override the subtitle displayed on each event.
   */
  sliceSubtitle?(row: T): string;

  /**
   * Override the tooltip content for each event.
   */
  tooltip?(slice: SliceOrInstant<T>): m.Children;

  /**
   * Customize the details panel for events on this track.   */
  detailsPanel?(row: T): TrackEventDetailsPanel;

  /**
* An optional callback to define the fill ratio for slices. The fill ratio is
   * an extra bit of information that can be rendered on each slice, where the
   * slice essentially contains a single horizontal bar chart. The value
   * returned can be a figure between 0.0 and 1.0 where 0 is empty and 1 is
   * full. If omitted, all slices will be rendered with their fill ratios set to
   * 'full'.   */
  fillRatio?(row: T): number;

  /**
* Override the pattern for each slice (e.g., RECT_PATTERN_HATCHED for RT threads).
   */
  slicePattern?(row: T): number;

  /**
   * Define buttons displayed on the track shell.
   */
  shellButtons?(): m.Children;

  /**
   * Called once per render cycle before drawing. Return an array of
   * ColorVariant values (one per slice) to control each slice's color.
   */
  onUpdatedSlices?(slices: readonly SliceOrInstant<T>[]): ColorVariant[];

  /**
   * Called when a slice is hovered.
   */
  onSliceOver?(args: OnSliceOverArgs<T>): void;

  /**
   * Called when hover leaves a slice.
   */
  onSliceOut?(args: OnSliceOutArgs<T>): void;

  /**
   * Called when a slice is clicked. Return false to prevent default selection.
   */
  onSliceClick?(args: OnSliceClickArgs<T>): void;
}

interface Tables extends AsyncDisposable {
  readonly slicesMipmapTable: DisposableSqlEntity;
  readonly instantsMipmapTable: DisposableSqlEntity;
  readonly incompleteSlicesTable: DisposableSqlEntity;}

export type RowSchema = {
  readonly id?: number;
  readonly ts: bigint;
  readonly dur?: bigint | null;
  readonly depth?: number;
  readonly layer?: number;
} & DatasetSchema;

function getDataset<T extends DatasetSchema>(
  attrs: SliceTrackAttrs<T>,
): SourceDataset<T> {
  const dataset = attrs.dataset;
  return typeof dataset === 'function' ? dataset() : dataset;
}

export class SliceTrack<T extends RowSchema> implements TrackRenderer {
  readonly rootTableName?: string;
  private readonly trace: Trace;
  private readonly uri: string;
  private sliceLayout: SliceLayout;
  private readonly attrs: SliceTrackAttrs<T>;
  private readonly instantWidthPx: number;
  private readonly queue = new AtomicTaskQueue();
  private readonly tablesSlot = new AsyncMemo<Tables>(this.queue);
  private readonly dataFrameSlot = new AsyncMemo<DataFrame<T>>(this.queue);
  private readonly bufferedBounds = new BufferedBounds();
  private readonly hoverMonitor = new Monitor([() => this.hoveredSlice?.id]);

  private hoveredSlice?: SliceOrInstant<T>;
  private charWidth = {title: -1, subtitle: -1};
  private computedTrackHeight = 0;
  private currentDataFrame?: DataFrame<T>;
  private rowCount: number;

  /**
   * Factory function to create a SliceTrack.   */
  static create<T extends RowSchema>(attrs: SliceTrackAttrs<T>): SliceTrack<T> {
    return new SliceTrack(attrs);
  }

  /**
* Async factory function to create a SliceTrack, first materializing
   * the dataset into a perfetto table. This can be more efficient if for
   * example the dataset is a complex query with multiple joins or window
   * functions, so materializing it up front can improve rendering performance,
   * for a one-time cost.
   *
   * However, it does have some downsides:
   * - You're front loading the cost of materialization, which can slow down
   *   trace load times.
   * - It uses more memory, as the entire dataset is materialized in memory as a
   *   new table.
   * - It means that this dataset track has a new root source table, which makes
   *   it impossible to combine with other tracks for the purposes of bulk
   *   operations such as aggregations or search.
   *
   * @param attrs The track attributes
   * @returns A fully initialized SliceTrack   */
  static async createMaterialized<T extends RowSchema>(
    attrs: SliceTrackAttrs<T>,
  ): Promise<SliceTrack<T>> {
    const originalDataset = getDataset(attrs);
// Create materialized table from the render query - we might as well
    // materialize the calculated columns that are missing from the source
    // dataset while we're here as this will improve performance at runtime.    const materializedTable = await createPerfettoTable({
      engine: attrs.trace.engine,
      as: generateRenderQuery(originalDataset),
    });

// Create a new dataset that queries the materialized table    const materializedDataset = new SourceDataset({
      src: materializedTable.name,
      schema: {
        ...originalDataset.schema,
// We know we must have these columns now as they are injected in
        // generateRenderQuery(), so we can add them to the schema to avoid the
        // DST from adding them again.        id: NUM,
        layer: NUM,
        depth: NUM,
        dur: LONG,
      },
    });

    return new SliceTrack({
      ...attrs,
      dataset: materializedDataset,
    });
  }

private constructor(attrs: SliceTrackAttrs<T>) {
    this.attrs = attrs;
    this.trace = attrs.trace;
    this.uri = attrs.uri;
    this.rootTableName = attrs.rootTableName;
    if (attrs.initialMaxDepth !== undefined) {
      // Row count is max depth + 1
      this.rowCount = attrs.initialMaxDepth + 1;
    } else {
      // Assume at least one row
      this.rowCount = 1;
    }
    this.instantWidthPx = attrs.instantStyle?.width ?? CHEVRON_WIDTH_PX;

    const sliceLayout = attrs.sliceLayout ?? {};
    this.sliceLayout = {
      padding: sliceLayout.padding ?? 3,
      rowGap: sliceLayout.rowGap ?? 0,
      sliceHeight: sliceLayout.sliceHeight ?? 18,
      titleSizePx: sliceLayout.titleSizePx ?? 12,
      subtitleSizePx: sliceLayout.subtitleSizePx ?? 10,
      collapsed: sliceLayout.collapsed ?? false,
    };
  }

  render(trackCtx: TrackRenderContext): void {
    const {ctx, size, timescale} = trackCtx;

    // Query for new data given the current state or reuse cache
    const dataFrame = this.useData(trackCtx);

    // Cache the current data frame for use in event handlers
    this.currentDataFrame = dataFrame;

    // If we have no data, we can't render anything
    if (!dataFrame) return;

    const pxEnd = size.width;
    const pxPerNs = timescale.durationToPx(1n);
    const baseOffsetPx = timescale.timeToPx(dataFrame.start);
    const charWidth = this.measureCharWidth(ctx);
    const selection = this.trace.selection.selection;
    const selectedId =
      selection.kind === 'track_event' && selection.trackUri === this.uri
        ? selection.eventId
        : undefined;

    const xTransform: Transform1D = {
      scale: pxPerNs,
      offset: baseOffsetPx,
    };

    this.renderSlices(
      trackCtx,
      dataFrame.slices,
      xTransform,
      pxEnd,
      pxPerNs,
      baseOffsetPx,
      charWidth,
      selectedId,
    );

    // Render instants after slices so they appear on top
    this.renderInstants(
      trackCtx,
      dataFrame.instants,
      xTransform,
      pxPerNs,
      baseOffsetPx,
      selectedId,
    );

    // Checkerboard for loading areas
    const frameStartPx = timescale.timeToPx(dataFrame.start);
    const frameEndPx = timescale.timeToPx(dataFrame.end);
    checkerboardExcept(
      ctx,
      this.getHeight(),
      0,
      size.width,
      frameStartPx,
      frameEndPx,
    );
  }

  private renderSlices(
    trackCtx: TrackRenderContext,
    sliceBuffers: SliceBuffers<T>,
    xTransform: Transform1D,
    pxEnd: number,
    pxPerNs: number,
    baseOffsetPx: number,
    charWidth: {title: number; subtitle: number},
    selectedId: number | undefined,
  ): void {
    const {ctx, renderer} = trackCtx;
    const {starts, ends, depths, patterns, slices, count} = sliceBuffers;

    const rowLayout = this.buildRowLayout();

    // Helper: get Y position for a slice at index j
    const sliceTop = (j: number) => rowTopFromLayout(rowLayout, depths[j]);

    // Collect text labels to render in a second pass
    const textLabels: Array<{
      title: string;
      subTitle: string;
      textColor: string;
      rectXCenter: number;
      titleY: number;
      subTitleY: number;
    }> = [];

    // Recreate the colors array every time as this could have changed
    // TODO(stevegolton): Find a way to avoid having to do this every frame.
    const colorVariants = this.onUpdatedSlices(slices);
    const colors = new Uint32Array(count);
    let selectedIdx = -1;

    for (let j = 0; j < count; j++) {
      const slice = slices[j];
      const colorVariant = colorVariants[j];
      const cs = slice.colorScheme;
      const color =
        colorVariant === ColorVariant.BASE
          ? cs.base
          : colorVariant === ColorVariant.VARIANT
            ? cs.variant
            : cs.disabled;
      colors[j] = color.rgba;

      // Track selected slice index
      if (selectedId !== undefined && slice.id === selectedId) {
        selectedIdx = j;
      }

      // Collect text labels
      const w = ends[j] - starts[j];
      const wPx = w * pxPerNs;

      // Skip text on collapsed rows (too small to read)
      if (this.sliceLayout.collapsed && depths[j] > 0) continue;

      // Skip slices that are too narrow to show text
      if (wPx < SLICE_MIN_WIDTH_FOR_TEXT_PX) continue;

      const x = starts[j];
      const xPx = x * pxPerNs + baseOffsetPx;

      // Skip slices that are completely offscreen
      if (xPx + wPx <= 0 || xPx >= pxEnd) continue;

      // Collect text label if wide enough (using screen-space width)
      const y = sliceTop(j);
      const title = slice.title;
      const subTitle = slice.subtitle;
      if (title || subTitle) {
        const textColor =
          colorVariant === ColorVariant.BASE
            ? cs.textBase
            : colorVariant === ColorVariant.VARIANT
              ? cs.textVariant
              : cs.textDisabled;

        // Clamp slice bounds to visible window for text positioning
        const clampedLeft = Math.max(xPx, 0);
        const clampedRight = Math.min(xPx + wPx, pxEnd);
        const clampedW = clampedRight - clampedLeft;
        const rectXCenter = clampedLeft + clampedW / 2;
        const yCenter = rowHeightFromLayout(rowLayout, depths[j]) / 2;
        const titleOffset = subTitle ? -4 : 1; // Move title up if there's a subtitle
        const titleY = Math.floor(y + yCenter) + titleOffset;
        const subTitleY = Math.floor(y + yCenter) + 6;

        textLabels.push({
          title: cropText(title, charWidth.title, clampedW),
          subTitle: cropText(subTitle, charWidth.subtitle, clampedW),
          textColor: textColor.cssString,
          rectXCenter,
          titleY,
          subTitleY,
        });
      }
    }

    renderer.drawSlices(
      {
        starts,
        ends,
        depths,
        colors,
        count,
        patterns,
      },
      rowLayout,
      xTransform,
    );

    // Draw fill ratio light overlay on the unfilled portion of each slice
    ctx.fillStyle = `#FFFFFF50`;
    for (let j = 0; j < count; j++) {
      const slice = slices[j];
      const fillRatio = clamp(slice.fillRatio, 0, 1);
      if (floatEqual(fillRatio, 1)) continue;
      const left = Math.max(starts[j] * pxPerNs + baseOffsetPx, 0);
      const right = Math.min(ends[j] * pxPerNs + baseOffsetPx, pxEnd);
      const width = right - left;
      const lightSectionDrawWidth = width * (1 - fillRatio);
      if (lightSectionDrawWidth < 1) continue;
      if (left + width <= 0 || left >= pxEnd) continue;
      const y = sliceTop(j);
      ctx.fillRect(
        left + (width - lightSectionDrawWidth),
        y,
        lightSectionDrawWidth,
        rowHeightFromLayout(rowLayout, depths[j]),
      );
    }

    // Draw text labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const label of textLabels) {
      ctx.fillStyle = label.textColor;
      if (label.title) {
        ctx.font = this.getTitleFont();
        ctx.fillText(label.title, label.rectXCenter, label.titleY);
      }
      if (label.subTitle) {
        ctx.globalAlpha = 0.6; // Slightly fade subtitles for visual hierarchy
        ctx.font = this.getSubtitleFont();
        ctx.fillText(label.subTitle, label.rectXCenter, label.subTitleY);
        ctx.globalAlpha = 1;
      }
    }

    // Draw selection highlight
    if (selectedIdx !== -1) {
      // Huge rects can be subject to flickering due to floating point precision
      // issues, so we clamp the selection rect to a reasonable size offscreen.
      const SEL_OFFSCREEN_MAX_PX = 20;
      const selLeftRaw = starts[selectedIdx] * pxPerNs + baseOffsetPx;
      const selLeft = Math.max(selLeftRaw, -SEL_OFFSCREEN_MAX_PX);
      const selRightRaw = ends[selectedIdx] * pxPerNs + baseOffsetPx;
      const selRight = Math.min(selRightRaw, pxEnd + SEL_OFFSCREEN_MAX_PX);
      const selW = selRight - selLeft;
      const selY = sliceTop(selectedIdx);
      const THICKNESS = 3;
      ctx.strokeStyle = trackCtx.colors.COLOR_TIMELINE_OVERLAY;
      ctx.lineWidth = THICKNESS;
      ctx.strokeRect(
        selLeft,
        selY - THICKNESS / 2,
        selW,
        rowHeightFromLayout(rowLayout, depths[selectedIdx]) + THICKNESS,
      );
    }
  }

  private renderInstants(
    trackCtx: TrackRenderContext,
    instantBuffers: InstantBuffers<T>,
    xTransform: Transform1D,
    pxPerNs: number,
    baseOffsetPx: number,
    selectedId: number | undefined,
  ): void {
    const {ctx, renderer} = trackCtx;
    const {xs, depths: instantDepths, instants, count} = instantBuffers;

    // Recreate the colors array every time as this could have changed
    // TODO(stevegolton): Find a way to avoid having to do this every frame.
    const colorVariants = this.onUpdatedSlices(instants);
    const colors = new Uint32Array(count);
    let selectedIdx = -1;

    for (let j = 0; j < count; j++) {
      const instant = instants[j];
      const colorVariant = colorVariants[j];
      const cs = instant.colorScheme;
      const color =
        colorVariant === ColorVariant.BASE
          ? cs.base
          : colorVariant === ColorVariant.VARIANT
            ? cs.variant
            : cs.disabled;
      colors[j] = color.rgba;

      // Track selected instant index
      if (selectedId !== undefined && instant.id === selectedId) {
        selectedIdx = j;
      }
    }

    const rowLayout = this.buildRowLayout();

    renderer.drawMarkers(
      {
        xs,
        depths: instantDepths,
        colors,
        count,
      },
      rowLayout,
      this.instantWidthPx,
      xTransform,
      (ctx, x, y, _w, h) => this.drawChevron(ctx, x, y, h),
    );

    // Draw selection highlight for instants
    if (selectedIdx !== -1) {
      const selX =
        xs[selectedIdx] * pxPerNs + baseOffsetPx - this.instantWidthPx / 2;
      const selY = rowTopFromLayout(rowLayout, instantDepths[selectedIdx]);
      const selH = rowHeightFromLayout(rowLayout, instantDepths[selectedIdx]);
      const THICKNESS = 3;
      ctx.strokeStyle = trackCtx.colors.COLOR_TIMELINE_OVERLAY;
      ctx.lineWidth = THICKNESS;
      ctx.strokeRect(
        selX,
        selY - THICKNESS / 2,
        this.instantWidthPx,
        selH + THICKNESS,
      );
    }  }

  getDataset() {
    return getDataset(this.attrs);
  }

detailsPanel(sel: TrackEventSelection): TrackEventDetailsPanel | undefined {
    if (this.attrs.detailsPanel) {
      // This type assertion is required as a temporary patch while the
      // specifics of selection details are being worked out. Eventually we will
      // change the selection details to be purely based on dataset, but there
      // are currently some use cases preventing us from doing so. For now, this
      // type assertion is safe as we know we just returned the entire row from
      // from getSelectionDetails() so we know it must at least implement the
      // row's type `T`.
      return this.attrs.detailsPanel(sel as unknown as T);
    } else {
      // Provide a default details panel that shows all dataset fields      const dataset = getDataset(this.attrs);
      return new SliceTrackDetailsPanel(
        this.trace,
        dataset,
        sel as unknown as T,
      );
    }
  }

  async getSelectionDetails(
    id: number,
  ): Promise<TrackEventDetails | undefined> {
const dataset = getDataset(this.attrs);    const query = (function () {
      if (dataset.implements({id: NUM})) {
        return dataset.query();
      } else {
        return `
          SELECT
            ROW_NUMBER() OVER (ORDER BY ts) AS id,
            *
          FROM (${dataset.query()})
        `;
      }
    })();

const result = await this.trace.engine.query(`      SELECT *
      FROM (${query})
      WHERE id = ${id}
    `);

    const row = result.iter(dataset.schema);
    if (!row.valid()) return undefined;

    const data: {[key: string]: SqlValue} = {};
    for (const col of result.columns()) {
      data[col] = row.get(col);
    }

    return {
      ...data,
      ts: Time.fromRaw(row.ts),
    };
  }

getTrackShellButtons(): m.Children {
    const collapseButton =
      this.rowCount > 1
        ? m(Button, {
            className: 'pf-visible-on-hover',
            onclick: () => {
              this.sliceLayout = {
                ...this.sliceLayout,
                collapsed: !this.sliceLayout.collapsed,
              };
            },
            icon: this.sliceLayout.collapsed
              ? Icons.UnfoldMore
              : Icons.UnfoldLess,
            tooltip: this.sliceLayout.collapsed
              ? 'Expand track'
              : 'Collapse track',
            compact: true,
          })
        : undefined;
    return [collapseButton, this.attrs.shellButtons?.()];
  }
}

// Helper functions

export function renderTooltip(
  trace: Trace,
  slice: SliceOrInstant<RowSchema>,
  opts: {readonly title?: string; readonly extras?: m.Children} = {},
): m.Children {
  const durationFormatted = formatDurationForTooltip(trace, slice.row.dur);  const {title = slice.title, extras} = opts;
  return [
    m('', exists(durationFormatted) && m('b', durationFormatted), ' ', title),
    extras,
    slice.count > 1 && m('div', `and ${slice.count - 1} other events`),
  ];
}

// Given a slice, format the duration of the slice for a tooltip.
function formatDurationForTooltip(trace: Trace, slice: Slice) {
  const {dur, flags} = slice;
  if (flags & SLICE_FLAGS_INCOMPLETE) {
    return '[Incomplete]';
  } else if (flags & SLICE_FLAGS_INSTANT) {
    return undefined;
  } else {
    return formatDuration(trace, dur);
  }
}

// Generate a query to use for generating slices to be rendered
export function generateRenderQuery<T extends DatasetSchema>(
  dataset: SourceDataset<T>,
) {  const hasId = dataset.implements({id: NUM});
  const hasLayer = dataset.implements({layer: NUM});

  const extraCols = Object.fromEntries(
    Object.keys(dataset.schema).map((key) => [key, key]),
  );

  const cols = {
    ...extraCols,
// If we have no id, automatically generate one using row number.
    id: hasId ? 'id' : 'ROW_NUMBER() OVER (ORDER BY ts)',
    ts: 'ts',
    layer: hasLayer ? 'layer' : 0, // If we have no layer, assume flat layering.    depth: getDepthExpression(dataset),
    dur: getDurExpression(dataset),
  } as const;

  return `SELECT ${Object.entries(cols)
    .map(([key, value]) => `${value} AS ${key}`)
    .join(', ')} FROM (${dataset.query()})`;
}

function getDepthExpression<T extends DatasetSchema>(
  dataset: SourceDataset<T>,
): string {
  const hasDepth = dataset.implements({depth: NUM});
  const hasDur = dataset.implements({dur: LONG});
  const hasNullableDur = dataset.implements({dur: LONG_NULL});

  if (hasDepth) {
    return 'depth';
  } else if (hasDur) {
    return `internal_layout(ts, dur) OVER (ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`;
  } else if (hasNullableDur) {
    return `internal_layout(ts, COALESCE(dur, -1)) OVER (ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`;
  } else {
    return '0';
  }
}

function getDurExpression<T extends DatasetSchema>(
  dataset: SourceDataset<T>,
): string {  const hasDur = dataset.implements({dur: LONG});
  const hasNullableDur = dataset.implements({dur: LONG_NULL});

  if (hasDur) {
    return 'dur';
  } else if (hasNullableDur) {
    return 'COALESCE(dur, -1)';
  } else {
// Assume instants    return '0';
  }
}
