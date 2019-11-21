export default function preloadIcons(iconsList, base = '.') {
    iconsList?.forEach(iconName => {
        const img = new Image();
        img.src = `${base}/icons/${iconName}.svg`;
    });
}
