import { EXPAND } from '../../constants';
import createNode from '../../helpers/createNode';

export default function expand(container) {
    const button = createNode('button', [this.__getCSSClass('button-icon'), EXPAND], {
        type: 'button'
    });

    this.__nodeOn(button, 'click', e => {
        e.stopPropagation?.();
        this.fullscreenToggle();
    });

    container.appendChild(button);
}
