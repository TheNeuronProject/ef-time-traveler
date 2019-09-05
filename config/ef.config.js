import camelCase from 'camelcase'

import packageInfo from '../package.json'

const production = process.env.NODE_ENV === 'production'
const getOutputPath = (relativePath) => {
	if (production) return `dist/${relativePath}`
	return `dev/${relativePath}`
}

export default {
	efCoreModule: 'EFCore',
	input: 'src/time-traveler.js',
	name: camelCase(packageInfo.name, {pascalCase: true}),
	format: 'umd', // Choose from iife, amd, umd, cjs, esm, system
	bundle: 'time-traveler',
	devPath: 'dev',
	proPath: 'dist',
	copyOptions: [
		[
			{files: 'test/index.html', dest: getOutputPath('')}
		],
		{verbose: true, watch: true}
	]
}
