const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const shopFind = `                        <form onSubmit={handleSaveSbConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">`;
const shopRepl = `                        {isSbLocked ? (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <h5 className="font-extrabold text-green-800 text-sm mb-1">✅ दुकान क्लाउड कनेक्टेड आहे</h5>
                            <p className="text-[10px] text-green-700 mb-3">या दुकानाचा डेटा क्लाउडवर सुरक्षितपणे सिंक्रोनाइझ होत आहे.</p>
                            <button onClick={() => setIsShopSbUnlocked(true)} className="bg-white border border-green-200 text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-green-100 transition-all">बदला (Change)</button>
                          </div>
                        ) : (
                        <form onSubmit={handleSaveSbConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">`;
code = code.replace(shopFind, shopRepl);

// The form closes at `</form>` for `handleSaveSbConfig`
const shopBtnFind = `                          </div>\n                        </form>`;
const shopBtnRepl = `                          </div>\n                        </form>\n                        )} /* END SHOP COLLAPSE */`;
code = code.replace(shopBtnFind, shopBtnRepl);

fs.writeFileSync('src/App.tsx', code);
