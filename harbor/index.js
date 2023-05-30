const { readFile, readFileSync } = require('fs');

console.log('hello world');

console.log(global.something);
global.something = 12;
console.log(global.something);

console.log(process.platform)
console.log(process.env.USER);

const txt = readFileSync('index.html', 'utf8');
console.log(txt)
