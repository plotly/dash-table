module.exports = ({ definitions, variables, ...options } = {}) => ({
    ...options,
    definitions: definitions || [],
    variables: Object.assign({

    }, variables || {})
});