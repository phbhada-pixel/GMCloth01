const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const waBtnTarget = `<a 
                        href={getWhatsAppCustomerUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          addAuditLog(\`व्हाट्सॲपवर पावती पाठवली: \${completedInvoice.customer_name} (\${whatsappPhone})\`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Send className="w-4 h-4" /> पाठवा (Send)
                      </a>`;

const waBtnReplacement = `<button 
                        onClick={sendWhatsAppBillApi}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Send className="w-4 h-4" /> पाठवा (API)
                      </button>`;

code = code.replace(waBtnTarget, waBtnReplacement);

// Just to ensure we correctly replaced the first wa target
const waFuncTarget = `  const getWhatsAppCustomerUrl = () => {
    if (!completedInvoice) return '#';`;

if (code.includes(waFuncTarget)) {
   console.log("Looks like previous patch_cart.cjs didn't replace getWhatsAppCustomerUrl correctly.");
} else {
   console.log("Functions were patched previously.");
}

fs.writeFileSync('src/App.tsx', code);
