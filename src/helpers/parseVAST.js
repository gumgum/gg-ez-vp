import { DEFAULT_VAST_OPTIONS } from '../constants';
import { VASTClient } from 'vast-client';
import addOverlays from '../helpers/addOverlays';
import mediaFilesReducer from '../helpers/mediaFilesReducer';
import replaceVASTMacros from '../helpers/replaceVASTMacros';

// Wrapper for VAST-Client.get()
export default async function parseVAST(src, options = DEFAULT_VAST_OPTIONS) {
    // Instantiate VASTClient
    const vastClient = new VASTClient();
    const srcWithSupportedMacros = replaceVASTMacros(src);
    // Request and parse vast tag
    const parsedVAST = await vastClient.get(srcWithSupportedMacros, options);
    this.VASTData = parsedVAST;
    const ad = parsedVAST?.ads[0];
    const creative = ad?.creatives[0];
    if (!creative) return;

    let VPAIDSource;
    if (creative.type === 'linear') {
        const { mediaFiles = [] } = creative;
        // Separate any JavaScript files from MediaFiles
        const sources = mediaFilesReducer(mediaFiles);
        this.VASTSources = sources;
        VPAIDSource = sources.javascript.find(({ apiFramework }) => apiFramework === 'VPAID');
    } else if (creative.type === 'nonlinear') {
        VPAIDSource = {
            fileURL: creative?.variations[0].staticResource
        };
    }
    // Adds ovelrlays to block and handle clicks from mobile
    addOverlays.call(this, !!VPAIDSource);

    // Load VPAID and run it
    if (VPAIDSource) {
        this.isVPAID = true;
        return this.__runVPAID(creative, VPAIDSource, vastClient, ad);
    }
    // if there is no VPAID, fallback to VAST tracking
    this.__enableVASTTracking(vastClient, ad, creative);
}
