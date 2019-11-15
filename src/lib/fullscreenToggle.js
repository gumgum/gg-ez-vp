import { EXPAND } from '../../constants';
export default function fullscreenToggle() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        return exitFullscreen();
    }
    return requestFullscreen(this.container);
}

const requestFullscreen = el => {
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
    this.emitter.emit(EXPAND, true);
};

const exitFullscreen = () => {
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
    this.emitter.emit(EXPAND, false);
};
