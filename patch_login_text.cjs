const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{isSyncing \? '🔄 सिंक करत आहे \(Syncing\.\.\.\)' : \(lang === 'ENGLISH' \? '🔐 Sign In' : '🔐 लॉगिन करा \(Sign In\)'\)\}/g,
  `{lang === 'ENGLISH' ? '🔐 Sign In' : '🔐 लॉगिन करा (Sign In)'}`
);

fs.writeFileSync('src/App.tsx', code);
