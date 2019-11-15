import { VOLUME } from '../../constants';
import createNode from '../../helpers/createNode';

/* note: for initial volume, see applyConfigToVideoElement */

const MUTE = 'mute';

export default function volume(container) {
    const {
        config: { controls, volume: initialVolume, muted: initialMuted }
    } = this;
    const volumeOnly = !Object.keys(controls).some(key => {
        if (key === VOLUME) return false;
        return controls[key];
    });
    console.log({ controls, volumeOnly });
    let volumeRange, button;

    const volumeClassRoot = this.__getCSSClass(VOLUME);
    const volumeContainer = createNode('div', volumeClassRoot);
    const volumeChangeEvt = this.isVPAID ? 'AdVolumeChange' : 'volumechange';

    if (volumeOnly) {
        // Show different styles when only the volume control is enabled
        this.container.classList.add(`${volumeClassRoot}-only`);
    }

    const setControlsState = () => {
        const currentVolume = this.getVolume();
        const isMuted = currentVolume === 0;
        const currentIntensity = getVolumeIntensity(currentVolume, isMuted);
        button.classList.remove('mute', 'low', 'medium', 'high');
        button.classList.add(currentIntensity);
        volumeRange.value = currentVolume;
    };

    const setVolume = () => {
        this.volume(volumeRange.value);
    };

    const initialIntensity = getVolumeIntensity(initialVolume, initialMuted);

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

    volumeRange = createNode(
        'input',
        [`${controlsClassName}-slider`, this.__getCSSClass('input-range')],
        inputAttrs
    );
    volumeRange.value = initialMuted ? 0 : initialVolume;

    volumeControl.appendChild(volumeRange);
    volumeContainer.appendChild(volumeControl);

    this.__nodeOn(volumeRange, 'change', setVolume);
    this.__nodeOn(volumeRange, 'input', setVolume);

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
    if (volume <= 0.33) return 'low';
    if (volume > 0.33 && volume < 0.66) return 'medium';
    return 'high';
};
