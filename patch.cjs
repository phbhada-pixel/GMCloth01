const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const patched = code.replace(
  /const loginWithCredentials = \(usernameVal: string, passwordVal: string\) => \{/,
  `const loginWithCredentials = (usernameVal: string, passwordVal: string) => {
    console.log("Login attempt:", usernameVal, passwordVal);
    console.log("Current users array:", JSON.stringify(users, null, 2));`
);
fs.writeFileSync('src/App.tsx', patched);
