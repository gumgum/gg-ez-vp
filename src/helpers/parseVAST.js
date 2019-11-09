import { VASTClient } from 'vast-client';
import { DEFAULT_VAST_OPTIONS } from '../constants';
import mediaFilesReducer from '../helpers/mediaFilesReducer';
import replaceVASTMacros from '../helpers/replaceVASTMacros';

// Wrapper for VAST-Client.get()
export default async function parseVAST(src, options = DEFAULT_VAST_OPTIONS) {
    // Instantiate VASTClient
    const vastClient = new VASTClient();
    const srcWithSupportedMacros = replaceVASTMacros(src);
    // Request and parse vast tag
    const parsedVAST = await vastClient.get(srcWithSupportedMacros, options);
    const ad = parsedVAST?.ads[0];
    const linearCreative = ad?.creatives?.find(({ type }) => type === 'linear');
    if (!linearCreative) return;

    const { mediaFiles = [] } = linearCreative;
    // Separate any JavaScript files from MediaFiles
    const sources = mediaFilesReducer(mediaFiles);
    this.VASTSources = sources;
    const VPAIDSource = sources.javascript.find(({ apiFramework }) => apiFramework === 'VPAID');

    // Load VPAID and run it
    if (VPAIDSource) {
        this.isVPAID = true;
        return this.__runVPAID(linearCreative, VPAIDSource);
    }

    // if there is no VPAID, fallback to VAST tracking
    this.__enableVASTTracking(vastClient, ad, linearCreative);
}
