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

    console.log({ VASTData });

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
    console.log({ VASTData });

    const VASTSources = isVAST ? VASTData?.sources.media.map(({ fileURL }) => fileURL) : null;

    // Find the sources for media playback
    const sources = VASTSources || (typeof src === 'string' ? [src] : src);
    console.log('sources');
    console.log({ sources });

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
        player.appendChild(source);
    });

    // Insert the video node
    container.appendChild(player);
}

const isBooleanAttr = k => ['autoplay', 'loop', 'playsinline', 'webkit-playsinline'].includes(k);
