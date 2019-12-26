import { TIMESTAMP_AD, SKIP, VOLUME, PROGRESS, TIMESTAMP, PLAY, EXPAND } from '../../constants';

import timestampAd from './timestampAd';
import volume from './volume';
import expand from './expand';
import skip from './skip';
import progress from './progress';
import timestamp from './timestamp';
import play from './play';

export default function renderControls() {
    const { container, config, __onTouchScreen, controlsRendered } = this;
    // Cancel if controls are already rendered
    if (controlsRendered) return;
    // Include a blocker div between viewer and controls
    this.__addBlockerOverlay();
    if (!config.controls) return;
    const isAd = config.adControls;
    const controls = document.createElement('div');
    if (isAd) container.classList.add(this.__getCSSClass('no-scrub'));
    if (__onTouchScreen) container.classList.add(this.__getCSSClass('touchscreen'));
    controls.classList.add(this.__getCSSClass('controls'));
    nodeRenderer.call(this, config, sections, controls);
    container.appendChild(controls);
    // Set flag for successful controls rendering
    this.controlsRendered = true;
}

function nodeRenderer(config, sections, container) {
    const { controls, adControls } = config;
    sections.forEach(node => {
        const { name, tagType, children, component } = node;
        const isAllowed = shouldNodeRender(node, adControls, controls);
        if (!isAllowed) return;
        if (tagType) {
            const node = document.createElement(tagType);
            const className = this.__getCSSClass(name);
            node.classList.add(className);
            if (children?.length) nodeRenderer.call(this, config, children, node);
            container.appendChild(node);
        }
        if (component) component.call(this, container);
    });
}

const shouldNodeRender = (node, isAd, controlsConfig) => {
    const { isAdComponent, tagType, children, component, name } = node;
    const nodeTypeAllowed =
        isAdComponent === undefined || (isAd && isAdComponent) || (!isAd && !isAdComponent);
    const isBottom = name === 'bottom'; // display bottom container all the time
    const componentIsOn = controlsConfig[name];
    if (!tagType && component) return nodeTypeAllowed && componentIsOn;
    const childrenWillRender = children?.some(c => shouldNodeRender(c, isAd, controlsConfig));
    return isBottom || (nodeTypeAllowed && childrenWillRender);
};

const sections = [
    {
        name: 'top',
        tagType: 'div',
        children: [
            {
                name: 'item-left',
                tagType: 'div',
                isAdComponent: true,
                children: [
                    {
                        name: TIMESTAMP_AD,
                        component: timestampAd
                    },
                    {
                        name: VOLUME,
                        component: volume
                    }
                ]
            },
            {
                name: 'item-right',
                tagType: 'div',
                isAdComponent: true,
                children: [
                    {
                        name: EXPAND,
                        component: expand
                    },
                    {
                        name: SKIP,
                        component: skip
                    }
                ]
            }
        ]
    },
    {
        name: 'middle',
        tagType: 'div',
        children: [{ name: PROGRESS, component: progress }]
    },
    {
        name: 'bottom',
        tagType: 'div',
        children: [
            {
                name: 'item-left',
                tagType: 'div',
                isAdComponent: false,
                children: [
                    {
                        name: TIMESTAMP,
                        component: timestamp
                    },
                    {
                        name: PLAY,
                        component: play
                    },
                    {
                        name: VOLUME,
                        component: volume
                    }
                ]
            },
            {
                name: 'item-right',
                tagType: 'div',
                isAdComponent: false,
                children: [
                    {
                        name: EXPAND,
                        component: expand
                    }
                ]
            }
        ]
    }
];
