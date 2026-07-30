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

import {classNames} from '../../../../base/classnames';
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
import {PopupMenu, MenuDivider, MenuTitle} from '../../../../widgets/menu';
import type {QueryNode} from '../../query_node';
import {Icon} from '../../../../widgets/icon';
import {buildMenuItems} from './menu_utils';
import {nodeRegistry} from '../node_registry';
import type {NodeDetailsAttrs} from '../../node_types';
import {NodeDetailsContent} from '../node_styling_widgets';

export interface NodeBoxAttrs {
  readonly node: QueryNode;
  readonly onAddOperationNode: (id: string, node: QueryNode) => void;
}

export function renderWarningIcon(node: QueryNode): m.Child {
  if (!node.context.issues || !node.context.issues.hasIssues()) return null;
=======
import {Icons} from '../../../../base/semantic_icons';
import {Button} from '../../../../widgets/button';
import {MenuItem, PopupMenu} from '../../../../widgets/menu';
import {QueryNode, singleNodeOperation, NodeType} from '../../query_node';
import {UIFilter, formatFilterDetails} from '../operations/filter';
import {Icon} from '../../../../widgets/icon';
import {Callout} from '../../../../widgets/callout';
import {Intent} from '../../../../widgets/common';
import {nodeRegistry} from '../node_registry';

export interface NodeActions {
  readonly onDuplicateNode: (node: QueryNode) => void;
  readonly onDeleteNode: (node: QueryNode) => void;
  readonly onAddOperationNode: (id: string, node: QueryNode) => void;
  readonly onRemoveFilter: (node: QueryNode, filter: UIFilter) => void;
}

export interface NodeBoxAttrs extends NodeActions {
  readonly node: QueryNode;
}

export function renderWarningIcon(node: QueryNode): m.Child {
  if (!node.state.issues || !node.state.issues.hasIssues()) return null;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts

  const iconClasses = classNames('pf-exp-node-box__warning-icon');

  return m(Icon, {
    className: iconClasses,
    icon: 'warning',
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
    title: node.context.issues.getTitle(),
  });
}

export function renderAddButton(attrs: NodeBoxAttrs): m.Child {
  const {node, onAddOperationNode} = attrs;

  const allowedChildren = nodeRegistry.getAllowedChildrenFor(node.type);
  if (allowedChildren.length === 0) {
    return null;
  }

  const addCb = (id: string) => onAddOperationNode(id, node);
  const multisourceMenuItems = buildMenuItems(
    'multisource',
    addCb,
    allowedChildren,
  );
  const modificationMenuItems = buildMenuItems(
    'modification',
    addCb,
    allowedChildren,
  );
  const exportMenuItems = buildMenuItems('export', addCb, allowedChildren);

  const sections: {title: string; items: m.Children[]}[] = [
    {title: 'Modifications', items: modificationMenuItems},
    {title: 'Operations', items: multisourceMenuItems},
    {title: 'Export', items: exportMenuItems},
  ].filter((s) => s.items.length > 0);

  if (sections.length === 0) {
    return null;
  }

  const menuItems: m.Children[] = [];
  for (let i = 0; i < sections.length; i++) {
    if (i > 0) {
      menuItems.push(m(MenuDivider));
    }
    menuItems.push(m(MenuTitle, {label: sections[i].title}));
    menuItems.push(...sections[i].items);
  }

=======
    title: node.state.issues.getTitle(),
  });
}

export function renderContextMenu(attrs: NodeBoxAttrs): m.Child {
  const {node, onDuplicateNode, onDeleteNode} = attrs;
  const menuItems: m.Child[] = [
    m(MenuItem, {
      label: 'Duplicate',
      onclick: () => onDuplicateNode(node),
    }),
    m(MenuItem, {
      label: 'Delete',
      onclick: () => onDeleteNode(node),
    }),
  ];

  return m(
    PopupMenu,
    {
      trigger: m(Button, {
        iconFilled: true,
        icon: Icons.ContextMenu,
      }),
    },
    ...menuItems,
  );
}

export function renderAddButton(attrs: NodeBoxAttrs): m.Child {
  const {node, onAddOperationNode} = attrs;
  const operationNodes = nodeRegistry
    .list()
    .filter(([_id, descriptor]) => descriptor.type === 'modification');

  if (operationNodes.length === 0) {
    return null;
  }

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts
  return m(
    PopupMenu,
    {
      trigger: m(Icon, {
        className: 'pf-exp-node-box-add-button',
        icon: 'add',
      }),
    },
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
    ...menuItems,
  );
}

function renderDetailsView(node: QueryNode): m.Child {
  const attrs: NodeDetailsAttrs = node.nodeDetails();
  return NodeDetailsContent(attrs.content);
=======
    ...operationNodes.map(([id, descriptor]) => {
      return m(MenuItem, {
        label: descriptor.name,
        onclick: () => onAddOperationNode(id, node),
      });
    }),
  );
}

export function renderFilters(attrs: NodeBoxAttrs): m.Child {
  const {node, onRemoveFilter} = attrs;
  return formatFilterDetails(
    node.state.filters,
    node.state.filterOperator,
    node.state,
    (filter) => onRemoveFilter(node, filter),
  );
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts
}

export const NodeBox: m.Component<NodeBoxAttrs> = {
  view({attrs}) {
    const {node} = attrs;
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
=======
    const shouldShowTitle = !singleNodeOperation(node.type);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts

    return [
      m(
        '.pf-exp-node-box__content',
        {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
          class: classNames(node.type),
        },
        m('.pf-exp-node-box__details', renderDetailsView(node)),
=======
          class: classNames(NodeType[node.type]),
        },
        shouldShowTitle && m('span.pf-exp-node-box__title', node.getTitle()),
        node.state.comment &&
          m(Callout, {intent: Intent.None}, node.state.comment),
        m('.pf-exp-node-box__details', node.nodeDetails?.()),
        renderFilters(attrs),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts
      ),
      m(
        '.pf-exp-node-box__actions',
        renderAddButton(attrs),
        renderWarningIcon(node),
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/node_box.ts
=======
        renderContextMenu(attrs),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/node_box.ts
      ),
    ];
  },
};
