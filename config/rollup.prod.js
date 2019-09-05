// Import base config
import base from './rollup.base'

const {input, name, format, plugins, proPath, bundle} = base

const config = {
	input,
	output: {
		name,
		format,
		file: `${proPath}/${bundle}${process.env.NODE_ENV === 'production' && '.min' || '.dev'}.js`,
		sourcemap: process.env.NODE_ENV !== 'production',
		globals: {
			'ef-core': 'ef'
		}
	},
	plugins,
	external: ['ef-core']
}

export default config
