/*
 * Copyright (C) 2024 The Android Open Source Project
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

#include "src/trace_processor/util/trace_type.h"

#include <algorithm>
#include <cstddef>
#include <cstdint>
#include <memory>
#include <utility>
#include <vector>

#include "perfetto/base/logging.h"
#include "perfetto/ext/base/flat_hash_map.h"
#include "perfetto/ext/base/no_destructor.h"
#include "perfetto/protozero/proto_utils.h"

#include "protos/perfetto/trace/trace.pbzero.h"

namespace perfetto::trace_processor {
namespace {

constexpr uint8_t kTracePacketTag =
    protozero::proto_utils::MakeTagLengthDelimited(
        protos::pbzero::Trace::kPacketFieldNumber);

bool IsPprofProfile(const uint8_t* data, size_t size) {
  // Minimum size to parse a protobuf tag and small varint
  constexpr size_t kMinPprofSize = 10;
  if (size < kMinPprofSize) {
    return false;
  }

  const uint8_t* ptr = data;
  const uint8_t* const end = ptr + size;

  // Check if first field is sample_type (field 1, length-delimited)
  uint64_t tag;
  const uint8_t* next = protozero::proto_utils::ParseVarInt(ptr, end, &tag);
  if (next == ptr) {
    return false;
  }

  constexpr uint64_t kSampleTypeTag =
      protozero::proto_utils::MakeTagLengthDelimited(1);

  if (tag != kSampleTypeTag) {
    return false;
  }

  // Parse the length of the sample_type field
  uint64_t sample_type_length;
  const uint8_t* len_next =
      protozero::proto_utils::ParseVarInt(next, end, &sample_type_length);
  if (len_next == next ||
      sample_type_length > static_cast<uint64_t>(end - len_next)) {
    return false;
  }

  // Look inside the sample_type field for pprof ValueType structure
  // In pprof: ValueType has field 1 (type) and field 2 (unit) as varints (wire
  // type 0)
  // In Perfetto: field 1 would contain length-delimited data (wire type 2)
  const uint8_t* value_type_ptr = len_next;
  const uint8_t* value_type_end = len_next + sample_type_length;

  // Parse the first ValueType message
  if (value_type_ptr >= value_type_end) {
    return false;
  }

  // Check for field 1 (type) as varint
  uint64_t inner_tag;
  const uint8_t* inner_next = protozero::proto_utils::ParseVarInt(
      value_type_ptr, value_type_end, &inner_tag);
  if (inner_next == value_type_ptr) {
    return false;
  }

  // Use proto_utils to create proper field tags for pprof ValueType fields:
  // Field 1 (type) and Field 2 (unit) are both varints in pprof format
  constexpr uint64_t kValueTypeTypeFieldTag =
      protozero::proto_utils::MakeTagVarInt(1);
  constexpr uint64_t kValueTypeUnitFieldTag =
      protozero::proto_utils::MakeTagVarInt(2);

  // Accept either field 1 (type) or field 2 (unit) as evidence of pprof format
  return inner_tag == kValueTypeTypeFieldTag ||
         inner_tag == kValueTypeUnitFieldTag;
}

}  // namespace

TraceImporterBase::~TraceImporterBase() = default;

TraceImporterId TraceImporterRegistry::Register(
    std::unique_ptr<TraceImporterBase> importer) {
  TraceImporterId id = importer->id();
  PERFETTO_CHECK(importers_.Insert(id, std::move(importer)).second);
  return id;}

const TraceTypeDescriptor* TraceImporterRegistry::Find(
    TraceImporterId id) const {
  if (const TraceImporterBase* importer = FindImporter(id)) {
    return &importer->descriptor();
  }
  // Unregistered ids (the "no match" sentinel) are described as unknown so
  // callers never see nullptr.
  static base::NoDestructor<TraceTypeDescriptor> unknown([] {
    TraceTypeDescriptor d;
    d.name = "unknown";
    return d;
  }());
  return &unknown.ref();
}

const TraceImporterBase* TraceImporterRegistry::FindImporter(
    TraceImporterId id) const {
  auto* it = importers_.Find(id);
  return it ? it->get() : nullptr;
}

TraceImporterId TraceImporterRegistry::Guess(const uint8_t* data,
                                             size_t size) const {
  // Sniff every importer in detection_priority order, lowest first. Priorities
  // are globally unique so the order is total.
  struct Entry {
    TraceImporterId id;
    const TraceImporterBase* importer;
  };
  std::vector<Entry> entries;
  for (auto it = importers_.GetIterator(); it; ++it) {
    entries.push_back({it.key(), it.value().get()});
  }
  std::sort(entries.begin(), entries.end(), [](const Entry& a, const Entry& b) {
    return a.importer->descriptor().detection_priority <
           b.importer->descriptor().detection_priority;
  });
  for (const Entry& e : entries) {
    if (e.importer->Sniff(data, size)) {
      return e.id;
    }
  }
  return TraceImporterId();
}

const char* TraceImporterRegistry::ToString(TraceImporterId id) const {
  return Find(id)->name.c_str();
}

bool TraceImporterRegistry::IsContainer(TraceImporterId id) const {
  return Find(id)->is_container;
}

CompressedTraceType SniffCompressedTraceType(const uint8_t* data, size_t size) {
  if (size >= 2 && data[0] == 0x1f && data[1] == 0x8b) {
    return CompressedTraceType::kGzip;
  }
  if (size >= 4 && data[0] == 0x28 && data[1] == 0xb5 && data[2] == 0x2f &&
      data[3] == 0xfd) {
    return CompressedTraceType::kZstd;
  }
// A raw proto trace starts with the length-delimited Trace.packet field tag.
  if (size > 0 && data[0] == kTracePacketTag) {
    return CompressedTraceType::kProto;
  }
  return CompressedTraceType::kOther;}

}  // namespace perfetto::trace_processor
