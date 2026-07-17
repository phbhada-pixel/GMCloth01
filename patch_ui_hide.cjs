const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For Master:
const masterFind = `<div className="grid grid-cols-1 gap-2.5 text-xs">`;
const masterRepl = `
                        {isMasterSbLocked ? (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <h5 className="font-extrabold text-green-800 text-sm mb-1">✅ मास्टर क्लाउड कनेक्टेड आहे</h5>
                            <p className="text-[10px] text-green-700 mb-3">सर्व दुकाने आणि युजर्सचा डेटा या मास्टर डेटाबेसमध्ये सुरक्षित आहे.</p>
                            <button onClick={() => setIsMasterSbUnlocked(true)} className="bg-white border border-green-200 text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-green-100 transition-all">बदला (Change)</button>
                          </div>
                        ) : (
                        <div className="grid grid-cols-1 gap-2.5 text-xs">
`;
code = code.replace(masterFind, masterRepl);

// Since we opened a block, we need to close it after the Master buttons section
const masterBtnFind = `                              </button>\n                            )}\n                          </div>\n                        </div>`;
const masterBtnRepl = `                              </button>\n                            )}\n                          </div>\n                        </div>\n                        )} /* END MASTER COLLAPSE */`;
code = code.replace(masterBtnFind, masterBtnRepl);

fs.writeFileSync('src/App.tsx', code);
