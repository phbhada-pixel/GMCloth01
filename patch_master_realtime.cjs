const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(autoSync && masterSbUrl && masterSbKey\) \{\n\s*uploadTableToSupabase\('t_shops', nextShops\);\n\s*\}/g, "if (autoSync && masterSbUrl && masterSbKey) { uploadTableToSupabase('t_shops', nextShops); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync && masterSbUrl && masterSbKey\) \{\n\s*uploadTableToSupabase\('t_user_accounts', nextUsers\);\n\s*\}/g, "if (autoSync && masterSbUrl && masterSbKey) { uploadTableToSupabase('t_user_accounts', nextUsers); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync && sbUrl && sbKey\) \{\n\s*uploadTableToSupabase\('t_user_accounts', nextUsers\);\n\s*\}/g, "if (autoSync && sbUrl && sbKey) { uploadTableToSupabase('t_user_accounts', nextUsers); triggerRealtimeSync(); }");

fs.writeFileSync('src/App.tsx', code);
