// external modules
import NanoEvents from 'nanoevents';
// own modules
import mountVideoElement from './lib/renderVideoElement';

export default class GgEzVp {
    constructor(options) {
        // set up the event emitter
        this.emitter = new NanoEvents();

        // merge default options with user provided options
        this.config = {
            ...defaultOptions,
            ...options
        };
        console.log(this.config);

        // set up any extra processes
        this.init();
    }

    init = () => {
        const { container: containerId } = this.config;
        const currentContainer = document.getElementById(containerId);
        if (!currentContainer) {
            throw new Error('No container found. Is the id correct?');
        }
        this.container = currentContainer;
        this.player = mountVideoElement(this);
        setTimeout(() => {
            this.emitter.emit('ready', { test: true });
        }, 3000);
    };

    on = (eventName, ...args) => {
        // Set internal event listeners
        if (['ready', 'predestroy'].includes(eventName)) {
            const teardown = this.emitter.on.apply(this.emitter, [eventName, ...args]);
            // Store listener for teardown on this.destroy
            this.instanceListeners.push(teardown);
        }

        // Set player event listeners
        if (this.player) {
            this.player.addEventListener(eventName, ...args);
            // Store listener for teardown on this.destroy
            this.playerListeners.push([eventName, ...args]);
        }
    };

    instanceListeners = [];

    playerListeners = [];

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
        const value = val < 0 ? 0 : val > 1 ? 1 : value;
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
        this.container.parentNode.removeChild(this.container);
    };
}

const defaultOptions = {
    container: null,
    width: null,
    height: null,
    src: null,
    controls: true,
    autoplay: false,
    volume: 1,
    muted: true,
    poster: null,
    preload: 'auto',
    loop: false,
    monetization: false
};
