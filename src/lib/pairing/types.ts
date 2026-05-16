export interface LivePeerConnection {
  peerId: string
  roomCode: string
  peerFingerprint: string
  send: (text: string) => void
  close: () => void
  attachMessageHandler: (handler: (text: string) => void) => void
}
