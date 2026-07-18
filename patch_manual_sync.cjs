const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPush = `
      await uploadTableToSupabase('t_shops', shops);
      await uploadTableToSupabase('t_user_accounts', users);
      await uploadTableToSupabase('t_products', products);
      await uploadTableToSupabase('t_customers', customers);
      await uploadTableToSupabase('t_suppliers', suppliers);
      await uploadTableToSupabase('t_sales', sales);
      await uploadTableToSupabase('t_purchases', purchases);
      await uploadTableToSupabase('t_audit_logs', auditLogs);
`;

const newPush = `
      const r1 = await uploadTableToSupabase('t_shops', shops);
      if (!r1?.success && r1?.error) throw new Error(r1.error);
      const r2 = await uploadTableToSupabase('t_user_accounts', users);
      if (!r2?.success && r2?.error) throw new Error(r2.error);
      const r3 = await uploadTableToSupabase('t_products', products);
      if (!r3?.success && r3?.error) throw new Error(r3.error);
      const r4 = await uploadTableToSupabase('t_customers', customers);
      if (!r4?.success && r4?.error) throw new Error(r4.error);
      const r5 = await uploadTableToSupabase('t_suppliers', suppliers);
      if (!r5?.success && r5?.error) throw new Error(r5.error);
      const r6 = await uploadTableToSupabase('t_sales', sales);
      if (!r6?.success && r6?.error) throw new Error(r6.error);
      const r7 = await uploadTableToSupabase('t_purchases', purchases);
      if (!r7?.success && r7?.error) throw new Error(r7.error);
      const r8 = await uploadTableToSupabase('t_audit_logs', auditLogs);
      if (!r8?.success && r8?.error) throw new Error(r8.error);
`;

code = code.replace(oldPush, newPush);

const oldMasterPush = `
                                const res1 = await uploadTableToSupabase('t_shops', shops);
                                const res2 = await uploadTableToSupabase('t_user_accounts', users);
`;

const newMasterPush = `
                                const res1 = await uploadTableToSupabase('t_shops', shops);
                                if (!res1?.success) throw new Error(res1?.error || "Unknown Error");
                                const res2 = await uploadTableToSupabase('t_user_accounts', users);
                                if (!res2?.success) throw new Error(res2?.error || "Unknown Error");
`;

code = code.replace(oldMasterPush, newMasterPush);
fs.writeFileSync('src/App.tsx', code);
