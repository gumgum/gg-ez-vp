// taken from https://codepen.io/bfintal/pen/Ejvgrp?editors=0010
export default function isElementInView(element) {
    const scroll = window.scrollY || window.pageYOffset;
    const boundsTop = element.getBoundingClientRect().top + scroll;

    const viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight
    };

    const bounds = {
        top: boundsTop,
        bottom: boundsTop + element.clientHeight
    };

    return (
        (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
        (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
    );
}
