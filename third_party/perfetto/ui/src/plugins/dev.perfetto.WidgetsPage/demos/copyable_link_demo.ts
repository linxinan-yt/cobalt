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
<<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.WidgetsPage/demos/copyable_link_demo.ts
import {CopyableLink} from '../../../widgets/copyable_link';
import {renderWidgetShowcase} from '../widgets_page_utils';

export function renderCopyableLink(): m.Children {
  return [
    m(
      '.pf-widget-intro',
      m('h1', 'CopyableLink'),
      m(
        'p',
        'A link component with a built-in copy-to-clipboard button for easily sharing URLs.',
      ),
    ),
    renderWidgetShowcase({
      renderWidget: ({noicon}) =>
        m(CopyableLink, {
          noicon,
          url: 'https://perfetto.dev/docs/',
        }),
      initialOpts: {
        noicon: false,
========
import {Checkbox} from '../../../widgets/checkbox';
import {renderWidgetShowcase} from '../widgets_page_utils';

export function renderCheckbox(): m.Children {
  return [
    m(
      '.pf-widget-intro',
      m('h1', 'Checkbox'),
      m(
        'p',
        'A standard checkbox input for binary on/off selections with optional labels and disabled state.',
      ),
    ),
    renderWidgetShowcase({
      renderWidget: (opts) => m(Checkbox, {label: 'Checkbox', ...opts}),
      initialOpts: {
        disabled: false,
>>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.WidgetsPage/demos/checkbox_demo.ts
      },
    }),
  ];
}
