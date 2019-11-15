export default function applyConfigToVideoElement({
    src,
    configAttributes: { muted, ...configAttributes },
    player,
    isVPAID,
    VASTSources
}) {
    player.muted = muted;
    appendVideoAttributes(configAttributes, player);
    if (isVPAID) return;
    appendVideoSources(src, player, VASTSources);
}

function appendVideoAttributes(configAttributes, player) {
    // Create an array of tuples with the filtered attributes to be added to the video node
    const attributes = Object.keys(configAttributes).reduce((attrs, key) => {
        const value = configAttributes[key];
        if (value) {
            return [...attrs, [key, value]];
        }
        return attrs;
    }, []);

    // Add all attributes to the video node
    attributes.forEach(([key, value]) => {
        player.setAttribute(key, isBooleanAttr(key) ? '' : value);
    });
}

function appendVideoSources(src, player, VASTSources) {
    const origin = VASTSources?.media || src;
    const sources = Array.isArray(origin) ? origin : [origin];

    // Add all sources to the video node
    sources.forEach(s => {
        const isVASTMediaFile = !!s.fileURL;
        const src = isVASTMediaFile ? s.fileURL : s;
        const source = document.createElement('source');
        source.src = src;
        if (isVASTMediaFile) {
            source.type = s.mimeType;
        }
        player.appendChild(source);
    });
}

const isBooleanAttr = k =>
    ['autoplay', 'loop', 'muted', 'playsinline', 'webkit-playsinline'].includes(k);