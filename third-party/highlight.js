import highlightjs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/github.css';

import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

highlightjs.registerLanguage('bash', bash);
highlightjs.registerLanguage('css', css);
highlightjs.registerLanguage('javascript', javascript);
highlightjs.registerLanguage('json', json);
highlightjs.registerLanguage('markdown', markdown);
highlightjs.registerLanguage('python', python);
highlightjs.registerLanguage('r', r);
highlightjs.registerLanguage('shell', shell);
highlightjs.registerLanguage('typescript', typescript);
highlightjs.registerLanguage('xml', xml);

export default highlightjs;
