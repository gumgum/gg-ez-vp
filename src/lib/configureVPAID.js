export default function configureVPAID() {
    const {
        config: { muted, volume },
        emitter,
        VPAIDWrapper
    } = this;
    const initialVolume = muted ? 0 : volume;
    VPAIDWrapper.setAdVolume(initialVolume);
}
