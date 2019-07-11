export default function renderVideoElement(playerInstance) {
    const {
        config: { src },
        container
    } = playerInstance;
    if (!src) {
        throw new Error('No file source found. Is src set?');
    }
    if (typeof src !== 'string' && !Array.isArray(src)) {
        throw new Error('src should be either a string or an array of strings');
    }
    const sources = typeof src === 'string' ? [src] : src;
    const video = document.createElement('video');
    sources.forEach(s => {
        const source = document.createElement('source');
        source.src = s;
        // TODO: need a better way to set type
        source.type = `video/${s.split('.').reverse()[0]}`;
        video.appendChild(source);
    });
    // TODO: Add more properties
    container.appendChild(video);
    return video;
}
