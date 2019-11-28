import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
// import livereload from 'rollup-plugin-livereload';
// import execute from 'rollup-plugin-execute';
import browsersync from 'rollup-plugin-browsersync';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import alias from '@rollup/plugin-alias';
import scss from 'rollup-plugin-scss'
import html from 'rollup-plugin-bundle-html';
// import replace from '@rollup/plugin-replace'; //replace strings from code
import autoPreprocess from 'svelte-preprocess';
import htmlMinifier from 'rollup-plugin-html-minifier'

const production = process.env.PRODUCTION;

var rollupConfig = {
	input: 'src/js/app.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public_html/js/main.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('src/scss/dist/build.css');
			},
			preprocess: autoPreprocess()
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		// !production && serve(),

		// Watch the `public_html` directory and refresh the
		// browser on changes when not in production
		// !production && livereload('public_html'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		//copy always
		// copy({
		// 	targets: [
		// 		{
		// 			src: 'src/to_public/*',
		// 			dest: 'public_html'
		// 		}
		// 	]
		// }),
		// production && terser(),
		// !production && browsersync({
		// 	watch: true,
		// 	// server: 'public_html',
		// 	proxy: 'sveltrend.test',
		// 	browser: "google chrome"
		// })
		babel({
			exclude: 'node_modules/**'
		}),
		alias({
			entries: {
				_src: __dirname + 'src',
				_components: __dirname + 'src/js/components',
				_assets: __dirname + 'src/assets',
			},
			resolve: ['.svelte', '.js'],
		}),
		html({
			template: 'src/index.template.html',
			// or html code: '<html><head></head><body></body></html>'
			dest: 'public_html',
			filename: 'index.template',
			// inject: 'head',
			// externals: [
			// 	{ type: 'js', file: "file1.js", pos: 'before' },
			// 	{ type: 'js', file: "file2.js", pos: 'before' }
			// ]
		}),
	],
};

if (production) {
	// al inicio del array
	rollupConfig.plugins.unshift(
		htmlMinifier({
			removeComments: true,
			removeEmptyElements: false,
			// collapseWhitespace: true,
			// conservativeCollapse: true,
			// preserveLineBreaks: true,
			minifyCSS: {
				format: 'beautify'
			}
		}),
	)
	// al final del array
	rollupConfig.plugins.push(
		//terser minifier
		terser(),
		copy({
			targets: [
				{
					src: ['src/production_only/*', 'src/to_public/*'],
					dest: 'public_html',
					dot: true,
				}
			]
		}),
		scss({
			output: 'public_html/css/main.css',
			outputStyle: 'compressed',
			failOnError: true,
		}),
		// replace({
		// 	__API_: 'PRODUCTION_URL',
		// 	// delimiters: ['', '']
		// }),
	)
	// rollupConfig.plugins.push(terser());
	// rollupConfig.plugins.copy.targets.push(terser())
} else {
	// rollupConfig.plugins.push(
	// 	browsersync({
	// 		watch: true,
	// 		// server: 'public_html',
	// 		proxy: 'sveltrend.test',
	// 		browser: "google chrome"
	// 	}),
	// )
	rollupConfig.output.sourcemap = true;
	rollupConfig.plugins.push(
		copy({
			targets: [
				{
					src: ['src/dev_only/*', 'src/to_public/*'],
					dest: 'public_html',
					dot: true,
				}
			]
		}),
		scss({
			output: 'public_html/css/main.css',
			// sourceMap: true,//not supported as of 25/11/2019
			sourceMapEmbed: true,
			// sourceMap: true,
			// outfile: 'public_html/css/main.css',
			failOnError: true,
		}),
		// replace({
		// 	__API_: 'DEV_URL',
		// 	// delimiters: ['', '']
		// }),
	)
	if (process.env.ROLLUP_WATCH) {
		//if watch mode
		// const rollup = require('rollup')
		// ,sass = require('node-sass');
		rollupConfig.watch = ({
			clearScreen: false
		});
		// .on('START', event => {
		// 	console.log('refresh')
		// 	// event.code can be one of:
		// 	//   START        — the watcher is (re)starting
		// 	//   BUNDLE_START — building an individual bundle
		// 	//   BUNDLE_END   — finished building a bundle
		// 	//   END          — finished building all bundles
		// 	//   ERROR        — encountered an error while bundling
		// 	//   FATAL        — encountered an unrecoverable error
		// });
		rollupConfig.plugins.push(
			// execute('npm run sass -- --update'),
			browsersync({
				watch: true,
				// server: 'public_html',
				proxy: 'sveltrend.test',
				browser: "chrome"
			}),
		)
	}
}

// Object.keys(rollup).forEach(k => {
// 	// console.log(rollup[k])
// 	// if (typeof rollup[k] === 'object' && rollup[k] !== null){
// 		rollupConfig[k] = Object.assign(rollup[k], env[k])
// 	// }
// });
// rollupConfig = rollup
// console.log(rollup)

// function serve() {
// 	let started = false;

// 	return {
// 		writeBundle() {
// 			if (!started) {
// 				started = true;

// 				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
// 					stdio: ['ignore', 'inherit', 'inherit'],
// 					shell: true
// 				});
// 			}
// 		}
// 	};
// }
// console.log(rollupConfig.plugins)
export default rollupConfig