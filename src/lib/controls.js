import defaultPaths from '../lib/defaultIcons.js';

export default function GgEzControls(playerInstance) {
    //get necessary vars from instance
    const {
        container,
        config: { controls, muted }
    } = playerInstance;

    // if for any reason controls config is falsey return
    if (!controls) return null;

    // create the controls container element
    const controlContainer = document.createElement('div');
    controlContainer.id = `${container.id}-GgEzControls`;
    controlContainer.className = 'gg-ez-controls';

    const iconPaths = defaultPaths();

    // function to get necessary icon
    const getIcon = ({ color, play: { src, color: iconColor } }, { viewbox, path }) => {
        if (src) {
            const img = document.createElement('img');
            img.src = src;
            return img;
        }
        const template = document.createElement('template');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewbox='${viewbox}' ><path d='${path}' fill='${
            iconColor ? iconColor : color
        }'></svg>`;
        template.innerHTML = svg.trim();
        return template.content.firstChild;
    };

    // start creating each button

    if (controls.play) {
        // create button element
        const playPause = document.createElement('div');
        playPause.className = 'gg-ez-control-icon gg-ez-playpause';
        const playIcon = getIcon(controls, iconPaths.play);
        const pauseIcon = getIcon(controls, iconPaths.pause);
        if (playerInstance.player.paused) {
            playIcon.classList.add('active');
        } else {
            pauseIcon.classList.add('active');
        }
        playPause.append(playIcon, pauseIcon);
        playPause.addEventListener('click', event => {
            event.stopImmediatePropagation();
            if (playerInstance.player.paused) {
                pauseIcon.classList.add('active');
                playIcon.classList.remove('active');
            } else {
                playIcon.classList.add('active');
                pauseIcon.classList.remove('active');
            }
            playerInstance.playPause();
        });
        // append to correnponding div
        controlContainer.append(playPause);
    }

    if (controls.fullscreen) {
        // create button element
        const fullscreen = document.createElement('div');
        fullscreen.className = 'gg-ez-control-icon gg-ez-fullscreen';
        const fullscreenIcon = getIcon(controls, iconPaths.fullscreen);
        fullscreen.append(fullscreenIcon);
        // append to correnponding div
        fullscreen.addEventListener('click', event => {
            event.stopImmediatePropagation();
            playerInstance.fullscreenToggle();
        });
        controlContainer.append(fullscreen);
    }

    if (controls.volume) {
        // create button element
        const volume = document.createElement('div');
        volume.className = 'gg-ez-control-icon gg-ez-volume';
        const volumeIcon = getIcon(controls, iconPaths.volume);
        const muteIcon = getIcon(controls, iconPaths.mute);
        if (playerInstance.player.muted) {
            muteIcon.classList.add('active');
        } else {
            volumeIcon.classList.add('active');
        }
        volume.addEventListener('click', event => {
            event.stopImmediatePropagation();
            if (playerInstance.player.muted) {
                volumeIcon.classList.add('active');
                muteIcon.classList.remove('active');
            } else {
                volumeIcon.classList.remove('active');
                muteIcon.classList.add('active');
            }
            playerInstance.muteUnmute();
        });
        volume.append(volumeIcon, muteIcon);
        // append to correnponding div
        controlContainer.append(volume);
    }

    container.append(controlContainer);

    return document.getElementById(controlContainer.id);
}
