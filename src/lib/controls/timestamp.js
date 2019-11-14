import { PLAYBACK_PROGRESS, TIMESTAMP } from '../../constants';
import secondsToReadableTime from '../../helpers/secondsToReadableTime';

export default function timestamp(container) {
    const currentTime = this.getCurrentTime();
    const duration = this.getDuration();
    const fancyCurrentTime = secondsToReadableTime(currentTime);
    const fancyDuration = secondsToReadableTime(duration);

    const timestampNode = document.createElement('div');
    const classNameRoot = this.__getCSSClass(TIMESTAMP);
    timestampNode.classList.add(classNameRoot);

    const [timestampCurrent, , timestampDuration] = [
        ['current', fancyCurrentTime],
        ['break', '/'],
        ['total', fancyDuration]
    ].map(([name, content]) => {
        const node = document.createElement('div');
        node.classList.add(`${classNameRoot}-${name}`);
        node.innerText = content;
        timestampNode.appendChild(node);
        return node;
    });

    // Set duration once playback starts if it wasn't available
    this.once(PLAYBACK_PROGRESS, ({ fancyDuration }) => {
        if (!duration) {
            timestampDuration.innerText = fancyDuration;
        }
    });

    // Update currentTime
    this.on(PLAYBACK_PROGRESS, ({ fancyCurrentTime }) => {
        timestampCurrent.innerText = fancyCurrentTime;
    });

    container.appendChild(timestampNode);
}
