export function isDescendant(child, parent) {
    if (child && child.parentElement === parent) {
        return true;
    } else if (child.parent) {
        return isDescendant(child, child.parentElement);
    }

    return false;
}