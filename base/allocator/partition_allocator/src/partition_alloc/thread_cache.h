// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef PARTITION_ALLOC_THREAD_CACHE_H_
#define PARTITION_ALLOC_THREAD_CACHE_H_

#include <cstdint>

#include "partition_alloc/build_config.h"
#include "partition_alloc/buildflags.h"
#include "partition_alloc/partition_alloc_base/compiler_specific.h"
#include "partition_alloc/partition_alloc_base/component_export.h"

#if PA_BUILDFLAG(PA_ARCH_CPU_X86_64) && PA_BUILDFLAG(HAS_64_BIT_POINTERS)
#include "partition_alloc/partition_alloc_base/cxx_wrapper/algorithm.h"
#endif

namespace partition_alloc {

namespace tools {

// This is used from ThreadCacheInspector, which runs in a different process. It
// scans the process memory looking for the two needles, to locate the thread
// cache registry instance.
//
// These two values were chosen randomly, and in particular neither is a valid
// pointer on most 64 bit architectures.
#if PA_BUILDFLAG(HAS_64_BIT_POINTERS)
constexpr uintptr_t kNeedle1 = 0xe69e32f3ad9ea63;
constexpr uintptr_t kNeedle2 = 0x9615ee1c5eb14caf;
#else
constexpr uintptr_t kNeedle1 = 0xe69e32f3;
constexpr uintptr_t kNeedle2 = 0x9615ee1c;
#endif  // PA_BUILDFLAG(HAS_64_BIT_POINTERS)

// This array contains, in order:
// - kNeedle1
// - &ThreadCacheRegistry::Instance()
// - kNeedle2
//
// It is refererenced in the thread cache constructor to make sure it is not
// removed by the compiler. It is also not const to make sure it ends up in
// .data.
constexpr size_t kThreadCacheNeedleArraySize = 4;
extern uintptr_t kThreadCacheNeedleArray[kThreadCacheNeedleArraySize];

}  // namespace tools

namespace internal {

constexpr inline size_t kInvalidThreadCacheIndex = static_cast<size_t>(-1);

}  // namespace internal

// Static only struct, working as a wrapper of internal::ThreadCache and
// internal::ThreadCacheRegistry.
struct ThreadCache {
  static constexpr float kDefaultMultiplier = 2.;

  PA_COMPONENT_EXPORT(PARTITION_ALLOC)
  static int64_t GetPeriodicPurgeNextIntervalInMicroseconds();
  PA_COMPONENT_EXPORT(PARTITION_ALLOC) static void RunPeriodicPurge();

<<<<<<< HEAD
  PA_COMPONENT_EXPORT(PARTITION_ALLOC)
  static void SetThreadCacheMultiplier(float multiplier);
  PA_COMPONENT_EXPORT(PARTITION_ALLOC)
=======
  // Runs `PurgeAll` and updates the next interval which
  // `GetPeriodicPurgeNextIntervalInMicroseconds` returns.
  //
  // Note that it's a caller's responsibility to invoke this member function
  // periodically with an appropriate interval. This function does not schedule
  // any task nor timer.
  void RunPeriodicPurge();
  // Returns the appropriate interval to invoke `RunPeriodicPurge` next time.
  int64_t GetPeriodicPurgeNextIntervalInMicroseconds() const;

  // Controls the thread cache size, by setting the multiplier to a value above
  // or below |ThreadCache::kDefaultMultiplier|.
  void SetThreadCacheMultiplier(float multiplier);
  void SetLargestActiveBucketIndex(uint16_t largest_active_bucket_index);

  static internal::Lock& GetLock() { return Instance().lock_; }
  // Purges all thread caches *now*. This is completely thread-unsafe, and
  // should only be called in a post-fork() handler.
  void ForcePurgeAllThreadAfterForkUnsafe();

  void ResetForTesting();

  static constexpr internal::base::TimeDelta kMinPurgeInterval =
      internal::base::Seconds(1);
  static constexpr internal::base::TimeDelta kMaxPurgeInterval =
      internal::base::Minutes(1);
  static constexpr internal::base::TimeDelta kDefaultPurgeInterval =
      2 * kMinPurgeInterval;
  static constexpr size_t kMinCachedMemoryForPurgingBytes = 500 * 1024;

 private:
  friend class tools::ThreadCacheInspector;
  friend class tools::HeapDumper;

  // Not using base::Lock as the object's constructor must be constexpr.
  internal::Lock lock_;
  ThreadCache* list_head_ PA_GUARDED_BY(GetLock()) = nullptr;
  bool periodic_purge_is_initialized_ = false;
  internal::base::TimeDelta periodic_purge_next_interval_;

  uint16_t largest_active_bucket_index_ =
      BucketIndexLookup::GetIndexForNeutralBuckets(
          kThreadCacheDefaultSizeThreshold);
};

constexpr ThreadCacheRegistry::ThreadCacheRegistry() = default;

#if PA_CONFIG(THREAD_CACHE_ENABLE_STATISTICS)
#define PA_INCREMENT_COUNTER(counter) ++counter
#else
#define PA_INCREMENT_COUNTER(counter) \
  do {                                \
  } while (0)
#endif  // PA_CONFIG(THREAD_CACHE_ENABLE_STATISTICS)

#if PA_BUILDFLAG(DCHECKS_ARE_ON)

namespace internal {

class ReentrancyGuard {
 public:
  explicit ReentrancyGuard(bool& flag) : flag_(flag) {
    PA_CHECK(!flag_);
    flag_ = true;
  }

  ~ReentrancyGuard() { flag_ = false; }

 private:
  bool& flag_;
};

}  // namespace internal

#define PA_REENTRANCY_GUARD(x)      \
  internal::ReentrancyGuard guard { \
    x                               \
  }

#else  // PA_BUILDFLAG(DCHECKS_ARE_ON)

#define PA_REENTRANCY_GUARD(x) \
  do {                         \
  } while (0)

#endif  // PA_BUILDFLAG(DCHECKS_ARE_ON)

// Per-thread cache. *Not* threadsafe, must only be accessed from a single
// thread.
//
// In practice, this is easily enforced as long as only |instance| is
// manipulated, as it is a thread_local member. As such, any
// |ThreadCache::instance->*()| call will necessarily be done from a single
// thread.
class PA_COMPONENT_EXPORT(PARTITION_ALLOC) ThreadCache {
 public:
  struct Bucket {
    internal::FreelistEntry* freelist_head = nullptr;
    // Want to keep sizeof(Bucket) small, using small types.
    uint8_t count = 0;
    std::atomic<uint8_t> limit{};  // Can be changed from another thread.
    uint16_t slot_size = 0;

    Bucket();
  };

  // Initializes the thread cache for |root|. May allocate, so should be called
  // with the thread cache disabled on the partition side, and without the
  // partition lock held.
  //
  // May only be called by a single PartitionRoot.
  static void Init(PartitionRoot* root);
  static bool IsInitialized();

  static void DeleteForTesting(ThreadCache* tcache);

  // Deletes existing thread cache and creates a new one for |root|.
  static void SwapForTesting(PartitionRoot* root);

  // Removes the tombstone marker that would be returned by Get() otherwise.
  static void RemoveTombstoneForTesting();

  // Can be called several times, must be called before any ThreadCache
  // interactions.
  static void EnsureThreadSpecificDataInitialized();

  static ThreadCache* Get() {
#if PA_CONFIG(THREAD_CACHE_FAST_TLS)
    return internal::g_thread_cache;
#else
    // This region isn't MTE-tagged.
    return reinterpret_cast<ThreadCache*>(
        internal::PartitionTlsGet(internal::g_thread_cache_key));
#endif
  }

  static ThreadCache* EnsureAndGet();

  static bool IsValid(ThreadCache* tcache) {
    // Do not MTE-untag, as it'd mess up the sentinel value.
    return reinterpret_cast<uintptr_t>(tcache) & kTombstoneMask;
  }

  static bool IsTombstone(ThreadCache* tcache) {
    // Do not MTE-untag, as it'd mess up the sentinel value.
    return reinterpret_cast<uintptr_t>(tcache) == kTombstone;
  }

  // Create a new ThreadCache associated with |root|.
  // Must be called without the partition locked, as this may allocate.
  static ThreadCache* Create(PartitionRoot* root);

  ~ThreadCache();

  // Disallow copy and move.
  ThreadCache(const ThreadCache&) = delete;
  ThreadCache(const ThreadCache&&) = delete;
  ThreadCache& operator=(const ThreadCache&) = delete;

  // Tries to put a slot at |slot_start| into the cache.
  // The slot comes from the bucket at index |bucket_index| from the partition
  // this cache is for.
  //
  // Returns the slot size if the insertion succeeds, `nullopt` otherwise.
  // Insertion can fail either because the cache is full or the
  // allocation was too large.
  PA_ALWAYS_INLINE std::optional<size_t> MaybePutInCache(uintptr_t slot_start,
                                                         size_t bucket_index);

  // Tries to allocate a memory slot from the cache.
  // Returns 0 on failure.
  //
  // Has the same behavior as RawAlloc(), that is: no cookie nor ref-count
  // handling. Sets |slot_size| to the allocated size upon success.
  PA_ALWAYS_INLINE uintptr_t GetFromCache(size_t bucket_index,
                                          size_t* slot_size);

  // Asks this cache to trigger |Purge()| at a later point. Can be called from
  // any thread.
  void SetShouldPurge();
  // Empties the cache.
  // The Partition lock must *not* be held when calling this.
  // Must be called from the thread this cache is for.
  void Purge();
  // Amount of cached memory for this thread's cache, in bytes.
  size_t CachedMemory() const;
  void AccumulateStats(ThreadCacheStats* stats) const;

  // Purge the thread cache of the current thread, if one exists.
  static void PurgeCurrentThread();

  const ThreadAllocStats& thread_alloc_stats() const {
    return thread_alloc_stats_;
  }
  size_t bucket_count_for_testing(size_t index) const {
    return buckets_[index].count;
  }

  internal::base::PlatformThreadId thread_id() const { return thread_id_; }

  // Sets the maximum size of allocations that may be cached by the thread
  // cache. This applies to all threads. However, the maximum size is bounded by
  // |kLargeSizeThreshold|.
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  static void SetLargestCachedSize(size_t size);

  // Purge the thread cache of the current thread, if one exists.
  PA_COMPONENT_EXPORT(PARTITION_ALLOC) static void PurgeCurrentThread();
  PA_COMPONENT_EXPORT(PARTITION_ALLOC) static void PurgeAllThread();
};

}  // namespace partition_alloc

#endif  // PARTITION_ALLOC_THREAD_CACHE_H_
