/*
 * @file log.js
 * @author Caleb Burke
 * @version 1.0
 * @date July 5, 2023
 *
 * Functions for logging info, errors, warnings and updates to stdout and 
 * files
 *
 * TODO: Create a better file system for log outputs i.e. different folders 
 *       with descriptive file names 
 * TODO: Create methods of removing old log files autonomously 
*/

require('dotenv').config({ path: '../.env' }); // ONLY USE IN DEV!

const { appendFile } = require('fs');

const PATH = '../logs/';
const LOG_TO_SCREEN = true;

/**
 * Get current timestamp
 * @returns timestamp string in d/m/y h:m:s timezone
 */
function timestamp() {
    return new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    });
}

/**
 * Logs messages to console and/or file.
 * 
 * Logs are in this format:
 * [TYPE] <timestamp> (where log was called) - The message
 * 
 * @param {string} msg - The message to print out
 * @param {string} type - To specify what type of message this is gonna be.
 * This value is simply put at the start of the log i.e. [${type}] ...
 * @param {string} color - The color of the message
 * @param {boolean} out - if the message should be printed to the screen
 * @returns {boolean} if log was successful
 */
function log(msg, type = 'LOG', color = 'white', to_screen = false) {
    let color_code = '\x1b[0m';
    let color_break = '\x1b[0m';

    switch (color) {
        case 'black': color_code = '\x1b[30m'; break;
        case 'red': color_code = '\x1b[31m'; break;
        case 'green': color_code = '\x1b[32m'; break;
        case 'yellow': color_code = '\x1b[33m'; break;
        case 'blue': color_code = '\x1b[34m'; break;
        case 'purle': color_code = '\x1b[35m'; break;
        case 'cyan': color_code = '\x1b[36m'; break;
        case 'white': color_code = '\x1b[37m'; break;
    }

    const error = new Error();
    const caller_line = error.stack.split('\n')[3].trim();
    const caller = /\/([^:\s]+):(\d+)/.exec(caller_line);

    const type_text = `${color_code}[${type}]${color_break}`;
    const time_text = `<${timestamp()}>`;
    const call_text = `(${caller[0]}):`;
    const msg_text = `${color_code}${msg}${color_break}`;
    const log_text = `${type_text}\t${time_text} ${call_text} ${msg_text}\n`;
    
    if (to_screen){
        console.log(log_text);
    }

    appendFile(PATH + 'logs.log', log_text, (err) => {
        if(err){
            console.error(err);
            return false;
        }
    });

    return true;
}

/**
 * Wrapper for log(..) to log out messages as an info
 * @param {string} msg 
 */
function info(msg) {
    log(msg, 'INFO', 'blue', LOG_TO_SCREEN);
}

/**
 * Wrapper for log(..) to log out messages as an info
 * @param {string} msg 
 */
function warning(msg) {
    log(msg, 'WARN', 'yellow', LOG_TO_SCREEN);
}

/**
 * Wrapper for log(..) to log out messages as an error
 * @param {string} msg 
 * @note Does not do any error handling, just logs that some error happened
 */
function error(msg) {
    log(msg, 'ERROR', 'red', LOG_TO_SCREEN);
}

module.exports = { 
    info,
    warning,
    error,
};
