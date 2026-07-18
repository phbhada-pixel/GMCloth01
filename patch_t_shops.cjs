const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `
        } else if (tableName === 't_shops') {
          copy.sb_url = copy.sbUrl || null;
          copy.sb_key = copy.sbKey || null;
          delete copy.sbUrl;
          delete copy.sbKey;
        }
`;

const replacement = `
        } else if (tableName === 't_shops') {
          copy.sb_url = copy.sbUrl || null;
          copy.sb_key = copy.sbKey || null;
          delete copy.sbUrl;
          delete copy.sbKey;
          delete copy.license_status;
          delete copy.license_expiry_date;
        }
`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
