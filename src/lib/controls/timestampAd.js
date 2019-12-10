import { PLAYBACK_PROGRESS, TIMESTAMP } from '../../constants';
import createNode from '../../helpers/createNode';

export default function timestampAd(container) {
    const getRemainingTime = () =>
        this.isVPAID
            ? this.VPAIDWrapper.getAdRemainingTime()
            : this.player.duration - this.player.currentTime;

    const initialRemainingTime = getRemainingTime();

    const timestampNode = createNode('div', `${this.__getCSSClass(TIMESTAMP)}-ad`);
    const nodeUpdater = setNodeText(timestampNode);
    nodeUpdater(initialRemainingTime);

    // Set duration once playback starts if it wasn't available
    this.once('loadedmetadata', () => {
        const remainingTime = getRemainingTime();
        if (!initialRemainingTime) nodeUpdater(remainingTime);
    });

    //TODO: Throttle DOM updates when fancyCurrentTime is the same
    // Update currentTime
    this.on(PLAYBACK_PROGRESS, ({ remainingTime }) => {
        nodeUpdater(remainingTime);
    });

    container.appendChild(timestampNode);
}

const isNan = Number.isNaN || isNaN;

const setNodeText = node => remainingTime => {
    const time = Math.floor(remainingTime);
    const text = !isNan(time) ? `Ad ${time}` : '';
    node.innerText = text;
};
