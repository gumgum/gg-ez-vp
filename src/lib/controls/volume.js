import { VOLUME } from '../../constants';
import createNode from '../../helpers/createNode';
import preloadIcons from '../../helpers/preloadIcons';

/* Note: volume can only be set by the user in Safari Mobile.
 * this.player.volume is read-only and will always return 1.
 * https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
 * On other browsers, the muted configuration will take precedence over volume.
 */

const MUTE = 'mute';
const LOW = 'low';
const MEDIUM = 'medium';
const HIGH = 'high';

const intensities = [MUTE, LOW, MEDIUM, HIGH];

export default function volume(container) {
    const {
        config: { controls, volume: initialVolume, muted: initialMuted }
    } = this;
    const muteToggleOnly = !Object.keys(controls).some(key => {
        if (key === VOLUME) return false;
        return controls[key];
    });
    let volumeRange, button;

    const volumeClassRoot = this.__getCSSClass(VOLUME);
    const volumeContainer = createNode('div', volumeClassRoot);
    const volumeChangeEvt = this.isVPAID ? 'AdVolumeChange' : 'volumechange';

    if (muteToggleOnly) {
        // Show different styles when only the volume control is enabled
        this.container.classList.add(`${volumeClassRoot}-only`);
    }

    const setControlsState = () => {
        const currentVolume = this.getVolume();
        const isMuted = currentVolume === 0;
        const currentIntensity = getVolumeIntensity(currentVolume, isMuted);
        button.classList.remove('mute', 'low', 'medium', 'high');
        button.classList.add(currentIntensity);
        if (volumeRange) volumeRange.value = currentVolume;
    };

    const setVolume = () => {
        this.volume(volumeRange.value);
    };

    const initialIntensity = getVolumeIntensity(initialMuted ? 0 : initialVolume, initialMuted);
    const iconsToLoad = intensities
        .filter(i => i !== initialIntensity)
        .map(i => {
            if (i === MUTE) return i;
            if (i === MEDIUM) i = 'med';
            return `${i}-volume`;
        });
    preloadIcons(iconsToLoad, this.__baseURL);

    button = createNode('button', [this.__getCSSClass('button-icon'), initialIntensity], {
        type: 'button'
    });

    this.__nodeOn(button, 'click', e => {
        e.stopPropagation?.();
        this.muteUnmute();
    });

    volumeContainer.appendChild(button);
    const controlsClassName = `${volumeClassRoot}-control`;
    const volumeControl = createNode('div', controlsClassName);

    volumeRange = muteToggleOnly
        ? null
        : createNode(
              'input',
              [`${controlsClassName}-slider`, this.__getCSSClass('input-range')],
              inputAttrs
          );

    if (volumeRange) {
        volumeRange.value = initialMuted ? 0 : initialVolume;
        volumeControl.appendChild(volumeRange);

        this.__nodeOn(volumeRange, 'change', setVolume);
        this.__nodeOn(volumeRange, 'input', setVolume);
    }

    volumeContainer.appendChild(volumeControl);

    this.on(volumeChangeEvt, setControlsState);

    container.appendChild(volumeContainer);
}

const inputAttrs = {
    type: 'range',
    name: 'volume',
    min: '0',
    max: '1',
    step: '0.05'
};

const getVolumeIntensity = (currentVolume, muted) => {
    const volume = parseFloat(currentVolume);
    if (muted || volume === 0) return MUTE;
    if (volume <= 0.33) return LOW;
    if (volume > 0.33 && volume < 0.66) return MEDIUM;
    return HIGH;
};
