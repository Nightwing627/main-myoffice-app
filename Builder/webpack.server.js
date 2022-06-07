//webpack.config.js
require('dotenv').config()
const path = require('path');
const pkg = require('./package')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')


const externals = [
    'firebase-admin',
    'md5',
    'querystring',
    'dotenv'
]

const genPackage = () => ({
    name: 'functions',
    private: true,
    main: 'paddle.js',
    author:"@ddimov",
    license: 'MIT',
    dependencies: externals.reduce(
    (acc, name) =>
        Object.assign({}, acc, {
        [name]:
            pkg.dependencies[name] ||
            pkg.devDependencies[name]
        }),
    {}
    )
})


module.exports = {
    target: 'node',
    resolve: {
        mainFields: ['module', 'main']
    },
    externals: externals.reduce(
        (acc, name) => Object.assign({}, acc, { [name]: true }),
        {}
    ),
    plugins: [new GenerateJsonPlugin('package.json', genPackage())]
}
