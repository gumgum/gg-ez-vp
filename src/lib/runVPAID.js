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
    const { clientWidth: width, clientHeight: height } = this.container;
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
        initVPAIDAd.call(this, { adParameters });
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
        // Force the VPAID to cover the whole container
        // This might not be the best thing to do tho
        this.player.style.width = '100%';
        this.player.style.height = '100%';
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

let desiredBitrate;

//const getViewMode = width => (width < 360 ? 'thumbnail' : 'normal');
const viewMode = 'normal';

function initVPAIDAd({ adParameters }) {
    const { clientWidth: width, clientHeight: height } = this.container;
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
