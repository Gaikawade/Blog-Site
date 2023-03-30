const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
	entry: path.join(__dirname, "src", "index.js"),
	output: {
		path: path.resolve(__dirname, "static/react"),
		filename: "index.bundle.js",
		publicPath: "static/react",
	},
	mode: "development",
	devServer: {
		static: { directory: path.join(__dirname, "src") },
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
		],
	},
	plugins: [
		new HTMLPlugin({
			template: path.join(__dirname, "src/index.html"),
		}),
		new FileManagerPlugin({
			events: {
				onStart: {
					delete: [
						path.join(__dirname, "templates", "base.html"),
						path.join(__dirname, "static/react/index.bundle.js"),
					],
				},
				onEnd: {
					move: [
						{
							source: path.join(__dirname, "./static/react/index.html"),
							destination: path.join(__dirname, "templates", "base.html"),
						},
					],
				},
			},
		}),
	],
};
