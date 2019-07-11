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
        console.log({ currentContainer });
        this.container = currentContainer;
        console.log(this);
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
