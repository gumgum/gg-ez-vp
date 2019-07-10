export default class GgEzVp {
    constructor(setup) {
        this.config = {
            container = '',
            width = null,
            height = null,
            src = null,
            controls = true,
            autoPlay = false,
            volume = 1,
            mute = false,
            poster = null,
            preload = false,
            loop = false
        } = setup;
        this.init();
    }

    init() {
        console.log(this);
    }
}
