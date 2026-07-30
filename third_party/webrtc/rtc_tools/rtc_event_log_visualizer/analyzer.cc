/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree. An additional intellectual property rights grant can be found
 *  in the file PATENTS.  All contributing project authors may
 *  be found in the AUTHORS file in the root of the source tree.
 */

#include "rtc_tools/rtc_event_log_visualizer/analyzer.h"

#include <cstddef>
#include <memory>
#include <string>
#include <vector>

#include "absl/algorithm/container.h"
#include "absl/strings/string_view.h"
#include "api/environment/environment_factory.h"
#include "api/function_view.h"
#include "api/neteq/neteq.h"
#include "api/units/data_rate.h"
#include "api/units/time_delta.h"
#include "api/units/timestamp.h"
<<<<<<< HEAD
=======
#include "logging/rtc_event_log/events/logged_rtp_rtcp.h"
#include "logging/rtc_event_log/events/rtc_event_ice_candidate_pair.h"
#include "logging/rtc_event_log/events/rtc_event_ice_candidate_pair_config.h"
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
#include "logging/rtc_event_log/rtc_event_log_parser.h"
#include "modules/rtp_rtcp/source/rtcp_packet/report_block.h"
#include "rtc_base/logging.h"
#include "rtc_tools/rtc_event_log_visualizer/analyze_audio.h"
#include "rtc_tools/rtc_event_log_visualizer/analyze_bwe.h"
#include "rtc_tools/rtc_event_log_visualizer/analyze_connectivity.h"
#include "rtc_tools/rtc_event_log_visualizer/analyze_rtp_rtcp.h"
#include "rtc_tools/rtc_event_log_visualizer/analyzer_common.h"
#include "rtc_tools/rtc_event_log_visualizer/plot_base.h"

namespace webrtc {

EventLogAnalyzer::EventLogAnalyzer(const ParsedRtcEventLog& parsed_log,
                                   bool normalize_time)
    : parsed_log_(parsed_log),
      config_(CreateEnvironment(), parsed_log, normalize_time) {
  config_.window_duration_ = TimeDelta::Millis(250);
  config_.step_ = TimeDelta::Millis(10);
  if (config_.end_time_ < config_.begin_time_) {
    RTC_LOG(LS_WARNING) << "No useful events in the log.";
    config_.begin_time_ = config_.end_time_ = Timestamp::Zero();
  }
  neteq_simulator_ = std::make_unique<LazyNetEqSimulator>(parsed_log_, config_);

  if (parsed_log_.first_timestamp().IsFinite() &&
      parsed_log_.last_timestamp().IsFinite()) {
    RTC_LOG(LS_INFO) << "Log is "
                     << (parsed_log_.last_timestamp().ms() -
                         parsed_log_.first_timestamp().ms()) /
                            1000
                     << " seconds long.";
  }
}

EventLogAnalyzer::EventLogAnalyzer(const ParsedRtcEventLog& parsed_log,
                                   const AnalyzerConfig& config)
    : parsed_log_(parsed_log), config_(config) {
  neteq_simulator_ = std::make_unique<LazyNetEqSimulator>(parsed_log_, config_);
  if (parsed_log_.first_timestamp().IsFinite() &&
      parsed_log_.last_timestamp().IsFinite()) {
    RTC_LOG(LS_INFO) << "Log is "
                     << (parsed_log_.last_timestamp().ms() -
                         parsed_log_.first_timestamp().ms()) /
                            1000
                     << " seconds long.";
  }
}

EventLogAnalyzer::~EventLogAnalyzer() = default;

void EventLogAnalyzer::SetNetEqReplacementFile(
    absl::string_view replacement_file_name,
    int file_sample_rate_hz) {
  neteq_simulator_->SetReplacementAudioFile(replacement_file_name,
                                            file_sample_rate_hz);
}

void EventLogAnalyzer::CreateGraphsByName(const std::vector<std::string>& names,
                                          PlotCollection* collection) const {
  for (absl::string_view name : names) {
    auto plot = absl::c_find_if(plots_, [name](const PlotDeclaration& plot) {
      return plot.label == name;
    });
    if (plot != plots_.end()) {
      plot->plot_func(collection);
    }
  }
}

void EventLogAnalyzer::InitializeMapOfNamedGraphs(bool show_detector_state,
                                                  bool show_alr_state,
                                                  bool show_link_capacity,
                                                  bool include_overhead) {
  plots_.RegisterPlot("incoming_packet_sizes", [this](Plot* plot) {
    this->CreatePacketGraph(kIncomingPacket, plot);
  });

  plots_.RegisterPlot("outgoing_packet_sizes", [this](Plot* plot) {
    this->CreatePacketGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("incoming_rtcp_types", [this](Plot* plot) {
    this->CreateRtcpTypeGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_rtcp_types", [this](Plot* plot) {
    this->CreateRtcpTypeGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("incoming_packet_count", [this](Plot* plot) {
    this->CreateAccumulatedPacketsGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_packet_count", [this](Plot* plot) {
    this->CreateAccumulatedPacketsGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("incoming_packet_rate", [this](Plot* plot) {
    this->CreatePacketRateGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_packet_rate", [this](Plot* plot) {
    this->CreatePacketRateGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("total_incoming_packet_rate", [this](Plot* plot) {
    this->CreateTotalPacketRateGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("total_outgoing_packet_rate", [this](Plot* plot) {
    this->CreateTotalPacketRateGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("audio_playout",
                      [this](Plot* plot) { this->CreatePlayoutGraph(plot); });

  plots_.RegisterPlot("neteq_set_minimum_delay", [this](Plot* plot) {
    this->CreateNetEqSetMinimumDelay(plot);
  });

  plots_.RegisterPlot("incoming_audio_level", [this](Plot* plot) {
    this->CreateAudioLevelGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_audio_level", [this](Plot* plot) {
    this->CreateAudioLevelGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("incoming_sequence_number_delta", [this](Plot* plot) {
    this->CreateSequenceNumberGraph(plot);
  });
  plots_.RegisterPlot("incoming_delay", [this](Plot* plot) {
    this->CreateIncomingDelayGraph(plot);
  });
  plots_.RegisterPlot("incoming_loss_rate", [this](Plot* plot) {
    this->CreateIncomingPacketLossGraph(plot);
  });
  plots_.RegisterPlot("incoming_bitrate", [this, include_overhead](Plot* plot) {
    this->CreateTotalIncomingBitrateGraph(plot, include_overhead);
  });
  plots_.RegisterPlot("outgoing_bitrate", [this, show_detector_state,
                                           show_alr_state, show_link_capacity,
                                           include_overhead](Plot* plot) {
    this->CreateTotalOutgoingBitrateGraph(plot, show_detector_state,
                                          show_alr_state, show_link_capacity,
                                          include_overhead);
  });
  plots_.RegisterPlot("incoming_stream_bitrate", [this](Plot* plot) {
    this->CreateStreamBitrateGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_stream_bitrate", [this](Plot* plot) {
    this->CreateStreamBitrateGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("incoming_layer_bitrate_allocation", [this](Plot* plot) {
    this->CreateBitrateAllocationGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_layer_bitrate_allocation", [this](Plot* plot) {
    this->CreateBitrateAllocationGraph(kOutgoingPacket, plot);
  });
  plots_.RegisterPlot("simulated_receiveside_bwe", [this](Plot* plot) {
    this->CreateReceiveSideBweSimulationGraph(plot);
  });
  plots_.RegisterPlot("simulated_sendside_bwe", [this](Plot* plot) {
    this->CreateSendSideBweSimulationGraph(plot);
  });
  plots_.RegisterPlot("simulated_goog_cc", [this](Plot* plot) {
    this->CreateGoogCcSimulationGraph(plot);
  });
  plots_.RegisterPlot("simulated_scream_delay", [this](Plot* plot) {
    this->CreateScreamSimulationDelayGraph(plot);
  });
  plots_.RegisterPlot("simulated_scream_bitrates", [this](Plot* plot) {
    this->CreateScreamSimulationBitrateGraph(plot);
  });
  plots_.RegisterPlot("simulated_scream_ref_window", [this](Plot* plot) {
    this->CreateScreamSimulationRefWindowGraph(plot);
  });
  plots_.RegisterPlot("simulated_scream_ratios", [this](Plot* plot) {
    this->CreateScreamSimulationRatiosGraph(plot);
  });
  plots_.RegisterPlot(
      "simulated_scream_feedback_events_per_rtt", [this](Plot* plot) {
        this->CreateScreamSimulationFeedbackEventsPerRttGraph(plot);
      });
  plots_.RegisterPlot("outgoing_loss", [this](Plot* plot) {
    this->CreateOutgoingLossRateGraph(plot);
  });
  plots_.RegisterPlot("outgoing_twcc_loss", [this](Plot* plot) {
    this->CreateOutgoingLossRateGraph(plot);
  });
  plots_.RegisterPlot("outgoing_ecn_feedback", [this](Plot* plot) {
    this->CreateOutgoingEcnFeedbackGraph(plot);
  });
  plots_.RegisterPlot("incoming_ecn_feedback", [this](Plot* plot) {
    this->CreateIncomingEcnFeedbackGraph(plot);
  });
  plots_.RegisterPlot("scream_ref_window", [this](Plot* plot) {
    this->CreateScreamRefWindowGraph(plot);
  });
  plots_.RegisterPlot("scream_delay_estimates", [this](Plot* plot) {
    this->CreateScreamDelayEstimateGraph(plot);
  });
  plots_.RegisterPlot("network_delay_feedback", [this](Plot* plot) {
    this->CreateNetworkDelayFeedbackGraph(plot);
  });
  plots_.RegisterPlot("fraction_loss_feedback", [this](Plot* plot) {
    this->CreateFractionLossGraph(plot);
  });
  plots_.RegisterPlot("incoming_timestamps", [this](Plot* plot) {
    this->CreateTimestampGraph(kIncomingPacket, plot);
  });
  plots_.RegisterPlot("outgoing_timestamps", [this](Plot* plot) {
    this->CreateTimestampGraph(kOutgoingPacket, plot);
  });

  plots_.RegisterPlot("incoming_rtcp_fraction_lost", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(kIncomingPacket, GetFractionLost,
                                            "Fraction lost (incoming RTCP)",
                                            "Loss rate (percent)", plot);
  });
  plots_.RegisterPlot("outgoing_rtcp_fraction_lost", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(kOutgoingPacket, GetFractionLost,
                                            "Fraction lost (outgoing RTCP)",
                                            "Loss rate (percent)", plot);
  });

  plots_.RegisterPlot("incoming_rtcp_cumulative_lost", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kIncomingPacket, GetCumulativeLost,
        "Cumulative lost packets (incoming RTCP)", "Packets", plot);
  });
  plots_.RegisterPlot("outgoing_rtcp_cumulative_lost", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kOutgoingPacket, GetCumulativeLost,
        "Cumulative lost packets (outgoing RTCP)", "Packets", plot);
  });

  plots_.RegisterPlot("incoming_rtcp_highest_seq_number", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kIncomingPacket, GetHighestSeqNumber,
        "Highest sequence number (incoming RTCP)", "Sequence number", plot);
  });
  plots_.RegisterPlot("outgoing_rtcp_highest_seq_number", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kOutgoingPacket, GetHighestSeqNumber,
        "Highest sequence number (outgoing RTCP)", "Sequence number", plot);
  });

  plots_.RegisterPlot("incoming_rtcp_delay_since_last_sr", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kIncomingPacket, DelaySinceLastSr,
        "Delay since last received sender report (incoming RTCP)", "Time (s)",
        plot);
  });
  plots_.RegisterPlot("outgoing_rtcp_delay_since_last_sr", [this](Plot* plot) {
    this->CreateSenderAndReceiverReportPlot(
        kOutgoingPacket, DelaySinceLastSr,
        "Delay since last received sender report (outgoing RTCP)", "Time (s)",
        plot);
  });

  plots_.RegisterPlot(
      "pacer_delay", [this](Plot* plot) { this->CreatePacerDelayGraph(plot); });

  plots_.RegisterPlot("audio_encoder_bitrate", [this](Plot* plot) {
    CreateAudioEncoderTargetBitrateGraph(this->parsed_log_, this->config_,
                                         plot);
  });
  plots_.RegisterPlot("audio_encoder_frame_length", [this](Plot* plot) {
    CreateAudioEncoderFrameLengthGraph(this->parsed_log_, this->config_, plot);
  });
  plots_.RegisterPlot("audio_encoder_packet_loss", [this](Plot* plot) {
    CreateAudioEncoderPacketLossGraph(this->parsed_log_, this->config_, plot);
  });
  plots_.RegisterPlot("audio_encoder_fec", [this](Plot* plot) {
    CreateAudioEncoderEnableFecGraph(this->parsed_log_, this->config_, plot);
  });
  plots_.RegisterPlot("audio_encoder_dtx", [this](Plot* plot) {
    CreateAudioEncoderEnableDtxGraph(this->parsed_log_, this->config_, plot);
  });
  plots_.RegisterPlot("audio_encoder_num_channels", [this](Plot* plot) {
    CreateAudioEncoderNumChannelsGraph(this->parsed_log_, this->config_, plot);
  });

  plots_.RegisterPlot("ice_candidate_pair_config", [this](Plot* plot) {
    this->CreateIceCandidatePairConfigGraph(plot);
  });
  plots_.RegisterPlot("ice_connectivity_check", [this](Plot* plot) {
    this->CreateIceConnectivityCheckGraph(plot);
  });
  plots_.RegisterPlot("dtls_transport_state", [this](Plot* plot) {
    this->CreateDtlsTransportStateGraph(plot);
  });
  plots_.RegisterPlot("dtls_writable_state", [this](Plot* plot) {
    this->CreateDtlsWritableStateGraph(plot);
  });
  plots_.RegisterPlot(
      "simulated_neteq_expand_rate", [this](PlotCollection* collection) {
        CreateNetEqNetworkStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqNetworkStatistics& stats) {
              return stats.expand_rate / 16384.f;
            },
            "Expand rate",
            collection->AppendNewPlot("simulated_neteq_expand_rate"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_speech_expand_rate", [this](PlotCollection* collection) {
        CreateNetEqNetworkStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqNetworkStatistics& stats) {
              return stats.speech_expand_rate / 16384.f;
            },
            "Speech expand rate",
            collection->AppendNewPlot("simulated_neteq_speech_expand_rate"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_accelerate_rate", [this](PlotCollection* collection) {
        CreateNetEqNetworkStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqNetworkStatistics& stats) {
              return stats.accelerate_rate / 16384.f;
            },
            "Accelerate rate",
            collection->AppendNewPlot("simulated_neteq_accelerate_rate"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_preemptive_rate", [this](PlotCollection* collection) {
        CreateNetEqNetworkStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqNetworkStatistics& stats) {
              return stats.preemptive_rate / 16384.f;
            },
            "Preemptive rate",
            collection->AppendNewPlot("simulated_neteq_preemptive_rate"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_concealment_events", [this](PlotCollection* collection) {
        CreateNetEqLifetimeStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqLifetimeStatistics& stats) {
              return static_cast<float>(stats.concealment_events);
            },
            "Concealment events",
            collection->AppendNewPlot("simulated_neteq_concealment_events"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_preferred_buffer_size",
      [this](PlotCollection* collection) {
        CreateNetEqNetworkStatsGraph(
            parsed_log_, config_, neteq_simulator_->GetStats(),
            [](const NetEqNetworkStatistics& stats) {
              return stats.preferred_buffer_size_ms;
            },
            "Preferred buffer size (ms)",
            collection->AppendNewPlot("simulated_neteq_preferred_buffer_size"));
      });
  plots_.RegisterPlot(
      "simulated_neteq_jitter_buffer_delay",
      [this](PlotCollection* collection) {
        for (const auto& st : neteq_simulator_->GetStats()) {
          CreateAudioJitterBufferGraph(
              parsed_log_, config_, st.first, st.second.get(),
              collection->AppendNewPlot("simulated_neteq_jitter_buffer_delay"));
        }
      });
}
void EventLogAnalyzer::CreatePlayoutGraph(Plot* plot) const {
  webrtc::CreatePlayoutGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateNetEqSetMinimumDelay(Plot* plot) const {
  webrtc::CreateNetEqSetMinimumDelay(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateAudioLevelGraph(PacketDirection direction,
                                             Plot* plot) const {
  webrtc::CreateAudioLevelGraph(parsed_log_, config_, direction, plot);
}

void EventLogAnalyzer::CreateIncomingDelayGraph(Plot* plot) const {
  webrtc::CreateIncomingDelayGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateFractionLossGraph(Plot* plot) const {
  webrtc::CreateFractionLossGraph(parsed_log_, config_, plot);
}

<<<<<<< HEAD
void EventLogAnalyzer::CreateTotalIncomingBitrateGraph(
    Plot* plot,
    bool include_overhead) const {
  webrtc::CreateTotalIncomingBitrateGraph(parsed_log_, config_, plot,
                                          include_overhead);
=======
// Plot the total bandwidth used by all RTP streams.
void EventLogAnalyzer::CreateTotalIncomingBitrateGraph(Plot* plot) const {
  // TODO(terelius): This could be provided by the parser.
  std::multimap<Timestamp, size_t> packets_in_order;
  for (const auto& stream : parsed_log_.incoming_rtp_packets_by_ssrc()) {
    for (const LoggedRtpPacketIncoming& packet : stream.incoming_packets)
      packets_in_order.insert(
          std::make_pair(packet.rtp.log_time(), packet.rtp.total_length));
  }

  auto window_begin = packets_in_order.begin();
  auto window_end = packets_in_order.begin();
  size_t bytes_in_window = 0;

  if (!packets_in_order.empty()) {
    // Calculate a moving average of the bitrate and store in a TimeSeries.
    TimeSeries bitrate_series("Bitrate", LineStyle::kLine);
    for (Timestamp time = config_.begin_time_;
         time < config_.end_time_ + config_.step_; time += config_.step_) {
      while (window_end != packets_in_order.end() && window_end->first < time) {
        bytes_in_window += window_end->second;
        ++window_end;
      }
      while (window_begin != packets_in_order.end() &&
             window_begin->first < time - config_.window_duration_) {
        RTC_DCHECK_LE(window_begin->second, bytes_in_window);
        bytes_in_window -= window_begin->second;
        ++window_begin;
      }
      float window_duration_in_seconds =
          static_cast<float>(config_.window_duration_.us()) /
          kNumMicrosecsPerSec;
      float x = config_.GetCallTimeSec(time);
      float y = bytes_in_window * 8 / window_duration_in_seconds / 1000;
      bitrate_series.points.emplace_back(x, y);
    }
    plot->AppendTimeSeries(std::move(bitrate_series));
  }

  // Overlay the outgoing REMB over incoming bitrate.
  TimeSeries remb_series("Remb", LineStyle::kStep);
  for (const auto& rtcp : parsed_log_.rembs(kOutgoingPacket)) {
    float x = config_.GetCallTimeSec(rtcp.log_time());
    float y = static_cast<float>(rtcp.remb.bitrate_bps()) / 1000;
    remb_series.points.emplace_back(x, y);
  }
  plot->AppendTimeSeriesIfNotEmpty(std::move(remb_series));

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 1, "Bitrate (kbps)", kBottomMargin, kTopMargin);
  plot->SetTitle("Incoming RTP bitrate");
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

void EventLogAnalyzer::CreateTotalOutgoingBitrateGraph(
    Plot* plot,
    bool show_detector_state,
    bool show_alr_state,
<<<<<<< HEAD
    bool show_link_capacity,
    bool include_overhead) const {
  webrtc::CreateTotalOutgoingBitrateGraph(parsed_log_, config_, plot,
                                          show_detector_state, show_alr_state,
                                          show_link_capacity, include_overhead);
=======
    bool show_link_capacity) const {
  // TODO(terelius): This could be provided by the parser.
  std::multimap<Timestamp, size_t> packets_in_order;
  for (const auto& stream : parsed_log_.outgoing_rtp_packets_by_ssrc()) {
    for (const LoggedRtpPacketOutgoing& packet : stream.outgoing_packets)
      packets_in_order.insert(
          std::make_pair(packet.rtp.log_time(), packet.rtp.total_length));
  }

  auto window_begin = packets_in_order.begin();
  auto window_end = packets_in_order.begin();
  size_t bytes_in_window = 0;

  if (!packets_in_order.empty()) {
    // Calculate a moving average of the bitrate and store in a TimeSeries.
    TimeSeries bitrate_series("Bitrate", LineStyle::kLine);
    for (Timestamp time = config_.begin_time_;
         time < config_.end_time_ + config_.step_; time += config_.step_) {
      while (window_end != packets_in_order.end() && window_end->first < time) {
        bytes_in_window += window_end->second;
        ++window_end;
      }
      while (window_begin != packets_in_order.end() &&
             window_begin->first < time - config_.window_duration_) {
        RTC_DCHECK_LE(window_begin->second, bytes_in_window);
        bytes_in_window -= window_begin->second;
        ++window_begin;
      }
      float window_duration_in_seconds =
          static_cast<float>(config_.window_duration_.us()) /
          kNumMicrosecsPerSec;
      float x = config_.GetCallTimeSec(time);
      float y = bytes_in_window * 8 / window_duration_in_seconds / 1000;
      bitrate_series.points.emplace_back(x, y);
    }
    plot->AppendTimeSeries(std::move(bitrate_series));
  }

  // Overlay the send-side bandwidth estimate over the outgoing bitrate.
  TimeSeries loss_series("Loss-based estimate", LineStyle::kStep);
  for (auto& loss_update : parsed_log_.bwe_loss_updates()) {
    float x = config_.GetCallTimeSec(loss_update.log_time());
    float y = static_cast<float>(loss_update.bitrate_bps) / 1000;
    loss_series.points.emplace_back(x, y);
  }

  TimeSeries link_capacity_lower_series("Link-capacity-lower",
                                        LineStyle::kStep);
  TimeSeries link_capacity_upper_series("Link-capacity-upper",
                                        LineStyle::kStep);
  for (auto& remote_estimate_event : parsed_log_.remote_estimate_events()) {
    float x = config_.GetCallTimeSec(remote_estimate_event.log_time());
    if (remote_estimate_event.link_capacity_lower.has_value()) {
      float link_capacity_lower = static_cast<float>(
          remote_estimate_event.link_capacity_lower.value().kbps());
      link_capacity_lower_series.points.emplace_back(x, link_capacity_lower);
    }
    if (remote_estimate_event.link_capacity_upper.has_value()) {
      float link_capacity_upper = static_cast<float>(
          remote_estimate_event.link_capacity_upper.value().kbps());
      link_capacity_upper_series.points.emplace_back(x, link_capacity_upper);
    }
  }

  TimeSeries delay_series("Delay-based estimate", LineStyle::kStep);
  IntervalSeries overusing_series("Overusing", "#ff8e82",
                                  IntervalSeries::kHorizontal);
  IntervalSeries underusing_series("Underusing", "#5092fc",
                                   IntervalSeries::kHorizontal);
  IntervalSeries normal_series("Normal", "#c4ffc4",
                               IntervalSeries::kHorizontal);
  IntervalSeries* last_series = &normal_series;
  float last_detector_switch = 0.0;

  BandwidthUsage last_detector_state = BandwidthUsage::kBwNormal;

  for (auto& delay_update : parsed_log_.bwe_delay_updates()) {
    float x = config_.GetCallTimeSec(delay_update.log_time());
    float y = static_cast<float>(delay_update.bitrate_bps) / 1000;

    if (last_detector_state != delay_update.detector_state) {
      last_series->intervals.emplace_back(last_detector_switch, x);
      last_detector_state = delay_update.detector_state;
      last_detector_switch = x;

      switch (delay_update.detector_state) {
        case BandwidthUsage::kBwNormal:
          last_series = &normal_series;
          break;
        case BandwidthUsage::kBwUnderusing:
          last_series = &underusing_series;
          break;
        case BandwidthUsage::kBwOverusing:
          last_series = &overusing_series;
          break;
        case BandwidthUsage::kLast:
          RTC_DCHECK_NOTREACHED();
      }
    }

    delay_series.points.emplace_back(x, y);
  }

  RTC_CHECK(last_series);
  last_series->intervals.emplace_back(last_detector_switch,
                                      config_.CallEndTimeSec());

  TimeSeries scream_series("Scream target rate", LineStyle::kStep);
  for (auto& scream_update : parsed_log_.bwe_scream_updates()) {
    float x = config_.GetCallTimeSec(scream_update.log_time());
    float y = static_cast<float>(scream_update.target_rate.kbps());
    scream_series.points.emplace_back(x, y);
  }

  TimeSeries created_series("Probe cluster created.", LineStyle::kNone,
                            PointStyle::kHighlight);
  for (auto& cluster : parsed_log_.bwe_probe_cluster_created_events()) {
    float x = config_.GetCallTimeSec(cluster.log_time());
    float y = static_cast<float>(cluster.bitrate_bps) / 1000;
    created_series.points.emplace_back(x, y);
  }

  TimeSeries result_series("Probing results.", LineStyle::kNone,
                           PointStyle::kHighlight);
  for (auto& result : parsed_log_.bwe_probe_success_events()) {
    float x = config_.GetCallTimeSec(result.log_time());
    float y = static_cast<float>(result.bitrate_bps) / 1000;
    result_series.points.emplace_back(x, y);
  }

  TimeSeries probe_failures_series("Probe failed", LineStyle::kNone,
                                   PointStyle::kHighlight);
  for (auto& failure : parsed_log_.bwe_probe_failure_events()) {
    float x = config_.GetCallTimeSec(failure.log_time());
    probe_failures_series.points.emplace_back(x, 0);
  }

  IntervalSeries alr_state("ALR", "#555555", IntervalSeries::kHorizontal);
  bool previously_in_alr = false;
  Timestamp alr_start = Timestamp::Zero();
  for (auto& alr : parsed_log_.alr_state_events()) {
    float y = config_.GetCallTimeSec(alr.log_time());
    if (!previously_in_alr && alr.in_alr) {
      alr_start = alr.log_time();
      previously_in_alr = true;
    } else if (previously_in_alr && !alr.in_alr) {
      float x = config_.GetCallTimeSec(alr_start);
      alr_state.intervals.emplace_back(x, y);
      previously_in_alr = false;
    }
  }

  if (previously_in_alr) {
    float x = config_.GetCallTimeSec(alr_start);
    float y = config_.GetCallTimeSec(config_.end_time_);
    alr_state.intervals.emplace_back(x, y);
  }

  if (show_detector_state) {
    plot->AppendIntervalSeries(std::move(overusing_series));
    plot->AppendIntervalSeries(std::move(underusing_series));
    plot->AppendIntervalSeries(std::move(normal_series));
  }

  if (show_alr_state) {
    plot->AppendIntervalSeries(std::move(alr_state));
  }

  if (show_link_capacity) {
    plot->AppendTimeSeriesIfNotEmpty(std::move(link_capacity_lower_series));
    plot->AppendTimeSeriesIfNotEmpty(std::move(link_capacity_upper_series));
  }

  plot->AppendTimeSeries(std::move(loss_series));
  plot->AppendTimeSeriesIfNotEmpty(std::move(probe_failures_series));
  plot->AppendTimeSeries(std::move(delay_series));
  plot->AppendTimeSeriesIfNotEmpty(std::move(scream_series));
  plot->AppendTimeSeries(std::move(created_series));
  plot->AppendTimeSeries(std::move(result_series));

  // Overlay the incoming REMB over the outgoing bitrate.
  TimeSeries remb_series("Remb", LineStyle::kStep);
  for (const auto& rtcp : parsed_log_.rembs(kIncomingPacket)) {
    float x = config_.GetCallTimeSec(rtcp.log_time());
    float y = static_cast<float>(rtcp.remb.bitrate_bps()) / 1000;
    remb_series.points.emplace_back(x, y);
  }
  plot->AppendTimeSeriesIfNotEmpty(std::move(remb_series));

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 1, "Bitrate (kbps)", kBottomMargin, kTopMargin);
  plot->SetTitle("Outgoing RTP bitrate");
}

// For each SSRC, plot the bandwidth used by that stream.
void EventLogAnalyzer::CreateStreamBitrateGraph(PacketDirection direction,
                                                Plot* plot) const {
  for (const auto& stream : parsed_log_.rtp_packets_by_ssrc(direction)) {
    // Filter on SSRC.
    if (!MatchingSsrc(stream.ssrc, desired_ssrc_)) {
      continue;
    }

    TimeSeries time_series(GetStreamName(parsed_log_, direction, stream.ssrc),
                           LineStyle::kLine);
    auto GetPacketSizeKilobits = [](const LoggedRtpPacket& packet) {
      return packet.total_length * 8.0 / 1000.0;
    };
    MovingAverage<LoggedRtpPacket, double>(
        GetPacketSizeKilobits, stream.packet_view, config_, &time_series);
    plot->AppendTimeSeries(std::move(time_series));
  }

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 1, "Bitrate (kbps)", kBottomMargin, kTopMargin);
  plot->SetTitle(GetDirectionAsString(direction) + " bitrate per stream");
}

// Plot the bitrate allocation for each temporal and spatial layer.
// Computed from RTCP XR target bitrate block, so the graph is only populated if
// those are sent.
void EventLogAnalyzer::CreateBitrateAllocationGraph(PacketDirection direction,
                                                    Plot* plot) const {
  std::map<LayerDescription, TimeSeries> time_series;
  const auto& xr_list = parsed_log_.extended_reports(direction);
  for (const auto& rtcp : xr_list) {
    const std::optional<rtcp::TargetBitrate>& target_bitrate =
        rtcp.xr.target_bitrate();
    if (!target_bitrate.has_value())
      continue;
    for (const auto& bitrate_item : target_bitrate->GetTargetBitrates()) {
      LayerDescription layer(rtcp.xr.sender_ssrc(), bitrate_item.spatial_layer,
                             bitrate_item.temporal_layer);
      auto time_series_it = time_series.find(layer);
      if (time_series_it == time_series.end()) {
        std::string layer_name = GetLayerName(layer);
        bool inserted;
        std::tie(time_series_it, inserted) = time_series.insert(
            std::make_pair(layer, TimeSeries(layer_name, LineStyle::kStep)));
        RTC_DCHECK(inserted);
      }
      float x = config_.GetCallTimeSec(rtcp.log_time());
      float y = bitrate_item.target_bitrate_kbps;
      time_series_it->second.points.emplace_back(x, y);
    }
  }
  for (auto& layer : time_series) {
    plot->AppendTimeSeries(std::move(layer.second));
  }
  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 1, "Bitrate (kbps)", kBottomMargin, kTopMargin);
  if (direction == kIncomingPacket)
    plot->SetTitle("Target bitrate per incoming layer");
  else
    plot->SetTitle("Target bitrate per outgoing layer");
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

void EventLogAnalyzer::CreateGoogCcSimulationGraph(Plot* plot) const {
  webrtc::CreateGoogCcSimulationGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateScreamSimulationDelayGraph(Plot* plot) const {
  webrtc::CreateScreamSimulationDelayGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateScreamSimulationBitrateGraph(Plot* plot) const {
  webrtc::CreateScreamSimulationBitrateGraph(parsed_log_, config_, plot);
}

<<<<<<< HEAD
void EventLogAnalyzer::CreateScreamSimulationRefWindowGraph(Plot* plot) const {
  webrtc::CreateScreamSimulationRefWindowGraph(parsed_log_, config_, plot);
=======
void EventLogAnalyzer::CreateScreamRefWindowGraph(Plot* plot) const {
  TimeSeries ref_window_series("RefWindow", LineStyle::kStep);
  for (auto& scream_update : parsed_log_.bwe_scream_updates()) {
    float x = config_.GetCallTimeSec(scream_update.log_time());
    float y = static_cast<float>(scream_update.ref_window.bytes());
    ref_window_series.points.emplace_back(x, y);
  }
  plot->AppendTimeSeries(std::move(ref_window_series));

  TimeSeries data_in_flight_series("Data in flight", LineStyle::kLine);
  for (auto& scream_update : parsed_log_.bwe_scream_updates()) {
    float x = config_.GetCallTimeSec(scream_update.log_time());
    float y = static_cast<float>(scream_update.data_in_flight.bytes());
    data_in_flight_series.points.emplace_back(x, y);
  }
  plot->AppendTimeSeries(std::move(data_in_flight_series));

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 3000, "Bytes", kBottomMargin, kTopMargin);
  plot->SetTitle("Scream Ref Window");
}

void EventLogAnalyzer::CreateScreamDelayEstimateGraph(Plot* plot) const {
  TimeSeries smoothed_rtt_series("Smoothed RTT", LineStyle::kStep);
  TimeSeries avg_queue_delay_series("Avg queue delay", LineStyle::kStep);

  for (auto& scream_update : parsed_log_.bwe_scream_updates()) {
    float x = config_.GetCallTimeSec(scream_update.log_time());
    float smoothed_rtt_ms = static_cast<float>(scream_update.smoothed_rtt.ms());
    smoothed_rtt_series.points.emplace_back(x, smoothed_rtt_ms);
    float avg_queue_delay_ms =
        static_cast<float>(scream_update.avg_queue_delay.ms());
    avg_queue_delay_series.points.emplace_back(x, avg_queue_delay_ms);
  }

  plot->AppendTimeSeries(std::move(smoothed_rtt_series));
  plot->AppendTimeSeries(std::move(avg_queue_delay_series));

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 50, "Delay (ms)", kBottomMargin, kTopMargin);
  plot->SetTitle("Scream delay estimates");
}

void EventLogAnalyzer::CreateEcnFeedbackGraph(Plot* plot,
                                              PacketDirection direction) const {
  TimeSeries not_ect("Not ECN capable", LineStyle::kBar,
                     PointStyle::kHighlight);
  TimeSeries ect_1("ECN capable", LineStyle::kBar, PointStyle::kHighlight);
  TimeSeries ce("Congestion experienced", LineStyle::kBar,
                PointStyle::kHighlight);

  for (const LoggedRtcpCongestionControlFeedback& feedback :
       parsed_log_.congestion_feedback(direction)) {
    int ect_1_count = 0;
    int not_ect_count = 0;
    int ce_count = 0;

    for (const rtcp::CongestionControlFeedback::PacketInfo& info :
         feedback.congestion_feedback.packets()) {
      switch (info.ecn) {
        case EcnMarking::kNotEct:
          ++not_ect_count;
          break;
        case EcnMarking::kEct1:
          ++ect_1_count;
          break;
        case EcnMarking::kEct0:
          RTC_LOG(LS_ERROR) << "unexpected ect(0)";
          break;
        case EcnMarking::kCe:
          ++ce_count;
          break;
      }
    }
    ect_1.points.emplace_back(config_.GetCallTimeSec(feedback.timestamp),
                              ect_1_count);
    not_ect.points.emplace_back(config_.GetCallTimeSec(feedback.timestamp),
                                not_ect_count);
    ce.points.emplace_back(config_.GetCallTimeSec(feedback.timestamp),
                           ce_count);
  }

  plot->AppendTimeSeriesIfNotEmpty(std::move(ect_1));
  plot->AppendTimeSeriesIfNotEmpty(std::move(not_ect));
  plot->AppendTimeSeriesIfNotEmpty(std::move(ce));

  plot->SetXAxis(config_.CallBeginTimeSec(), config_.CallEndTimeSec(),
                 "Time (s)", kLeftMargin, kRightMargin);
  plot->SetSuggestedYAxis(0, 10, "Count per feedback", kBottomMargin,
                          kTopMargin);
>>>>>>> parent of ef1b4419c4a (CONFLICTED Chromium Cherry pick: Revert Cobalt.)
}

void EventLogAnalyzer::CreateScreamSimulationRatiosGraph(Plot* plot) const {
  webrtc::CreateScreamSimulationRatiosGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateScreamSimulationFeedbackEventsPerRttGraph(
    Plot* plot) const {
  webrtc::CreateScreamSimulationFeedbackEventsPerRttGraph(parsed_log_, config_,
                                                          plot);
}

void EventLogAnalyzer::CreateScreamRefWindowGraph(Plot* plot) const {
  webrtc::CreateScreamRefWindowGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateScreamDelayEstimateGraph(Plot* plot) const {
  webrtc::CreateScreamDelayEstimateGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateSendSideBweSimulationGraph(Plot* plot) const {
  webrtc::CreateSendSideBweSimulationGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateReceiveSideBweSimulationGraph(Plot* plot) const {
  webrtc::CreateReceiveSideBweSimulationGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateNetworkDelayFeedbackGraph(Plot* plot) const {
  webrtc::CreateNetworkDelayFeedbackGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreatePacerDelayGraph(Plot* plot) const {
  webrtc::CreatePacerDelayGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateIceCandidatePairConfigGraph(Plot* plot) const {
  webrtc::CreateIceCandidatePairConfigGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateIceConnectivityCheckGraph(Plot* plot) const {
  webrtc::CreateIceConnectivityCheckGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateDtlsTransportStateGraph(Plot* plot) const {
  webrtc::CreateDtlsTransportStateGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateDtlsWritableStateGraph(Plot* plot) const {
  webrtc::CreateDtlsWritableStateGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreatePacketGraph(PacketDirection direction,
                                         Plot* plot) const {
  webrtc::CreatePacketGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateRtcpTypeGraph(PacketDirection direction,
                                           Plot* plot) const {
  webrtc::CreateRtcpTypeGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateAccumulatedPacketsGraph(PacketDirection direction,
                                                     Plot* plot) const {
  webrtc::CreateAccumulatedPacketsGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreatePacketRateGraph(PacketDirection direction,
                                             Plot* plot) const {
  webrtc::CreatePacketRateGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateTotalPacketRateGraph(PacketDirection direction,
                                                  Plot* plot) const {
  webrtc::CreateTotalPacketRateGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateSequenceNumberGraph(Plot* plot) const {
  webrtc::CreateSequenceNumberGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateIncomingPacketLossGraph(Plot* plot) const {
  webrtc::CreateIncomingPacketLossGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateStreamBitrateGraph(PacketDirection direction,
                                                Plot* plot) const {
  webrtc::CreateStreamBitrateGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateBitrateAllocationGraph(PacketDirection direction,
                                                    Plot* plot) const {
  webrtc::CreateBitrateAllocationGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateOutgoingEcnFeedbackGraph(Plot* plot) const {
  webrtc::CreateOutgoingEcnFeedbackGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateIncomingEcnFeedbackGraph(Plot* plot) const {
  webrtc::CreateIncomingEcnFeedbackGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateOutgoingLossRateGraph(Plot* plot) const {
  webrtc::CreateOutgoingLossRateGraph(parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateTimestampGraph(PacketDirection direction,
                                            Plot* plot) const {
  webrtc::CreateTimestampGraph(direction, parsed_log_, config_, plot);
}

void EventLogAnalyzer::CreateSenderAndReceiverReportPlot(
    PacketDirection direction,
    FunctionView<float(const rtcp::ReportBlock&)> fy,
    std::string title,
    std::string yaxis_label,
    Plot* plot) const {
  webrtc::CreateSenderAndReceiverReportPlot(direction, fy, title, yaxis_label,
                                            parsed_log_, config_, plot);
}

}  // namespace webrtc
