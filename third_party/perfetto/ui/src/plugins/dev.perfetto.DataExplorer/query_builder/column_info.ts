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

<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/column_info.ts
import type {PerfettoSqlType} from '../../../trace_processor/perfetto_sql_type';
import type {SqlColumn} from '../../dev.perfetto.SqlModules/sql_modules';
=======
import {perfettoSqlTypeToString} from '../../../trace_processor/perfetto_sql_type';
import {SqlColumn} from '../../dev.perfetto.SqlModules/sql_modules';
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/column_info.ts

export interface ColumnInfo {
  name: string;
  type?: PerfettoSqlType;
  description?: string;
  checked: boolean;
  alias?: string;
  // When true, the type was explicitly modified by the user and should be
  // preserved even when upstream columns change.
  typeUserModified?: boolean;
}

export function columnInfoFromSqlColumn(
  column: SqlColumn,
  checked: boolean = false,
): ColumnInfo {
  return {
    name: column.name,
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/column_info.ts
    type: column.type,
    description: column.description,
    checked,
=======
    type: perfettoSqlTypeToString(column.type),
    checked,
    column: column,
  };
}

export function columnInfoFromName(
  name: string,
  checked: boolean = false,
): ColumnInfo {
  return {
    name,
    type: 'NA',
    checked,
    column: {name},
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/column_info.ts
  };
}

export function newColumnInfo(
  col: ColumnInfo,
  checked?: boolean | undefined,
): ColumnInfo {
  const finalName = col.alias ?? col.name;
  return {
<<<<<<< HEAD:third_party/perfetto/ui/src/plugins/dev.perfetto.DataExplorer/query_builder/column_info.ts
    name: finalName,
    type: col.type,
    description: col.description,
=======
    name: col.alias ?? col.column.name,
    type: perfettoSqlTypeToString(col.column.type),
    column: col.column,
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.):third_party/perfetto/ui/src/plugins/dev.perfetto.ExplorePage/query_builder/column_info.ts
    alias: undefined,
    checked: checked ?? col.checked,
    typeUserModified: col.typeUserModified,
  };
}
