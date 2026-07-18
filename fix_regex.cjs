const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/license_expiry_date BIGINT;\r?\n?\`;\}/g, "license_expiry_date BIGINT;\n`}");
fs.writeFileSync('src/App.tsx', code);
