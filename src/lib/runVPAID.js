import { VASTTracker } from 'vast-client';
import loadVPAID from '../helpers/loadVPAID';
import createNode from '../helpers/createNode';
import isVPAIDVersionSupported from '../helpers/isVPAIDVersionSupported';
import VPAIDWrapper from '../lib/VPAIDWrapper';
import { DATA_READY, SUPPORTED_VPAID_VERSION, RESIZE, VPAID_STARTED } from '../constants';
const viewMode = 'normal';
let originalDimensions;

export default async function runVPAID(creative, VPAIDSource, vastClient, ad) {
    const vastTracker = new VASTTracker(vastClient, ad, creative);
    const { adParameters } = creative;
    // Listeners dependent on VPAIDWrapper must be defined BEFORE loading it,
    // in case the script is already in cache
    attachVPAIDListeners.call(this);
    const { VPAIDCreative, iframe } = await loadVPAID(VPAIDSource.fileURL, this.playerContainer);
    const VPAIDCreativeVersion = VPAIDCreative.handshakeVersion(SUPPORTED_VPAID_VERSION);
    const canSupportVPAID = isVPAIDVersionSupported(VPAIDCreativeVersion);
    const { offsetWidth: width, offsetHeight: height } = this.container;
    originalDimensions = { width, height };
    addVPAIDOverlays.call(this);
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

// Include a div for the VPAID slot (clicks go here)
// And a div that can be used to prevent clicks on the VPAID through CSS pointer-events: none
function addVPAIDOverlays() {
    const slot = createNode('div', this.__getCSSClass('slot'));
    this.playerContainer.appendChild(slot);
    const blocker = createNode('div', this.__getCSSClass('blocker'));
    this.container.appendChild(blocker);
    this.__slot = slot;
    this.__blocker = blocker;
}

// Attach listeners dependent on VPAID Wrapper
function attachVPAIDListeners() {
    // Finish setup after VPAID is ready
    this.once(DATA_READY, () => {
        const { offsetWidth, offsetHeight } = this.container;
        if (
            offsetWidth !== originalDimensions.width ||
            offsetHeight !== originalDimensions.height
        ) {
            this.VPAIDWrapper.resizeAd(offsetWidth, offsetHeight, viewMode);
        }
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
    this.on('AdSizeChange', () => {
        // Force the VPAID to cover the whole container
        // This might not be the best thing to do
        this.player.style.width = '100%';
        this.player.style.height = '100%';
    });
}

function initVPAIDAd({ adParameters }) {
    const { clientWidth: width, clientHeight: height } = this.container;
    const creativeData = { AdParameters: adParameters };

    const environmentVars = {
        slot: this.__slot,
        videoSlot: this.player,
        videoSlotCanAutoplay: true
    };
    const initAdParameters = [
        width,
        height,
        viewMode,
        undefined, //desiredBitrate,
        creativeData,
        environmentVars
    ];
    this.VPAIDWrapper.initAd(...initAdParameters);
}
