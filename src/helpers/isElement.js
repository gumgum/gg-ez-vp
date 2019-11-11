export default function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}
