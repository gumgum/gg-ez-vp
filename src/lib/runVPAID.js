import { VASTTracker } from 'vast-client';
import loadVPAID from '../helpers/loadVPAID';
import isVPAIDVersionSupported from '../helpers/isVPAIDVersionSupported';
import VPAIDWrapper from '../lib/VPAIDWrapper';
import { DATA_READY, SUPPORTED_VPAID_VERSION, VPAID_STARTED } from '../constants';

export default async function runVPAID(creative, VPAIDSource, vastClient, ad) {
    const vastTracker = new VASTTracker(vastClient, ad, creative);
    const { adParameters } = creative;
    // Listeners dependent on VPAIDWrapper must be defined BEFORE loading it,
    // in case the script is already in cache
    attachVPAIDListeners.call(this);
    const { VPAIDCreative, iframe } = await loadVPAID(VPAIDSource.fileURL, this.playerContainer);
    const VPAIDCreativeVersion = VPAIDCreative.handshakeVersion(SUPPORTED_VPAID_VERSION);
    const canSupportVPAID = isVPAIDVersionSupported(VPAIDCreativeVersion);
    const { clientWidth: width, clientHeight: height } = this.playerContainer;
    const originalDimensions = { width, height };
    this.VASTTracker = vastTracker;
    if (canSupportVPAID) {
        this.VPAIDiframe = iframe;
        this.VPAIDWrapper = new VPAIDWrapper({
            VPAIDCreative,
            emitter: this.emitter,
            dimensions: originalDimensions,
            creativeVersion: VPAIDCreativeVersion,
            VASTTracker: vastTracker
        });
        this.__mountVideoElement();
        this.__renderControls();
        this.__initVPAIDAd({ adParameters });
    }
}

// Attach listeners dependent on VPAID Wrapper
function attachVPAIDListeners() {
    // Finish setup after VPAID is ready
    this.once(DATA_READY, () => {
        this.dataReady = true;
        this.__attachStoredListeners();
        this.__configureVPAID();
        this.__setReadyNextTick();
    });
    this.once('AdSizeChange', dimensions => {
        this.dimensions = dimensions;
    });
    this.once(VPAID_STARTED, () => {
        this.VPAIDStarted = true;
        this.VPAIDFinished = false;
    });
    this.once('AdVideoComplete', () => {
        // Reset all flags
        this.VPAIDStarted = false;
        this.VPAIDFinished = true;
        this.dataReady = false;
        this.VPAIDWrapper = null;
        this.VASTData = null;
    });
}
