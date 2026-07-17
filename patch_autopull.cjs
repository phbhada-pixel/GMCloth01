const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  // Auto-pull from Master on fresh device
  useEffect(() => {
    if (masterSupabaseClient && shops.length === 1 && shops[0].id === 'shop-mauli') {
      const autoPull = async () => {
        try {
          console.log("Fresh device detected. Auto-pulling master data...");
          const { data: cloudShops, error: errShops } = await masterSupabaseClient.from('t_shops').select('*');
          const { data: cloudUsers, error: errUsers } = await masterSupabaseClient.from('t_user_accounts').select('*');
          
          if (!errShops && !errUsers) {
            if (cloudShops && cloudShops.length > 0) {
               const mappedShops = cloudShops.map(item => {
                  const copy = { ...item };
                  if (copy.sb_url) { copy.sbUrl = copy.sb_url; delete copy.sb_url; }
                  if (copy.sb_key) { copy.sbKey = copy.sb_key; delete copy.sb_key; }
                  return copy;
               });
               setShops(mappedShops);
               localStorage.setItem('t_shops', JSON.stringify(mappedShops));
            }
            if (cloudUsers && cloudUsers.length > 0) {
               setUsers(cloudUsers);
               localStorage.setItem('t_users', JSON.stringify(cloudUsers));
            }
            console.log("Auto-pull complete!");
          }
        } catch(e) {}
      };
      autoPull();
    }
  }, [masterSupabaseClient, shops]);
`;

// Insert it right after the masterSupabaseClient useEffect
const target = "  }, [masterSbUrl, masterSbKey]);";
const patched = code.replace(target, target + "\n" + effectCode);

fs.writeFileSync('src/App.tsx', patched);
