import checkVPAIDInterface from '../helpers/checkVPAIDInterface';
import secondsToReadableTime from '../helpers/secondsToReadableTime';
import setCallbacksForCreative from './setCallbacksForCreative';
import {
    DATA_READY,
    ERROR,
    PLAYBACK_PROGRESS,
    PLAYER_CLICK,
    VPAID_STARTED,
    SKIP,
    EXPAND
} from '../constants';

export default class VPAIDWrapper {
    constructor({
        VPAIDCreative,
        emitter,
        dimensions: { width: containerWidth, height: containerHeight },
        creativeVersion,
        VASTTracker
    }) {
        this._creative = VPAIDCreative;
        this.emitter = emitter;
        const isValidVPAID = this.__checkVPAIDInterface(VPAIDCreative);
        if (!isValidVPAID) {
            /* eslint-disable-next-line no-console */
            console.log("GgEzVp [WARN]: The VPAIDCreative doesn't conform to the VPAID spec");
            VASTTracker.error({ ERRORCODE: 901 });
            return;
        }
        this.VASTTracker = VASTTracker;
        this.__setCallbacksForCreative();
        this.emitter.on(SKIP, this.skipAd);
        this.emitter.on(EXPAND, isExpanded => {
            const expandAdArgs = isExpanded
                ? [window.screen.width, window.screen.height, 'fullscreen']
                : [containerWidth, containerHeight, 'thumbnail'];
            if (parseFloat(creativeVersion) < 2) {
                return this.stopAd();
            }
            this.expandAd(...expandAdArgs);
        });
        // listen for window closing to send close events
        window.onbeforeunload = () => {
            VASTTracker.close();
        };
    }

    __checkVPAIDInterface = checkVPAIDInterface;

    __setCallbacksForCreative = setCallbacksForCreative;

    initAd = (width, height, viewMode, desiredBitrate, creativeData, environmentVars) => {
        this._creative?.initAd(
            width,
            height,
            viewMode,
            desiredBitrate,
            creativeData,
            environmentVars
        );
        this.setAdVolume(0);
    };

    /* Wrapper methods */

    // Pass through for startAd
    startAd() {
        this.emitter.emit(VPAID_STARTED);
        this._creative?.startAd();
    }

    // Pass through for stopAd
    stopAd() {
        this._creative?.stopAd();
    }

    // Pass through for getAdLinear
    getAdLinear() {
        return this._creative?.getAdLinear();
    }

    // Pass through for getAdRemainingTime
    getAdRemainingTime() {
        return this._creative?.getAdRemainingTime();
    }

    // Pass through for getAdExpanded
    getAdExpanded() {
        return this._creative?.getAdExpanded();
    }

    // Pass through for getAdSkippableState
    getAdSkippableState() {
        return this._creative?.getAdSkippableState();
    }

    skipAd() {
        if (this.getAdSkippableState()) {
            return this._creative?.skipAd();
        }
    }

    // Pass through for setAdVolume
    setAdVolume(val) {
        this._creative?.setAdVolume(val);
    }

    // Pass through for getAdVolume
    getAdVolume() {
        return this._creative?.getAdVolume();
    }

    // Pass through for getAdDuration
    getAdDuration() {
        return this._creative?.getAdDuration();
    }

    // Pass through for resizeAd
    resizeAd(width, height, viewMode) {
        this._creative?.resizeAd(width, height, viewMode);
    }

    // Pass through for pauseAd
    pauseAd() {
        this._creative?.pauseAd();
    }

    // Pass through for pauseAd
    resumeAd() {
        this._creative?.resumeAd();
    }

    // Pass through for expandAd
    expandAd() {
        this._creative?.expandAd();
    }

    // Pass through for collapseAd
    collapseAd() {
        this._creative?.collapseAd();
    }

    /* VPAID listeners */

    // Callback for AdPaused
    onAdPaused() {
        this.emitter.emit('AdPaused');
        this.emitter.emit('pause');
        this.VASTTracker.setPaused(true);
    }

    // Callback for AdPlaying
    onAdPlaying() {
        this.emitter.emit('AdPlaying');
        this.emitter.emit('play');
        this.VASTTracker.setPaused(false);
    }

    // Callback for AdError
    onAdError(message) {
        this.emitter.emit('AdError', message);
        this.emitter.emit(ERROR, message);
        this.VASTTracker.error({ ERRORCODE: 901 });
    }

    // Callback for AdLog
    onAdLog(message) {
        this.emitter.emit('AdLog', message);
    }

    // Callback for AdUserAcceptInvitation
    onAdUserAcceptInvitation() {
        this.emitter.emit('AdUserAcceptInvitation');
    }

    // Callback for AdUserMinimize
    onAdUserMinimize() {
        this.emitter.emit('AdUserMinimize');
    }

    // Callback for AdUserClose
    onAdUserClose() {
        this.emitter.emit('AdUserClose');
        this.VASTTracker.close();
    }

    // Callback for AdSkippableStateChange
    onAdSkippableStateChange() {
        const adSkippableState = this._creative?.getAdSkippableState();
        this.emitter.emit('AdSkippableStateChange', adSkippableState);
    }

    // Callback for AdExpandedChange
    onAdExpandedChange() {
        const adExpanded = this._creative?.getAdExpanded();
        this.emitter.emit('AdExpandedChange', adExpanded);
        this.VASTTracker.setFullscreen(adExpanded);
    }

    // Callback for AdSizeChange
    onAdSizeChange() {
        const width = this._creative?.getAdWidth();
        const height = this._creative?.getAdHeight();
        this.emitter.emit('AdSizeChange', { width, height });
    }

    // Callback for AdDurationChange
    onAdDurationChange() {
        const duration = this._creative?.getAdDuration();
        this.duration = duration;
        this.emitter.emit('AdDurationChange', duration);
        this.checkProgress();
        this.VASTTracker.setDuration(duration);
    }

    // Callback for AdRemainingTimeChange
    // the AdRemainingTimeChange event is NOT re-emitted, USE PLAYBACK_PROGRESS instead
    onAdRemainingTimeChange() {
        this.checkProgress();
    }

    // Checks the currentTime, sets it on the VASTTracker/VPAIDWrapper, then
    // emits: PLAYBACK_PROGRESS
    // { remainingTime, readableTime, duration, currentTime }
    // Should be called on AdRemainingTimeChange, AdDurationChange, 25%, 50% and 75%
    checkProgress = () => {
        const remainingTime = this._creative?.getAdRemainingTime();
        const duration = this._creative?.getAdDuration();
        const currentTime = duration - remainingTime;
        const fancyDuration = secondsToReadableTime(duration);
        const fancyCurrentTime = secondsToReadableTime(currentTime);
        const payload = {
            remainingTime,
            fancyCurrentTime,
            fancyDuration,
            duration,
            currentTime
        };
        this.currentTime = currentTime;
        this.emitter.emit(PLAYBACK_PROGRESS, payload);
        this.VASTTracker.setProgress(currentTime);
    };

    // Callback for AdImpression
    onAdImpression() {
        this.emitter.emit('AdImpression');
        this.VASTTracker.trackImpression();
    }

    // Callback for AdClickThru
    onAdClickThru(url, id, playerHandles) {
        this.VASTTracker.once('clickthrough', VASTClickURL => {
            // click priority:
            // 1- VPAID
            // 2- VAST
            // 3- fallback passed to VASTTracker.click(url)
            const clickUrl = url || VASTClickURL;
            const payload = { url: clickUrl, id, playerHandles };
            this.emitter.emit(PLAYER_CLICK, payload);
            if (playerHandles) {
                window.open(clickUrl);
            }
        });
        // url is used as a fallback if not provided by the VAST tag
        this.VASTTracker.click(url);
    }

    // Callback for AdInteraction
    onAdInteraction(id) {
        this.emitter.emit('AdInteraction', id);
    }

    // Callback for AdVideoStart
    onAdVideoStart() {
        // Video 0% completed
        this.emitter.emit('play');
        this.emitter.emit('AdVideoStart');
    }

    // Callback for AdVideoFirstQuartile
    onAdVideoFirstQuartile() {
        // Video 25% completed
        this.emitter.emit('AdVideoFirstQuartile');
        this.checkProgress();
    }

    // Callback for AdVideoMidpoint
    onAdVideoMidpoint() {
        // Video 50% completed
        this.emitter.emit('AdVideoMidpoint');
        this.checkProgress();
    }

    // Callback for AdVideoThirdQuartile
    onAdVideoThirdQuartile() {
        // Video 75% completed
        this.emitter.emit('AdVideoThirdQuartile');
        this.checkProgress();
    }

    // Callback for AdVideoComplete
    onAdVideoComplete() {
        // Video 100% completed
        this.emitter.emit('AdVideoComplete');
        this.checkProgress();
        this.VASTTracker.complete();
    }

    // Callback for AdLinearChange
    onAdLinearChange() {
        const adLinear = this._creative?.getAdLinear();
        this.emitter.emit('AdLinearChange', adLinear);
    }

    // Callback for AdLoaded
    onAdLoaded() {
        this.emitter.emit('AdLoaded');
        this.emitter.emit(DATA_READY);
    }

    // Callback for startAd
    onStartAd() {
        this.emitter.emit('AdStarted');
    }

    // Callback for stopAd
    onStopAd() {
        this.emitter.emit('ended');
        this.emitter.emit('AdStopped');
    }

    // Callback for skipAd
    onSkipAd() {
        this.emitter.emit('AdSkipped');
        this.VASTTracker.skip();
    }

    // Callback for AdVolumeChange
    onAdVolumeChange() {
        const volume = this._creative?.getAdVolume();
        const isMuted = volume == 0;
        this.emitter.emit('AdVolumeChange', volume);
        this.VASTTracker.setMuted(isMuted);
    }
}
