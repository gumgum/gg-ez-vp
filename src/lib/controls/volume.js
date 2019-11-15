import { VOLUME } from '../../constants';
import createNode from '../../helpers/createNode';

const MUTE = 'mute';

export default function volume(container) {
    const {
        config: { controls, volume: currentVolume, muted }
    } = this;
    const { volumeControl, volumeButton } = controls;
    // TODO: set -volume-only modifier

    let volumeRange, button;
    const volumeClassRoot = this.__getCSSClass(VOLUME);
    const volumeContainer = createNode('div', volumeClassRoot);
    const intensity = getVolumeIntensity(currentVolume, muted);
    const volumeChangeEvt = this.isVPAID ? 'AdVolumeChange' : 'volumechange';

    const setControlsState = () => {
        //TODO: fix issues dragging input
        const currentVolume = this.getVolume();
        const isMuted = this.isVPAID ? currentVolume : this.player.muted;

        if (button) {
            const currentIntensity = getVolumeIntensity(currentVolume, isMuted);
            button.classList.remove('mute', 'low', 'medium', 'high');
            button.classList.add(currentIntensity);
        }

        if (volumeRange) {
            volumeRange.value = isMuted ? 0 : currentVolume;
        }
    };

    const setVolume = () => {
        this.volume(volumeRange.value);
    };

    if (volumeButton) {
        button = createNode('button', [this.__getCSSClass('button-icon'), intensity], {
            type: 'button'
        });

        this.__nodeOn(button, 'click', e => {
            e.stopPropagation?.();
            this.muteUnmute();
        });

        volumeContainer.appendChild(button);
    }

    if (volumeControl) {
        const controlsClassName = `${volumeClassRoot}-control`;
        const volumeControl = createNode('div', controlsClassName);

        volumeRange = createNode(
            'input',
            [`${controlsClassName}-slider`, this.__getCSSClass('input-range')],
            inputAttrs
        );
        volumeRange.value = currentVolume;

        this.__nodeOn(volumeRange, 'change', setVolume);
        this.__nodeOn(volumeRange, 'input', setVolume);

        volumeControl.appendChild(volumeRange);
        volumeContainer.appendChild(volumeControl);
    }

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
