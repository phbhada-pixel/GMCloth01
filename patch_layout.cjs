const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLayout = `                /* Main Billing Interface */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left panel: Cart & Checkout (Lg: 5cols) */}
                  <div className="lg:col-span-5 space-y-4">`;

// I'll just use a clever string replacement for the grid layout.
const splitString = '                /* Main Billing Interface */';
const endString = '              )}\n            </div>\n          )}\n\n          {/* TAB: STOCK / INVENTORY */}';

let indexStart = code.indexOf(splitString);
let indexEnd = code.indexOf(endString);

if (indexStart !== -1 && indexEnd !== -1) {
    let billingLayout = code.substring(indexStart, indexEnd);
    
    // The billingLayout contains the two `div className="lg:col-span-5 space-y-4"` and `lg:col-span-7 space-y-4`
    let leftPanelStart = billingLayout.indexOf('{/* Left panel: Cart & Checkout (Lg: 5cols) */}');
    let rightPanelStart = billingLayout.indexOf('{/* Right panel: Product catalog list (Lg: 7cols) */}');
    
    let leftPanelCode = billingLayout.substring(leftPanelStart, rightPanelStart);
    let rightPanelCode = billingLayout.substring(rightPanelStart);
    
    // Now swap them! Also add coupon UI to the cart panel.
    
    // 1. In leftPanelCode (Cart), we need to add the Coupon Input below Cart Items.
    let cartSummaryStart = leftPanelCode.indexOf('{/* Summary calculations */}');
    let cartSummaryCode = leftPanelCode.substring(cartSummaryStart);
    
    // Add coupon UI right before cartSummary
    const couponUI = `
                      {/* Applied Coupon & System Coupons */}
                      <div className="border border-indigo-100 rounded-xl p-3 bg-indigo-50/30">
                        <h4 className="text-[10px] font-bold text-indigo-800 mb-2 uppercase">🎁 Apply Coupon</h4>
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             placeholder="Enter Coupon Code" 
                             value={couponCodeInput}
                             onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                             className="flex-1 text-xs border border-indigo-200 rounded-lg px-2 py-1.5 uppercase font-bold"
                           />
                           <button 
                             onClick={() => {
                               const found = coupons.find(c => c.code === couponCodeInput);
                               if (found) {
                                  setAppliedCoupon(found);
                                  alert('Coupon Applied: ' + found.discount_percentage + '% OFF');
                               } else {
                                  alert('Invalid or expired coupon code!');
                               }
                             }}
                             className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700"
                           >
                             Apply
                           </button>
                        </div>
                        {appliedCoupon && (
                           <div className="mt-2 flex justify-between items-center bg-indigo-100 p-2 rounded-lg text-xs font-bold text-indigo-900">
                              <span>Applied: {appliedCoupon.code} ({appliedCoupon.discount_percentage}% OFF)</span>
                              <button onClick={() => setAppliedCoupon(null)} className="text-rose-600 hover:text-rose-800 text-[10px] bg-rose-100 px-2 py-0.5 rounded">Remove</button>
                           </div>
                        )}
                      </div>
`;
    leftPanelCode = leftPanelCode.substring(0, cartSummaryStart) + couponUI + '\n' + cartSummaryCode;

    // 2. We also need to update the Cart summary display to show Coupon Discount
    const cartTotalsUI = `<div className="flex items-center justify-between">
                            <span>अतिरिक्त सवलत (Discount)</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">₹</span>
                              <input 
                                type="number" 
                                value={cartDiscount}
                                onChange={(e) => setCartDiscount(Number(e.target.value))}
                                className="w-16 border rounded px-1.5 py-0.5 text-right font-bold text-xs"
                              />
                            </div>
                          </div>`;
    const newCartTotalsUI = `<div className="flex items-center justify-between">
                            <span>मॅन्युअल सवलत (Manual Discount)</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[10px]">₹</span>
                              <input 
                                type="number" 
                                value={cartDiscount}
                                onChange={(e) => setCartDiscount(Number(e.target.value))}
                                className="w-16 border rounded px-1.5 py-0.5 text-right font-bold text-xs"
                              />
                            </div>
                          </div>
                          {appliedCoupon && (
                            <div className="flex justify-between text-indigo-600 font-bold">
                              <span>कूपन सवलत ({appliedCoupon.code})</span>
                              <span>-₹{cartTotals().couponDiscountAmount.toFixed(2)}</span>
                            </div>
                          )}`;
    leftPanelCode = leftPanelCode.replace(cartTotalsUI, newCartTotalsUI);

    // Swap columns! Note: Right panel is closed by a few divs that belong to the grid.
    
    // To cleanly swap, we can modify the grid columns. Left was 5, Right was 7.
    // Let's make Left (Catalog) 7, Right (Cart) 5.
    
    leftPanelCode = leftPanelCode.replace('lg:col-span-5', 'lg:col-span-4');
    leftPanelCode = leftPanelCode.replace('{/* Left panel: Cart & Checkout (Lg: 5cols) */}', '{/* Right panel: Cart & Checkout */}');
    
    rightPanelCode = rightPanelCode.replace('lg:col-span-7', 'lg:col-span-8');
    rightPanelCode = rightPanelCode.replace('{/* Right panel: Product catalog list (Lg: 7cols) */}', '{/* Left panel: Product catalog list */}');

    let newBillingLayout = splitString + '\n' + 
      '                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">\n' +
      '                  ' + rightPanelCode + '\n' +
      '                  ' + leftPanelCode + '\n';
      
    // Remove one extra `</div>` if needed, but since we just swapped the strings, the div depths should be identical! Wait, rightPanelCode has an extra `</div>` at the end which closes the grid!
    
    // Let's refine the swap.
    let gridCloseIndex = rightPanelCode.lastIndexOf('</div>');
    let rightPanelContent = rightPanelCode.substring(0, gridCloseIndex).trimEnd();
    
    newBillingLayout = splitString + '\n' + 
      '                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-col-reverse lg:flex-row">\n' + // Use flex-col-reverse for mobile if needed, but grid works fine.
      '                  ' + rightPanelContent + '\n' +
      '                  ' + leftPanelCode + '\n' +
      '                </div>\n';

    code = code.substring(0, indexStart) + newBillingLayout + code.substring(indexEnd);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Layout patched!");
} else {
    console.log("Could not find layout delimiters!");
}
