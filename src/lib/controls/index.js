import { TIMESTAMP_AD, SKIP, VOLUME, PROGRESS, TIMESTAMP, PLAY, EXPAND } from '../../constants';

import timestampAd from './timestampAd';
import volume from './volume';
import expand from './expand';
import skip from './skip';
import progress from './progress';
import timestamp from './timestamp';
import play from './play';

export default function renderControls() {
    const { container, player, config } = this;
    if (!config.controls) return;

    const controls = document.createElement('div');
    controls.classList.add(this.__getCSSClass('controls'));
    nodeRenderer.call(this, config, sections, controls);
    container.appendChild(controls);
}

function nodeRenderer(config, sections, container) {
    const { isVAST, controls, isAd } = config;
    const shouldRenderAdBar = isAd || isVAST;
    sections.forEach(({ name, tagType, children, component, showOnAd }) => {
        const isAllowed = shouldNodeRender(showOnAd, shouldRenderAdBar);
        if (!isAllowed) return;
        if (tagType) {
            const node = document.createElement(tagType);
            const className = this.__getCSSClass(name);
            node.classList.add(className);
            if (children?.length) nodeRenderer.call(this, config, children, node);
            container.appendChild(node);
        }
        if (component && controls[name]) component.call(this, container);
    });
}

const shouldNodeRender = (showOnAd, shouldRenderAdBar) => {
    if (
        showOnAd === undefined ||
        (shouldRenderAdBar && showOnAd) ||
        (!shouldRenderAdBar && !showOnAd)
    )
        return true;
    return false;
};

const sections = [
    {
        name: 'top',
        tagType: 'div',
        children: [
            {
                name: 'item-left',
                tagType: 'div',
                showOnAd: true,
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
                showOnAd: true,
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
                showOnAd: false,
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
                showOnAd: false,
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
