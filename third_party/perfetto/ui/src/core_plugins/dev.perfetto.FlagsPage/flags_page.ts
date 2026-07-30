// Copyright (C) 2020 The Android Open Source Project
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
import {Icons} from '../../base/semantic_icons';
import {channelChanged, getNextChannel, setChannel} from '../../core/channels';
import {featureFlags} from '../../core/feature_flags';
<<<<<<< HEAD
import {type Flag, OverrideState} from '../../public/feature_flag';
=======
import {Flag, OverrideState} from '../../public/feature_flag';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
import {Button, ButtonVariant} from '../../widgets/button';
import {CardStack} from '../../widgets/card';
import {EmptyState} from '../../widgets/empty_state';
import {Icon} from '../../widgets/icon';
import {Select} from '../../widgets/select';
import {SettingsCard, SettingsShell} from '../../widgets/settings_shell';
import {Stack, StackAuto} from '../../widgets/stack';
import {TextInput} from '../../widgets/text_input';
import {fuzzySearch, type FuzzySegment} from '../../base/fuzzy';
import {Intent} from '../../widgets/common';
import {Anchor} from '../../widgets/anchor';
import {Popup} from '../../widgets/popup';
import {Box} from '../../widgets/box';
<<<<<<< HEAD
import {GateDetector, renderSegments} from '../../base/mithril_utils';
import {findRef} from '../../base/dom_utils';

const SEARCH_BOX_REF = 'flags-search-box';
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

const RELEASE_PROCESS_URL =
  'https://perfetto.dev/docs/visualization/perfetto-ui-release-process';

interface FlagOption {
  readonly id: string;
  readonly name: string;
}

interface SelectWidgetAttrs {
  readonly id: string;
<<<<<<< HEAD
  readonly label: m.Children;
  readonly description: m.Children;
  readonly options: FlagOption[];
  readonly selected: string;
  readonly isChanged: boolean;
  readonly focused: boolean;
=======
  readonly label: string;
  readonly description: m.Children;
  readonly options: FlagOption[];
  readonly selected: string;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  readonly onSelect: (id: string) => void;
}

class SelectWidget implements m.ClassComponent<SelectWidgetAttrs> {
  view({attrs}: m.Vnode<SelectWidgetAttrs>) {
<<<<<<< HEAD
    return m(SettingsCard, {
      id: attrs.id,
      title: attrs.label,
      description: attrs.description,
      focused: attrs.focused,
      accent: attrs.isChanged ? Intent.Primary : undefined,
      linkHref: `#!/flags/${encodeURIComponent(attrs.id)}`,
      controls: m(
        Select,
        {
          onchange: (e: InputEvent) => {
            const value = (e.target as HTMLSelectElement).value;
            attrs.onSelect(value);
=======
    return m(Stack, {orientation: 'horizontal'}, [
      m(Stack, [
        m(
          Stack,
          {
            orientation: 'horizontal',
            gap: 'small',
            className: 'pf-flags-page__label-row',
          },
          attrs.label,
          m(
            '.pf-flags-page__link-button',
            m(Anchor, {
              href: `#!/flags/${encodeURIComponent(attrs.id)}`,
              icon: 'link',
              title: 'Link to this flag',
            }),
          ),
        ),
        m('.pf-flags-page__flag-id', attrs.id),
        m('.pf-flags-page__description', attrs.description),
      ]),
      m(StackAuto),
      m(StackFixed, [
        m(
          Select,
          {
            onchange: (e: InputEvent) => {
              const value = (e.target as HTMLSelectElement).value;
              attrs.onSelect(value);
            },
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
          },
        },
        attrs.options.map((o) => {
          const selected = o.id === attrs.selected;
          return m('option', {value: o.id, selected}, o.name);
        }),
      ),
    });
  }
}

interface FlagWidgetAttrs {
  readonly flag: Flag;
<<<<<<< HEAD
  readonly nameSegments?: readonly FuzzySegment[] | string;
  readonly descriptionSegments?: readonly FuzzySegment[] | string;
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  readonly focused: boolean;
}

class FlagWidget implements m.ClassComponent<FlagWidgetAttrs> {
  view({attrs}: m.Vnode<FlagWidgetAttrs>) {
    const flag = attrs.flag;
    const defaultState = flag.defaultValue ? 'Enabled' : 'Disabled';
<<<<<<< HEAD

    return m(SelectWidget, {
      label: renderSegments(attrs.nameSegments ?? flag.name),
      id: flag.id,
      description: renderSegments(
        attrs.descriptionSegments ?? flag.description.trim(),
      ),
      options: [
        {id: OverrideState.DEFAULT, name: `Default (${defaultState})`},
        {id: OverrideState.TRUE, name: 'Enabled'},
        {id: OverrideState.FALSE, name: 'Disabled'},
      ],
      isChanged: flag.isOverridden(),
      focused: attrs.focused,
      selected: flag.overriddenState(),
      onSelect: (value: string) => {
        switch (value) {
          case OverrideState.TRUE:
            flag.set(true);
            break;
          case OverrideState.FALSE:
            flag.set(false);
            break;
          default:
          case OverrideState.DEFAULT:
            flag.reset();
            break;
        }
      },
    });
=======
    const isChanged = flag.isOverridden();

    return m(
      Card,
      {
        id: flag.id,
        className: classNames(
          isChanged && 'pf-flags-page__card--changed',
          attrs.focused && 'pf-flags-page__card--focused',
        ),
      },
      m(SelectWidget, {
        label: flag.name,
        id: flag.id,
        description: flag.description,
        options: [
          {id: OverrideState.DEFAULT, name: `Default (${defaultState})`},
          {id: OverrideState.TRUE, name: 'Enabled'},
          {id: OverrideState.FALSE, name: 'Disabled'},
        ],
        selected: flag.overriddenState(),
        onSelect: (value: string) => {
          switch (value) {
            case OverrideState.TRUE:
              flag.set(true);
              break;
            case OverrideState.FALSE:
              flag.set(false);
              break;
            default:
            case OverrideState.DEFAULT:
              flag.reset();
              break;
          }
        },
      }),
    );
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
}

export interface FlagsPageAttrs {
  readonly subpage?: string;
}

export class FlagsPage implements m.ClassComponent<FlagsPageAttrs> {
  private filterText: string = '';

  private renderEmptyState(isFiltering: boolean) {
    if (isFiltering) {
      return m(
        EmptyState,
        {
          title: 'No settings match your search criteria',
        },
        m(Button, {
          label: 'Clear filter',
          icon: Icons.FilterOff,
          variant: ButtonVariant.Filled,
          onclick: () => {
            this.filterText = '';
          },
        }),
      );
    } else {
      return m(EmptyState, {
        icon: 'search_off',
        title: 'No settings found',
      });
    }
  }

  view({attrs}: m.Vnode<FlagsPageAttrs>): m.Children {
    const isFiltering = this.filterText !== '';
    const flags = featureFlags
      .allFlags()
      .filter((p) => !p.id.startsWith('plugin_'));

    const filteredFlags = isFiltering
      ? fuzzySearch(
          flags,
          [(f: Flag) => f.name, (f: Flag) => f.id, (f: Flag) => f.description],
          this.filterText,
        ).map((res) => ({
          item: res.item,
          nameSegments: res.segments[0],
          idSegments: res.segments[1],
          descriptionSegments: res.segments[2],
        }))
      : flags.map((flag) => ({
          item: flag,
          nameSegments: flag.name,
          idSegments: flag.id,
          descriptionSegments: flag.description.trim(),
        }));
    const needsReload = channelChanged();

    const subpage = decodeURIComponent(attrs.subpage ?? '');

<<<<<<< HEAD
    const page = m(
=======
    return m(
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      SettingsShell,
      {
        stickyHeaderContent: m(
          Stack,
          {orientation: 'horizontal'},
          m(
            Popup,
            {
              trigger: m(Button, {
                icon: 'restore',
                label: 'Restore Defaults',
              }),
            },
            m(
              Box,
              m(
                Stack,
                'Are you sure you want to restore all flags to their default values? This action cannot be undone!',
                m(
                  Stack,
                  {orientation: 'horizontal'},
                  m(StackAuto),
                  m(Button, {
                    className: Popup.DISMISS_POPUP_GROUP_CLASS,
                    variant: ButtonVariant.Filled,
                    label: 'Cancel',
                  }),
                  m(Button, {
                    className: Popup.DISMISS_POPUP_GROUP_CLASS,
                    intent: Intent.Danger,
                    variant: ButtonVariant.Filled,
                    label: 'Restore Defaults',
                    onclick: () => featureFlags.resetAll(),
                  }),
                ),
              ),
            ),
          ),
          needsReload &&
            m(Button, {
              icon: 'refresh',
              label: 'Reload required',
              variant: ButtonVariant.Filled,
              intent: Intent.Primary,
              onclick: () => window.location.reload(),
            }),
          m(StackAuto),
          m(TextInput, {
            placeholder: 'Search...',
            ref: SEARCH_BOX_REF,
            value: this.filterText,
            leftIcon: 'search',
            oninput: (e: Event) => {
              const target = e.target as HTMLInputElement;
              this.filterText = target.value;
            },
          }),
        ),
        title: 'Flags',
      },
      m(
        Stack,
        {spacing: 'large'},
<<<<<<< HEAD
        m(SelectWidget, {
          label: 'Release channel',
          id: 'releaseChannel',
          isChanged: getNextChannel() !== 'stable',
          focused: subpage === `/releaseChannel`,
          description: [
            'Which release channel of the UI to use. See ',
            m(
              Anchor,
              {
                href: RELEASE_PROCESS_URL,
              },
              'Release Process',
            ),
            ' for more information.',
          ],
          options: [
            {id: 'stable', name: 'Stable (default)'},
            {id: 'canary', name: 'Canary'},
            {id: 'autopush', name: 'Autopush'},
          ],
          selected: getNextChannel(),
          onSelect: (id) => setChannel(id),
        }),
=======
        m(
          Card,
          {
            id: 'releaseChannel',
            className: classNames(
              subpage === `/releaseChannel` && 'pf-flags-page__card--focused',
            ),
          },
          m(SelectWidget, {
            label: 'Release channel',
            id: 'releaseChannel',
            description: [
              'Which release channel of the UI to use. See ',
              m(
                Anchor,
                {
                  href: RELEASE_PROCESS_URL,
                },
                'Release Process',
              ),
              ' for more information.',
            ],
            options: [
              {id: 'stable', name: 'Stable (default)'},
              {id: 'canary', name: 'Canary'},
              {id: 'autopush', name: 'Autopush'},
            ],
            selected: getNextChannel(),
            onSelect: (id) => setChannel(id),
          }),
        ),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
        m(
          'span',
          m(
            'h1',
            m(Icon, {icon: Icons.Warning}),
            ' Warning: Experimental features ahead! ',
          ),
        ),
        m(
          'span.pf-flags-page__description',
          'The following flags are experimental and may change or break the UI in unexpected ways. They are used by the Perfetto developers to test new features while in development. They might mess up your local storage, and they may be removed or renamed at any time. Use at your own risk!',
        ),
        filteredFlags.length === 0
          ? this.renderEmptyState(isFiltering)
          : m(
              CardStack,
<<<<<<< HEAD
              filteredFlags.map(
                ({item: flag, nameSegments, descriptionSegments}) =>
                  m(FlagWidget, {
                    flag,
                    nameSegments,
                    descriptionSegments,
                    focused: attrs.subpage === `/${flag.id}`,
                  }),
=======
              filteredFlags.map((flag) =>
                m(FlagWidget, {
                  flag: flag.item,
                  focused: attrs.subpage === `/${flag.item.id}`,
                }),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
              ),
            ),
        m(
          '.pf-flags-page__footer',
          m(
            'span',
            'Are you looking for plugins? These have moved to the ',
            m(Anchor, {href: '#!/plugins'}, 'plugins'),
            ' page.',
          ),
        ),
      ),
    );

<<<<<<< HEAD
    return m(
      GateDetector,
      {
        onVisibilityChanged: (visible: boolean, dom: Element) => {
          if (visible) {
            const input = findRef(
              dom,
              SEARCH_BOX_REF,
            ) as HTMLInputElement | null;
            if (input) {
              input.focus();
              input.select();
            }
          }
        },
      },
      page,
    );
=======
  oncreate(vnode: m.VnodeDOM<FlagsPageAttrs>) {
    const subpage = decodeURIComponent(vnode.attrs.subpage ?? '');
    const flagId = /[/](\w+)/.exec(subpage)?.slice(1, 2)[0];
    if (flagId) {
      const flag = vnode.dom.querySelector(`#${flagId}`);
      if (flag) {
        flag.scrollIntoView({block: 'center'});
      }
    }
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
}
