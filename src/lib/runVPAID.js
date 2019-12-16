import { VASTTracker } from 'vast-client';
import loadVPAID from '../helpers/loadVPAID';
import isVPAIDVersionSupported from '../helpers/isVPAIDVersionSupported';
import VPAIDWrapper from '../lib/VPAIDWrapper';
import { DATA_READY, SUPPORTED_VPAID_VERSION, VPAID_STARTED } from '../constants';

export default async function runVPAID(creative, VPAIDSource, vastClient, ad) {
    const vastTracker = new VASTTracker(vastClient, ad, creative);
    const { adParameters } = creative;
    const VPAIDCreative = await loadVPAID(VPAIDSource.fileURL, this.container);
    const VPAIDCreativeVersion = VPAIDCreative.handshakeVersion(SUPPORTED_VPAID_VERSION);
    const canSupportVPAID = isVPAIDVersionSupported(VPAIDCreativeVersion);
    const { offsetWidth: width, offsetHeight: height } = this.container;
    const originalDimensions = { width, height };
    if (canSupportVPAID) {
        this.VPAIDWrapper = new VPAIDWrapper({
            VPAIDCreative,
            emitter: this.emitter,
            dimensions: originalDimensions,
            creativeVersion: VPAIDCreativeVersion,
            VASTTracker: vastTracker
        });
        this.once(DATA_READY, () => {
            this.dataReady = true;
            this.__attachStoredListeners();
            this.__configureVPAID();
            this.__setReadyNextTick();
        });
        this.once(VPAID_STARTED, () => {
            this.VPAIDStarted = true;
        });
        this.__mountVideoElement();
        this.__initVPAIDAd({ adParameters });
    }
}
