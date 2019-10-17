// external modules
import NanoEvents from 'nanoevents';
import unbindAll from 'nanoevents/unbind-all';
// own modules
import mountVideoElement from './lib/renderVideoElement';
import parseAdXML from './lib/parseAdXML';
import videoControls from './lib/controls';

import {
    DATA_READY,
    PLAYBACK_PROGRESS,
    PLAYER_CLICK,
    PRE_DESTROY,
    READY,
    RESIZE
} from './constants';

// List of events fired by the instance instead of events the <video> tag
const internalEvents = [DATA_READY, PLAYBACK_PROGRESS, PRE_DESTROY, READY, RESIZE];

export default class GgEzVp {
    constructor(options) {
        // set up the event emitter
        this.emitter = new NanoEvents();
        // flag than can be used from the outside to check if the instance is ready
        this.ready = false;

        // merge default options with user provided options
        this.config = {
            ...defaultOptions,
            ...options,
            controls:
                options.controls !== undefined
                    ? options.controls && {
                          ...defaultOptions.controls,
                          ...options.controls
                      }
                    : defaultOptions.controls
        };

        // Create the video node
        this.player = document.createElement('video');
        // set vast data default
        this.VASTData = null;
        // set up any extra processes
        this.init();
    }

    init = () => {
        const { container: containerId, isVAST } = this.config;
        const currentContainer = document.getElementById(containerId);
        if (!currentContainer) {
            throw new Error(`No container found. Is the id correct? (${containerId})`);
        }
        currentContainer.classList.add('gg-ez-container');
        // set click listener on player
        this.nodeOn(currentContainer, 'click', this.emitPlayerClick);
        // listen for <video> tag resize
        this.nodeOn(window, RESIZE, this.playerResizeListener());
        this.container = currentContainer;
        this.renderVideoElement(isVAST);
        if (isVAST) {
            return this.fetchVASTData();
        }
    };

    mountVideoElement = mountVideoElement;

    // Renders the video element once the data to render it is ready
    renderVideoElement = isVAST => {
        const renderer = () => {
            const { controls } = this.config;
            this.mountVideoElement();
            this.controlContainer = controls ? videoControls(this) : null;
            if (this.controlContainer)
                this.container.addEventListener('mouseenter', () =>
                    this.controlContainer.classList.add('active')
                );
            this.container.addEventListener('mouseleave', () =>
                this.controlContainer.classList.remove('active')
            );
            // set up playback progress listener
            this.on('timeupdate', this.playbackProgressReporter);
            this.ready = true;
            const callback = () => this.emitter.emit(READY);
            if (requestAnimationFrame) {
                return requestAnimationFrame(callback);
            }
            setTimeout(callback);
        };
        if (isVAST) {
            this.on(DATA_READY, renderer);
        } else {
            return renderer();
        }
    };

    // helps retrieve and parse the VAST data
    fetchVASTData = async () => {
        try {
            this.VASTData = await parseAdXML(this);
            this.emitter.emit(DATA_READY);
        } catch (err) {
            this.emitter.emit('error', err.toString());
        }
    };

    storedListeners = {
        on: [],
        once: []
    };

    isInternalEvent = eventName => internalEvents.includes(eventName);

    // event handler
    on = (eventName, ...args) => {
        const isInternal = this.isInternalEvent(eventName);

        const teardown = isInternal
            ? // Set instance listener
              this.emitter.on.apply(this.emitter, [eventName, ...args])
            : // Set player listeners
              this.nodeOn(this.player, eventName, ...args);

        // return the teardown function
        return teardown;
    };

    // Listen for an event just once
    once = (eventName, callback) => {
        const unbind = this.on(eventName, (...args) => {
            unbind();
            callback.apply(this, args);
        });

        return unbind;
    };

    nodeOn = (node, eventName, ...args) => {
        node.addEventListener(eventName, ...args);
        // Store listener for teardown on this.destroy
        const eventData = [node, eventName, ...args];
        this.nodeListeners.push(eventData);
        // return the node teardown function
        return () => {
            this.nodeListeners = this.nodeListeners.filter(data => data !== eventData);
            node.removeEventListener(eventName, ...args);
        };
    };

    nodeListeners = [];

    emitPlayerClick = (...args) => {
        this.emitter.emit(PLAYER_CLICK, ...args);
    };

    dimensions = {
        width: 0,
        height: 0
    };

    playerResizeListener = () => {
        const { offsetWidth: initialWidth, offsetHeight: initialHeight } = this.player;
        this.dimensions.width = initialWidth;
        this.dimensions.height = initialHeight;
        return this.resizeHandler;
    };

    resizeHandler = () => {
        const { offsetWidth: currentWidth, offsetHeight: currentHeight } = this.player;
        const changedWidth = currentWidth !== this.dimensions.width;
        const changedHeight = currentHeight !== this.dimensions.height;
        if (changedWidth || changedHeight) {
            const newDimensions = { width: currentWidth, height: currentHeight };
            this.dimensions = newDimensions;
            this.emitter.emit(RESIZE, newDimensions);
        }
    };

    play = () => {
        this.player.play();
    };

    pause = () => {
        this.player.pause();
    };

    // Playback methods
    playPause = () => {
        if (this.player.paused) {
            return this.play();
        }
        return this.pause();
    };

    volume = value => {
        const volume = Math.min(Math.max(value, 0), 1);
        this.player.volume = volume;
    };

    muteUnmute = () => {
        if (this.player.muted) {
            return this.unmute();
        }
        return this.mute();
    };

    mute = () => {
        this.player.muted = true;
    };

    unmute = () => {
        this.player.muted = false;
    };

    getCurrentTime = () => {
        const { currentTime } = this.player;
        return currentTime;
    };

    fullscreenToggle = () => {
        const el = this.player;
        if (!this.config.fullscreen) {
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
                /* Firefox */
                el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
                /* Chrome, Safari and Opera */
                el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
                /* IE/Edge */
                el.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    };

    // Listens for timeupdate and emits an event with duration, currentTime and readableTime
    playbackProgressReporter = () => {
        const { currentTime, duration } = this.player;
        const mins = Math.floor(currentTime / 60);
        const secs = Math.floor(currentTime % 60);
        const readableTime = `${mins}:${secs < 10 ? `0${secs}` : secs}`;
        this.emitter.emit(PLAYBACK_PROGRESS, { readableTime, duration, currentTime });
    };

    // Teardown methods
    removeListeners = () => {
        // remove internal listeners
        unbindAll(this.emitter);

        // remove player listeners
        this.nodeListeners.forEach(([node, ...args]) => {
            node.removeEventListener(...args);
        });
    };

    destroy = () => {
        this.emitter.emit(PRE_DESTROY);
        this.pause();
        this.removeListeners();
        this.container.innerHTML = '';
    };
}

const defaultOptions = {
    container: null,
    width: null,
    height: null,
    src: null,
    controls: {
        bg: null,
        color: '#FFFFFF',
        play: {
            color: null,
            src: null
        },
        stop: {
            color: null,
            src: null
        },
        replay: {
            color: null,
            src: null
        },
        volume: {
            color: null,
            src: null
        },
        fullscreen: {
            color: null,
            src: null
        },
        timer: {
            color: null
        }
    },
    autoPlay: false,
    volume: 1,
    muted: true,
    poster: null,
    preload: 'auto',
    loop: false,
    isVAST: false,
    fullscreen: false,
    playsinline: true
};
