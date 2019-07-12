import mountVideoElement from './lib/renderVideoElement';

export default class GgEzVp {
    constructor(options) {
        console.log({ options });
        this.config = {
            ...defaultOptions,
            ...options
        };
        console.log(this.config);

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
        // TODO
        //this.setListeners()
    };

    playPause = () => {
        console.log(this.player.paused);
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

    volume = value => {
        if (value >= 0 || value <= 1) {
            this.player.volume = value;
        }
    };

    muteUnmute = () => {
        console.log(this.player.muted);
        if (this.player.muted) {
            this.unmute();
        } else {
            this.pause();
        }
    };

    mute = () => {
        this.player.muted = true;
    };

    unmute = () => {
        this.player.muted = false;
    };

    destroy = () => {
        this.pause();
        // TODO
        //this.removeListeners()
        this.container.parentNode.removeChild(this.container);
    };
}

const defaultOptions = {
    container: '',
    width: null,
    height: null,
    src: null,
    controls: true,
    autoPlay: false,
    volume: 1,
    mute: false,
    poster: null,
    preload: false,
    loop: false,
    monetization: false
};
