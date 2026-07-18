const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add a debounce ref
code = code.replace(
  "const appStateRef = useRef<any>({});",
  "const appStateRef = useRef<any>({});\n  const syncTimeoutRef = useRef<any>(null);"
);

// 2. Add a triggerSync function
const triggerSyncCode = `
  const triggerRealtimeSync = () => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      if (navigator.onLine && ((sbUrl && sbKey) || (masterSbUrl && masterSbKey))) {
        silentSmartSync();
      }
    }, 2000); // 2 second debounce
  };
`;
code = code.replace("const silentSmartSync = async () => {", triggerSyncCode + "\n  const silentSmartSync = async () => {");

// 3. Call triggerRealtimeSync in all the updateLocal functions
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_products', updated\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_products', updated); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_customers', updated\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_customers', updated); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_suppliers', updated\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_suppliers', updated); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_sales', updated\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_sales', updated); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_purchases', updated\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_purchases', updated); triggerRealtimeSync(); }");
code = code.replace(/if \(autoSync\) \{\n\s*uploadTableToSupabase\('t_audit_logs', \[newLog\]\);\n\s*\}/g, "if (autoSync) { uploadTableToSupabase('t_audit_logs', [newLog]); triggerRealtimeSync(); }");

fs.writeFileSync('src/App.tsx', code);
