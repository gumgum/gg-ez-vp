import { PLAY } from '../../constants';
const PAUSE = 'pause';
const REPLAY = 'replay';

export default function play(container) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add(this.__getCSSClass('button-icon'), PLAY);

    this.__nodeOn(button, 'click', e => {
        e.stopPropagation?.();
        this.playPause();
    });

    this.on(PLAY, listenerCreator(button, [REPLAY, PLAY], PAUSE));
    this.on(PAUSE, listenerCreator(button, [REPLAY, PAUSE], PLAY));
    this.on('ended', listenerCreator(button, [PLAY, PAUSE], REPLAY));

    container.appendChild(button);
}

const listenerCreator = (node, classNamesRm = [], classNameAdd = '') => () => {
    if (!node) return;
    node.classList.remove(...classNamesRm);
    node.classList.add(classNameAdd);
};
