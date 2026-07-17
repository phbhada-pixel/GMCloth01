const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const shopBtnFind = `                        </div>\n                      </form>`;
const shopBtnRepl = `                        </div>\n                      </form>\n                      )} {/* END SHOP COLLAPSE */}`;

if (!code.includes("END SHOP COLLAPSE")) {
  code = code.replace(shopBtnFind, shopBtnRepl);
  fs.writeFileSync('src/App.tsx', code);
}
