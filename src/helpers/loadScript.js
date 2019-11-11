export default function loadScript(url, onLoad, container = document.body) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            if (onLoad) onLoad();
            resolve();
        };
        container.appendChild(script);
    });
}
