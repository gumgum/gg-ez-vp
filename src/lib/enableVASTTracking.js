import { VASTTracker } from 'vast-client';

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
    pause: tracker => () => tracker.setPaused(true),
    skip: tracker => () => tracker.skip(),
    play: tracker => () => tracker.setPaused(false),
    expand: tracker => isFullscreen => tracker.setFullscreen(isFullscreen),
    volumechange: tracker => e => tracker.setMuted(e.target.muted || !e.target.volume),
    timeupdate: tracker => e => tracker.setProgress(e.target.currentTime),
    loadedmetadata: tracker => e => tracker.setDuration(e.target.duration)
};
