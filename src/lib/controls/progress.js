import { PROGRESS, PLAYBACK_PROGRESS } from '../../constants';
import createNode from '../../helpers/createNode';

export default function progress(container) {
    const classNameRoot = this.__getCSSClass(PROGRESS);
    const progressContainer = createNode('div', classNameRoot);
    const progressBar = createNode('div', `${classNameRoot}-bar`);
    const progressFill = createNode('div', `${classNameRoot}-filled`);
    const isAd = this.config.isAd || this.config.isVAST;

    this.on(PLAYBACK_PROGRESS, ({ currentTime, duration }) => {
        const percentage = Math.floor((100 / duration) * currentTime);
        progressFill.style.flexBasis = `${percentage}%`;
    });

    if (!isAd) {
        this.__nodeOn(progressBar, 'click', e => {
            e.stopPropagation?.();
            const duration = this.getDuration();
            const clickedTime = (e.offsetX / progressBar.offsetWidth) * duration;
            this.player.currentTime = clickedTime;
        });

        this.__nodeOn(progressBar, 'mousemove', e => {
            const duration = this.getDuration();
            const percentage = (e.offsetX / progressBar.offsetWidth) * 100;
            progressFill.style.flexBasis = `${percentage}%`;
        });

        this.__nodeOn(progressBar, 'mouseleave', () => {
            const duration = this.getDuration();
            const currentTime = this.getCurrentTime();
            const percentage = Math.floor((100 / duration) * currentTime);
            progressFill.style.flexBasis = `${percentage}%`;
        });
    }

    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);
    container.appendChild(progressContainer);
}
