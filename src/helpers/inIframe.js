// from https://stackoverflow.com/a/326076/1335287
// This will help detect if the player is running inside an iframe

export default function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
