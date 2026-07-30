# SQLite Upgrade Guide

## Overview

Perfetto depends on SQLite internals:
<<<<<<< HEAD
- SQLite grammar processing via the syntaqlite library
=======
- Modified SQLite tokenizer (`tokenize.c`) for PerfettoSQL
- SQLite grammar file (`parse.y`) processing
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
- Internal SQLite constants and structures

## Upgrade Procedure

### Prerequisites
Only upgrade when Chrome, Android, and Google3 all support the target SQLite version.

### Steps

1. **Update version references:**
   - `tools/install-build-deps` - update SQLite version/hash
   - `bazel/deps.bzl` - update SQLite version/hash

<<<<<<< HEAD
2. **Regenerate the PerfettoSQL parser:**
   ```bash
   python3 tools/gen_syntaqlite_parser
=======
2. **Run parser update:**
   ```bash
   python3 tools/update_sql_parsers.py
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
   ```

3. **Build and test:**
   ```bash
   tools/ninja -C out/linux_clang_release trace_processor_shell perfetto_unittests
   out/linux_clang_release/perfetto_unittests --gtest_filter="*Sql*"
   tools/diff_test_trace_processor.py out/linux_clang_release/trace_processor_shell --quiet
   ```

## Common Issues

<<<<<<< HEAD
=======
### SQLite Special Tokens Changed
**Error:** `SQLite special tokens have changed! Expected: %token SPACE COMMENT ILLEGAL.`

**Fix:** Update `EXPECTED_SPECIAL_TOKENS` in `tools/update_sql_parsers.py`

### Missing Token Definitions
**Error:** `use of undeclared identifier 'TK_COMMENT'` or `'SQLITE_DIGIT_SEPARATOR'`

**Fix:** Add missing constants to `tokenize_internal_helper.h`

>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
### SQLite Internal API Changes
**Error:** Compilation errors in `sqlite_utils.h` or `sqlite/bindings/*.h`

**Fix:** Update bindings for SQLite API changes

## Key Files

### Always Review
- `tools/install-build-deps` - SQLite version/hash
- `bazel/deps.bzl` - SQLite version/hash
<<<<<<< HEAD
- `tools/gen_syntaqlite_parser` - Parser regeneration script

### Generated (Don't Edit)
- `src/trace_processor/perfetto_sql/syntaqlite/syntaqlite_perfetto.c`
- `src/trace_processor/perfetto_sql/syntaqlite/syntaqlite_perfetto.h`

### Grammar Sources (Edit These)
- `src/trace_processor/perfetto_sql/syntaqlite/perfetto.y` - Perfetto dialect grammar
- `src/trace_processor/perfetto_sql/syntaqlite/perfetto.synq` - AST node definitions

## Rollback
1. Revert version changes in `tools/install-build-deps` and `bazel/deps.bzl`
2. Re-run `python3 tools/gen_syntaqlite_parser`
=======
- `tools/update_sql_parsers.py` - Parser update script
- `tokenize_internal_helper.h` - Tokenizer integration

### Generated (Don't Edit)
- `perfettosql_grammar.*`
- `perfettosql_keywordhash.h`
- `tokenize_internal.c`

## Rollback
1. Revert version changes in `tools/install-build-deps` and `bazel/deps.bzl`
2. Re-run `python3 tools/update_sql_parsers.py`
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
3. Rebuild
