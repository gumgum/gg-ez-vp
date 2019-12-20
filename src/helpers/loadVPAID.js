const SCRIPT_ID = 'adloaderscript';

export default function loadVPAID(url, container) {
    return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.id = 'adloaderframe';
        iframe.setAttribute(
            'style',
            'border: 0px;margin: 0px;opacity: 1;padding:0px;height: 100%;position: absolute;width: 100%;top: 0;left: 0;'
        );
        container.appendChild(iframe);
        // url points to the ad js file
        iframe.contentWindow.document.write(
            // split the end script tag to prevent closing js prematurely
            `<head></head><body><script id="${SCRIPT_ID}" src="${url}"></scr` + 'ipt></body>'
        );

        const script = iframe.contentWindow.document.getElementById(SCRIPT_ID);

        script.onload = function() {
            const fn = iframe.contentWindow.getVPAIDAd;
            if (fn && typeof fn == 'function') {
                const VPAIDCreative = fn();
                resolve({ VPAIDCreative, iframe });
            }
        };

        script.onerror = function(e) {
            reject(e);
        };
    });
}
