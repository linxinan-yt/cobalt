/*
 *  Copyright (c) 2013 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree. An additional intellectual property rights grant can be found
 *  in the file PATENTS.  All contributing project authors may
 *  be found in the AUTHORS file in the root of the source tree.
 */

#include "audio/nack_tracker.h"

#include <cstddef>
#include <cstdint>
#include <optional>
<<<<<<< HEAD
#include <vector>

#include "api/units/frequency.h"
#include "api/units/time_delta.h"
#include "modules/include/module_common_types_public.h"
#include "rtc_base/checks.h"
=======
#include <utility>
#include <vector>

#include "api/field_trials_view.h"
#include "modules/include/module_common_types_public.h"
#include "rtc_base/checks.h"
#include "rtc_base/experiments/struct_parameters_parser.h"
#include "rtc_base/logging.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

namespace webrtc {
namespace {

<<<<<<< HEAD
constexpr Frequency kDefaultSampleRate = Frequency::Hertz(48000);
constexpr TimeDelta kMaxPacketDuration = TimeDelta::Millis(120);
constexpr TimeDelta kDefaultRtt = TimeDelta::Millis(100);
constexpr TimeDelta kMaxNackDelay = TimeDelta::Seconds(1);

}  // namespace

NackTracker::NackTracker(size_t max_nack_list_size)
    : max_nack_list_size_(max_nack_list_size),
      sample_rate_(kDefaultSampleRate) {}
=======
const int kDefaultSampleRateKhz = 48;
const int kMaxPacketSizeMs = 120;
constexpr char kNackTrackerConfigFieldTrial[] =
    "WebRTC-Audio-NetEqNackTrackerConfig";

}  // namespace

NackTracker::Config::Config(const FieldTrialsView& field_trials) {
  auto parser = StructParametersParser::Create(
      "packet_loss_forget_factor", &packet_loss_forget_factor,
      "ms_per_loss_percent", &ms_per_loss_percent, "never_nack_multiple_times",
      &never_nack_multiple_times, "require_valid_rtt", &require_valid_rtt,
      "max_loss_rate", &max_loss_rate);
  parser->Parse(field_trials.Lookup(kNackTrackerConfigFieldTrial));
  RTC_LOG(LS_INFO) << "Nack tracker config:"
                      " packet_loss_forget_factor="
                   << packet_loss_forget_factor
                   << " ms_per_loss_percent=" << ms_per_loss_percent
                   << " never_nack_multiple_times=" << never_nack_multiple_times
                   << " require_valid_rtt=" << require_valid_rtt
                   << " max_loss_rate=" << max_loss_rate;
}

NackTracker::NackTracker(const FieldTrialsView& field_trials)
    : config_(field_trials),
      sequence_num_last_received_rtp_(0),
      timestamp_last_received_rtp_(0),
      any_rtp_received_(false),
      timestamp_last_decoded_rtp_(0),
      any_rtp_decoded_(false),
      sample_rate_khz_(kDefaultSampleRateKhz),
      max_nack_list_size_(kNackListSizeLimit) {}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

NackTracker::~NackTracker() = default;

void NackTracker::UpdateSampleRate(int sample_rate_hz) {
  RTC_DCHECK_GT(sample_rate_hz, 0);
<<<<<<< HEAD
  Frequency sample_rate = Frequency::Hertz(sample_rate_hz);
  if (sample_rate != sample_rate_) {
    Reset();
    sample_rate_ = sample_rate;
=======
  int sample_rate_khz = sample_rate_hz / 1000;
  if (sample_rate_khz_ != sample_rate_khz) {
    Reset();
    sample_rate_khz_ = sample_rate_khz;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
}

void NackTracker::UpdateLastReceivedPacket(uint16_t sequence_number,
                                           uint32_t timestamp) {
<<<<<<< HEAD
  if (!sequence_num_last_received_rtp_.has_value()) {
    sequence_num_last_received_rtp_ = sequence_number;
    timestamp_last_received_rtp_ = timestamp;
    return;
  }

  nack_list_.erase(sequence_number);

  if (!IsNewerSequenceNumber(sequence_number,
                             *sequence_num_last_received_rtp_)) {
    return;
  }
=======
  // Just record the value of sequence number and timestamp if this is the
  // first packet.
  if (!any_rtp_received_) {
    sequence_num_last_received_rtp_ = sequence_number;
    timestamp_last_received_rtp_ = timestamp;
    any_rtp_received_ = true;
    // If no packet is decoded, to have a reasonable estimate of time-to-play
    // use the given values.
    if (!any_rtp_decoded_) {
      timestamp_last_decoded_rtp_ = timestamp;
    }
    return;
  }

  if (sequence_number == sequence_num_last_received_rtp_)
    return;

  // Received RTP should not be in the list.
  nack_list_.erase(sequence_number);

  // If this is an old sequence number, no more action is required, return.
  if (IsNewerSequenceNumber(sequence_num_last_received_rtp_, sequence_number))
    return;

  UpdatePacketLossRate(sequence_number - sequence_num_last_received_rtp_ - 1);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)

  UpdateList(sequence_number, timestamp);

  sequence_num_last_received_rtp_ = sequence_number;
  timestamp_last_received_rtp_ = timestamp;
  LimitNackListSize();
}

std::optional<int> NackTracker::GetSamplesPerPacket(
    uint16_t sequence_number_current_received_rtp,
    uint32_t timestamp_current_received_rtp) const {
  uint32_t timestamp_increase =
<<<<<<< HEAD
      timestamp_current_received_rtp - *timestamp_last_received_rtp_;
  uint16_t sequence_num_increase =
      sequence_number_current_received_rtp - *sequence_num_last_received_rtp_;

  int samples_per_packet = timestamp_increase / sequence_num_increase;
  if (samples_per_packet == 0 ||
      samples_per_packet > kMaxPacketDuration * sample_rate_) {
=======
      timestamp_current_received_rtp - timestamp_last_received_rtp_;
  uint16_t sequence_num_increase =
      sequence_number_current_received_rtp - sequence_num_last_received_rtp_;

  int samples_per_packet = timestamp_increase / sequence_num_increase;
  if (samples_per_packet == 0 ||
      samples_per_packet > kMaxPacketSizeMs * sample_rate_khz_) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    // Not a valid samples per packet.
    return std::nullopt;
  }
  return samples_per_packet;
}

void NackTracker::UpdateList(uint16_t sequence_number_current_received_rtp,
                             uint32_t timestamp_current_received_rtp) {
  if (!IsNewerSequenceNumber(sequence_number_current_received_rtp,
<<<<<<< HEAD
                             *sequence_num_last_received_rtp_ + 1)) {
=======
                             sequence_num_last_received_rtp_ + 1)) {
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
    return;
  }

  std::optional<int> samples_per_packet = GetSamplesPerPacket(
      sequence_number_current_received_rtp, timestamp_current_received_rtp);
  if (!samples_per_packet) {
    return;
  }

<<<<<<< HEAD
  for (uint16_t sequence_number = *sequence_num_last_received_rtp_ + 1;
       IsNewerSequenceNumber(sequence_number_current_received_rtp,
                             sequence_number);
       ++sequence_number) {
    nack_list_[sequence_number] =
        EstimateTimestamp(sequence_number, *samples_per_packet);
=======
  for (uint16_t n = sequence_num_last_received_rtp_ + 1;
       IsNewerSequenceNumber(sequence_number_current_received_rtp, n); ++n) {
    uint32_t timestamp = EstimateTimestamp(n, *samples_per_packet);
    NackElement nack_element(TimeToPlay(timestamp), timestamp);
    nack_list_.insert(nack_list_.end(), std::make_pair(n, nack_element));
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
  }
}

uint32_t NackTracker::EstimateTimestamp(uint16_t sequence_num,
                                        int samples_per_packet) {
<<<<<<< HEAD
  uint16_t sequence_num_diff = sequence_num - *sequence_num_last_received_rtp_;
  return sequence_num_diff * samples_per_packet + *timestamp_last_received_rtp_;
=======
  uint16_t sequence_num_diff = sequence_num - sequence_num_last_received_rtp_;
  return sequence_num_diff * samples_per_packet + timestamp_last_received_rtp_;
}

void NackTracker::UpdateLastDecodedPacket(uint32_t timestamp) {
  any_rtp_decoded_ = true;
  timestamp_last_decoded_rtp_ = timestamp;
  // Packets in the list with timestamp less than the timestamp of the decoded
  // RTP should be removed from the lists. They will be discarded by the jitter
  // buffer if they arrive.
  NackList::iterator it = nack_list_.begin();
  while (it != nack_list_.end() &&
         !IsNewerTimestamp(it->second.estimated_timestamp, timestamp)) {
    it = nack_list_.erase(it);
  }
  // Update estimated time-to-play.
  for (; it != nack_list_.end(); ++it) {
    it->second.time_to_play_ms = TimeToPlay(it->second.estimated_timestamp);
  }
}

NackTracker::NackList NackTracker::GetNackList() const {
  return nack_list_;
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

void NackTracker::Reset() {
  nack_list_.clear();

<<<<<<< HEAD
  sequence_num_last_received_rtp_.reset();
  timestamp_last_received_rtp_.reset();
  sample_rate_ = kDefaultSampleRate;
}

void NackTracker::LimitNackListSize() {
  uint16_t limit = *sequence_num_last_received_rtp_ -
=======
  sequence_num_last_received_rtp_ = 0;
  timestamp_last_received_rtp_ = 0;
  any_rtp_received_ = false;
  timestamp_last_decoded_rtp_ = 0;
  any_rtp_decoded_ = false;
  sample_rate_khz_ = kDefaultSampleRateKhz;
}

void NackTracker::SetMaxNackListSize(size_t max_nack_list_size) {
  RTC_CHECK_GT(max_nack_list_size, 0);
  // Ugly hack to get around the problem of passing static consts by reference.
  const size_t kNackListSizeLimitLocal = NackTracker::kNackListSizeLimit;
  RTC_CHECK_LE(max_nack_list_size, kNackListSizeLimitLocal);

  max_nack_list_size_ = max_nack_list_size;
  LimitNackListSize();
}

void NackTracker::LimitNackListSize() {
  uint16_t limit = sequence_num_last_received_rtp_ -
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
                   static_cast<uint16_t>(max_nack_list_size_) - 1;
  nack_list_.erase(nack_list_.begin(), nack_list_.upper_bound(limit));
}

<<<<<<< HEAD
std::vector<uint16_t> NackTracker::GetNackList(
    std::optional<TimeDelta> round_trip_time) {
  std::vector<uint16_t> sequence_numbers;
  if (!round_trip_time.has_value()) {
    round_trip_time = kDefaultRtt;
  }
  for (const auto [sequence_number, timestamp] : nack_list_) {
    if (Nack(timestamp, *round_trip_time)) {
      sequence_numbers.push_back(sequence_number);
    }
  }
  return sequence_numbers;
}

bool NackTracker::Nack(uint32_t timestamp, TimeDelta round_trip_time) {
  TimeDelta time_since_packet =
      (*timestamp_last_received_rtp_ - timestamp) / sample_rate_;
  return time_since_packet + round_trip_time < kMaxNackDelay;
}

=======
int64_t NackTracker::TimeToPlay(uint32_t timestamp) const {
  uint32_t timestamp_increase = timestamp - timestamp_last_decoded_rtp_;
  return timestamp_increase / sample_rate_khz_;
}

// We don't erase elements with time-to-play shorter than round-trip-time.
std::vector<uint16_t> NackTracker::GetNackList(int64_t round_trip_time_ms) {
  RTC_DCHECK_GE(round_trip_time_ms, 0);
  std::vector<uint16_t> sequence_numbers;
  if (round_trip_time_ms == 0) {
    if (config_.require_valid_rtt) {
      return sequence_numbers;
    } else {
      round_trip_time_ms = config_.default_rtt_ms;
    }
  }
  if (packet_loss_rate_ >
      static_cast<uint32_t>(config_.max_loss_rate * (1 << 30))) {
    return sequence_numbers;
  }
  // The estimated packet loss is between 0 and 1, so we need to multiply by 100
  // here.
  int max_wait_ms =
      100.0 * config_.ms_per_loss_percent * packet_loss_rate_ / (1 << 30);
  for (NackList::const_iterator it = nack_list_.begin(); it != nack_list_.end();
       ++it) {
    int64_t time_since_packet_ms =
        (timestamp_last_received_rtp_ - it->second.estimated_timestamp) /
        sample_rate_khz_;
    if (it->second.time_to_play_ms > round_trip_time_ms ||
        time_since_packet_ms + round_trip_time_ms < max_wait_ms)
      sequence_numbers.push_back(it->first);
  }
  if (config_.never_nack_multiple_times) {
    nack_list_.clear();
  }
  return sequence_numbers;
}

void NackTracker::UpdatePacketLossRate(int packets_lost) {
  const uint64_t alpha_q30 = (1 << 30) * config_.packet_loss_forget_factor;
  // Exponential filter.
  packet_loss_rate_ = (alpha_q30 * packet_loss_rate_) >> 30;
  for (int i = 0; i < packets_lost; ++i) {
    packet_loss_rate_ =
        ((alpha_q30 * packet_loss_rate_) >> 30) + ((1 << 30) - alpha_q30);
  }
}
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}  // namespace webrtc
