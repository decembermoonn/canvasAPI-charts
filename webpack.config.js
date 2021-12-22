module.exports = {
    entry: './src/interface/ChartServant.ts',
    experiments: {
        outputModule: true,
    },
    output: {
        filename: 'bundle.js',
        library: {
            type: 'module',
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
};