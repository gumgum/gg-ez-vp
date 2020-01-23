import { PLAYBACK_PROGRESS, TIMESTAMP } from '../../constants';
import secondsToReadableTime from '../../helpers/secondsToReadableTime';
import createNode from '../../helpers/createNode';

export default function timestamp(container) {
    const currentTime = this.getCurrentTime();
    const initialDuration = this.getDuration();
    const fancyCurrentTime = secondsToReadableTime(currentTime);
    const fancyDuration = secondsToReadableTime(Math.max(initialDuration, 0));

    const classNameRoot = this.__getCSSClass(TIMESTAMP);
    const timestampNode = createNode('div', classNameRoot);

    const showContent = fancyCurrentTime && fancyDuration;
    const separator = showContent ? '/' : '';
    const durationText = showContent ? fancyDuration : '';

    const [timestampCurrent, , timestampDuration] = [
        ['current', fancyCurrentTime],
        ['break', separator],
        ['total', durationText]
    ].map(([name, content]) => {
        const node = createNode('div', `${classNameRoot}-${name}`);
        node.innerText = content;
        timestampNode.appendChild(node);
        return node;
    });

    // Set duration once playback starts if it wasn't available
    this.once(PLAYBACK_PROGRESS, ({ fancyDuration }) => {
        timestampDuration.innerText = fancyDuration;
    });

    //TODO: Throttle DOM updates when fancyCurrentTime is the same
    // Update currentTime
    this.on(PLAYBACK_PROGRESS, ({ fancyCurrentTime }) => {
        timestampCurrent.innerText = fancyCurrentTime;
    });

    container.appendChild(timestampNode);
}
