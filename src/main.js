// external modules
import NanoEvents from 'nanoevents';
import unbindAll from 'nanoevents/unbind-all';
// instance methods
import renderVideoElement from './lib/renderVideoElement';
import runVPAID from './lib/runVPAID';
import initVPAIDAd from './lib/initVPAIDAd';
import enableVASTTracking from './lib/enableVASTTracking';
import configureVPAID from './lib/configureVPAID';
import renderControls from './lib/controls';
import fullscreenToggle from './lib/fullscreenToggle';
// helper functions
import isElement from './helpers/isElement';
import parseVAST from './helpers/parseVAST';
import secondsToReadableTime from './helpers/secondsToReadableTime';

import {
    CSS_ROOT,
    DATA_READY,
    PLAYBACK_PROGRESS,
    PLAYER_CLICK,
    PRE_DESTROY,
    READY,
    RESIZE,
    VPAID_STARTED,
    ERROR,
    DEFAULT_OPTIONS as defaultOptions
} from './constants';

// List of events fired by the instance instead of events the <video> tag
const internalEvents = [
    DATA_READY,
    PLAYBACK_PROGRESS,
    PLAYER_CLICK,
    PRE_DESTROY,
    READY,
    RESIZE,
    VPAID_STARTED,
    ERROR
];

export default class GgEzVp {
    constructor(options) {
        // set up the event emitter
        this.emitter = new NanoEvents();
        // flag than can be used from the outside to check if the instance is ready
        this.ready = false;
        // flag than can be used from the outside to check if the data needed to render is ready
        this.dataReady = false;
        this.prevVol = options.volume;
        this.isFullscreen = false;

        // merge default options with user provided options
        this.config = {
            ...defaultOptions,
            ...options,
            controls:
                options.controls === false || options.controls === null
                    ? false
                    : options.controls
                    ? {
                          ...defaultOptions.controls,
                          ...options.controls
                      }
                    : defaultOptions.controls
        };

        // Create the video node
        this.player = document.createElement('video');
        // set vast data default
        this.VASTData = null;
        this.VPAIDWrapper = null;
        // set up any extra processes
        this.__init();
    }

    // set up controls and internal listeners
    // fetch VAST data if necessary
    __init = () => {
        try {
            const { container, isVAST } = this.config;
            this.container = isElement(container) ? container : document.getElementById(container);
            this.__validateConfig();
            this.container.classList.add(this.__getCSSClass());
            // listen for <video> tag resize
            this.__nodeOn(window, RESIZE, this.__playerResizeListener());
            // set click listener on player
            this.on('click', this.__emitPlayerClick);
            if (isVAST) {
                return this.__runVAST();
            }
            this.__renderVideoElement();
        } catch (err) {
            console.log(err);
        }
    };

    __getCSSClass = (suffix = '') => CSS_ROOT + (suffix ? `--${suffix}` : '');

    __validateConfig = () => {
        const { src, container } = this.config;
        let err = '';

        // Validate that there is a source
        if (!src || (typeof src !== 'string' && !Array.isArray(src))) {
            err = 'video src should be a string or an array of strings';
        }

        if (!this.container) {
            err = `container should be a DOM node or a node's id. Current container: ${container}`;
        }

        if (err) {
            throw new Error(`GgEzVp Error: ${err}`);
        }
    };

    // add pass all the required data into the video element
    __mountVideoElement = renderVideoElement;

    // renders the video element once the data to render it is ready
    // emits: READY
    __renderVideoElement = () => {
        this.__mountVideoElement();
        // set up controls
        this.__renderControls();
        // set up playback progress listener
        this.on('timeupdate', this.__playbackProgressReporter);
        this.__setReadyNextTick();
    };

    __setReadyNextTick = () => {
        // Execute the callback in the next cycle, using requestAnimationFrame
        // if available or setTimeout as a fallback
        if (window.requestAnimationFrame) {
            return requestAnimationFrame(this.__setReady);
        }
        setTimeout(this.__setReady);
    };

    __setReady = () => {
        this.ready = true;
        this.emitter.emit(READY);
    };

    __renderControls = renderControls;

    __parseVAST = parseVAST;

    __enableVASTTracking = enableVASTTracking;

    __runVPAID = runVPAID;

    __initVPAIDAd = initVPAIDAd;

    __configureVPAID = configureVPAID;

    // helps retrieve and parse the VAST data
    // emits: DATA_READY || error
    __runVAST = async () => {
        try {
            const {
                config: { src }
            } = this;
            this.VASTData = await this.__parseVAST(src);
        } catch (err) {
            this.emitter.emit(ERROR, err);
        }
    };

    __isInternalEvent = eventName => internalEvents.includes(eventName);

    // add event listeners to any node
    __nodeOn = (node, eventName, ...args) => {
        node.addEventListener(eventName, ...args);
        // Store listener for teardown on this.destroy
        const eventData = [node, eventName, ...args];
        this.__nodeListeners.push(eventData);
        // return the node teardown function
        return () => {
            this.__nodeListeners = this.__nodeListeners.filter(data => data !== eventData);
            node.removeEventListener(eventName, ...args);
        };
    };

    // list of active node event listeners
    __nodeListeners = [];

    // emit event for clicks inside the player container
    // emits: PLAYER_CLICK
    __emitPlayerClick = (...args) => {
        this.emitter.emit(PLAYER_CLICK, ...args);
    };

    // listen for clicks inside the player container
    __playerResizeListener = () => {
        const { offsetWidth: initialWidth, offsetHeight: initialHeight } = this.player;
        this.dimensions.width = initialWidth;
        this.dimensions.height = initialHeight;
        return this.__resizeHandler;
    };

    // listen for changes in the video tag dimensions
    // emits: RESIZE
    __resizeHandler = () => {
        const { offsetWidth: currentWidth, offsetHeight: currentHeight } = this.player;
        const changedWidth = currentWidth !== this.dimensions.width;
        const changedHeight = currentHeight !== this.dimensions.height;
        if (changedWidth || changedHeight) {
            const newDimensions = { width: currentWidth, height: currentHeight };
            this.dimensions = newDimensions;
            this.emitter.emit(RESIZE, newDimensions);
        }
    };

    // listens for timeupdate and emits an event with duration, currentTime and readableTime of the <video> tag, for VPAID, see VPAIDWrapper.onAdRemainingTimeChange
    // emits: PLAYBACK_PROGRESS
    // { remainingTime, readableTime, duration, currentTime }
    __playbackProgressReporter = () => {
        const { currentTime, duration } = this.player;
        const fancyCurrentTime = secondsToReadableTime(currentTime);
        const fancyDuration = secondsToReadableTime(duration);
        const remainingTime = duration - currentTime;
        const payload = {
            remainingTime,
            fancyCurrentTime,
            fancyDuration,
            duration,
            currentTime
        };
        this.emitter.emit(PLAYBACK_PROGRESS, payload);
    };

    // teardown methods
    __removeListeners = () => {
        // remove internal listeners
        unbindAll(this.emitter);

        // remove player listeners
        this.__nodeListeners.forEach(([node, ...args]) => {
            node.removeEventListener(...args);
        });
    };

    __listenerStore = {
        on: [],
        once: []
    };

    __storeListener = type => (...args) => {
        this.__listenerStore?.[type].push(args);
    };

    // attach pending listeners
    // emits: 'attaching-EVENT_NAME', where EVENT_NAME is the original event name
    // this event is useful when the user wants access to the teardown function
    __attachStoredListeners = () => {
        for (let key in this.__listenerStore) {
            this.__listenerStore[key].forEach(args => {
                const teardown = this[key](...args);
                const storageEvent = `attaching-${key}`;
                // emit an event that allows recovering the teardown fn of async listeners
                this.emitter.emit(storageEvent, teardown);
            });
        }
        this.__listenerStore = null;
    };

    __shouldStoreListener = eventName => {
        const isInternal = this.__isInternalEvent(eventName);
        const {
            config: { isVAST },
            dataReady
        } = this;
        const shouldStoreListener = !isInternal && isVAST && !dataReady;
        return shouldStoreListener;
    };

    // event handler
    on = (eventName, ...args) => {
        const { isVPAID } = this;

        if (this.__shouldStoreListener(eventName)) {
            this.__storeListener('on')(eventName, ...args);
            return;
        }

        const teardown =
            // All VPAID events are considered as internal and mapped in VPAIDWrapper
            isVPAID || this.__isInternalEvent(eventName)
                ? // Set instance listener
                  this.emitter.on.apply(this.emitter, [eventName, ...args])
                : // Set player listeners
                  this.__nodeOn(this.player, eventName, ...args);

        // return the teardown function
        return teardown;
    };

    // listen for an event just once
    once = (eventName, callback) => {
        if (this.__shouldStoreListener(eventName)) {
            this.__storeListener('once')(eventName, callback);
            return;
        }

        const unbind = this.on(eventName, (...args) => {
            unbind();
            callback.apply(this, args);
        });

        return unbind;
    };

    // store for current video dimensions
    dimensions = {
        width: 0,
        height: 0
    };

    // start media playback
    play = () => {
        const { isVPAID, VPAIDStarted, VPAIDWrapper } = this;
        if (isVPAID) {
            if (VPAIDStarted) {
                return VPAIDWrapper.resumeAd();
            }
            return VPAIDWrapper.startAd();
        }
        this.player.play();
    };

    // stop media playback
    pause = () => {
        const { isVPAID, VPAIDWrapper } = this;
        if (isVPAID) {
            return VPAIDWrapper.pauseAd();
        }
        this.player.pause();
    };

    // toggle media playback
    playPause = () => {
        if (this.player.paused) {
            return this.play();
        }
        return this.pause();
    };

    // set the media volume, accepts float numbers between 0 and 1
    volume = value => {
        const { isVPAID, VPAIDWrapper } = this;
        const volume = Math.min(Math.max(value, 0), 1);
        if (isVPAID) {
            return VPAIDWrapper.setAdVolume(volume);
        }
        this.player.volume = volume;
    };

    // mute audio
    mute = () => {
        const { isVPAID, VPAIDWrapper } = this;
        if (isVPAID) {
            this.prevVol = VPAIDWrapper.getAdVolume();
            return VPAIDWrapper.setAdVolume(0);
        }
        this.player.muted = true;
    };

    // unmute audio
    unmute = () => {
        const { isVPAID, VPAIDWrapper, prevVol, config } = this;
        if (isVPAID) {
            const volume = prevVol || config.volume;
            return VPAIDWrapper.setAdVolume(volume);
        }
        this.player.muted = false;
    };

    // toggle mute
    muteUnmute = () => {
        if (this.player.muted) {
            return this.unmute();
        }
        return this.mute();
    };

    // return the video volume
    getVolume = () => {
        if (this.isVPAID) {
            return this.VPAIDWrapper.getAdVolume();
        }
        return this.player.volume;
    };

    // return the duration of the video
    getDuration = () => {
        if (this.isVPAID) {
            return this.VPAIDWrapper.duration;
        }
        const { duration } = this.player;
        return duration || 0;
    };

    // return the currentTime of the video
    getCurrentTime = () => {
        if (this.isVPAID) {
            return this.VPAIDWrapper.currentTime;
        }
        const { currentTime } = this.player;
        return currentTime;
    };

    // turn fullscreen on/off
    fullscreenToggle = fullscreenToggle;

    // remove all event listeners and remove everything inside the container
    // emits PRE_DESTROY
    destroy = () => {
        this.emitter.emit(PRE_DESTROY);
        this.pause();
        this.__removeListeners();
        this.container.innerHTML = '';
    };
}
