/*global GgEzVp*/
const VAST_SAMPLE =
    'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]';
const configs = [
    //MP4
    {
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4'
    },
    // VAST
    {
        container: 'videoContainer2',
        src: VAST_SAMPLE,
        isVAST: true
    },
    // XML VAST
    {
        container: 'videoContainer3',
        src: null,
        xmlContent: null,
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

function getConfigXMLURL(xmlContent) {
    const xmlBlob = new Blob([xmlContent], { type: 'text/xml' });
    const xmlURL = URL.createObjectURL(xmlBlob);
    return xmlURL;
}

window.addEventListener('load', async function onload() {
    try {
        const xmlContent = await fetch(VAST_SAMPLE).then(response => response.text());
        const xmlURL = getConfigXMLURL(xmlContent);
        const xmlConfig = configs[configs.length - 1];
        xmlConfig.src = xmlURL;
        xmlConfig.xmlContent = xmlContent;
        window.playerInstances = configs.map(createPlayerInstance);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
});

function createPlayerInstance(config, index) {
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
    setDemoControls(instance, config, index);
    return instance;
}

const nextTick = requestAnimationFrame || setTimeout;

function setDemoControls(playerInstance, config, index) {
    const sectionContainer = playerInstance.container.parentNode;
    const playBtn = sectionContainer.querySelector('.play-btn');
    const muteBtn = sectionContainer.querySelector('.mute-btn');
    const input = sectionContainer.querySelector('.gds-form-group__text-input');
    const f5Btn = sectionContainer.querySelector('.reload-btn');
    const checkbox = sectionContainer.querySelector('.gds-form-group__toggleswitch-input');

    const isTextarea = input.tagName === 'TEXTAREA';

    if (isTextarea) {
        if (!input.value || !input.value.trim()) {
            input.value = config.xmlContent;
        }

        if (input.value !== config.xmlContent) {
            config.xmlContent = input.value;
            const xmlURL = getConfigXMLURL(config.xmlContent);
            config.src = xmlURL;
        }
    } else {
        if (!input.value) {
            input.value = config.src;
        }
    }

    if (config.isVAST) checkbox.checked = true;

    playerInstance.__nodeOn(playBtn, 'click', () => playerInstance.playPause());
    playerInstance.__nodeOn(muteBtn, 'click', () => playerInstance.muteUnmute());
    playerInstance.__nodeOn(f5Btn, 'click', () => {
        playerInstance.destroy();
        playerInstance = null;
        nextTick(() => {
            let src = input.value || config.src;
            if (input.value && config.xmlContent !== input.value) {
                src = getConfigXMLURL(input.value);
            }
            playerInstance = createPlayerInstance({ ...config, src, isVAST: !!checkbox.checked });
            window.playerInstances[index] = playerInstance;
        });
    });
}
