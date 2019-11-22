// from https://stackoverflow.com/a/326076/1335287

export default function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
