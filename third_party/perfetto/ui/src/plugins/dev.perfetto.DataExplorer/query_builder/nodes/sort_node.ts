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
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/sort_node.ts
  type QueryNode,
  type NodeContext,
  nextNodeId,
  NodeType,
} from '../../query_node';
import type {ColumnInfo} from '../column_info';
import type protos from '../../../../protos';
import {Button} from '../../../../widgets/button';
import {
  StructuredQueryBuilder,
  type SortCriterion as BuilderSortCriterion,
} from '../structured_query_builder';
import {setValidationError} from '../node_issues';
import {
  LabeledControl,
  DraggableItem,
  OutlinedMultiSelect,
  type MultiSelectOption,
  type MultiSelectDiff,
} from '../widgets';
import type {NodeDetailsAttrs, NodeModifyAttrs} from '../../node_types';
import {loadNodeDoc} from '../node_doc_loader';
import {createErrorSections} from '../widgets';
import {NodeDetailsMessage} from '../node_styling_widgets';
=======
  QueryNode,
  QueryNodeState,
  nextNodeId,
  NodeType,
  ModificationNode,
} from '../../query_node';
import {ColumnInfo} from '../column_info';
import protos from '../../../../protos';
import {Card} from '../../../../widgets/card';
import {MultiselectInput} from '../../../../widgets/multiselect_input';
import {Button} from '../../../../widgets/button';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/sort_node.ts

export interface SortCriterion {
  colName: string;
  direction: 'ASC' | 'DESC';
}

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/sort_node.ts
// Serializable node configuration. This IS the serialized format —
// no separate serializeState()/deserializeState() needed.
export interface SortNodeAttrs {
  sortCriteria?: SortCriterion[];
}

export class SortNode implements QueryNode {
  readonly nodeId: string;
  readonly type = NodeType.kSort;
  primaryInput?: QueryNode;
  nextNodes: QueryNode[];
  readonly attrs: SortNodeAttrs;
  readonly context: NodeContext;

  constructor(attrs: SortNodeAttrs, context: NodeContext) {
    this.nodeId = nextNodeId();
    this.attrs = {
      ...attrs,
      sortCriteria: attrs.sortCriteria ?? [],
    };
    this.context = context;
    this.nextNodes = [];
  }

  get sortCols(): ColumnInfo[] {
    if (!this.attrs.sortCriteria) {
      return [];
    }
    const sourceCols = this.sourceCols;
    return this.attrs.sortCriteria
=======
export interface SortNodeState extends QueryNodeState {
  prevNode: QueryNode;
  sortColNames?: string[]; // For backwards compatibility
  sortCriteria?: SortCriterion[];
}

export class SortNode implements ModificationNode {
  readonly nodeId: string;
  readonly type = NodeType.kSort;
  readonly prevNode: QueryNode;
  nextNodes: QueryNode[];
  readonly state: SortNodeState;
  sortCols: ColumnInfo[];

  constructor(state: SortNodeState) {
    this.nodeId = nextNodeId();
    this.state = state;
    this.prevNode = state.prevNode;
    this.nextNodes = [];

    this.state.sortCriteria = this.state.sortCriteria ?? [];
    this.sortCols = this.resolveSortCols();
  }

  private resolveSortCols(): ColumnInfo[] {
    if (!this.state.sortCriteria) {
      return [];
    }
    const sourceCols = this.sourceCols;
    return this.state.sortCriteria
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/sort_node.ts
      .map((criterion) => sourceCols.find((c) => c.name === criterion.colName))
      .filter((c): c is ColumnInfo => c !== undefined);
  }

  get sourceCols(): ColumnInfo[] {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/sort_node.ts
    return this.primaryInput?.finalCols ?? [];
=======
    return this.prevNode?.finalCols ?? [];
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/sort_node.ts
  }

  get finalCols(): ColumnInfo[] {
    return this.sourceCols;
  }

  getTitle(): string {
    return 'Sort';
  }

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/nodes/sort_node.ts
  nodeDetails(): NodeDetailsAttrs {
    if (!this.attrs.sortCriteria || this.attrs.sortCriteria.length === 0) {
      return {
        content: NodeDetailsMessage('No sort columns'),
      };
    }

    const label = this.attrs.sortCriteria
      .map((c) =>
        c.direction === 'DESC' ? `${c.colName} ↓` : `${c.colName} ↑`,
      )
      .join(', ');

    return {
      content: m('div', `Sort by ${label}`),
    };
  }

  nodeSpecificModify(): NodeModifyAttrs {
    if (!this.attrs.sortCriteria) {
      this.attrs.sortCriteria = [];
    }

    const sections: NodeModifyAttrs['sections'] = [
      ...createErrorSections(this),
    ];

    // Column selector section
    sections.push({
      content: this.renderColumnSelector(),
    });

    // Sort criteria list section
    sections.push({
      content: this.renderSortCriteriaList(),
    });

    return {
      info: 'Orders rows by selected columns. Add columns to sort by, then drag to reorder. Click column chips to toggle between ascending (ASC) and descending (DESC) order.',
      sections,
    };
  }

  private renderColumnSelector(): m.Child {
    const sortCriteria = this.attrs.sortCriteria ?? [];

    const sortOptions: MultiSelectOption[] = this.sourceCols.map((col) => ({
      id: col.name,
      name: col.name,
      checked: sortCriteria.some((c) => c.colName === col.name),
    }));

    const label =
      sortCriteria.length > 0
        ? sortCriteria
            .map((c) =>
              c.direction === 'DESC' ? `${c.colName} ↓` : `${c.colName} ↑`,
            )
            .join(', ')
        : 'None';

    return m(
      LabeledControl,
      {
        label: 'Sort by:',
      },
      m(OutlinedMultiSelect, {
        label,
        options: sortOptions,
        showNumSelected: false,
        onChange: (diffs: MultiSelectDiff[]) => {
          if (!this.attrs.sortCriteria) {
            this.attrs.sortCriteria = [];
          }
          for (const diff of diffs) {
            if (diff.checked) {
              // Add column if not already present
              if (!this.attrs.sortCriteria.some((c) => c.colName === diff.id)) {
                this.attrs.sortCriteria.push({
                  colName: diff.id,
                  direction: 'ASC',
                });
              }
            } else {
              // Remove column
              this.attrs.sortCriteria = this.attrs.sortCriteria.filter(
                (c) => c.colName !== diff.id,
              );
            }
          }
          this.context.onchange?.();
        },
      }),
    );
  }

  private renderSortCriteriaList(): m.Child {
    const sortCriteria = this.attrs.sortCriteria ?? [];

    if (sortCriteria.length === 0) {
      return null;
    }

    const handleReorder = (from: number, to: number) => {
      if (!this.attrs.sortCriteria) return;
      const newSortCriteria = [...this.attrs.sortCriteria];
      const [removed] = newSortCriteria.splice(from, 1);
      newSortCriteria.splice(to, 0, removed);
      this.attrs.sortCriteria = newSortCriteria;
      this.context.onchange?.();
      m.redraw();
    };

    return m(
      '.pf-sort-criteria-list',
      sortCriteria.map((criterion, index) =>
        m(
          DraggableItem,
          {
            index,
            onReorder: handleReorder,
          },
          m('span', criterion.colName),
          m(Button, {
            label: criterion.direction,
            onclick: () => {
              if (this.attrs.sortCriteria) {
                this.attrs.sortCriteria[index].direction =
                  criterion.direction === 'ASC' ? 'DESC' : 'ASC';
                this.context.onchange?.();
                m.redraw();
              }
            },
          }),
        ),
      ),
    );
  }

  nodeInfo(): m.Children {
    return loadNodeDoc('sort');
  }

  validate(): boolean {
    // Clear any previous errors at the start of validation
    if (this.context.issues) {
      this.context.issues.clear();
    }

    if (this.primaryInput === undefined) {
      setValidationError(this.context, 'No input node connected');
      return false;
    }

    if (!this.primaryInput.validate()) {
      setValidationError(this.context, 'Previous node is invalid');
      return false;
    }

    if (this.sortCols === undefined || this.sortCols.length === 0) {
      setValidationError(this.context, 'No sort columns selected');
      return false;
    }

    return true;
  }

  clone(): QueryNode {
    return new SortNode(
      {sortCriteria: this.attrs.sortCriteria?.map((c) => ({...c}))},
      this.context,
    );
  }

  getStructuredQuery(): protos.PerfettoSqlStructuredQuery | undefined {
    if (this.primaryInput === undefined) return undefined;

    if (this.sortCols.length === 0) {
      // No sortable columns - return passthrough to maintain reference chain
      return StructuredQueryBuilder.passthrough(this.primaryInput, this.nodeId);
    }

    const criteria: BuilderSortCriterion[] = [];
    for (const criterion of this.attrs.sortCriteria ?? []) {
      const col = this.sortCols.find((c) => c.name === criterion.colName);
      if (!col) continue;

      criteria.push({
        columnName: col.name,
        direction: criterion.direction,
      });
    }

    if (criteria.length === 0) {
      // No valid sort criteria - return passthrough to maintain reference chain
      return StructuredQueryBuilder.passthrough(this.primaryInput, this.nodeId);
    }

    return StructuredQueryBuilder.withOrderBy(
      this.primaryInput,
      criteria,
      this.nodeId,
    );
=======
  nodeDetails(): m.Child {
    if (this.sortCols.length > 0 && this.state.sortCriteria) {
      const criteria = this.state.sortCriteria
        .map((c) => c.direction === 'DESC' ? `${c.colName} DESC` : c.colName)
        .join(', ');
      return m(
        '.pf-aggregation-node-details',
        `Sort by `,
        m('strong', criteria),
      );
    }
    return m('.pf-aggregation-node-details', 'No sort column selected');
  }

  nodeSpecificModify(): m.Child {
    return m(Card, [
      m('label', 'Pick order by columns '),
      m(MultiselectInput, {
        options: this.sourceCols.map((c) => ({key: c.name, label: c.name})),
        selectedOptions: this.sortCols?.map((c) => c.column.name) ?? [],
        onOptionAdd: (key: string) => {
          if (!this.state.sortCriteria) {
            this.state.sortCriteria = [];
          }
          this.state.sortCriteria.push({colName: key, direction: 'ASC'});
          this.sortCols = this.resolveSortCols();
          m.redraw();
        },
        onOptionRemove: (key: string) => {
          if (this.state.sortCriteria) {
            this.state.sortCriteria = this.state.sortCriteria.filter(
              (c) => c.colName !== key,
            );
            this.sortCols = this.resolveSortCols();
            m.redraw();
          }
        },
      }),
      this.state.sortCriteria?.map((criterion, index) =>
        m(
          '.sort-criterion',
          {
            draggable: true,
            ondragstart: (e: DragEvent) => {
              e.dataTransfer!.setData('text/plain', index.toString());
            },
            ondragover: (e: DragEvent) => {
              e.preventDefault();
            },
            ondrop: (e: DragEvent) => {
              e.preventDefault();
              if (!this.state.sortCriteria) return;
              const from = parseInt(e.dataTransfer!.getData('text/plain'), 10);
              const to = index;

              const newSortCriteria = [...this.state.sortCriteria];
              const [removed] = newSortCriteria.splice(from, 1);
              newSortCriteria.splice(to, 0, removed);
              this.state.sortCriteria = newSortCriteria;
              this.sortCols = this.resolveSortCols();
              m.redraw();
            },
          },
          [
            m('span.pf-drag-handle', '☰'),
            m('span', criterion.colName),
            m(Button, {
              label: criterion.direction,
              onclick: () => {
                if (this.state.sortCriteria) {
                  this.state.sortCriteria[index].direction =
                    criterion.direction === 'ASC' ? 'DESC' : 'ASC';
                  m.redraw();
                }
              },
            }),
          ],
        ),
      ),
    ]);
  }

  validate(): boolean {
    return (
      this.prevNode !== undefined &&
      this.sortCols !== undefined &&
      this.sortCols.length > 0
    );
  }

  clone(): QueryNode {
    return new SortNode(this.state);
  }

  getStructuredQuery(): protos.PerfettoSqlStructuredQuery | undefined {
    if (this.prevNode === undefined) return undefined;
    const prevQuery = this.prevNode.getStructuredQuery();
    if (!prevQuery) return undefined;

    if (this.sortCols.length === 0) {
      return prevQuery;
    }

    const orderingSpecs: protos.PerfettoSqlStructuredQuery.OrderBy.IOrderingSpec[] =
      [];
    for (const criterion of this.state.sortCriteria ?? []) {
      const col = this.sortCols.find(
        (c) => c.column.name === criterion.colName,
      );
      if (!col) continue;

      orderingSpecs.push({
        columnName: col.column.name,
        direction:
          criterion.direction === 'DESC'
            ? protos.PerfettoSqlStructuredQuery.OrderBy.Direction.DESC
            : protos.PerfettoSqlStructuredQuery.OrderBy.Direction.ASC,
      });
    }

    if (orderingSpecs.length === 0) {
      return prevQuery;
    }

    return protos.PerfettoSqlStructuredQuery.create({
      innerQuery: prevQuery,
      orderBy: protos.PerfettoSqlStructuredQuery.OrderBy.create({
        orderingSpecs,
      }),
    });
  }

  serializeState(): object {
    return this.state;
  }

  static deserializeState(state: SortNodeState): SortNodeState {
    return {
      ...state,
      prevNode: undefined as unknown as QueryNode,
    };
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/nodes/sort_node.ts
  }
}
