/*
 * @file webpack.config.js
 * @author Caleb Burke
 * @version 1.0
 * @date June 15, 2023
 *
 * My webpack config file for 'compiling' js for 
 * client side scripts.
 * 
 * NOTE: Currently this project has not been configured to use webpack. This 
 * config exists to slowly incorporate webpack
 *
*/

const path = require('path');

module.exports = {
    entry: './public/assets/js/sidebar.js',
    output: {
        filename: 'sidebar.js',
        path: path.resolve(__dirname, 'dist'),
    },
};