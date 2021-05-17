module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/i,

				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg|png|jpg|jpeg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
		],
	},
};
