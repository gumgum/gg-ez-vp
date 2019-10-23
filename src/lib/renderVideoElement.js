import applyConfigToVideoElement from '../helpers/applyConfigToVideoElement';

export default function renderVideoElement() {
    const {
        player,
        container,
        isVPAID,
        VASTSources,
        config: { src, width, height, autoplay, volume, muted, poster, preload, loop, playsinline }
    } = this;

    // Group all the video element attributes
    const configAttributes = {
        muted,
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

    applyConfigToVideoElement({ src, configAttributes, player, isVPAID, VASTSources });

    // Insert the video node
    container.appendChild(player);
}
