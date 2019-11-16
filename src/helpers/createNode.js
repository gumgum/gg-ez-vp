// This will just create a node, the caller should attach it to the DOM
// and add content how/when it sees fit
export default function createNode(tagName, classNames = [], attributes) {
    const node = document.createElement(tagName);
    const classList = Array.isArray(classNames) ? classNames : [classNames];
    if (classList?.length) {
        node.classList.add(...classList);
    }
    if (typeof attributes === 'object' && attributes !== null) {
        Object.keys(attributes).forEach(attr => {
            const value = attributes[attr];
            node.setAttribute(attr, value);
        });
    }
    return node;
}
