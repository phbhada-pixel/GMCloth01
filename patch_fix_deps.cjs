const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add useRef to imports
if (!code.includes("useRef")) {
  code = code.replace("useState, useEffect", "useState, useEffect, useRef");
}

// 2. Move the useEffect that updates appStateRef
const effectRegex = /  useEffect\(\(\) => \{\n    appStateRef\.current = \{ shops, users, products, customers, suppliers, sales, purchases, auditLogs \};\n  \}, \[shops, users, products, customers, suppliers, sales, purchases, auditLogs\]\);\n\n/g;
code = code.replace(effectRegex, "");

// Insert it right before autoSync (where it used to be but wait, autoSync was above the others)
// Actually, let's insert it right before `useEffect(() => { ... // Initial Sync check ...`
const target = "  // Manage Online/Offline Transition and Sync triggers";
code = code.replace(target, `  useEffect(() => {\n    appStateRef.current = { shops, users, products, customers, suppliers, sales, purchases, auditLogs };\n  }, [shops, users, products, customers, suppliers, sales, purchases, auditLogs]);\n\n` + target);

fs.writeFileSync('src/App.tsx', code);
