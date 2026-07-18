const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');
const res = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('MASTER_ADMIN')) {
    res.push(i + 1 + ': ' + lines[i]);
  }
}
fs.writeFileSync('grep_out.txt', res.join('\n'));
