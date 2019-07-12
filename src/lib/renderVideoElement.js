export default function renderVideoElement(playerInstance) {
    const {
        container,
        config: { src, width, height, autoplay, volume, muted, poster, preload, loop }
    } = playerInstance;

    // Group all the video element attributes
    const attrsConfig = {
        volume,
        width,
        height,
        autoplay,
        poster,
        preload,
        loop
    };

    // Validate that there is a source
    if (!src) {
        throw new Error('No file source found. Is src set?');
    }

    // validate the source is an accepted type (string | array)
    if (typeof src !== 'string' && !Array.isArray(src)) {
        throw new Error('src should be either a string or an array of strings');
    }

    // Create an array of tuples with the filtered attributes to be added to the video node
    const attributes = Object.keys(attrsConfig).reduce((attrs, key) => {
        const value = attrsConfig[key];
        if (value) {
            return [...attrs, [key, value]];
        }
        return attrs;
    }, []);

    // Find the sources for media playback
    const sources = typeof src === 'string' ? [src] : src;

    // Create the video node
    const video = document.createElement('video');

    // Set the default muted value
    video.muted = muted;

    // Add all attributes to the video node
    attributes.forEach(([key, value]) => {
        video.setAttribute(key, isBooleanAttr(key) ? key : value);
    });

    // Add all sources to the video node
    sources.forEach(s => {
        const source = document.createElement('source');
        source.src = s;
        // TODO: need a better way to set type
        source.type = `video/${s.split('.').reverse()[0]}`;
        video.appendChild(source);
    });

    // Insert the video node
    container.appendChild(video);

    // Return the video container to the class
    return video;
}

const isBooleanAttr = k => ['autoplay', 'loop'].includes(k);
