module.exports = {
    entry: './main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "ToyReact.createElement" }]]
                    }
                }
            }
        ]
    },
    // 开发模式，配置完后，可以在浏览器看到正常代码，方便调试
    mode: "development",
    optimization: {
        minimize: false
    }
};
