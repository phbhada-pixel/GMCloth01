const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/useState\('maulicloth@oksbi'\)/g, "useState('')");
code = code.replace(/placeholder="उदा\. mauli_admin"/g, 'placeholder="उदा. admin"');
code = code.replace(/placeholder="उदा\. admin@mauli\.com"/g, 'placeholder="उदा. admin@shop.com"');
code = code.replace(/placeholder="उदा\. master \/ mauli_admin"/g, 'placeholder="उदा. master / admin"');
code = code.replace(/placeholder="उदा\. mauli_emp"/g, 'placeholder="उदा. employee"');
code = code.replace(/Powered by Mauli Garments billing/g, 'Powered by Textile Shop Manager Pro');

// Remove the two quick login buttons
const qLoginRegex = /<button\s+onClick=\{\(\) => loginWithCredentials\('mauli_admin'[\s\S]*?<\/button>\s*<button\s+onClick=\{\(\) => loginWithCredentials\('mauli_emp'[\s\S]*?<\/button>/;
code = code.replace(qLoginRegex, "");

fs.writeFileSync('src/App.tsx', code);
