const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add useRef near the top
if (!code.includes("const appStateRef = useRef")) {
  code = code.replace(
    /const \[sbUrl, setSbUrl\] = useState/,
    `const appStateRef = useRef<any>({});\n  const [sbUrl, setSbUrl] = useState`
  );
  
  // Add useEffect to update refs
  code = code.replace(
    /const \[autoSync, setAutoSync\] = useState/,
    `useEffect(() => {\n    appStateRef.current = { shops, users, products, customers, suppliers, sales, purchases, auditLogs };\n  }, [shops, users, products, customers, suppliers, sales, purchases, auditLogs]);\n\n  const [autoSync, setAutoSync] = useState`
  );

  // Update silentSmartSync to use refs
  code = code.replace(/await smartSyncTable\('t_shops', shops/g, "await smartSyncTable('t_shops', appStateRef.current.shops");
  code = code.replace(/await smartSyncTable\('t_user_accounts', users/g, "await smartSyncTable('t_user_accounts', appStateRef.current.users");
  code = code.replace(/await smartSyncTable\('t_products', products/g, "await smartSyncTable('t_products', appStateRef.current.products");
  code = code.replace(/await smartSyncTable\('t_customers', customers/g, "await smartSyncTable('t_customers', appStateRef.current.customers");
  code = code.replace(/await smartSyncTable\('t_suppliers', suppliers/g, "await smartSyncTable('t_suppliers', appStateRef.current.suppliers");
  code = code.replace(/await smartSyncTable\('t_sales', sales/g, "await smartSyncTable('t_sales', appStateRef.current.sales");
  code = code.replace(/await smartSyncTable\('t_purchases', purchases/g, "await smartSyncTable('t_purchases', appStateRef.current.purchases");
  code = code.replace(/await smartSyncTable\('t_audit_logs', auditLogs/g, "await smartSyncTable('t_audit_logs', appStateRef.current.auditLogs");
}

fs.writeFileSync('src/App.tsx', code);
