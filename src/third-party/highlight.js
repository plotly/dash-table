import highlightjs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';

import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import http from 'highlight.js/lib/languages/http';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import julia from 'highlight.js/lib/languages/julia';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

highlightjs.registerLanguage('bash', bash);
highlightjs.registerLanguage('css', css);
highlightjs.registerLanguage('http', http);
highlightjs.registerLanguage('javascript', javascript);
highlightjs.registerLanguage('json', json);
highlightjs.registerLanguage('julia', julia);
highlightjs.registerLanguage('markdown', markdown);
highlightjs.registerLanguage('plaintext', plaintext);
highlightjs.registerLanguage('python', python);
highlightjs.registerLanguage('r', r);
highlightjs.registerLanguage('ruby', ruby);
highlightjs.registerLanguage('shell', shell);
highlightjs.registerLanguage('sql', sql);
highlightjs.registerLanguage('xml', xml);
highlightjs.registerLanguage('yaml', yaml);

export default highlightjs;
