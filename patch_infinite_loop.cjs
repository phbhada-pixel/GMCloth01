const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /  \}, \[sbUrl, sbKey, currentShopId, shops, users, products, customers, suppliers, sales, purchases, auditLogs\]\);/g;
code = code.replace(regex, "  }, [sbUrl, sbKey, masterSbUrl, masterSbKey, currentShopId, autoSync]); // Removed data dependencies to prevent infinite loop");

fs.writeFileSync('src/App.tsx', code);
