// CSS
export const CSS_ROOT = 'gg-ez-vp';
// EVENTS
export const DATA_READY = 'data-ready';
export const PLAYBACK_PROGRESS = 'playback-progress';
export const PLAYER_CLICK = 'player-click';
export const PRE_DESTROY = 'pre-destroy';
export const READY = 'ready';
export const RESIZE = 'resize';
export const ERROR = 'error';
export const VPAID_STARTED = 'VPAID-started';
// Controls
const controls = {
    timestampAd: false,
    skip: false,
    volume: true,
    progress: true,
    timestamp: true,
    play: true,
    expand: true
};
// Config
export const DEFAULT_OPTIONS = {
    container: null,
    width: '100%',
    height: null,
    src: null,
    autoPlay: false,
    volume: 1,
    muted: true,
    poster: null,
    preload: 'auto',
    loop: false,
    isVAST: false,
    fullscreen: false,
    playsinline: true,
    controls
};
// VAST
export const SUPPORTED_VPAID_VERSION = '2.0';
// resolveAll will return the first Ad or AdPod in the VAST
export const DEFAULT_VAST_OPTIONS = { resolveAll: false };
export const JAVASCRIPT_MIME_TYPES = [
    'application/x-javascript',
    'application/javascript',
    'application/ecmascript',
    'text/javascript',
    'text/ecmascript'
];
