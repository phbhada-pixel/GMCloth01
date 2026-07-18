const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = "ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`}";
const replacement1 = `ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;

-- जर तुम्ही आधीच टेबल तयार केले असेल आणि नवीन कॉलम जोडायचे असतील (For Existing Databases):
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS sb_url TEXT;
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS sb_key TEXT;
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'ACTIVE';
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS license_expiry_date BIGINT;
\`;}`;

const target2 = "ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`;";
const replacement2 = `ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;

-- जर तुम्ही आधीच टेबल तयार केले असेल आणि नवीन कॉलम जोडायचे असतील (For Existing Databases):
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS sb_url TEXT;
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS sb_key TEXT;
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'ACTIVE';
ALTER TABLE t_shops ADD COLUMN IF NOT EXISTS license_expiry_date BIGINT;
\`;`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', code);
