// external modules
import NanoEvents from 'nanoevents';
// own modules
import mountVideoElement from './lib/renderVideoElement';
import parseAdXML from './lib/parseAdXML';
import videoControls from './lib/controls.js';

export default class GgEzVp {
    constructor(options) {
        // set up the event emitter
        this.emitter = new NanoEvents();

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

        // flag than can be used from the outside to check if the instance is ready
        this.ready = false;

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
        console.log({ containerId });
        this.container = currentContainer;
        //console.log({ parseAdXML });
        this.renderVideoElement();
        if (isVAST) {
            return this.fetchVASTData();
        }
        setTimeout(() => this.emitter.emit('dataready'));
    };

    // Renders the video element once the data to render it is ready
    renderVideoElement = () => {
        this.on('dataready', () => {
            const { controls } = this.config;
            this.player = mountVideoElement(this);
            this.controlContainer = controls ? videoControls(this) : null;
            if (this.controlContainer)
                this.container.addEventListener('mouseenter', () =>
                    this.controlContainer.classList.add('active')
                );
            this.container.addEventListener('mouseleave', () =>
                this.controlContainer.classList.remove('active')
            );
            this.ready = true;
            this.emitter.emit('ready');
        });
    };

    // helps retrieve and parse the VAST data
    fetchVASTData = async () => {
        try {
            this.VASTData = await parseAdXML(this);
            this.emitter.emit('dataready');
        } catch (err) {
            this.emitter.emit('error', err.toString());
        }
    };

    // event handler
    on = (eventName, ...args) => {
        const isInternal = ['ready', 'dataready', 'predestroy', 'error'].includes(eventName);
        // Set internal event listeners
        if (isInternal) {
            const teardown = this.emitter.on.apply(this.emitter, [eventName, ...args]);
            // Store listener for teardown on this.destroy
            this.instanceListeners.push(teardown);
        }

        // Set player event listeners
        if (this.player && (!isInternal || eventName === 'error')) {
            console.log('player event');
            console.log({ eventName, args });
            this.player.addEventListener(eventName, ...args);
            // Store listener for teardown on this.destroy
            this.playerListeners.push([eventName, ...args]);
        }
    };

    // Listen for an event just once
    once(event, callback) {
        console.log({ event, callback });
        // TODO: should "once" events be pushed to this.instanceListeners?
        const unbind = this.emitter.on(event, function(...args) {
            unbind();
            console.log({ unbind, args });
            callback.apply(this, args);
        });
        console.log({ unbind });
        return unbind;
    }

    instanceListeners = [];

    playerListeners = [];

    // Playback methods
    playPause = () => {
        if (this.player.paused) {
            this.play();
        } else {
            this.pause();
        }
    };

    play = () => {
        this.player.play();
    };

    pause = () => {
        this.player.pause();
    };

    volume = val => {
        const value = val < 0 ? 0 : val > 1 ? 1 : val;
        this.player.volume = value;
    };

    muteUnmute = () => {
        if (this.player.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    };

    mute = () => {
        this.player.muted = true;
    };

    unmute = () => {
        this.player.muted = false;
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

    // Teardown methods
    removeListeners = () => {
        // remove internal listeners
        this.instanceListeners.forEach(teardownFn => {
            teardownFn();
        });

        // remove player listeners
        this.playerListeners.forEach(listenerConfig => {
            this.player.removeEventListener(...listenerConfig);
        });

        this.instanceListeners = [];
        this.playerListeners = [];
    };

    destroy = () => {
        this.emitter.emit('predestroy');
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
    fullscreen: false
};
