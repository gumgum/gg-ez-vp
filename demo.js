/*global GgEzVp*/
const configs = [
    //MP4
    {
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4'
    },
    // VAST
    {
        container: 'videoContainer2',
        src:
            'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
        isVAST: true
    }
];
const events = [
    'data-ready',
    'playback-progress',
    'player-click',
    'pre-destroy',
    ['ready', instance => instance.play()],
    'resize',
    'error',
    'VPAID-started'
];

window.onload = function onload() {
    configs.forEach(createPlayerInstance);
};

function createPlayerInstance(config) {
    const instance = new GgEzVp(config);
    const logger = (eventName, cb) => {
        return evt => {
            // eslint-disable-next-line
            console.log(`${eventName} - Instance ${config.container} log:`, evt);
            if (cb) cb(instance);
        };
    };
    // Set player listeners
    events.forEach(event => {
        const [eventName, cb] = Array.isArray(event) ? event : [event];
        instance.on(eventName, logger(eventName, cb));
    });
    // Set instance demo controls
    setDemoControls(instance, config);
    return instance;
}

const nextTick = requestAnimationFrame || setTimeout;

function setDemoControls(playerInstance, config) {
    const sectionContainer = playerInstance.container.parentNode;
    const playBtn = sectionContainer.querySelector('.play-btn');
    const muteBtn = sectionContainer.querySelector('.mute-btn');
    const input = sectionContainer.querySelector('.gds-form-group__text-input');
    const f5Btn = sectionContainer.querySelector('.reload-btn');
    const checkbox = sectionContainer.querySelector('.gds-form-group__toggleswitch-input');

    if (!input.value) input.value = config.src;
    if (config.isVAST) checkbox.checked = true;

    playerInstance.__nodeOn(playBtn, 'click', () => playerInstance.playPause());
    playerInstance.__nodeOn(muteBtn, 'click', () => playerInstance.muteUnmute());
    playerInstance.__nodeOn(f5Btn, 'click', () => {
        playerInstance.destroy();
        playerInstance = null;
        nextTick(() => {
            const src = input.value || config.src;
            const isVAST = !!checkbox.checked;
            playerInstance = createPlayerInstance({ ...config, src, isVAST });
        });
    });
}
