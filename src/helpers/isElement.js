export default function isElement(o) {
    return typeof HTMLElement === 'object'
        ? o instanceof HTMLElement //DOM2
        : o &&
              typeof o === 'object' &&
              o !== null &&
              o.nodeType === 1 &&
              typeof o.nodeName === 'string';
}
