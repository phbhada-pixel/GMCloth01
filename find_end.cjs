const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = "{masterSbSubTab === 'guide' && (";
const startIndex = code.indexOf(target);

let openBraces = 0;
let endIndex = -1;

for (let i = startIndex; i < code.length; i++) {
  if (code[i] === '{') openBraces++;
  else if (code[i] === '}') {
    openBraces--;
    if (openBraces === 0) {
      // Need to find the end of `)}`
      if (code.substring(i, i+3) === ')}') {
         endIndex = i + 2;
         break;
      }
    }
  }
}
console.log(endIndex);
console.log(code.substring(endIndex, endIndex + 100));
