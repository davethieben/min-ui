const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "min.js",
        path: path.resolve(__dirname, "dist"),
    },
};
