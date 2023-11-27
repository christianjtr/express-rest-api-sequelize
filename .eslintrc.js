module.exports = {
    'env': {
        'commonjs': true,
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'eol-last': 'error',
        'object-curly-spacing': ['error', 'always'],
        'no-multi-spaces': 'error'

    }
};
