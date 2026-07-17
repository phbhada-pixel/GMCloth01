const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

// Find the Cloud Setup for New Devices block and remove it
const regex = /\{\/\* Cloud Setup for New Devices \*\/\}[\s\S]*?(?=\{\/\* Quick Demo logins section \*\/\}|<\/div>\s*<\/div>\s*<\/div>\s*\))/;
const patched = code.replace(regex, "");

fs.writeFileSync('src/App.tsx', patched);
