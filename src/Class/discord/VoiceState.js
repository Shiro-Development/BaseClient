class VoiceState {
  constructor (client, voiceState) {
    this.client = client
    this.id = voiceState.id
    this.guildID = voiceState.guild_id
    this.channelID = voiceState.channel_id
    this.sessionID = voiceState.session_id
    this.deaf = voiceState.deaf
    this.mute = voiceState.mute
    this.selfDeaf = voiceState.self_deaf
    this.selfMute = voiceState.self_mute
    this.selfStream = voiceState.self_stream
    this.selfVideo = voiceState.self_video
    this.suppress = voiceState.suppress
    this.requestToTalkTime = voiceState.request_to_speak_timestamp
  }
}

module.exports = VoiceState
