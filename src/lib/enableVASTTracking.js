import { VASTTracker } from 'vast-client';
//TODO: pending event controls skip, expandButton

export default function enableVASTTracking(vastClient, ad, creative) {
    const vastTracker = new VASTTracker(vastClient, ad, creative);
    setVASTTracking(vastTracker, this.on);
    this.dataReady = true;
    this.VASTTracker = vastTracker;
    this.__attachStoredListeners();
    this.__renderVideoElement();
}

function setVASTTracking(vastTracker, on) {
    Object.keys(VASTEventListeners).forEach(eventName => {
        const listener = VASTEventListeners[eventName](vastTracker);
        on(eventName, listener);
    });
    window.onbeforeunload = () => vastTracker.close();
}

// Tracking methods from:
// https://github.com/dailymotion/vast-client-js/blob/master/docs/api/vast-tracker.md#public-methods--
const VASTEventListeners = {
    canplay: tracker => () => tracker.trackImpression(),
    click: tracker => () => tracker.click(),
    ended: tracker => () => tracker.complete(),
    error: tracker => () => tracker.errorWithCode(405),
    fullscreenchange: tracker => () => {
        const isFullscreen = !!document.fullscreenElement;
        tracker.setFullscreen(isFullscreen);
    },
    pause: tracker => () => tracker.setPaused(true),
    play: tracker => () => tracker.setPaused(false),
    volumechange: tracker => e => tracker.setMuted(e.target.muted),
    timeupdate: tracker => e => tracker.setProgress(e.target.currentTime)
};
