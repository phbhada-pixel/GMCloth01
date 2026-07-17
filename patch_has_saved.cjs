const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const hasMasterSbSaved = !!localStorage\.getItem\('master_sb_url'\) && !!localStorage\.getItem\('master_sb_key'\);/g,
  "const hasMasterSbSaved = !!masterSbUrl && !!masterSbKey;"
);

code = code.replace(
  /const hasSbSaved = \(!!localStorage\.getItem\('sb_url_' \+ currentShopId\) && !!localStorage\.getItem\('sb_key_' \+ currentShopId\)\);/g,
  "const hasSbSaved = !!sbUrl && !!sbKey;"
);

code = code.replace(
  /const hasSbCreds = !!localStorage\.getItem\('sb_url_' \+ currentShopId\) && !!localStorage\.getItem\('sb_key_' \+ currentShopId\);/g,
  "const hasSbCreds = !!sbUrl && !!sbKey;"
);

fs.writeFileSync('src/App.tsx', code);
