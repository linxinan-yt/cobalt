#!/usr/bin/env python3
# Copyright (C) 2019 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Pack a set of SQL files into a single binary blob and embed it as a
`constexpr std::array<uint8_t, N>` C++ header.

The generated blob is consumed at runtime by `SqlBundle` (see
`src/trace_processor/util/sql_bundle.h`). Wire format:

  uint32_t count;
  for (count) {
    uint32_t path_size;       // Excluding the trailing NUL.
    char     path[path_size];
    char     nul;             // 0x00.
    uint32_t sql_size;
    char     sql[sql_size];
  }

Inputs are passed as positional args. As a convenience, any positional that
ends with `.txt` is read as a newline-separated list of further input paths
(used by the GN template, where the file list is materialised at build
time via `generated_file`).
"""

import argparse
import os
import struct
import sys

# Allow `from python.tools import cpp_blob_emitter` to resolve when this
# script is run directly. In Bazel the py_binary `deps` wire it up; in
# Soong the genrule lists it in `tool_files` and the relative layout is
# preserved inside the sandbox.
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.dirname(SCRIPT_DIR))
from python.tools import cpp_blob_emitter  # noqa: E402


def expand_inputs(inputs):
  out = []
  for path in inputs:
    if path.endswith('.txt'):
      with open(path, 'r', encoding='utf-8') as f:
        out.extend(line for line in f.read().splitlines() if line)
    else:
      out.append(path)
  return out


def pack_bundle(file_to_sql):
  """Pack {relpath: sql_bytes} into the SqlBundle wire format.

  Entries are sorted by path so that files belonging to the same top-level
  directory (= PerfettoSQL package) end up contiguous in the bundle. The
  consumer relies on this to detect package boundaries by a simple linear
  scan rather than maintaining a hashmap.
  """
  buf = bytearray()
  buf += struct.pack('<I', len(file_to_sql))
  for path, sql in sorted(file_to_sql.items()):
    path_bytes = path.encode('utf-8')
    buf += struct.pack('<I', len(path_bytes))
    buf += path_bytes
    buf += b'\0'
    buf += struct.pack('<I', len(sql))
    buf += sql
  return bytes(buf)


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('--output', required=True)
  parser.add_argument('--namespace', required=True)
  parser.add_argument('--gen-dir', default='')
  parser.add_argument('--root-dir', default=None)
  parser.add_argument('inputs', nargs='+')
  args = parser.parse_args()

  sql_files = expand_inputs(args.inputs)

<<<<<<< HEAD
  # Soong cannot pass us a path to the Perfetto source directory, so when
  # --root-dir is omitted we fall back to the longest common path. This
  # fails on empty path, but it's a price worth paying to avoid hacks.
=======
  sql_files = []
  if args.input_list_file:
    with open(args.input_list_file, 'r', encoding='utf-8') as input_list_file:
      for line in input_list_file.read().splitlines():
        sql_files.append(line)
  else:
    sql_files = args.sql_files

  # Unfortunately we cannot always pass this in as an arg as soong does not
  # provide us a way to get the path to the Perfetto source directory. This
  # fails on empty path but it's a price worth paying to have to use gross hacks
  # in Soong.
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  root_dir = args.root_dir if args.root_dir else os.path.commonpath(sql_files)

  file_to_sql = {}
  for file_name in sql_files:
<<<<<<< HEAD
    with open(file_name, 'rb') as f:
=======
    with open(file_name, 'r', encoding='utf-8') as f:
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
      relpath = os.path.relpath(file_name, root_dir)
      # We've had bugs (e.g. b/264711057) when Soong's common path logic
      # ends up with a bunch of ../ prefixing the path: disallow any ../.
      assert '../' not in relpath, relpath
      relpath = relpath.replace('\\', '/')
      file_to_sql[relpath] = f.read()

<<<<<<< HEAD
  blob = pack_bundle(file_to_sql)
  cpp_blob_emitter.emit_array(
      blob,
      args.output,
      symbol=cpp_blob_emitter.derive_symbol(args.output),
      namespace=args.namespace,
      include_guard=cpp_blob_emitter.derive_include_guard(
          args.output, args.gen_dir))
=======
      # We've had bugs (e.g. b/264711057) when Soong's common path logic breaks
      # and ends up with a bunch of ../ prefixing the path: disallow any ../
      # as this should never be a valid in our C++ output.
      assert '../' not in relpath
      sql_outputs[relpath] = f.read()

  with open(args.cpp_out, 'w+', encoding='utf-8') as output:
    output.write(REPLACEMENT_HEADER)
    output.write(NAMESPACE_BEGIN.format(args.namespace))

    # Create the C++ variable for each SQL file.
    for path, sql in sql_outputs.items():
      variable = filename_to_variable(os.path.splitext(path)[0])
      output.write('\nconst char {}[] = '.format(variable))
      # MSVC doesn't like string literals that are individually longer than 16k.
      # However it's still fine "if" "we" "concatenate" "many" "of" "them".
      # This code splits the sql in string literals of ~1000 chars each.
      line_groups = ['']
      for line in sql.split('\n'):
        line_groups[-1] += line + '\n'
        if len(line_groups[-1]) > 1000:
          line_groups.append('')

      for line in line_groups:
        output.write('R"_d3l1m1t3r_({})_d3l1m1t3r_"\n'.format(line))
      output.write(';\n')

    output.write(FILE_TO_SQL_STRUCT)

    # Create mapping of filename to variable name for each variable.
    output.write("\nconst FileToSql kFileToSql[] = {")
    for path in sql_outputs.keys():
      variable = filename_to_variable(os.path.splitext(path)[0])

      # This is for Windows which has \ as a path separator.
      path = path.replace("\\", "/")
      output.write('\n  {{"{}", {}}},\n'.format(path, variable))
    output.write("};\n")

    output.write(NAMESPACE_END.format(args.namespace))

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  return 0


if __name__ == '__main__':
  sys.exit(main())
