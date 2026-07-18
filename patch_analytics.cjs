const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = `  // Dashboard calculations
  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock).length;
  const totalSalesVal = sales.reduce((sum, item) => sum + item.grand_total, 0);`;

const hookReplacement = `  // Dashboard calculations
  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock).length;
  const totalSalesVal = sales.reduce((sum, item) => sum + item.grand_total, 0);

  const [revenueMetrics, setRevenueMetrics] = useState({ daily: 0, weekly: 0, monthly: 0, yearly: 0 });

  useEffect(() => {
    if (activeTab === 'home' && role !== 'MASTER_ADMIN' && currentShopId) {
      const fetchMetrics = async () => {
        try {
          if (supabaseClient) {
            const { data, error } = await supabaseClient.rpc('get_revenue_metrics', { p_shop_id: currentShopId });
            if (!error && data && data.length > 0) {
              setRevenueMetrics({
                daily: data[0].daily_revenue || 0,
                weekly: data[0].weekly_revenue || 0,
                monthly: data[0].monthly_revenue || 0,
                yearly: data[0].yearly_revenue || 0
              });
              return;
            }
          }
        } catch (e) {
          console.error("RPC failed, falling back to local calculation");
        }
        
        // Fallback to local calculation
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        
        // start of week (Sunday)
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
        
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
        
        let d = 0, w = 0, m = 0, y = 0;
        sales.forEach(sale => {
          if (sale.date >= startOfDay) d += sale.grand_total;
          if (sale.date >= startOfWeek) w += sale.grand_total;
          if (sale.date >= startOfMonth) m += sale.grand_total;
          if (sale.date >= startOfYear) y += sale.grand_total;
        });
        setRevenueMetrics({ daily: d, weekly: w, monthly: m, yearly: y });
      };
      fetchMetrics();
    }
  }, [activeTab, sales, currentShopId, role, supabaseClient]);`;

code = code.replace(hookTarget, hookReplacement);

const uiTarget = `              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl p-4 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[108px]">
                  <div className="absolute right-2 -bottom-2 text-forest-400 opacity-25 text-7xl font-bold">₹</div>
                  <div>
                    <p className="text-xs text-forest-100 font-bold">एकूण विक्री (Total Sales)</p>
                    <p className="text-2xl font-black mt-1">₹{totalSalesVal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] mt-2 text-forest-100">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>सर्व सुरक्षित व्यवहार जोडले</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-forest-100 shadow-sm flex flex-col justify-between min-h-[108px]">
                  <div>
                    <p className="text-xs text-gray-400 font-bold">अंदाजित नफा (Estimated Profit)</p>
                    <p className="text-2xl font-black text-forest-500 mt-1">₹{estimatedProfit.toFixed(2)}</p>
                  </div>
                  <p className="text-[10px] text-gray-400">३५% अंदाजित नफ्याचा मार्जिन</p>
                </div>
                {/* Outstanding Credit (Udhaari) Owed to the Shop */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200 shadow-sm flex flex-col justify-between min-h-[108px] relative overflow-hidden">
                  <div className="absolute right-2 -bottom-2 text-red-500 opacity-10 text-6xl font-bold">💰</div>
                  <div>
                    <p className="text-xs text-red-800 font-extrabold uppercase tracking-wide">एकूण येणे बाकी उधारी (Owed Credit)</p>
                    <p className="text-2xl font-black text-red-600 mt-1">₹{totalOutstanding.toFixed(0)}</p>
                  </div>
                  <p className="text-[10px] text-red-700 font-bold">शेतकरी व ग्राहकांकडील एकूण येणे</p>
                </div>
              </div>`;

const uiReplacement = `              {/* Analytics Overview - Revenue Metrics */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                  <span>📈</span> ॲनालिटिक्स ओव्हरव्ह्यू (Analytics Overview)
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] text-emerald-100 text-6xl opacity-40">📊</div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">आजची कमाई (Daily Revenue)</p>
                      <p className="text-xl font-black text-emerald-600 mt-1">₹{revenueMetrics.daily.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] text-blue-100 text-6xl opacity-40">📈</div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">या आठवड्याची कमाई (Weekly)</p>
                      <p className="text-xl font-black text-blue-600 mt-1">₹{revenueMetrics.weekly.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] text-indigo-100 text-6xl opacity-40">📅</div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">या महिन्याची कमाई (Monthly)</p>
                      <p className="text-xl font-black text-indigo-600 mt-1">₹{revenueMetrics.monthly.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col justify-between min-h-[96px] relative overflow-hidden">
                    <div className="absolute right-[-10px] bottom-[-10px] text-purple-100 text-6xl opacity-40">🗓️</div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">या वर्षाची कमाई (Yearly)</p>
                      <p className="text-xl font-black text-purple-600 mt-1">₹{revenueMetrics.yearly.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl p-4 text-white shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[108px]">
                  <div className="absolute right-2 -bottom-2 text-forest-400 opacity-25 text-7xl font-bold">₹</div>
                  <div>
                    <p className="text-xs text-forest-100 font-bold">एकूण विक्री (Total Sales)</p>
                    <p className="text-2xl font-black mt-1">₹{totalSalesVal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] mt-2 text-forest-100">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>सर्व सुरक्षित व्यवहार जोडले</span>
                  </div>
                </div>
                {/* Outstanding Credit (Udhaari) Owed to the Shop */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200 shadow-sm flex flex-col justify-between min-h-[108px] relative overflow-hidden">
                  <div className="absolute right-2 -bottom-2 text-red-500 opacity-10 text-6xl font-bold">💰</div>
                  <div>
                    <p className="text-xs text-red-800 font-extrabold uppercase tracking-wide">एकूण येणे बाकी उधारी (Owed Credit)</p>
                    <p className="text-2xl font-black text-red-600 mt-1">₹{totalOutstanding.toFixed(0)}</p>
                  </div>
                  <p className="text-[10px] text-red-700 font-bold">शेतकरी व ग्राहकांकडील एकूण येणे</p>
                </div>
              </div>`;

code = code.replace(uiTarget, uiReplacement);
fs.writeFileSync('src/App.tsx', code);
