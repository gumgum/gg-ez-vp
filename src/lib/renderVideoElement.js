export default function renderVideoElement() {
    const {
        player,
        container,
        VASTData,
        config: {
            src,
            isVAST,
            width,
            height,
            autoplay,
            volume,
            muted,
            poster,
            preload,
            loop,
            playsinline
        }
    } = this;

    // Group all the video element attributes
    const attrsConfig = {
        volume,
        width,
        height,
        autoplay,
        poster,
        preload,
        loop,
        playsinline,
        'webkit-playsinline': playsinline
    };

    // Validate that there is a source
    if (!src) {
        throw new Error('No file source found. Is src set?');
    }

    // validate the source is an accepted type (string | array)
    if (typeof src !== 'string' && !Array.isArray(src)) {
        throw new Error('src should be either a string or an array of strings');
    }

    // Validate VASTData exists
    if (isVAST && !VASTData) {
        throw new Error('VAST data not found');
    }

    // Create an array of tuples with the filtered attributes to be added to the video node
    const attributes = Object.keys(attrsConfig).reduce((attrs, key) => {
        const value = attrsConfig[key];
        if (value) {
            return [...attrs, [key, value]];
        }
        return attrs;
    }, []);

    const VASTSources = isVAST
        ? VASTData.ads[0].creatives[0].mediaFiles.map(({ fileURL }) => fileURL)
        : null;

    // Find the sources for media playback
    const sources = VASTSources || (typeof src === 'string' ? [src] : src);

    // Set the default muted value
    player.muted = muted;

    // Add all attributes to the video node
    attributes.forEach(([key, value]) => {
        player.setAttribute(key, isBooleanAttr(key) ? '' : value);
    });

    // Add all sources to the video node
    sources.forEach(s => {
        const source = document.createElement('source');
        source.src = s;
        // TODO: need a better way to set type
        source.type = `video/${s.split('.').reverse()[0]}`;
        console.log({ source });
        player.appendChild(source);
    });

    // Insert the video node
    container.appendChild(player);
}

const isBooleanAttr = k => ['autoplay', 'loop', 'playsinline', 'webkit-playsinline'].includes(k);
