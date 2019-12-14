/* Note: volume can only be set by the user in Safari Mobile.
 * this.player.volume is read-only and will always return 1.
 * https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html
 * On other browsers, the muted configuration will take precedence over volume.
 */

export default function applyConfigToVideoElement({
    src,
    configAttributes: { muted, volume, ...configAttributes },
    player,
    isVPAID,
    VASTSources,
    setVolume
}) {
    const initialVolume = muted || !volume ? 0 : volume;
    setVolume(initialVolume);
    appendVideoAttributes({ ...configAttributes, volume: initialVolume }, player);
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
