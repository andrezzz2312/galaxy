const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Galaxy',
			filename: 'index.html',
			template: 'src/index.html',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: 'src/index.css',
					to: '',
				},
				{
					from: 'src/sonidos',
					to: 'sonidos',
				},
				{
					from: 'src/texturas',
					to: 'texturas',
				},
			],
		}),
	],
}
