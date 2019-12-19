import { VASTTracker } from 'vast-client';
import loadVPAID from '../helpers/loadVPAID';
import isVPAIDVersionSupported from '../helpers/isVPAIDVersionSupported';
import VPAIDWrapper from '../lib/VPAIDWrapper';
import { DATA_READY, SUPPORTED_VPAID_VERSION, VPAID_STARTED, RESIZE } from '../constants';

export default async function runVPAID(creative, VPAIDSource, vastClient, ad) {
    const vastTracker = new VASTTracker(vastClient, ad, creative);
    const { adParameters } = creative;
    const { VPAIDCreative, iframe } = await loadVPAID(VPAIDSource.fileURL, this.playerContainer);
    const VPAIDCreativeVersion = VPAIDCreative.handshakeVersion(SUPPORTED_VPAID_VERSION);
    const canSupportVPAID = isVPAIDVersionSupported(VPAIDCreativeVersion);
    const { offsetWidth: width, offsetHeight: height } = this.playerContainer;
    const originalDimensions = { width, height };
    if (canSupportVPAID) {
        this.VPAIDiframe = iframe;
        this.VPAIDWrapper = new VPAIDWrapper({
            VPAIDCreative,
            emitter: this.emitter,
            dimensions: originalDimensions,
            creativeVersion: VPAIDCreativeVersion,
            VASTTracker: vastTracker
        });
        // Finish setup after VPAID is ready
        this.once(DATA_READY, () => {
            this.dataReady = true;
            this.__attachStoredListeners();
            this.__configureVPAID();
            this.__setReadyNextTick();
        });
        this.once(VPAID_STARTED, () => {
            this.VPAIDStarted = true;
        });
        // Add a resize listener for the VPAID iframe (GH-48)
        this.__nodeOn(this.VPAIDiframe.contentWindow, RESIZE, () => {
            const { innerHeight: height, innerWidth: width } = this.VPAIDiframe.contentWindow;
            this.VPAIDWrapper.resizeAd(width, height, 'normal');
        });
        this.__mountVideoElement();
        this.__renderControls();
        this.__initVPAIDAd({ adParameters });
    }
}
