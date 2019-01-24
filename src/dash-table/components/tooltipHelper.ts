export default (
    el: HTMLElement | null,
    parent: HTMLElement | null = null
) => {
    parent = parent || (() => {
        parent = el;

        while (parent && parent.nodeName.toLowerCase() !== 'td') {
            parent = parent.parentElement;
        }

        return parent;
    })();

    if (!el || !parent) {
        return;
    }

    let positionalParent = el;
    while (getComputedStyle(positionalParent).position !== 'relative' &&
        getComputedStyle(positionalParent).position !== 'sticky') {
        if (!positionalParent.parentElement) {
            break;
        }

        positionalParent = positionalParent.parentElement;
    }

    let relativeParent = el;
    while (getComputedStyle(relativeParent).position !== 'relative') {
        if (!relativeParent.parentElement) {
            break;
        }

        relativeParent = relativeParent.parentElement;
    }

    const positionalBounds = positionalParent.getBoundingClientRect();

    const parentBounds = parent.getBoundingClientRect();

    const leftCorrection = (parentBounds.width - el.clientWidth) / 2;
    let left = (parentBounds.left - positionalBounds.left) + positionalParent.scrollLeft + leftCorrection;
    let top = (parentBounds.top - positionalBounds.top) + positionalParent.scrollTop + parentBounds.height;

    const { clientWidth: elWidth, clientHeight: elHeight } = el;
    const { scrollLeft: vwLeft, scrollTop: vwTop, clientWidth: vwWidth, clientHeight: vwHeight } = document.body;

    // too far left
    if (left < vwLeft) {
        left = vwLeft;
    }

    // too far right
    if (left + elWidth > vwLeft + vwWidth) {
        left = (vwLeft + vwWidth) - elWidth;
    }

    // too low
    if (top + elHeight > vwTop + vwHeight) {
        top = (parentBounds.top - positionalBounds.top) + positionalParent.scrollTop - elHeight;
    }

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.position = 'absolute';
};