import { VASTClient } from 'vast-client';
import { JAVASCRIPT_MIME_TYPES, DEFAULT_VAST_OPTIONS } from '../constants';

// Wrapper for VAST-Client.get()
export default async function parseVAST(src, options = DEFAULT_VAST_OPTIONS) {
    try {
        // Instantiate VASTClient
        const vastClient = new VASTClient();
        // Request and parse vast tag
        const parsedVAST = await vastClient.get(src, options);
        const mediaFiles = parsedVAST.ads[0].creatives[0].mediaFiles;
        // Separate any JavaScript files from MediaFiles
        const sources = mediaFiles.reduce(
            (acc, mediaFile) => {
                const isJavaScript = JAVASCRIPT_MIME_TYPES.includes(mediaFile.mimeType);
                if (isJavaScript) {
                    acc.javascript.push(mediaFile);
                } else {
                    acc.media.push(mediaFile);
                }
                return acc;
            },
            { javascript: [], media: [] }
        );
        // TODO: execute javascript files
        // TODO: get javascript files for VAST 4.1
        // TODO: set up tracking events
        return {
            parsedVAST,
            sources
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
}
