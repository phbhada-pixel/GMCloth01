const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldPosTarget = `                /* Main Billing Interface */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left panel: Cart & Checkout (Lg: 5cols) */}
                  <div className="lg:col-span-5 space-y-4">`;

const newPosTarget = `                /* Main Billing Interface (Two-Column POS) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left panel: Product catalog list (Lg: 7cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input 
                          type="text"
                          placeholder={Loc.t("search_product", lang)}
                          value={billingSearch}
                          onChange={(e) => setBillingSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 border border-forest-100 rounded-xl text-xs bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto pr-1">
                      {products
                        .filter(p => p.name.toLowerCase().includes(billingSearch.toLowerCase()) || (p.category && p.category.toLowerCase().includes(billingSearch.toLowerCase())))
                        .map(p => (
                          <div 
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-3 rounded-2xl border border-forest-100 hover:border-forest-400 cursor-pointer transition-all flex flex-col justify-between text-left group hover:shadow-sm h-32"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <p className="font-bold text-xs text-gray-800 group-hover:text-forest-500 transition-colors line-clamp-2 leading-tight">{p.name}</p>
                              </div>
                              <span className="bg-forest-50 text-forest-700 px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 mt-1 inline-block">{p.category}</span>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                              <div>
                                <span className="text-xs font-black text-forest-500">₹{p.selling_price}</span>
                              </div>
                              <span className={\`text-[9px] font-bold \${p.stock_quantity <= p.min_stock ? 'text-red-500' : 'text-gray-400'}\`}>
                                Qty: {p.stock_quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Right panel: Cart & Checkout (Lg: 5cols) */}
                  <div className="lg:col-span-5 space-y-4">`;

// Wait, I need to completely replace the two column sections!
