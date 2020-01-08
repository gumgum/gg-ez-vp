const viewMode = 'normal';
const desiredBitrate = undefined;
export default function initVPAIDAd({ adParameters }) {
    const { offsetWidth: width, offsetHeight: height } = this.container;
    const creativeData = { AdParameters: adParameters };

    const environmentVars = {
        slot: this.playerContainer,
        videoSlot: this.player,
        videoSlotCanAutoplay: true
    };
    const initAdParameters = [
        width,
        height,
        viewMode,
        desiredBitrate,
        creativeData,
        environmentVars
    ];
    this.VPAIDWrapper.initAd(...initAdParameters);
}
