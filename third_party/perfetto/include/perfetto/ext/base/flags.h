/*
 * Copyright (C) 2025 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef INCLUDE_PERFETTO_EXT_BASE_FLAGS_H_
#define INCLUDE_PERFETTO_EXT_BASE_FLAGS_H_

#include "perfetto/base/build_config.h"

#if PERFETTO_BUILDFLAG(PERFETTO_ANDROID_BUILD) && \
    PERFETTO_BUILDFLAG(PERFETTO_OS_ANDROID)
// Android: aconfig generates PERFETTO_FLAGS_* macros in perfetto_flags.h
#include <perfetto_flags.h>
<<<<<<< HEAD
=======
#endif

namespace perfetto::base::flags {

// The list of all the read-only flags accessible to the Perfetto codebase.
//
// The first argument is the name of the flag. Should match 1:1 with the name
// in `perfetto_flags.aconfig`.
// The second argument is the default value of the flag in non-Android platform
// contexts.
//
// Note: For rt_mutex and rt_futex, the source of truth for non-Android platform
// is in rt_mutex.h
#define PERFETTO_READ_ONLY_FLAGS(X)                                    \
  X(test_read_only_flag, NonAndroidPlatformDefault_FALSE)              \
  X(use_murmur_hash_for_flat_hash_map, NonAndroidPlatformDefault_TRUE) \
  X(ftrace_clear_offline_cpus_only, NonAndroidPlatformDefault_TRUE)    \
  X(use_lockfree_taskrunner,                                           \
    PERFETTO_BUILDFLAG(PERFETTO_ENABLE_LOCKFREE_TASKRUNNER)            \
        ? NonAndroidPlatformDefault_TRUE                               \
        : NonAndroidPlatformDefault_FALSE)                             \
  X(use_rt_mutex, NonAndroidPlatformDefault_FALSE)                     \
  X(use_rt_futex, NonAndroidPlatformDefault_FALSE)                     \
  X(buffer_clone_preserve_read_iter, NonAndroidPlatformDefault_TRUE)   \
  X(sma_prevent_duplicate_immediate_flushes, NonAndroidPlatformDefault_TRUE)

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                 implementation details start here                          //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

[[maybe_unused]] constexpr bool NonAndroidPlatformDefault_TRUE = true;
[[maybe_unused]] constexpr bool NonAndroidPlatformDefault_FALSE = false;

#if PERFETTO_BUILDFLAG(PERFETTO_ANDROID_BUILD) && \
    PERFETTO_BUILDFLAG(PERFETTO_OS_ANDROID)
#define PERFETTO_FLAGS_DEF_GETTER(name, default_non_android_value) \
  [[maybe_unused]] constexpr bool name = ::perfetto::flags::name();
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#else
// Non-Android: Define fallback PERFETTO_FLAGS_* macros
// These match the pattern from Android's aconfig codegen
#define PERFETTO_FLAGS(FLAG) PERFETTO_FLAGS_##FLAG

#define PERFETTO_FLAGS_TEST_READ_ONLY_FLAG false
#define PERFETTO_FLAGS_USE_LOCKFREE_TASKRUNNER \
  PERFETTO_BUILDFLAG(PERFETTO_ENABLE_LOCKFREE_TASKRUNNER)
#define PERFETTO_FLAGS_BUFFER_CLONE_PRESERVE_READ_ITER true
#define PERFETTO_FLAGS_USE_UNIX_SOCKET_INOTIFY \
  PERFETTO_BUILDFLAG(PERFETTO_ENABLE_SOCK_INOTIFY)
#define PERFETTO_FLAGS_TRIGGER_PERFETTO_ON_TRACED_PROBES_DISCONNECT false
#define PERFETTO_FLAGS_USE_PCRE2 PERFETTO_BUILDFLAG(PERFETTO_PCRE2)
#define PERFETTO_FLAGS_SYS_STATS_LARGE_READ true

#endif  // PERFETTO_BUILDFLAG(PERFETTO_ANDROID_BUILD) && ...

#endif  // INCLUDE_PERFETTO_EXT_BASE_FLAGS_H_
