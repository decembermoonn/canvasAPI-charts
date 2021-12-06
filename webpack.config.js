// eslint-disable-next-line no-undef
module.exports = {
    entry: './src/components/ChartServant.ts',
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
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'ts-shader-loader'
            }
        ],
    },
};