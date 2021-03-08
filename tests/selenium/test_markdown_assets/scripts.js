window.hljs = {
    getLanguage: lang => false, // force auto-highlight
    highlightAuto: str => { return { value: 'hljs override' } }
};