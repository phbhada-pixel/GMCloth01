const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(masterSupabaseClient && shops\.length === 1 && shops\[0\]\.id === 'shop-mauli'\)/g,
  "if (masterSupabaseClient && shops.length === 0)"
);

code = code.replace(
  /const saved = localStorage\.getItem\('low_stock_notifs_' \+ \(localStorage\.getItem\('current_shop_id'\) \|\| 'shop-mauli'\)\);/g,
  "const saved = localStorage.getItem('low_stock_notifs_' + (localStorage.getItem('current_shop_id') || ''));"
);

fs.writeFileSync('src/App.tsx', code);
