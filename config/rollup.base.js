import path from 'path'
import chalk from 'chalk'

// Rollup plugins
import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import progress from 'rollup-plugin-progress'
import json from 'rollup-plugin-json'
import eft from 'rollup-plugin-eft'
import postcss from 'rollup-plugin-postcss'
import inject from 'rollup-plugin-inject'
import {eslint} from 'rollup-plugin-eslint'
import {uglify} from 'rollup-plugin-uglify'

// Postcss plugins
// import postcssModules from 'postcss-modules'
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'

// ef configuration
import efConfig from './ef.config.js'
const {
	efCoreModule,
	input,
	name,
	format,
	bundle,
	devPath,
	proPath,
	copyOptions,
} = efConfig

console.log('Target:', chalk.bold.green(process.env.NODE_ENV || 'development'))


export default {
	input,
	name,
	format,
	bundle: path.normalize(bundle),
	devPath: path.normalize(devPath),
	proPath: path.normalize(proPath),
	copyOptions,
	plugins: [
		progress({
			clearLine: false
		}),
		eslint(),
		resolve({
			browser: true,
			extensions: ['.mjs', '.js', '.jsx', '.json', '.node']
		}),
		json(),
		postcss({
			extract: true,
			minimize: process.env.NODE_ENV === 'production',
			sourceMap: process.env.NODE_ENV !== 'production',
			plugins: [
				simplevars(),
				nested(),
				cssnext({ warnForDuplicates: false })
			]
		}),
		eft(),
		buble({
			transforms: {
				modules: false,
				dangerousForOf: true
			},
			objectAssign: 'Object.assign',
			jsx: `${efCoreModule}.createElement`,
			jsxFragment: `${efCoreModule}.Fragment`
		}),
		inject({
			include: ['**/*.js', '**/*.jsx'],
			exclude: 'node_modules/**',
			modules: {
				[efCoreModule]: ['ef-core', '*']
			}
		}),
		commonjs(),
		replace({
			'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
		}),
		(process.env.NODE_ENV === 'production' && uglify())
	]
}
