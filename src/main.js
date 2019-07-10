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

    init() {
        console.log(this);
    }
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
    loop: false
};
