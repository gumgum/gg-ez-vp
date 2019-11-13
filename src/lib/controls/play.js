import { PLAY } from '../../constants';
const PAUSE = 'pause';
const REPLAY = 'replay';

export default function play(container) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');

    const classNames = [this.__getCSSClass('button-icon'), PLAY];
    classNames.forEach(className => {
        button.classList.add(className);
    });

    this.__nodeOn(button, 'click', e => {
        e.stopPropagation?.();
        this.playPause();
    });

    this.on(PLAY, () => {
        button.classList.remove(REPLAY);
        button.classList.remove(PAUSE);
        button.classList.add(PLAY);
    });

    this.on(PAUSE, () => {
        button.classList.remove(REPLAY);
        button.classList.remove(PLAY);
        button.classList.add(PAUSE);
    });

    this.on('ended', () => {
        button.classList.remove(PLAY);
        button.classList.remove(PAUSE);
        button.classList.add(REPLAY);
    });

    container.appendChild(button);
}
