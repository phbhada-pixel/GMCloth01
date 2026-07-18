const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replaceAll("BIGINT;\`;}", "BIGINT;\n`}");
fs.writeFileSync('src/App.tsx', code);
