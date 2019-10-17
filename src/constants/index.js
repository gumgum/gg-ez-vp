export const DATA_READY = 'data-ready';
export const PLAYBACK_PROGRESS = 'playback-progress';
export const PLAYER_CLICK = 'player-click';
export const PRE_DESTROY = 'pre-destroy';
export const READY = 'ready';
export const RESIZE = 'resize';
export const DEFAULT_OPTIONS = {
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
