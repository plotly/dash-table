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

    const left = (parentBounds.left - positionalBounds.left) + positionalParent.scrollLeft;
    const top = (parentBounds.top - positionalBounds.top) + positionalParent.scrollTop + parentBounds.height;

    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    el.style.position = 'absolute';
};