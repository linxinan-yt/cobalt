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
import {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
  type QueryNode,
  nextNodeId,
  NodeType,
  type SecondaryInputSpec,
  type NodeContext,
} from '../../query_node';
import {notifyNextNodes} from '../graph_utils';
import type protos from '../../../../protos';
import {type ColumnInfo, newColumnInfo} from '../column_info';
import {Callout} from '../../../../widgets/callout';
import {NodeIssues} from '../node_issues';
import {
  StructuredQueryBuilder,
  type ColumnSpec,
} from '../structured_query_builder';
import {loadNodeDoc} from '../node_doc_loader';
import type {NodeModifyAttrs, NodeDetailsAttrs} from '../../node_types';
import {ResultsPanelEmptyState} from '../widgets';
import {ColumnSelector} from '../column_selector';
import {
  NodeDetailsMessage,
  NodeTitle,
  ColumnName,
} from '../node_styling_widgets';

// Serializable node configuration.
export interface UnionNodeAttrs {
  selectedColumns: ColumnInfo[];
}

export class UnionNode implements QueryNode {
  readonly nodeId: string;
  readonly type = NodeType.kUnion;
  secondaryInputs: SecondaryInputSpec;
  nextNodes: QueryNode[];
  readonly attrs: UnionNodeAttrs;
  readonly context: NodeContext;

  get inputNodesList(): QueryNode[] {
    return [...this.secondaryInputs.connections.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, node]) => node);
  }

  get finalCols(): ColumnInfo[] {
    return this.attrs.selectedColumns.filter((col) => col.checked);
  }

  constructor(
    attrs: UnionNodeAttrs & {inputNodes?: QueryNode[]},
    context: NodeContext,
  ) {
    this.nodeId = nextNodeId();
    const {inputNodes, ...rest} = attrs;
    this.attrs = rest as UnionNodeAttrs;
    this.context = context;
    this.secondaryInputs = {
      connections: new Map(),
      min: 2,
      max: 'unbounded',
      portNames: (portIndex: number) => `Input ${portIndex}`,
    };
    // Initialize connections from inputNodes
    if (inputNodes) {
      for (let i = 0; i < inputNodes.length; i++) {
        this.secondaryInputs.connections.set(i, inputNodes[i]);
      }
    }
    this.nextNodes = [];

    const userOnChange = this.context.onchange;
    this.context.onchange = () => {
=======
  QueryNode,
  QueryNodeState,
  nextNodeId,
  NodeType,
  MultiSourceNode,
  notifyNextNodes,
} from '../../query_node';
import protos from '../../../../protos';
import {ColumnInfo, newColumnInfoList} from '../column_info';
import {Callout} from '../../../../widgets/callout';
import {NodeIssues} from '../node_issues';
import {UIFilter} from '../operations/filter';
import {Card, CardStack} from '../../../../widgets/card';
import {Checkbox} from '../../../../widgets/checkbox';

export interface UnionSerializedState {
  unionNodes: string[];
  selectedColumns: ColumnInfo[];
  filters?: UIFilter[];
  comment?: string;
}

export interface UnionNodeState extends QueryNodeState {
  readonly prevNodes: QueryNode[];
  selectedColumns: ColumnInfo[];
}

export class UnionNode implements MultiSourceNode {
  readonly nodeId: string;
  readonly type = NodeType.kUnion;
  readonly prevNodes: QueryNode[];
  nextNodes: QueryNode[];
  readonly state: UnionNodeState;
  comment?: string;
  filters?: UIFilter[];

  get finalCols(): ColumnInfo[] {
    return this.state.selectedColumns.filter((col) => col.checked);
  }

  constructor(state: UnionNodeState) {
    this.nodeId = nextNodeId();
    this.state = {
      ...state,
      autoExecute: state.autoExecute ?? false,
    };
    this.prevNodes = state.prevNodes;
    this.nextNodes = [];

    const userOnChange = this.state.onchange;
    this.state.onchange = () => {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
      notifyNextNodes(this);
      userOnChange?.();
    };
  }

  onPrevNodesUpdated() {
    const newCommonColumns = this.getCommonColumns();

    // Preserve checked status for columns that still exist.
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    for (const oldCol of this.attrs.selectedColumns ?? []) {
      const newCol = newCommonColumns.find((c) => c.name === oldCol.name);
=======
    for (const oldCol of this.state.selectedColumns ?? []) {
      const newCol = newCommonColumns.find(
        (c) => c.column.name === oldCol.column.name,
      );
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
      if (newCol) {
        newCol.checked = oldCol.checked;
      }
    }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    this.attrs.selectedColumns = newCommonColumns;
  }

  private getCommonColumns(): ColumnInfo[] {
    if (this.inputNodesList.length === 0) {
      return [];
    }
    // Filter out undefined entries before processing
    const validPrevNodes = this.inputNodesList.filter(
=======
    this.state.selectedColumns = newCommonColumns;
  }

  private getCommonColumns(): ColumnInfo[] {
    if (this.prevNodes.length === 0) {
      return [];
    }
    // Filter out undefined entries before processing
    const validPrevNodes = this.prevNodes.filter(
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
      (node): node is QueryNode => node !== undefined,
    );
    if (validPrevNodes.length === 0) {
      return [];
    }
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    let commonCols = validPrevNodes[0].finalCols.map((col) =>
      newColumnInfo(col, true),
    );
=======
    let commonCols = newColumnInfoList(validPrevNodes[0].finalCols, true);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
    for (let i = 1; i < validPrevNodes.length; i++) {
      const currentNodeCols = validPrevNodes[i].finalCols;
      commonCols = commonCols.filter((commonCol) =>
        currentNodeCols.some(
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
          (currentNodeCol) => currentNodeCol.name === commonCol.name,
=======
          (currentNodeCol) =>
            currentNodeCol.column.name === commonCol.column.name,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
        ),
      );
    }
    return commonCols;
  }

  validate(): boolean {
    // Clear any previous errors at the start of validation
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    if (this.context.issues) {
      this.context.issues.clear();
    }

    // Check for undefined entries (disconnected inputs)
    const validPrevNodes = this.inputNodesList.filter(
      (node): node is QueryNode => node !== undefined,
    );

    if (validPrevNodes.length < this.inputNodesList.length) {
=======
    if (this.state.issues) {
      this.state.issues.clear();
    }

    // Check for undefined entries (disconnected inputs)
    const validPrevNodes = this.prevNodes.filter(
      (node): node is QueryNode => node !== undefined,
    );

    if (validPrevNodes.length < this.prevNodes.length) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
      this.setValidationError(
        'Union node has disconnected inputs. Please connect all inputs or remove this node.',
      );
      return false;
    }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    if (this.inputNodesList.length < 2) {
=======
    if (this.prevNodes.length < 2) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
      this.setValidationError('Union node requires at least two sources.');
      return false;
    }

    if (this.getCommonColumns().length === 0) {
      this.setValidationError(
        'Union node requires common columns between sources.',
      );
      return false;
    }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    for (const inputNode of this.inputNodesList) {
      // Skip undefined entries (already handled above)
      if (inputNode === undefined) continue;

      if (!inputNode.validate()) {
        this.setValidationError(
          inputNode.context.issues?.queryError?.message ??
            `Input node '${inputNode.getTitle()}' is invalid`,
=======
    for (const prevNode of this.prevNodes) {
      // Skip undefined entries (already handled above)
      if (prevNode === undefined) continue;

      if (!prevNode.validate()) {
        this.setValidationError(
          prevNode.state.issues?.queryError?.message ??
            `Previous node '${prevNode.getTitle()}' is invalid`,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
        );
        return false;
      }
    }

    return true;
  }

  private setValidationError(message: string): void {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
    if (!this.context.issues) {
      this.context.issues = new NodeIssues();
    }
    this.context.issues.queryError = new Error(message);
=======
    if (!this.state.issues) {
      this.state.issues = new NodeIssues();
    }
    this.state.issues.queryError = new Error(message);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
  }

  getTitle(): string {
    return 'Union';
  }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/union_node.ts
  nodeInfo(): m.Children {
    return loadNodeDoc('union');
  }

  nodeDetails(): NodeDetailsAttrs {
    const selectedCols = this.attrs.selectedColumns.filter((c) => c.checked);
    let message: m.Child;

    if (selectedCols.length === 0) {
      message = NodeDetailsMessage('No common columns selected');
    } else if (selectedCols.length > 3) {
      // Show the count of common columns
      message = m('div', `${selectedCols.length} common columns`);
    } else {
      // Show individual column names
      const selectedItems = selectedCols.map((c) =>
        m('div', ColumnName(c.name)),
      );
      message = m('div', ...selectedItems);
    }

    const content = [NodeTitle(this.getTitle()), message];
    return {content};
  }

  nodeSpecificModify(): NodeModifyAttrs {
    this.validate();
    const error = this.context.issues?.queryError;

    const selectedCount = this.attrs.selectedColumns.filter(
      (col) => col.checked,
    ).length;
    const totalCount = this.attrs.selectedColumns.length;

    const sections: NodeModifyAttrs['sections'] = [];

    // Add error if present
    if (error) {
      sections.push({
        content: m(Callout, {icon: 'error'}, error.message),
      });
    }

    // Selected columns section
    if (totalCount === 0) {
      // Show empty state when no common columns
      sections.push({
        content: m(ResultsPanelEmptyState, {
          icon: 'table',
          title: 'No common columns between sources',
          variant: 'warning',
        }),
      });
    } else {
      sections.push({
        title: `Select Common Columns (${selectedCount} / ${totalCount} selected)`,
        content: m(ColumnSelector, {
          columns: this.attrs.selectedColumns,
          onColumnsChange: (columns) => {
            this.attrs.selectedColumns = columns;
            this.context.onchange?.();
          },
          helpText: 'Select which common columns to include in the union',
          draggable: true,
        }),
      });
    }

    return {
      info: 'Stacks rows from multiple inputs vertically (UNION ALL). All inputs must have compatible column schemas. Useful for combining similar data from different sources.',
      sections,
    };
  }

  clone(): QueryNode {
    return new UnionNode(
      {selectedColumns: this.attrs.selectedColumns.map((c) => ({...c}))},
      this.context,
    );
  }

  getStructuredQuery(): protos.PerfettoSqlStructuredQuery | undefined {
    if (this.inputNodesList.length < 2) return undefined;

    // Check for undefined entries
    for (const inputNode of this.inputNodesList) {
      if (inputNode === undefined) return undefined;
    }

    // Get the list of checked common columns
    const selectedColumns = this.attrs.selectedColumns.filter((c) => c.checked);
    if (selectedColumns.length === 0) return undefined;

    // Build column specifications for the SELECT
    const columnSpecs: ColumnSpec[] = selectedColumns.map((col) => ({
      columnNameOrExpression: col.name,
    }));

    // Create wrapper queries for each input that selects only the common columns
    // Pass the query protos directly to withUnion (not nodes)
    const wrappedQueries: protos.PerfettoSqlStructuredQuery[] = [];
    for (const inputNode of this.inputNodesList) {
      const selectQuery = StructuredQueryBuilder.withSelectColumns(
        inputNode,
        columnSpecs,
        undefined,
      );
      if (!selectQuery) return undefined;
      wrappedQueries.push(selectQuery);
    }

    // Create the union from the wrapped queries
    return StructuredQueryBuilder.withUnion(wrappedQueries, true, this.nodeId);
=======
  nodeDetails(): m.Child {
    const cards: m.Child[] = [];
    const selectedCols = this.state.selectedColumns.filter((c) => c.checked);
    if (selectedCols.length > 0) {
      // If more than 3 columns, just show the count
      if (selectedCols.length > 3) {
        cards.push(
          m(
            Card,
            {className: 'pf-node-details-card'},
            m('div', `${selectedCols.length} common columns`),
          ),
        );
      } else {
        // Show individual column names for 3 or fewer
        const selectedItems = selectedCols.map((c) => {
          return m('div', c.column.name);
        });
        cards.push(
          m(Card, {className: 'pf-node-details-card'}, ...selectedItems),
        );
      }
    }

    if (cards.length === 0) {
      return m('.pf-node-details-message', 'No common columns');
    }

    return m(CardStack, cards);
  }

  nodeSpecificModify(): m.Child {
    this.validate();
    const error = this.state.issues?.queryError;

    return m(
      '.pf-exp-query-operations',
      error && m(Callout, {icon: 'error'}, error.message),
      m(
        CardStack,
        m(
          Card,
          m('h2.pf-columns-box-title', 'Selected Columns'),
          m(
            'div.pf-column-list',
            this.state.selectedColumns.map((col, index) =>
              this.renderSelectedColumn(col, index),
            ),
          ),
        ),
      ),
    );
  }

  private renderSelectedColumn(col: ColumnInfo, index: number): m.Child {
    return m(
      '.pf-column',
      m(Checkbox, {
        checked: col.checked,
        label: col.column.name,
        onchange: (e) => {
          const newSelectedColumns = [...this.state.selectedColumns];
          newSelectedColumns[index] = {
            ...newSelectedColumns[index],
            checked: (e.target as HTMLInputElement).checked,
          };
          this.state.selectedColumns = newSelectedColumns;
          this.state.onchange?.();
        },
      }),
    );
  }

  clone(): QueryNode {
    const stateCopy: UnionNodeState = {
      prevNodes: [...this.state.prevNodes],
      selectedColumns: this.state.selectedColumns.map((c) => ({...c})),
    };
    const clone = new UnionNode(stateCopy);
    clone.filters = this.filters ? [...this.filters] : undefined;
    clone.comment = this.comment;
    return clone;
  }

  getStructuredQuery(): protos.PerfettoSqlStructuredQuery | undefined {
    if (this.prevNodes.length < 2) return undefined;

    const queries: protos.IPerfettoSqlStructuredQuery[] = [];
    for (const prevNode of this.prevNodes) {
      if (prevNode === undefined) return undefined;
      const query = prevNode.getStructuredQuery();
      if (!query) return undefined;
      queries.push(query);
    }

    return protos.PerfettoSqlStructuredQuery.create({
      id: this.nodeId,
      experimentalUnion:
        protos.PerfettoSqlStructuredQuery.ExperimentalUnion.create({
          queries,
          useUnionAll: true,
        }),
    });
  }

  serializeState(): UnionSerializedState {
    return {
      unionNodes: this.prevNodes.slice(1).map((n) => n.nodeId),
      selectedColumns: this.state.selectedColumns,
      filters: this.filters,
      comment: this.comment,
    };
  }

  static deserializeState(
    nodes: Map<string, QueryNode>,
    state: UnionSerializedState,
    baseNode: QueryNode,
  ): {prevNodes: QueryNode[]; selectedColumns: ColumnInfo[]} {
    const unionNodes = state.unionNodes
      .map((id) => nodes.get(id))
      .filter((node): node is QueryNode => node !== undefined);
    return {
      prevNodes: [baseNode, ...unionNodes],
      selectedColumns: state.selectedColumns,
    };
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/union_node.ts
  }
}
