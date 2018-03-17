var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: '\w', to: 'index.html' }]
        }
    },
    entry: "./app/index.jsx", // входная точка - исходный файл
    output: {
        path: path.resolve(__dirname, './public'),     // путь к каталогу выходных файлов - папка public
        publicPath: '/public/',
        filename: "bundle.js"       // название создаваемого файла
    },
    devtool: 'inline-source-map',
    module: {
        rules: [   //загрузчик для jsx
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options: {
                    presets: ["env", "react"]    // используемые плагины
                }
            }
        ]
    }
}