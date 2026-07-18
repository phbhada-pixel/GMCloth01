const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove mock data constants
code = code.replace(/\/\/ Initial Mock Data[\s\S]*?(?=\/\/ MASTER SUPABASE CONFIGURATION)/, "");

// 2. Update shops initialization
code = code.replace(
  /const initial: Shop\[\] = \[\s*\{\s*id: "shop-mauli"[\s\S]*?\}\s*\];/,
  "const initial: Shop[] = [];"
);

// 3. Update users initialization
const usersInitRegex = /const initial: UserAccount\[\] = \[\s*\{\s*id: "user-master",\s*username: "master",\s*password: "master123",\s*role: "MASTER_ADMIN",\s*shopId: null,\s*last_updated: 0\s*\},\s*\{\s*id: "user-mauli"[\s\S]*?\}\s*\];/;
code = code.replace(usersInitRegex, `const initial: UserAccount[] = [
      {
        id: "user-master",
        username: "master",
        password: "master123",
        role: "MASTER_ADMIN",
        shopId: null,
        last_updated: 0
      }
    ];`);

// 4. Update currentShopId initialization
code = code.replace(
  /return localStorage\.getItem\('current_shop_id'\) \|\| 'shop-mauli';/,
  "return localStorage.getItem('current_shop_id') || '';"
);

// 5. Update local storage initializations for products, customers, etc.
code = code.replace(/const initial = currentShopId === 'shop-mauli' \? INITIAL_PRODUCTS : \[\];/g, "const initial: Product[] = [];");
code = code.replace(/const initial = currentShopId === 'shop-mauli' \? INITIAL_CUSTOMERS : \[\];/g, "const initial: Customer[] = [];");
code = code.replace(/const initial = currentShopId === 'shop-mauli' \? INITIAL_SUPPLIERS : \[\];/g, "const initial: Supplier[] = [];");
code = code.replace(/const initial = currentShopId === 'shop-mauli' \? INITIAL_SALES : \[\];/g, "const initial: Sale[] = [];");

fs.writeFileSync('src/App.tsx', code);
