export default function GgEzControls(playerInstance) {
    const {
        container,
        config: { controls, muted }
    } = playerInstance;

    if (!controls) return null;

    const controlContainer = document.createElement('div');
    controlContainer.id = `${container.id}-GgEzControls`;
    controlContainer.className = 'gg-ez-controls';

    const leftControls = document.createElement('div');
    leftControls.className = 'left-controls';
    const rightControls = document.createElement('div');
    rightControls.className = 'right-controls';

    if (controls.play) {
        const playPause = document.createElement('div');
        playPause.className = 'gg-ez-control-icon gg-ez-playpause';
        playPause.documentCreate = 'background-image: url(dist/img/play.svg)';
        leftControls.append(playPause);
    }

    controlContainer.append(leftControls, rightControls);
    container.append(controlContainer);

    return document.getElementById(controlContainer.id);
}
