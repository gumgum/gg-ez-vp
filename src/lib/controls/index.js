const sections = {
    top: {
        'item-left': [
            {
                name: 'timestampAd',
                showOnAd: true
            },
            {
                name: 'volumeAd',
                showOnAd: true
            }
        ],
        'item-right': [{ name: 'skip', showOnAd: true }]
    },
    middle: [{ name: 'progress' }],
    bottom: {
        'item-left': [
            {
                name: 'timestamp',
                showOnAd: false
            },
            {
                name: 'play',
                showOnAd: false
            },
            {
                name: 'volume',
                showOnAd: false
            }
        ],
        'item-right': [{ name: 'expand' }]
    }
};

export default function renderControls() {
    const {
        container,
        player,
        config: { configControls }
    } = this;
    console.log({ container, player, configControls });

    if (!configControls) return;

    const controls = document.createElement('div');
    controls.classList.add(this.__getCSSClass('controls'));

    //TODO: Render sections
    //const sections = controlSections.forEach(sectionName => {
    //    const section = document.createElement('div');
    //    section.classList.add(this.__getCSSClass(sectionName))
    //})

    Object.keys(configControls).forEach(controlName => {
        const component = configControls[controlName];
        if (component) component.call(this, controls);
    });
    container.appendChild(controls);
}
