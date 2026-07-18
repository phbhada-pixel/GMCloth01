const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.split('BIGINT;`;}').join('BIGINT;`}');
fs.writeFileSync('src/App.tsx', code);
