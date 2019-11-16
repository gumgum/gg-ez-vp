import createNode from '../../helpers/createNode';
import { SKIP } from '../../constants';

export default function skip(container) {
    const button = createNode('button', this.__getCSSClass('button-skip'), {
        type: 'button'
    });
    button.innerText = SKIP;

    this.__nodeOn(button, 'click', e => {
        e.stopPropagation?.();
        this.emitter.emit(SKIP);
    });
    this.container.classList.add(this.__getCSSClass(SKIP));
    container.appendChild(button);
}
