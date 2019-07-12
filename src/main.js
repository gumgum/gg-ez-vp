// external modules
import NanoEvents from 'nanoevents';
// own modules
import mountVideoElement from './lib/renderVideoElement';
import parseAdXML from './lib/parseAdXML';

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

        // flag than can be used from the outside to check if the instance is ready
        this.ready = false;

        // set up any extra processes
        this.init();
    }

    init = () => {
        const { container: containerId, isVAST } = this.config;
        const currentContainer = document.getElementById(containerId);
        if (!currentContainer) {
            throw new Error('No container found. Is the id correct?');
        }
        this.container = currentContainer;
        //console.log({ parseAdXML });
        this.renderVideoElement();
        if (isVAST) {
            return this.fetchVASTData();
        }
        setTimeout(() => this.emitter.emit('dataready'));
    };

    renderVideoElement = () => {
        this.on('dataready', () => {
            this.player = mountVideoElement(this);
            console.log(this.player);
            this.ready = true;
            this.emitter.emit('ready');
        });
    };

    fetchVASTData = async () => {
        try {
            this.vastData = await parseAdXML(this);
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
            console.log({ eventName });
            const teardown = this.emitter.on.apply(this.emitter, [eventName, ...args]);
            // Store listener for teardown on this.destroy
            this.instanceListeners.push(teardown);
        }

        // Set player event listeners
        if (this.player && (!isInternal || eventName === 'error')) {
            console.log({ eventName });
            this.player.addEventListener(eventName, ...args);
            // Store listener for teardown on this.destroy
            this.playerListeners.push([eventName, ...args]);
        }
    };

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
    isVAST: false
};
