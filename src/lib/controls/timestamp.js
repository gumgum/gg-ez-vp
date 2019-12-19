import { PLAYBACK_PROGRESS, TIMESTAMP, DATA_READY } from '../../constants';
import secondsToReadableTime from '../../helpers/secondsToReadableTime';
import createNode from '../../helpers/createNode';

export default function timestamp(container) {
    const currentTime = this.getCurrentTime();
    const initialDuration = this.getDuration();
    const fancyCurrentTime = secondsToReadableTime(currentTime);
    const fancyDuration = secondsToReadableTime(Math.max(initialDuration, 0));

    const classNameRoot = this.__getCSSClass(TIMESTAMP);
    const timestampNode = createNode('div', classNameRoot);

    const [timestampCurrent, , timestampDuration] = [
        ['current', fancyCurrentTime],
        ['break', '/'],
        ['total', fancyDuration]
    ].map(([name, content]) => {
        const node = createNode('div', `${classNameRoot}-${name}`);
        node.innerText = content;
        timestampNode.appendChild(node);
        return node;
    });

    // Set duration once playback starts if it wasn't available
    this.once(PLAYBACK_PROGRESS, ({ fancyDuration: updatedDuration }) => {
        if (fancyDuration === '0:00') {
            timestampDuration.innerText = updatedDuration;
        }
    });

    //TODO: Throttle DOM updates when fancyCurrentTime is the same
    // Update currentTime
    this.on(PLAYBACK_PROGRESS, ({ fancyCurrentTime }) => {
        timestampCurrent.innerText = fancyCurrentTime;
    });

    container.appendChild(timestampNode);
}
