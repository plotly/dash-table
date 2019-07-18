import { config, library, dom } from '@fortawesome/fontawesome-svg-core';
import { faEyeSlash, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEraser, faPencilAlt, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

config.searchPseudoElements = true;

library.add(
    faEraser,
    faEyeSlash,
    faPencilAlt,
    faSort,
    faSortDown,
    faSortUp,
    faTrashAlt
);

dom.watch();
