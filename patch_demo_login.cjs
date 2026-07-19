const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `        onDemoLogin={(demoRole) => {
          if (demoRole === 'master') {
            loginWithCredentials('master', 'master123');
          } else {
            loginWithCredentials('shop', 'shop123');
          }
        }}`;

const replacementStr = `        onDemoLogin={(demoRole) => {
          if (demoRole === 'master') {
            loginWithCredentials('master', 'master123');
          } else {
            const existingShopUser = users.find(u => u.username === 'shop' || u.role === 'SHOP_ADMIN');
            if (existingShopUser) {
              // Just login with the first SHOP_ADMIN we find if 'shop' isn't explicitly there
              const uToLogin = users.find(u => u.username === 'shop') || existingShopUser;
              loginWithCredentials(uToLogin.username, uToLogin.password);
              
              // If loginWithCredentials fails (e.g. missing), force it:
              if (localStorage.getItem('t_role') !== uToLogin.role) {
                 setCurrentUser(uToLogin);
                 setRole(uToLogin.role);
                 setCurrentShopId(uToLogin.shopId || '');
                 localStorage.setItem('t_role', uToLogin.role);
                 localStorage.setItem('t_active_user', JSON.stringify(uToLogin));
                 if (uToLogin.shopId) localStorage.setItem('current_shop_id', uToLogin.shopId);
                 setActiveTab('home');
              }
            } else {
              // Create demo shop
              const sId = "SHPDEMO123";
              const newShop = {
                id: sId,
                name: "Demo Textile Boutique",
                address: "Mumbai, Maharashtra",
                whatsNo: "9876543210",
                upiId: "demo@upi",
                gstNumber: '',
                created_at: Date.now(),
                sbUrl: '',
                sbKey: '',
                license_status: 'ACTIVE',
                verification_status: 'VERIFIED',
                license_expiry_date: Date.now() + 31536000000
              };
              const nextShops = [...shops, newShop];
              setShops(nextShops);
              localStorage.setItem('t_shops', JSON.stringify(nextShops));

              const newAdmin = {
                id: "USRDEMO123",
                username: "shop",
                password: "shop123",
                role: "SHOP_ADMIN",
                shopId: sId,
                email: "demo_shop@vidyaretail.com",
                last_updated: Date.now()
              };
              const nextUsers = [...users, newAdmin];
              setUsers(nextUsers);
              localStorage.setItem('t_users', JSON.stringify(nextUsers));
              
              setCurrentUser(newAdmin as any);
              setRole('SHOP_ADMIN');
              setCurrentShopId(sId);
              localStorage.setItem('t_role', 'SHOP_ADMIN');
              localStorage.setItem('t_active_user', JSON.stringify(newAdmin));
              localStorage.setItem('current_shop_id', sId);
              setActiveTab('home');
            }
          }
        }}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
