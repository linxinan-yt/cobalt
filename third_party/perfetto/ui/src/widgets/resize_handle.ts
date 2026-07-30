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

import './resize_handle.scss';
import m from 'mithril';
import type {HTMLAttrs} from './common';
import type {MithrilEvent} from '../base/mithril_utils';

export interface ResizeHandleAttrs extends HTMLAttrs {
  // Called with delta (relative change)
  onResize?(deltaPx: number): void;
  // Called with absolute position relative to offsetParent
  onResizeAbsolute?(positionPx: number): void;
  onResizeStart?(): void;
  onResizeEnd?(): void;
  // Direction of the resize handle:
  // - 'vertical' (default): horizontal bar that can be dragged up/down
  // - 'horizontal': vertical bar that can be dragged left/right
  readonly direction?: 'vertical' | 'horizontal';
}

export class ResizeHandle implements m.ClassComponent<ResizeHandleAttrs> {
  private handleElement?: HTMLElement;
  private previousY: number | undefined;
<<<<<<< HEAD
  private previousX: number | undefined;
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

  oncreate(vnode: m.VnodeDOM<ResizeHandleAttrs, this>) {
    this.handleElement = vnode.dom as HTMLElement;
  }

  private endDrag(attrs: ResizeHandleAttrs, pointerId: number) {
<<<<<<< HEAD
    if (this.previousY !== undefined || this.previousX !== undefined) {
      this.previousY = undefined;
      this.previousX = undefined;
=======
    if (this.previousY !== undefined) {
      this.previousY = undefined;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      this.handleElement!.releasePointerCapture(pointerId);
      attrs.onResizeEnd?.();
    }
  }

  view({attrs}: m.CVnode<ResizeHandleAttrs>): m.Children {
    const {
      onResize: _onResize,
      onResizeAbsolute: _onResizeAbsolute,
      onResizeStart: _onResizeStart,
      onResizeEnd: _onResizeEnd,
      direction = 'vertical',
      ...rest
    } = attrs;

    const isHorizontal = direction === 'horizontal';

    return m('.pf-resize-handle', {
<<<<<<< HEAD
      class: isHorizontal
        ? 'pf-resize-handle--horizontal'
        : 'pf-resize-handle--vertical',
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      oncontextmenu: (e: Event) => {
        e.preventDefault();
      },
      onpointerdown: (e: PointerEvent) => {
        const offsetParent = this.handleElement?.offsetParent as HTMLElement;
<<<<<<< HEAD

        if (isHorizontal) {
          const offsetLeft = offsetParent?.getBoundingClientRect().left ?? 0;
          const mouseOffsetX = e.clientX - offsetLeft;
          this.previousX = mouseOffsetX;
        } else {
          const offsetTop = offsetParent?.getBoundingClientRect().top ?? 0;
          const mouseOffsetY = e.clientY - offsetTop;
          this.previousY = mouseOffsetY;
        }
=======
        const offsetTop = offsetParent?.getBoundingClientRect().top ?? 0;
        const mouseOffsetY = e.clientY - offsetTop;
        this.previousY = mouseOffsetY;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

        this.handleElement!.setPointerCapture(e.pointerId);
        attrs.onResizeStart?.();

        e.stopPropagation();
      },
      onpointermove: (e: MithrilEvent<PointerEvent>) => {
        const offsetParent = this.handleElement?.offsetParent as HTMLElement;
<<<<<<< HEAD
=======
        const offsetTop = offsetParent?.getBoundingClientRect().top ?? 0;
        const mouseOffsetY = e.clientY - offsetTop;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

        // We typically just resize some element when dragging the handle, so we
        // tell Mithril not to redraw after this event.
        e.redraw = false;
<<<<<<< HEAD

        // Note: We don't check hasPointerCapture() here because pointer capture
        // already ensures we only receive move events during an active drag.
        // The previousX/previousY check is sufficient to determine drag state.

        if (isHorizontal) {
          const offsetLeft = offsetParent?.getBoundingClientRect().left ?? 0;
          const mouseOffsetX = e.clientX - offsetLeft;

          if (this.previousX !== undefined) {
            attrs.onResize?.(mouseOffsetX - this.previousX);
            attrs.onResizeAbsolute?.(mouseOffsetX);
            this.previousX = mouseOffsetX;
          }
        } else {
          const offsetTop = offsetParent?.getBoundingClientRect().top ?? 0;
          const mouseOffsetY = e.clientY - offsetTop;

          if (this.previousY !== undefined) {
            attrs.onResize?.(mouseOffsetY - this.previousY);
            attrs.onResizeAbsolute?.(mouseOffsetY);
            this.previousY = mouseOffsetY;
          }
=======
        if (
          this.previousY !== undefined
          // && this.handleElement!.hasPointerCapture(e.pointerId)
        ) {
          attrs.onResize(mouseOffsetY - this.previousY);
          this.previousY = mouseOffsetY;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
        }
      },
      onpointerup: (e: PointerEvent) => {
        this.endDrag(attrs, e.pointerId);
      },
      onpointercancel: (e: PointerEvent) => {
        this.endDrag(attrs, e.pointerId);
      },
      onpointercapturelost: (e: PointerEvent) => {
        this.endDrag(attrs, e.pointerId);
      },
      ...rest,
    });
  }
}
