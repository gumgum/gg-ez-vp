export default function setCallbacksForCreative() {
    // The key of the object is the event name and the value is a
    // reference to the callback function that is registered with the creative
    const callbacks = {
        AdStarted: this.onStartAd,
        AdStopped: this.onStopAd,
        AdSkipped: this.onSkipAd,
        AdLoaded: this.onAdLoaded,
        AdLinearChange: this.onAdLinearChange,
        AdSizeChange: this.onAdSizeChange,
        AdExpandedChange: this.onAdExpandedChange,
        AdSkippableStateChange: this.onAdSkippableStateChange,
        AdDurationChange: this.onAdDurationChange,
        AdRemainingTimeChange: this.onAdRemainingTimeChange,
        AdVolumeChange: this.onAdVolumeChange,
        AdImpression: this.onAdImpression,
        AdClickThru: this.onAdClickThru,
        AdInteraction: this.onAdInteraction,
        AdVideoStart: this.onAdVideoStart,
        AdVideoFirstQuartile: this.onAdVideoFirstQuartile,
        AdVideoMidpoint: this.onAdVideoMidpoint,
        AdVideoThirdQuartile: this.onAdVideoThirdQuartile,
        AdVideoComplete: this.onAdVideoComplete,
        AdUserAcceptInvitation: this.onAdUserAcceptInvitation,
        AdUserMinimize: this.onAdUserMinimize,
        AdUserClose: this.onAdUserClose,
        AdPaused: this.onAdPaused,
        AdPlaying: this.onAdPlaying,
        AdError: this.onAdError,
        AdLog: this.onAdLog
    };
    // Looping through the object and registering each of the callbacks with the creative
    for (let eventName in callbacks) {
        const callback = callbacks[eventName];
        this._creative.subscribe(callback, eventName, this);
    }
}
