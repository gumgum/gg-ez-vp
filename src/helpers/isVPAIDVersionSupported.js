import { SUPPORTED_VPAID_VERSION } from '../constants';
const floatParser = Number.parseFloat || parseFloat;
const playerVersion = floatParser(SUPPORTED_VPAID_VERSION);

export default function isVPAIDVersionSupported(creativeVersionStr) {
    const creativeVersion = floatParser(creativeVersionStr);
    const isSupported = creativeVersion <= playerVersion;
    return isSupported;
}
