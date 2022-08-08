const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
	devServer: {
		static: {
			directory: path.join(__dirname, 'src'),
		},
		compress: true,
		port: 5000,
	},
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	mode: 'development',
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
