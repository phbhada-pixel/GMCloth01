const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

// Find where Master Supabase Client is created
// Add an auto-pull effect right after it.
const patched = code.replace(
  /\/\/ Master auto-pull effect/g,
  ""
);

fs.writeFileSync('src/App.tsx', patched);
