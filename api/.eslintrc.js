module.exports = {
	env: {
		'node': true,
		'browser': false,
		'commonjs': true,
		'es6': true,
		'mocha': true,
	},
	'extends': [
		'eslint:recommended',
		'airbnb-base',
		'plugin:import/errors',
		'plugin:import/warnings',
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking"
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly',
	},
	"parser": "@typescript-eslint/parser",
	'parserOptions': {
		'ecmaVersion': 2018,
		"project": "./tsconfig.json"
	},
	'rules': {
		'indent': [
			'error',
			2
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		"comma-dangle": ["error", {
				"arrays": "always-multiline",
				"objects": "always-multiline",
				"imports": "always-multiline",
				"exports": "always-multiline",
				"functions": "never"
		}],
		"no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }]
	}
}