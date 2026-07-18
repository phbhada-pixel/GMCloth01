const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Patch downloadTableFromSupabase
const oldDownload = `
    try {
      let query = client.from(tableName).select('*');
      if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
        query = query.eq('shop_id', currentShopId);
      } else if (tableName === 't_user_accounts' && role !== 'MASTER_ADMIN') {
        // Shop admin (or logged out) downloads users for their shop + master admins
        query = query.or(\`shopId.eq.\${currentShopId},role.eq.MASTER_ADMIN\`);
      }
      const { data, error } = await query;
`;

const newDownload = `
    if (tableName === 't_user_accounts') {
       let cloudUsers = [];
       // Fetch MASTER_ADMIN and SHOP_ADMIN from Master DB
       if (masterSbUrl && masterSbKey) {
          let mClient = masterSupabaseClient || createClient(masterSbUrl, masterSbKey);
          let query = mClient.from('t_user_accounts').select('*');
          if (role !== 'MASTER_ADMIN' && currentShopId) {
              query = query.or(\`shopId.eq.\${currentShopId},role.eq.MASTER_ADMIN\`);
          }
          const { data } = await query;
          if (data) {
             const masters = data.filter(u => u.role === 'MASTER_ADMIN' || u.role === 'SHOP_ADMIN');
             cloudUsers = [...cloudUsers, ...masters];
          }
       }
       // Fetch EMPLOYEE from Shop DB
       if (sbUrl && sbKey && role !== 'MASTER_ADMIN') {
          let sClient = supabaseClient || createClient(sbUrl, sbKey);
          const { data } = await sClient.from('t_user_accounts').select('*').eq('role', 'EMPLOYEE');
          if (data) {
             cloudUsers = [...cloudUsers, ...data];
          }
       }
       if (!masterSbUrl && !masterSbKey && !sbUrl && !sbKey) return null;
       return cloudUsers;
    }

    try {
      let query = client.from(tableName).select('*');
      if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
        query = query.eq('shop_id', currentShopId);
      }
      const { data, error } = await query;
`;

code = code.replace(oldDownload, newDownload);

// 2. Patch uploadTableToSupabase
const oldUpload = `
    if (!client) return { success: false, error: 'Supabase client initialize होऊ शकले नाही' };

    try {
      const formattedData = dataArray.map(item => {
        const copy = { ...item };
        if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
          copy.shop_id = currentShopId;
        } else if (tableName === 't_shops') {
          // Map properties to match Supabase table schema
          copy.sb_url = copy.sbUrl || null;
          copy.sb_key = copy.sbKey || null;
          delete copy.sbUrl;
          delete copy.sbKey;
        } else if (tableName === 't_user_accounts') {
          // ShopId is camelCase in local state but could be quote-wrapped in SQL, but SQL has "shopId" (quoted)
          // Also strip last_updated, email, session_token as they are not in the basic SQL schema
          delete copy.last_updated;
          delete copy.email;
          delete copy.session_token;
        }
        return copy;
      });

      const { error } = await client
        .from(tableName)
        .upsert(formattedData, { onConflict: 'id' });
`;

const newUpload = `
    if (tableName === 't_user_accounts') {
       let overallSuccess = true;
       let lastError = null;

       const masterAccounts = dataArray.filter(u => u.role === 'MASTER_ADMIN' || u.role === 'SHOP_ADMIN');
       const shopAccounts = dataArray.filter(u => u.role === 'EMPLOYEE');

       if (masterAccounts.length > 0 && masterSbUrl && masterSbKey) {
           let mClient = masterSupabaseClient || createClient(masterSbUrl, masterSbKey);
           const formatted = masterAccounts.map(item => {
               const copy = { ...item };
               delete copy.last_updated; delete copy.email; delete copy.session_token;
               return copy;
           });
           const { error } = await mClient.from('t_user_accounts').upsert(formatted, { onConflict: 'id' });
           if (error) { overallSuccess = false; lastError = error; }
       }
       
       if (shopAccounts.length > 0 && sbUrl && sbKey && role !== 'MASTER_ADMIN') {
           let sClient = supabaseClient || createClient(sbUrl, sbKey);
           const formatted = shopAccounts.map(item => {
               const copy = { ...item };
               delete copy.last_updated; delete copy.email; delete copy.session_token;
               copy.shopId = null; // Prevent FK constraint failure since t_shops might be empty in Shop DB
               return copy;
           });
           const { error } = await sClient.from('t_user_accounts').upsert(formatted, { onConflict: 'id' });
           if (error) { overallSuccess = false; lastError = error; }
       }

       if (!overallSuccess && lastError) {
           const errorMsg = lastError.message || lastError.details || JSON.stringify(lastError);
           return { success: false, error: errorMsg };
       }
       return { success: true };
    }

    if (!client) return { success: false, error: 'Supabase client initialize होऊ शकले नाही' };

    try {
      const formattedData = dataArray.map(item => {
        const copy = { ...item };
        if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
          copy.shop_id = currentShopId;
        } else if (tableName === 't_shops') {
          copy.sb_url = copy.sbUrl || null;
          copy.sb_key = copy.sbKey || null;
          delete copy.sbUrl;
          delete copy.sbKey;
        }
        return copy;
      });

      const { error } = await client
        .from(tableName)
        .upsert(formattedData, { onConflict: 'id' });
`;

code = code.replace(oldUpload, newUpload);

fs.writeFileSync('src/App.tsx', code);
