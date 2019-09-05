import del from 'del'
import copy from 'rollup-plugin-copy-glob'
// Import base config
import base from './rollup.base'
// Import dev plugins
import liveServer from 'rollup-plugin-live-server'

const { name, plugins, devPath, bundle, copyOptions } = base

plugins.unshift(copy(...copyOptions))
plugins.push(liveServer({
	root: './dev',
	open: true,
	file: 'index.html',
	ignore: '**/*.map'
}))

// Clear previous builds files
del.sync([`${devPath}dev/**`])

const config = {
	input: 'test/main.js',
	output: {
		name,
		format: 'iife',
		file: `${devPath}/${bundle}.js`,
		sourcemap: true,
	},
	plugins,
	watch: {
		chokidar: true,
		include: ['src/**', 'test/**']
	}
}

export default config
