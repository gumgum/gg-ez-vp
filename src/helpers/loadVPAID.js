const SCRIPT_ID = 'adloaderscript';

export default function loadVPAID(url, container) {
    return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.id = `adloaderframe_${Date.now()}`;
        iframe.setAttribute(
            'style',
            'border:0px;margin:0px;opacity:1;padding:0px;height:100%;position:absolute;width:100%;top:0;left:0;'
        );
        container.prepend(iframe);
        // url points to the ad js file
        iframe.contentWindow.document.write(
            // split the end script tag to prevent closing js prematurely
            `<head></head><body><script id="${SCRIPT_ID}" src="${url}" async></scr` + 'ipt></body>'
        );

        const script = iframe.contentWindow.document.getElementById(SCRIPT_ID);
        let VPAIDCreative = getVPAIDCreative(iframe);

        // retrieve cached creative
        if (VPAIDCreative) {
            return resolve({ VPAIDCreative, iframe });
        }

        // or load script
        script.onload = () => {
            VPAIDCreative = getVPAIDCreative(iframe);
            resolve({ VPAIDCreative, iframe });
        };

        // handle errors
        script.onerror = reject;
    });
}

function getVPAIDCreative(iframe) {
    const creativeGetter = iframe.contentWindow.getVPAIDAd;
    if (creativeGetter && typeof creativeGetter === 'function') {
        const VPAIDCreative = creativeGetter();
        return VPAIDCreative;
    }
}
