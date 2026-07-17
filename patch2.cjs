const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const patched = code.replace(
  /console.log\("Current users array:", JSON.stringify\(users, null, 2\)\);/,
  `alert("Users len: " + users.length + " first: " + (users[0] ? users[0].username + ":" + users[0].password : "none"));`
);
fs.writeFileSync('src/App.tsx', patched);
