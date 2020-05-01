import createNode from './createNode';
// Add a div that can be used to prevent clicks on the VAST through CSS pointer-events: none
// Include a div for the VPAID slot (clicks go here)
export default function addOverlays(isVPAID) {
    if (isVPAID) {
        const slot = createNode('div', this.__getCSSClass('slot'));
        this.playerContainer.appendChild(slot);
        this.__slot = slot;
    }
    const blocker = createNode('div', this.__getCSSClass('blocker'));
    this.container.appendChild(blocker);
    this.__blocker = blocker;
}
