import { VASTClient } from 'vast-client/dist/vast-client-module.min';

export default async function parseAdXML(playerInstance) {
    const {
        config: { isVAST, src }
    } = playerInstance;

    // validate isVAST value is right
    if (isVAST !== true) {
        throw new Error('isVAST should be true to parse src as an ad');
    }

    // Validate that there is a source
    if (!src || typeof src !== 'string') {
        throw new Error('src must be a URL string');
    }

    const vastClient = new VASTClient();

    // Request and parse vast tag
    const data = await vastClient.get(src);

    return data;
}
