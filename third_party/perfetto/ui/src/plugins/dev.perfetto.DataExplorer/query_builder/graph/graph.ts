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

/**
 * Graph Component - Query Builder Visual Graph Editor
 *
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
 * This file implements the visual graph editor for the Data Explorer query builder.
=======
 * This file implements the visual graph editor for the Explore Page query builder.
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
 * It handles the rendering, layout, and interaction of query nodes in a node-graph format.
 *
 * Key Concepts:
 * - Root Nodes: Nodes that have explicit x,y coordinates and are rendered at top level
 * - Docked Nodes: Child nodes without coordinates that appear "docked" below their parent
 * - Node Chain: A sequence of single-input/single-output nodes connected vertically
 * - Layout Map: Tracks which nodes have explicit coordinates (undocked nodes)
 *
 * Architecture:
 * - Nodes without layout coordinates are rendered "docked" to their parent via the 'next' property
 * - Only root (undocked) nodes need explicit positioning
 * - Connections between undocked nodes are rendered as edges
 * - Docked chains appear as stacked boxes within a single visual unit
 */

import m from 'mithril';

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
import {classNames} from '../../../../base/classnames';
import {Icons} from '../../../../base/semantic_icons';
import {Button, ButtonVariant} from '../../../../widgets/button';
import {Intent} from '../../../../widgets/common';
import {uuidv4} from '../../../../base/uuid';
=======
import {Icons} from '../../../../base/semantic_icons';
import {Button, ButtonVariant} from '../../../../widgets/button';
import {Intent} from '../../../../widgets/common';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
import {
  MenuItem,
  MenuDivider,
  MenuTitle,
  PopupMenu,
} from '../../../../widgets/menu';
import {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  type Connection,
  type Label,
  type Node,
  NodeGraph,
  type NodeGraphApi,
  type NodeGraphAttrs,
  type NodePort,
} from '../../../../widgets/nodegraph';
import {createEditableTextLabels} from './text_label';
import {type QueryNode, singleNodeOperation, NodeType} from '../../query_node';
import {NodeBox} from './node_box';
import {buildMenuItems} from './menu_utils';
import {nodeRegistry} from '../node_registry';
import {
  getAllNodes,
  findNodeById,
  addConnection,
  removeConnection,
  wouldCreateCycle,
} from '../graph_utils';
import {RoundActionButton} from '../widgets';
import {getNodeHue} from './node_config';
=======
  Connection,
  Node,
  NodeGraph,
  NodeGraphApi,
  NodePort,
} from '../../../../widgets/nodegraph';
import {UIFilter} from '../operations/filter';
import {
  QueryNode,
  singleNodeOperation,
  SourceNode,
  MultiSourceNode,
  ModificationNode,
  NodeType,
  addConnection,
  removeConnection,
} from '../../query_node';
import {EmptyGraph} from '../empty_graph';
import {nodeRegistry} from '../node_registry';
import {NodeBox} from './node_box';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts

// ========================================
// TYPE DEFINITIONS
// ========================================

type Position = {x: number; y: number};

// Maps node IDs to their layout positions.
// Nodes in this map are "undocked" (have coordinates), nodes absent are "docked" (attached to parent).
type LayoutMap = Map<string, Position>;

const LAYOUT_CONSTANTS = {
  INITIAL_X: 100,
  INITIAL_Y: 100,
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  BATCH_NODE_HORIZONTAL_OFFSET: 250,
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
};

// ========================================
// TYPE GUARDS
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
// Check if a node should show a top port based on its type (capabilities)
// rather than its current connection state
function shouldShowTopPort(node: QueryNode): boolean {
  // Single-input operation nodes always have a top port, even when disconnected
  return singleNodeOperation(node.type);
=======
function isSourceNode(node: QueryNode): node is SourceNode {
  return (
    node.type === NodeType.kTable ||
    node.type === NodeType.kSimpleSlices ||
    node.type === NodeType.kSqlSource
  );
}

// Multi-input nodes (have prevNodes array, cannot be docked)
function isMultiSourceNode(node: QueryNode): node is MultiSourceNode {
  return (
    node.type === NodeType.kIntervalIntersect ||
    node.type === NodeType.kUnion ||
    node.type === NodeType.kMerge
  );
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

// ========================================
// GRAPH ATTRIBUTES INTERFACE
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
// Callbacks shared between BuilderAttrs and GraphAttrs.
// Builder forwards these to Graph without transformation.
export interface GraphCallbacks {
  readonly onNodeSelected: (node: QueryNode) => void;
  readonly onNodeAddToSelection: (node: QueryNode) => void;
  readonly onNodeRemoveFromSelection: (nodeId: string) => void;
  readonly onDeselect: () => void;
  readonly onNodeLayoutChange: (nodeId: string, layout: Position) => void;
  readonly onLabelsChange?: (labels: TextLabelData[]) => void;
=======
export interface GraphAttrs {
  readonly rootNodes: QueryNode[];
  readonly selectedNode?: QueryNode;
  readonly nodeLayouts: LayoutMap;
  readonly onNodeSelected: (node: QueryNode) => void;
  readonly onDeselect: () => void;
  readonly onNodeLayoutChange: (nodeId: string, layout: Position) => void;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
  readonly onAddSourceNode: (id: string) => void;
  readonly onAddOperationNode: (id: string, node: QueryNode) => void;
  readonly onClearAllNodes: () => void;
  readonly onDuplicateNode: (node: QueryNode) => void;
  readonly onDeleteNode: (node: QueryNode) => void;
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  readonly onConnectionRemove: (
    fromNode: QueryNode,
    toNode: QueryNode,
    isSecondaryInput: boolean,
  ) => void;
  readonly onImport: () => void;
  readonly onExport: () => void;
  readonly onCreateGroup?: (selectedNodeIds: ReadonlySet<string>) => void;
  readonly onUngroupNode?: (node: QueryNode) => void;
}

export interface GraphAttrs extends GraphCallbacks {
  readonly rootNodes: QueryNode[];
  readonly selectedNodes: ReadonlySet<string>;
  readonly nodeLayouts: LayoutMap;
  readonly labels: ReadonlyArray<TextLabelData>;
  readonly loadGeneration?: number;
=======
  readonly onConnectionRemove: (fromNode: QueryNode, toNode: QueryNode) => void;
  readonly onImport: () => void;
  readonly onImportWithStatement: () => void;
  readonly onExport: () => void;
  readonly onRemoveFilter: (node: QueryNode, filter: UIFilter) => void;
  readonly devMode?: boolean;
  readonly onDevModeChange?: (enabled: boolean) => void;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
// Alias for consistency with existing code in this file
const findQueryNode = findNodeById;
=======
// Traverses the graph using BFS with cycle detection (visited set prevents infinite loops)
export function getAllNodes(rootNodes: QueryNode[]): QueryNode[] {
  const allNodes: QueryNode[] = [];
  const visited = new Set<string>();

  for (const root of rootNodes) {
    const queue: QueryNode[] = [root];

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr) continue;

      if (visited.has(curr.nodeId)) {
        continue;
      }

      visited.add(curr.nodeId);
      allNodes.push(curr);

      for (const child of curr.nextNodes) {
        if (child !== undefined && !visited.has(child.nodeId)) {
          queue.push(child);
        }
      }
    }
  }
  return allNodes;
}

function findQueryNode(
  nodeId: string,
  rootNodes: QueryNode[],
): QueryNode | undefined {
  const allNodes = getAllNodes(rootNodes);
  return allNodes.find((n) => n.nodeId === nodeId);
}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts

// A node is "docked" if it has no layout (rendered as part of parent's chain via 'next' property)
function isChildDocked(child: QueryNode, nodeLayouts: LayoutMap): boolean {
  return !nodeLayouts.has(child.nodeId);
}

// ========================================
// NODE PORT AND MENU UTILITIES
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
// Calculate the number of ports to display for secondary inputs.
// Shows one extra empty port for adding new connections, but respects max limit.
function calculateNumPorts(
  currentConnections: number,
  max: number | 'unbounded',
): number {
  return max === 'unbounded'
    ? currentConnections + 1
    : Math.min(currentConnections + 1, max);
}

function getInputLabels(node: QueryNode): NodePort[] {
  // Single-input operation nodes always have a top port (even when disconnected)
  if (singleNodeOperation(node.type)) {
    const labels: NodePort[] = [];
    labels.push({content: 'Input', direction: 'top'});

    // Check if node also has secondaryInputs (like AddColumnsNode or FilterDuring)
    if (node.secondaryInputs) {
      // Show side ports using the node's custom port names
      const portNames = node.secondaryInputs.portNames;
      const currentConnections = node.secondaryInputs.connections.size ?? 0;
      const numPorts = calculateNumPorts(
        currentConnections,
        node.secondaryInputs.max,
      );

      for (let i = 0; i < numPorts; i++) {
        const portName = getPortName(portNames, i);
        labels.push({content: portName, direction: 'left'});
      }
    }
    return labels;
  }

  // Multi-source nodes (IntervalIntersect, Join, Union) - no primaryInput
  if (node.secondaryInputs) {
    const portNames = node.secondaryInputs.portNames;
    const currentConnections = node.secondaryInputs.connections.size ?? 0;
    const numPorts = calculateNumPorts(
      currentConnections,
      node.secondaryInputs.max,
    );
    const labels: NodePort[] = [];

    for (let i = 0; i < numPorts; i++) {
      const portName = getPortName(portNames, i);
      labels.push({content: portName, direction: 'left'});
=======
function getInputLabels(node: QueryNode): NodePort[] {
  if (isSourceNode(node)) {
    return [];
  }

  if (isMultiSourceNode(node)) {
    const multiSourceNode = node as MultiSourceNode;

    // Check if node has custom input labels
    if (
      'getInputLabels' in multiSourceNode &&
      typeof multiSourceNode.getInputLabels === 'function'
    ) {
      return (
        multiSourceNode as MultiSourceNode & {getInputLabels: () => string[]}
      )
        .getInputLabels()
        .map((label) => ({content: label, direction: 'left'}));
    }

    // Always show one extra empty port for adding new connections
    const numPorts = multiSourceNode.prevNodes.length + 1;
    const labels: NodePort[] = [];
    for (let i = 0; i < numPorts; i++) {
      labels.push({content: `Input ${i + 1}`, direction: 'left'});
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
    }
    return labels;
  }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  // Source nodes have no inputs
  return [];
}

// Helper function to get port name from either an array or a function
function getPortName(
  portNames: string[] | ((portIndex: number) => string),
  portIndex: number,
): string {
  if (typeof portNames === 'function') {
    return portNames(portIndex);
  }

  // Array of names - use the index or fallback if out of bounds
  return portNames[portIndex] ?? `Input ${portIndex}`;
=======
  // Check if ModificationNode has inputNodes (additional left-side inputs)
  if ('inputNodes' in node) {
    const modNode = node as ModificationNode;
    if (modNode.inputNodes !== undefined && Array.isArray(modNode.inputNodes)) {
      // Check if node has custom input labels
      if (
        'getInputLabels' in modNode &&
        typeof modNode.getInputLabels === 'function'
      ) {
        return modNode.getInputLabels();
      }

      const labels: NodePort[] = [];

      // Add top port for prevNode (main data flow)
      labels.push({content: 'Input', direction: 'top'});

      // For AddColumnsNode, show exactly one left-side port
      // (it only supports connecting one table to add columns from)
      if ('type' in modNode && modNode.type === NodeType.kAddColumns) {
        labels.push({content: 'Table', direction: 'left'});
        return labels;
      }

      // For other nodes with inputNodes, dynamically show ports
      const numConnected = modNode.inputNodes.filter(
        (it: QueryNode | undefined) => it,
      ).length;
      // Always show one extra empty port for adding new connections
      const numLeftPorts = numConnected + 1;

      // Add left-side ports for inputNodes (additional table inputs)
      for (let i = 0; i < numLeftPorts; i++) {
        labels.push({content: `Table ${i + 1}`, direction: 'left'});
      }
      return labels;
    }
  }

  return [{content: 'Input', direction: 'top'}];
}

function buildMenuItems(
  nodeType: 'source' | 'multisource' | 'modification',
  devMode: boolean | undefined,
  onAddNode: (id: string) => void,
): m.Children[] {
  return nodeRegistry
    .list()
    .filter(([_id, descriptor]) => descriptor.type === nodeType)
    .map(([id, descriptor]) => {
      if (descriptor.devOnly && !devMode) {
        return null;
      }
      return m(MenuItem, {
        label: descriptor.name,
        onclick: () => onAddNode(id),
      });
    });
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

function buildAddMenuItems(
  targetNode: QueryNode,
  onAddOperationNode: (id: string, node: QueryNode) => void,
): m.Children[] {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  const allowedChildren = nodeRegistry.getAllowedChildrenFor(targetNode.type);
  if (allowedChildren.length === 0) {
    return [];
  }

  const addCb = (id: string) => onAddOperationNode(id, targetNode);
  const multisourceItems = buildMenuItems(
    'multisource',
    addCb,
    allowedChildren,
  );
  const modificationItems = buildMenuItems(
    'modification',
    addCb,
    allowedChildren,
  );

  const exportItems = buildMenuItems('export', addCb, allowedChildren);

  const sections: {title: string; items: m.Children[]}[] = [
    {title: 'Modifications', items: modificationItems},
    {title: 'Operations', items: multisourceItems},
    {title: 'Export', items: exportItems},
  ].filter((s) => s.items.length > 0);

  if (sections.length === 0) {
    return [];
  }

  const menuItems: m.Children[] = [];
  for (let i = 0; i < sections.length; i++) {
    if (i > 0) {
      menuItems.push(m(MenuDivider));
    }
    menuItems.push(m(MenuTitle, {label: sections[i].title}));
    menuItems.push(...sections[i].items);
  }
  return menuItems;
=======
  const modificationItems = buildMenuItems('modification', undefined, (id) =>
    onAddOperationNode(id, targetNode),
  );
  const multisourceItems = buildMenuItems('multisource', undefined, (id) =>
    onAddOperationNode(id, targetNode),
  );

  // Add a divider between modification and multisource nodes if both exist
  if (modificationItems.length > 0 && multisourceItems.length > 0) {
    return [...modificationItems, m(MenuDivider), ...multisourceItems];
  }
  return [...modificationItems, ...multisourceItems];
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

// ========================================
// LAYOUT UTILITIES
// ========================================

// Returns nodes that should be rendered at the root level (excludes docked children)
function getRootNodes(
  allNodes: QueryNode[],
  nodeLayouts: LayoutMap,
): QueryNode[] {
  const dockedNodes = new Set<QueryNode>();

  // A node is docked (not a root) if:
  // 1. It's a single-node operation (modification node)
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  // 2. It has a primaryInput (parent in the primary flow)
=======
  // 2. It has a prevNode (parent in the primary flow)
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
  // 3. It doesn't have a layout position (purely visual property)
  for (const node of allNodes) {
    if (
      singleNodeOperation(node.type) &&
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      'primaryInput' in node &&
      node.primaryInput !== undefined &&
=======
      'prevNode' in node &&
      node.prevNode !== undefined &&
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      isChildDocked(node, nodeLayouts)
    ) {
      dockedNodes.add(node);
    }
  }

  return allNodes.filter((n) => !dockedNodes.has(n));
}

function ensureNodeLayouts(
  roots: QueryNode[],
  attrs: GraphAttrs,
  nodeGraphApi: NodeGraphApi | null,
): void {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  if (!nodeGraphApi) return;

  let lastPlacement: Position | undefined;

=======
  // Assign layouts to new nodes using smart placement
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
  for (const qnode of roots) {
    if (!attrs.nodeLayouts.has(qnode.nodeId)) {
      let placement: Position;

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      if (!lastPlacement) {
        // First node - use API placement
        const canDockTop = shouldShowTopPort(qnode);
        const nodeTemplate: Omit<Node, 'x' | 'y'> = {
          id: qnode.nodeId,
          inputs: getInputLabels(qnode),
          outputs: [{content: 'Output', direction: 'bottom'}],
          canDockBottom: true,
          canDockTop,
          hue: getNodeHue(qnode),
          accentBar: true,
          content: m(NodeBox, {
            node: qnode,
            onAddOperationNode: attrs.onAddOperationNode,
          }),
        };
        placement = nodeGraphApi.findPlacementForNode(nodeTemplate);
      } else {
        // Subsequent nodes - place to the right of previous
        placement = {
          x: lastPlacement.x + LAYOUT_CONSTANTS.BATCH_NODE_HORIZONTAL_OFFSET,
          y: lastPlacement.y,
        };
      }

      lastPlacement = placement;
=======
      // Use NodeGraph API to find optimal non-overlapping placement
      if (nodeGraphApi) {
        const nodeTemplate = createNodeConfig(qnode, attrs);
        placement = nodeGraphApi.findPlacementForNode(nodeTemplate);
      } else {
        // Fallback to default position if API not ready yet
        placement = {
          x: LAYOUT_CONSTANTS.INITIAL_X,
          y: LAYOUT_CONSTANTS.INITIAL_Y,
        };
      }

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      attrs.onNodeLayoutChange(qnode.nodeId, placement);
    }
  }
}

// ========================================
// NODE RENDERING
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
=======
// Assigns a color hue based on the node's type for visual distinction
function getNodeHue(node: QueryNode): number {
  switch (node.type) {
    case NodeType.kTable:
      return 354; // Red (#ffcdd2)
    case NodeType.kSimpleSlices:
      return 122; // Green (#c8e6c9)
    case NodeType.kSqlSource:
      return 199; // Cyan/Light Blue (#b3e5fc)
    case NodeType.kAggregation:
      return 339; // Pink (#f8bbd0)
    case NodeType.kModifyColumns:
      return 261; // Purple (#d1c4e9)
    case NodeType.kAddColumns:
      return 232; // Indigo (#c5cae9)
    case NodeType.kLimitAndOffset:
      return 175; // Teal (#b2dfdb)
    case NodeType.kSort:
      return 54; // Yellow (#fff9c4)
    case NodeType.kIntervalIntersect:
      return 45; // Amber/Orange (#ffecb3)
    case NodeType.kUnion:
      return 187; // Cyan (#b2ebf2)
    default:
      return 65; // Lime (#f0f4c3)
  }
}

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
// Returns the next docked child in the chain (rendered via 'next' property)
function getNextDockedNode(
  qnode: QueryNode,
  attrs: GraphAttrs,
): Omit<Node, 'x' | 'y'> | undefined {
  if (
    qnode.nextNodes.length === 1 &&
    qnode.nextNodes[0] !== undefined &&
    singleNodeOperation(qnode.nextNodes[0].type) &&
    isChildDocked(qnode.nextNodes[0], attrs.nodeLayouts)
  ) {
    const child = qnode.nextNodes[0];
    // Only dock the child if it's part of the primary flow chain
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
    // (i.e., the child's primaryInput points back to this parent)
    if ('primaryInput' in child && child.primaryInput === qnode) {
=======
    // (i.e., the child's prevNode points back to this parent)
    if ('prevNode' in child && child.prevNode === qnode) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      return renderChildNode(child, attrs);
    }
  }
  return undefined;
}

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
function buildNodeContextMenuItems(
  qnode: QueryNode,
  attrs: GraphAttrs,
): m.Children {
  return [
    qnode.type === NodeType.kGroup && attrs.onUngroupNode !== undefined
      ? m(MenuItem, {
          label: 'Ungroup',
          onclick: () => attrs.onUngroupNode?.(qnode),
        })
      : null,
    m(MenuItem, {
      label: 'Duplicate',
      onclick: () => attrs.onDuplicateNode(qnode),
    }),
    m(MenuItem, {
      label: 'Delete',
      onclick: () => attrs.onDeleteNode(qnode),
    }),
  ];
}

=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
function createNodeConfig(
  qnode: QueryNode,
  attrs: GraphAttrs,
): Omit<Node, 'x' | 'y'> {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  const canDockTop = shouldShowTopPort(qnode);
  const addMenuItems = buildAddMenuItems(qnode, attrs.onAddOperationNode);
  const outputs: NodePort[] =
    addMenuItems.length > 0
      ? [
          {
            content: 'Output',
            direction: 'bottom',
            contextMenuItems: addMenuItems,
          },
        ]
      : nodeRegistry.getAllowedChildrenFor(qnode.type).length > 0
        ? [{content: 'Output', direction: 'bottom'}]
        : [];

  const isGroup = qnode.type === NodeType.kGroup;
  return {
    id: qnode.nodeId,
    inputs: getInputLabels(qnode),
    outputs,
    canDockBottom: !isGroup,
    canDockTop,
    hue: isGroup ? undefined : getNodeHue(qnode),
    accentBar: !isGroup,
    className: classNames(isGroup && 'pf-node--group'),
    contextMenuItems: buildNodeContextMenuItems(qnode, attrs),
    content: m(NodeBox, {
      node: qnode,
      onAddOperationNode: attrs.onAddOperationNode,
    }),
    next: getNextDockedNode(qnode, attrs),
    invalid: !qnode.validate(),
=======
  const noTopPort = isSourceNode(qnode) || isMultiSourceNode(qnode);

  return {
    id: qnode.nodeId,
    inputs: getInputLabels(qnode),
    outputs: [
      {
        content: 'Output',
        direction: 'bottom',
        contextMenuItems: buildAddMenuItems(qnode, attrs.onAddOperationNode),
      },
    ],
    canDockBottom: true,
    canDockTop: !noTopPort,
    hue: getNodeHue(qnode),
    accentBar: true,
    content: m(NodeBox, {
      node: qnode,
      onDuplicateNode: attrs.onDuplicateNode,
      onDeleteNode: attrs.onDeleteNode,
      onAddOperationNode: attrs.onAddOperationNode,
      onRemoveFilter: attrs.onRemoveFilter,
    }),
    next: getNextDockedNode(qnode, attrs),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
  };
}

function renderChildNode(
  qnode: QueryNode,
  attrs: GraphAttrs,
): Omit<Node, 'x' | 'y'> {
  return createNodeConfig(qnode, attrs);
}

function renderNodeChain(
  qnode: QueryNode,
  layout: Position,
  attrs: GraphAttrs,
): Node {
  return {
    ...createNodeConfig(qnode, attrs),
    x: layout.x,
    y: layout.y,
  };
}

// Renders only root nodes; docked children are recursively rendered via 'next' property
function renderNodes(
  rootNodes: QueryNode[],
  attrs: GraphAttrs,
  nodeGraphApi: NodeGraphApi | null,
): Node[] {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  const allNodes = getAllNodes(rootNodes, {traverseGroups: false});
=======
  const allNodes = getAllNodes(rootNodes);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
  const roots = getRootNodes(allNodes, attrs.nodeLayouts);

  ensureNodeLayouts(roots, attrs, nodeGraphApi);

  return roots
    .map((qnode) => {
      const layout = attrs.nodeLayouts.get(qnode.nodeId);
      if (!layout) {
        console.warn(`Node ${qnode.nodeId} has no layout, skipping render.`);
        return null;
      }
      return renderNodeChain(qnode, layout, attrs);
    })
    .filter((n): n is Node => n !== null);
}

// ========================================
// CONNECTION HANDLING
// ========================================

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
// Single-input nodes use port 0 for primaryInput, multi-source nodes don't have primaryInput
function hasPrimaryInputPort(node: QueryNode): boolean {
  return singleNodeOperation(node.type);
}

// Convert visual port to secondary input index (undefined means primary input)
function toSecondaryIndex(
  node: QueryNode,
  visualPort: number,
): number | undefined {
  if (hasPrimaryInputPort(node)) {
    return visualPort === 0 ? undefined : visualPort - 1;
  }
  return visualPort;
=======
// For multi-source nodes, finds which input port (0-indexed) the parent is connected to
function calculateInputPort(child: QueryNode, parent: QueryNode): number {
  if (isMultiSourceNode(child)) {
    const index = child.prevNodes.indexOf(parent);
    return index !== -1 ? index : 0;
  }

  // Check if modification node has inputNodes (additional left-side inputs)
  if ('inputNodes' in child && 'prevNode' in child) {
    const modNode = child as ModificationNode;
    if (modNode.inputNodes !== undefined && Array.isArray(modNode.inputNodes)) {
      // Check if parent is the main prevNode (port 0)
      if (modNode.prevNode === parent) {
        return 0;
      }
      // Check if parent is in inputNodes array (ports 1+)
      const index = modNode.inputNodes.indexOf(parent);
      if (index !== -1) {
        return index + 1; // Port 1 = inputNodes[0], Port 2 = inputNodes[1], etc.
      }
    }
  }

  return 0;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

// Builds visual connections between nodes (skips docked chains since they use 'next' property)
function buildConnections(
  rootNodes: QueryNode[],
  nodeLayouts: LayoutMap,
): Connection[] {
  const connections: Connection[] = [];
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  const allNodes = getAllNodes(rootNodes, {traverseGroups: false});
=======
  const allNodes = getAllNodes(rootNodes);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts

  for (const qnode of allNodes) {
    for (const child of qnode.nextNodes) {
      if (child === undefined) continue;

      // Skip docked children - they're rendered via 'next' property, not as connections
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      // But only skip if it's part of the primary flow chain (child's primaryInput points back)
=======
      // But only skip if it's part of the primary flow chain (child's prevNode points back)
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      if (
        qnode.nextNodes.length === 1 &&
        singleNodeOperation(child.type) &&
        isChildDocked(child, nodeLayouts) &&
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
        'primaryInput' in child &&
        child.primaryInput === qnode
=======
        'prevNode' in child &&
        child.prevNode === qnode
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      ) {
        continue;
      }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      // Check if this parent is connected to multiple ports on the child
      // (e.g., Union node with same parent connected to Input 0 and Input 1)
      const connectedPorts: number[] = [];

      // Check primary input
      if (child.primaryInput === qnode) {
        connectedPorts.push(0);
      }

      // Check secondary inputs
      if (child.secondaryInputs) {
        const offset = hasPrimaryInputPort(child) ? 1 : 0;
        for (const [index, node] of child.secondaryInputs.connections) {
          if (node === qnode) {
            connectedPorts.push(index + offset);
          }
        }
      }

      // Create a separate connection for each port
      for (const toPort of connectedPorts) {
        connections.push({
          fromNode: qnode.nodeId,
          fromPort: 0,
          toNode: child.nodeId,
          toPort: toPort,
        });
      }
=======
      connections.push({
        fromNode: qnode.nodeId,
        fromPort: 0,
        toNode: child.nodeId,
        toPort: calculateInputPort(child, qnode),
      });
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
    }
  }

  return connections;
}

// Handles creating a new connection between nodes (updates both forward and backward links)
function handleConnect(conn: Connection, rootNodes: QueryNode[]): void {
  const fromNode = findQueryNode(conn.fromNode, rootNodes);
  const toNode = findQueryNode(conn.toNode, rootNodes);

  if (!fromNode || !toNode) {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
    console.warn(
      `Cannot create connection: node not found (from: ${conn.fromNode}, to: ${conn.toNode})`,
    );
    return;
  }

  if (!nodeRegistry.isConnectionAllowed(fromNode.type, toNode.type)) {
    return;
  }

  if (wouldCreateCycle(fromNode, toNode)) {
    console.warn(
      `Cannot create connection: would create a cycle (from: ${conn.fromNode}, to: ${conn.toNode})`,
    );
    return;
  }

  const secondaryIndex = toSecondaryIndex(toNode, conn.toPort);
  addConnection(fromNode, toNode, secondaryIndex);
=======
    return;
  }

  // For multisource nodes, all ports are left-side and 0-indexed (port 0 = prevNodes[0])
  // For modification nodes, port 0 is top (prevNode), ports 1+ are left-side (inputNodes[0], inputNodes[1], ...)
  let portIndex: number | undefined;
  if (isMultiSourceNode(toNode)) {
    portIndex = conn.toPort;
  } else {
    portIndex = conn.toPort > 0 ? conn.toPort - 1 : undefined;
  }
  addConnection(fromNode, toNode, portIndex);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts

  m.redraw();
}

// Handles removing a connection (cleans up both forward and backward links)
function handleConnectionRemove(
  conn: Connection,
  rootNodes: QueryNode[],
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  onConnectionRemove: (
    fromNode: QueryNode,
    toNode: QueryNode,
    isSecondaryInput: boolean,
  ) => void,
=======
  onConnectionRemove: (fromNode: QueryNode, toNode: QueryNode) => void,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
): void {
  const fromNode = findQueryNode(conn.fromNode, rootNodes);
  const toNode = findQueryNode(conn.toNode, rootNodes);

  if (!fromNode || !toNode) {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
    console.warn(
      `Cannot remove connection: node not found (from: ${conn.fromNode}, to: ${conn.toNode})`,
    );
    return;
  }

  // Check BEFORE removal if this is a secondary input connection
  let isSecondaryInput = false;
  if (toNode.secondaryInputs?.connections) {
    for (const node of toNode.secondaryInputs.connections.values()) {
      if (node === fromNode) {
        isSecondaryInput = true;
        break;
      }
    }
  }

  // Convert visual port to secondary index for removal
  const secondaryIndex = toSecondaryIndex(toNode, conn.toPort);

  // Use the helper function to cleanly remove the connection
  removeConnection(fromNode, toNode, secondaryIndex);

  // Call the parent callback for any additional cleanup (e.g., state management)
  onConnectionRemove(fromNode, toNode, isSecondaryInput);
}

// ========================================
// TEXT LABEL SERIALIZATION
// ========================================

/**
 * Serializable representation of a text label.
 * This interface contains only plain data types that can be safely
 * serialized to/from JSON, unlike the Label interface which includes
 * Mithril vnodes in the content field.
 */
export interface TextLabelData {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly text: string;
=======
    return;
  }

  // Use the helper function to cleanly remove the connection
  removeConnection(fromNode, toNode);

  // Call the parent callback for any additional cleanup (e.g., state management)
  onConnectionRemove(fromNode, toNode);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
}

// ========================================
// GRAPH COMPONENT
// ========================================

export class Graph implements m.ClassComponent<GraphAttrs> {
  private nodeGraphApi: NodeGraphApi | null = null;
  private hasPerformedInitialLayout: boolean = false;
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
  private hasPerformedInitialRecenter: boolean = false;
  private recenterRequired: boolean = false;
  // True while a recenter is pending. The graph is hidden (visibility:hidden)
  // to prevent a flash of un-centered content.
  private pendingRecenter: boolean = false;
  // DOM reference for checking visibility (Gate may hide us with display:none).
  private graphElement?: HTMLElement;
  private labels: Label[] = [];
  private labelTexts: Map<string, string> = new Map();
  private editingLabels: Set<string> = new Set();
  private previousLoadGeneration?: number;

  oninit(vnode: m.Vnode<GraphAttrs>) {
    // Load initial labels from attrs
    this.deserializeLabels(vnode.attrs.labels as TextLabelData[]);
  }

  oncreate(vnode: m.VnodeDOM<GraphAttrs>) {
    this.graphElement = vnode.dom as HTMLElement;
    // Focus the graph container so WSAD keyboard controls work immediately
    this.graphElement.focus();
  }

  onbeforeupdate(vnode: m.Vnode<GraphAttrs>, old: m.VnodeDOM<GraphAttrs>) {
    // Only update labels if the reference changed (indicating external state update)
    if (vnode.attrs.labels !== old.attrs.labels) {
      this.deserializeLabels(vnode.attrs.labels as TextLabelData[]);
    }
    return true;
  }

  /**
   * Notifies parent component that labels have changed.
   * Called after any label modification (add, move, resize, delete).
   */
  private notifyLabelsChanged(attrs: GraphAttrs) {
    if (attrs.onLabelsChange) {
      attrs.onLabelsChange(this.serializeLabels());
    }
  }

  private addLabel(attrs: GraphAttrs) {
    const id = uuidv4();
    // Offset from the last label if one exists, otherwise use default position
    const lastLabel = this.labels[this.labels.length - 1];
    const x = lastLabel !== undefined ? lastLabel.x + 30 : 100;
    const y = lastLabel !== undefined ? lastLabel.y + 30 : 100;
    this.labels.push({
      id,
      x,
      y,
      width: 200,
      content: undefined, // Will be set in view
    });
    this.labelTexts.set(id, 'New label');
    this.notifyLabelsChanged(attrs);
    m.redraw();
  }

  /**
   * Serializes the current text labels to a JSON-compatible format.
   * Returns an array of TextLabelData that can be stored or transmitted.
   */
  serializeLabels(): TextLabelData[] {
    return this.labels.map((label) => ({
      id: label.id,
      x: label.x,
      y: label.y,
      width: label.width,
      text: this.labelTexts.get(label.id) ?? '',
    }));
  }

  /**
   * Deserializes text labels from a JSON-compatible format.
   * Replaces the current labels with the deserialized data.
   */
  deserializeLabels(data: TextLabelData[]): void {
    this.labels = data.map((labelData) => ({
      id: labelData.id,
      x: labelData.x,
      y: labelData.y,
      width: labelData.width,
      content: undefined, // Will be set in view
    }));

    this.labelTexts.clear();
    for (const labelData of data) {
      this.labelTexts.set(labelData.id, labelData.text);
    }

    this.editingLabels.clear();
    m.redraw();
  }

  private renderControls(attrs: GraphAttrs) {
    const cb = attrs.onAddSourceNode;
    const sections: {title: string; items: m.Children[]}[] = [
      {title: 'Sources', items: buildMenuItems('source', cb)},
      {title: 'Operations', items: buildMenuItems('multisource', cb)},
      {title: 'Modifications', items: buildMenuItems('modification', cb)},
      {title: 'Export', items: buildMenuItems('export', cb)},
    ].filter((s) => s.items.length > 0);

    const addNodeMenuItems: m.Children[] = [];
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) {
        addNodeMenuItems.push(m(MenuDivider));
      }
      addNodeMenuItems.push(m(MenuTitle, {label: sections[i].title}));
      addNodeMenuItems.push(...sections[i].items);
    }
    addNodeMenuItems.push(m(MenuDivider));
    addNodeMenuItems.push(
      m(MenuItem, {
        label: 'Label',
        onclick: () => this.addLabel(attrs),
      }),
    );

    const moreMenuItems = [
      m(MenuItem, {
        label: 'Export to JSON',
=======

  private renderEmptyNodeGraph(attrs: GraphAttrs) {
    return m(EmptyGraph, {
      onAddSourceNode: attrs.onAddSourceNode,
      onImport: attrs.onImport,
      onImportWithStatement: attrs.onImportWithStatement,
      devMode: attrs.devMode,
      onDevModeChange: attrs.onDevModeChange,
    });
  }

  private renderControls(attrs: GraphAttrs) {
    const sourceMenuItems = buildMenuItems(
      'source',
      attrs.devMode,
      attrs.onAddSourceNode,
    );

    const operationMenuItems = buildMenuItems(
      'multisource',
      attrs.devMode,
      attrs.onAddSourceNode,
    );

    const addNodeMenuItems = [
      m(MenuTitle, {label: 'Sources'}),
      ...sourceMenuItems,
      m(MenuDivider),
      m(MenuTitle, {label: 'Operations'}),
      ...operationMenuItems,
    ];

    const moreMenuItems = [
      m(MenuItem, {
        label: 'Export',
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
        icon: Icons.Download,
        onclick: attrs.onExport,
      }),
      m(MenuItem, {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
        label: 'Import from JSON',
        icon: 'file_upload',
        onclick: attrs.onImport,
      }),
      m(MenuItem, {
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
        label: 'Clear All Nodes',
        icon: Icons.Delete,
        intent: Intent.Danger,
        onclick: attrs.onClearAllNodes,
      }),
    ];

    return m(
      '.pf-exp-node-graph__controls',
      m(
        PopupMenu,
        {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
          trigger: RoundActionButton({
            icon: Icons.Add,
            title: 'Add Node',
            onclick: () => {},
=======
          trigger: m(Button, {
            label: 'Add Node',
            icon: Icons.Add,
            variant: ButtonVariant.Filled,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
          }),
        },
        addNodeMenuItems,
      ),
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      attrs.selectedNodes.size > 1 &&
        attrs.onCreateGroup !== undefined &&
        m(Button, {
          label: 'Group',
          icon: 'group_work',
          variant: ButtonVariant.Filled,
          intent: Intent.Primary,
          rounded: true,
          title: `Group ${attrs.selectedNodes.size} selected nodes`,
          onclick: () => attrs.onCreateGroup?.(attrs.selectedNodes),
        }),
      m(Button, {
        icon: 'center_focus_strong',
        variant: ButtonVariant.Minimal,
        title: 'Center Graph',
        onclick: () => {
          if (this.nodeGraphApi) {
            this.nodeGraphApi.recenter();
          }
        },
      }),
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      m(
        PopupMenu,
        {
          trigger: m(Button, {
            icon: Icons.ContextMenuAlt,
            variant: ButtonVariant.Minimal,
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
=======
            style: {marginLeft: '8px'},
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
          }),
        },
        moreMenuItems,
      ),
    );
  }

  view({attrs}: m.CVnode<GraphAttrs>) {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
    const {rootNodes} = attrs;
=======
    const {rootNodes, selectedNode} = attrs;
    const allNodes = getAllNodes(rootNodes);

    if (allNodes.length === 0) {
      return m(
        '.pf-exp-node-graph',
        {
          tabindex: 0,
          onclick: (e: MouseEvent) => {
            if (e.target === e.currentTarget) {
              attrs.onDeselect();
            }
          },
        },
        this.renderEmptyNodeGraph(attrs),
      );
    }
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts

    const nodes = renderNodes(rootNodes, attrs, this.nodeGraphApi);
    const connections = buildConnections(rootNodes, attrs.nodeLayouts);

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
    // Detect if loadGeneration has changed (indicates a load operation occurred)
    const loadGenerationChanged =
      attrs.loadGeneration !== undefined &&
      attrs.loadGeneration !== this.previousLoadGeneration;

    if (loadGenerationChanged) {
      // Always sync previousLoadGeneration to prevent repeated detection
      // This is critical - if we only update when nodes.length > 0, then when
      // nodeGraphApi is initially null (causing empty nodes), we'd miss the update.
      // Later panning would then trigger a late recenter causing infinite redraws.
      this.previousLoadGeneration = attrs.loadGeneration;

      if (nodes.length > 0) {
        // Content was loaded - defer recenter to onReady callback
        // We can't recenter immediately because NodeGraph hasn't rendered the new nodes yet
        this.recenterRequired = true;
      }
    }

=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
    // Perform auto-layout if nodeLayouts is empty and API is available
    if (
      !this.hasPerformedInitialLayout &&
      this.nodeGraphApi &&
      attrs.nodeLayouts.size === 0 &&
      nodes.length > 0
    ) {
      this.hasPerformedInitialLayout = true;
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
      this.hasPerformedInitialRecenter = true;
      // Call autoLayout to arrange nodes hierarchically
      // autoLayout will call onNodeMove for each node it repositions
      this.nodeGraphApi.autoLayout();
      // Recenter will happen in the onReady callback after the next render
      this.recenterRequired = true;
    } else if (
      !this.hasPerformedInitialRecenter &&
      this.nodeGraphApi &&
      nodes.length > 0
    ) {
      // Recenter on first render even if auto-layout didn't run
      // (e.g., when loading from localStorage with existing positions)
      this.hasPerformedInitialRecenter = true;
      this.recenterRequired = true;
    }

    // Hide graph content while a recenter is pending to prevent a flash of
    // un-centered nodes before autofit adjusts the viewport.
    if (this.recenterRequired) {
      this.pendingRecenter = true;
=======
      // Defer autoLayout to next tick to ensure DOM nodes are fully rendered
      setTimeout(() => {
        if (this.nodeGraphApi) {
          // Call autoLayout to arrange nodes hierarchically
          this.nodeGraphApi.autoLayout();
          // After autoLayout, the nodes array will have updated x,y coordinates
          // Update the nodeLayouts map with these new positions
          for (const node of nodes) {
            attrs.onNodeLayoutChange(node.id, {x: node.x, y: node.y});
          }
          // Trigger a redraw to reflect the new positions
          m.redraw();
        }
      }, 0);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
    }

    return m(
      '.pf-exp-node-graph',
      {
        tabindex: 0,
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
        onkeydown: (e: KeyboardEvent) => {
          // Skip if user is typing in an input or textarea
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            return;
          }

          // Shift+W/S for zoom in/out (matches Timeline behavior)
          // Use KeyboardEvent.code for physical key position (layout-independent)
          const ZOOM_STEP = 0.1;
          if (e.shiftKey && this.nodeGraphApi !== null) {
            if (e.code === 'KeyW') {
              this.nodeGraphApi.zoomBy(ZOOM_STEP);
              e.preventDefault();
              return;
            }
            if (e.code === 'KeyS') {
              this.nodeGraphApi.zoomBy(-ZOOM_STEP);
              e.preventDefault();
              return;
            }
          }

          // WASD keyboard panning (only without Shift modifier)
          const PAN_STEP = 50;
          const panMap: Record<string, [number, number]> = {
            KeyW: [0, PAN_STEP],
            KeyA: [PAN_STEP, 0],
            KeyS: [0, -PAN_STEP],
            KeyD: [-PAN_STEP, 0],
          };
          const pan = panMap[e.code];
          if (pan !== undefined && this.nodeGraphApi !== null) {
            this.nodeGraphApi.panBy(pan[0], pan[1]);
            e.preventDefault();
          }
        },
=======
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
      },
      [
        m(NodeGraph, {
          nodes,
          connections,
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
          selectedNodeIds: attrs.selectedNodes,
          hideControls: true,
          fillHeight: true,
          // Hide the graph while a recenter is pending to avoid a flash of
          // un-centered content.
          style: this.pendingRecenter ? {visibility: 'hidden'} : undefined,
          onReady: (api: NodeGraphApi) => {
            this.nodeGraphApi = api;

            if (this.recenterRequired) {
              // Check that our container is actually visible (non-zero size).
              // When a tab is hidden via Gate (display:none) the canvas has
              // 0×0 dimensions and autofit would produce bogus zoom/pan.
              // Leave the flags in place so recenter fires the next time
              // the tab becomes visible and onReady is called again.
              const rect = this.graphElement?.getBoundingClientRect();
              if (rect === undefined || rect.width === 0 || rect.height === 0) {
                return; // Defer until canvas is visible
              }

              this.recenterRequired = false;
              api.recenter();
              if (this.pendingRecenter) {
                this.pendingRecenter = false;
                m.redraw();
              }
            }
          },
          multiselect: true,
=======
          selectedNodeIds: new Set(
            selectedNode?.nodeId ? [selectedNode.nodeId] : [],
          ),
          hideControls: true,
          onReady: (api: NodeGraphApi) => {
            this.nodeGraphApi = api;
          },
          multiselect: false,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
          onNodeSelect: (nodeId: string) => {
            const qnode = findQueryNode(nodeId, rootNodes);
            if (qnode) {
              attrs.onNodeSelected(qnode);
            }
          },
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
          onNodeAddToSelection: (nodeId: string) => {
            const qnode = findQueryNode(nodeId, rootNodes);
            if (qnode) {
              attrs.onNodeAddToSelection(qnode);
            }
          },
          onNodeRemoveFromSelection: (nodeId: string) => {
            attrs.onNodeRemoveFromSelection(nodeId);
          },
          onSelectionClear: () => {
            attrs.onDeselect();
          },
          onNodeMove: (nodeId: string, x: number, y: number) => {
=======
          onSelectionClear: () => {
            attrs.onDeselect();
          },
          onNodeDrag: (nodeId: string, x: number, y: number) => {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
            attrs.onNodeLayoutChange(nodeId, {x, y});
          },
          onConnect: (conn: Connection) => {
            handleConnect(conn, rootNodes);
          },
          onConnectionRemove: (index: number) => {
            handleConnectionRemove(
              connections[index],
              rootNodes,
              attrs.onConnectionRemove,
            );
          },
          onNodeRemove: (nodeId: string) => {
            const qnode = findQueryNode(nodeId, rootNodes);
            if (qnode) {
              attrs.onDeleteNode(qnode);
            }
          },
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/graph/graph.ts
          onUndock: (
            _parentId: string,
            nodeId: string,
            x: number,
            y: number,
          ) => {
            // Store the new position in the layout map so node becomes independent
            attrs.onNodeLayoutChange(nodeId, {x, y});
            m.redraw();
          },
          onDock: (targetId: string, childNode: Omit<Node, 'x' | 'y'>) => {
            const parentNode = findQueryNode(targetId, rootNodes);
            const childQueryNode = findQueryNode(childNode.id, rootNodes);

            if (!parentNode || !childQueryNode) {
              console.warn('Cannot dock: parent or child node not found');
              m.redraw();
              return;
            }

            const existingChildren = parentNode.nextNodes;

            // Only allow docking if:
            // 1. Parent has no children, OR
            // 2. Parent has exactly one child and it's the child being docked (re-docking)
            const canDock =
              existingChildren.length === 0 ||
              (existingChildren.length === 1 &&
                existingChildren[0] === childQueryNode);

            if (!canDock) {
              console.warn('Cannot dock: parent already has children');
              m.redraw();
              return;
            }

            // Check if child can be docked (single-node operation)
            if (!singleNodeOperation(childQueryNode.type)) {
              console.warn(
                'Cannot dock: only single-node operations can be docked',
              );
              m.redraw();
              return;
            }

            // Check if the child node type is allowed as a child of the parent
            if (
              !nodeRegistry.isConnectionAllowed(
                parentNode.type,
                childQueryNode.type,
              )
            ) {
              m.redraw();
              return;
            }

            // Dock the child
            attrs.nodeLayouts.delete(childNode.id);
            addConnection(parentNode, childQueryNode);
            m.redraw();
          },
          contextMenuOnHover: true,
          labels: createEditableTextLabels(
            this.labels,
            this.labelTexts,
            this.editingLabels,
            () => this.notifyLabelsChanged(attrs),
          ),
          onLabelMove: (labelId: string, x: number, y: number) => {
            const label = this.labels.find((l) => l.id === labelId);
            if (label) {
              label.x = x;
              label.y = y;
              this.notifyLabelsChanged(attrs);
            }
          },
          onLabelResize: (labelId: string, width: number) => {
            const label = this.labels.find((l) => l.id === labelId);
            if (label) {
              label.width = width;
              this.notifyLabelsChanged(attrs);
            }
          },
          onLabelRemove: (labelId: string) => {
            const labelIndex = this.labels.findIndex((l) => l.id === labelId);
            if (labelIndex !== -1) {
              this.labels.splice(labelIndex, 1);
            }
            this.labelTexts.delete(labelId);
            this.notifyLabelsChanged(attrs);
            m.redraw();
          },
        } satisfies NodeGraphAttrs),
=======
          onUndock: () => {
            // When undocking, NodeGraph widget assigns x,y via onNodeDrag callback
            // The node relationships (nextNodes/prevNode) remain unchanged
            m.redraw();
          },
          onDock: (_targetId: string, childNode: Omit<Node, 'x' | 'y'>) => {
            // Remove coordinates so node becomes "docked" (renders via parent's 'next')
            attrs.nodeLayouts.delete(childNode.id);
            m.redraw();
          },
        }),
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/graph/graph.ts
        this.renderControls(attrs),
      ],
    );
  }
}
