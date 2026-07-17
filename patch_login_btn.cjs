const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<button\s+type="submit"\s+disabled=\{isSyncing\}\s+className=\{`w-full \$\{isSyncing \? 'bg-gray-400 cursor-not-allowed' : 'bg-forest-600 hover:bg-forest-700'\}.*?\s+>.*?<\/button>/s,
  `<button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {lang === 'ENGLISH' ? '🔐 Sign In' : '🔐 लॉगिन करा (Sign In)'}
                </button>`
);

fs.writeFileSync('src/App.tsx', code);
