const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookTarget = `  const [billPaymentMode, setBillPaymentMode] = useState<'CASH' | 'UPI' | 'CARD' | 'CREDIT'>('CASH');
  const [cartDiscount, setCartDiscount] = useState(0);
  const [completedInvoice, setCompletedInvoice] = useState<Sale | null>(null);`;

const hookReplacement = `  const [billPaymentMode, setBillPaymentMode] = useState<'CASH' | 'UPI' | 'CARD' | 'CREDIT'>('CASH');
  const [cartDiscount, setCartDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [completedInvoice, setCompletedInvoice] = useState<Sale | null>(null);`;

code = code.replace(hookTarget, hookReplacement);

const cartTotalsTarget = `  const cartTotals = () => {
    let rawTotal = 0;
    let gstSum = 0;
    cartItems.forEach(item => {
      const itemPrice = item.product.selling_price - item.discount;
      const sub = itemPrice * item.quantity;
      rawTotal += sub;
      // GST estimation
      gstSum += (sub * (item.product.gst_percent / 100));
    });

    const netTotal = rawTotal - cartDiscount;
    return {
      subTotal: rawTotal,
      gstAmount: gstSum,
      grandTotal: netTotal + gstSum
    };
  };`;

const cartTotalsReplacement = `  const cartTotals = () => {
    let rawTotal = 0;
    let gstSum = 0;
    cartItems.forEach(item => {
      const itemPrice = item.product.selling_price - item.discount;
      const sub = itemPrice * item.quantity;
      rawTotal += sub;
      // GST estimation
      gstSum += (sub * (item.product.gst_percent / 100));
    });

    let couponDiscountAmount = 0;
    if (appliedCoupon) {
      couponDiscountAmount = (rawTotal * appliedCoupon.discount_percentage) / 100;
    }

    const netTotal = rawTotal - cartDiscount - couponDiscountAmount;
    return {
      subTotal: rawTotal,
      couponDiscountAmount,
      gstAmount: gstSum,
      grandTotal: Math.max(0, netTotal + gstSum)
    };
  };`;

code = code.replace(cartTotalsTarget, cartTotalsReplacement);

const waTarget = `  const getWhatsAppCustomerUrl = () => {
    if (!completedInvoice) return '#';
    
    const itemsText = cartItems.map((item) => {
      const unitPrice = item.product.selling_price - item.discount;
      const sizeStr = item.product.size ? \` (Size: \${item.product.size})\` : '';
      const colorStr = item.product.color ? \` (Color: \${item.product.color})\` : '';
      return \`🛍️ *\${item.product.name}*\${sizeStr}\${colorStr}\\n   Qty: \${item.quantity} | Rate: ₹\${unitPrice.toFixed(0)} | Total: ₹\${(unitPrice * item.quantity).toFixed(0)}\`;
    }).join('\\n\\n');

    const discountDetails = completedInvoice.discount > 0 ? \`👉 Discount: -₹\${completedInvoice.discount.toFixed(0)}\\n\` : '';
    const gstDetails = completedInvoice.gst_amount > 0 ? \`👉 GST: ₹\${completedInvoice.gst_amount.toFixed(0)}\\n\` : '';

    const messageText = \`*\${shopName}* 🙏\\n\` +
      \`प्रिय ग्राहक *\${completedInvoice.customer_name}*,\\n\` +
      \`खरेदी केल्याबद्दल धन्यवाद! आपले बिल खालीलप्रमाणे आहे:\\n\` +
      \`===================\\n\` +
      \`\${itemsText}\\n\` +
      \`===================\\n\` +
      \`👉 Sub-Total: ₹\${completedInvoice.total_amount.toFixed(0)}\\n\` +
      discountDetails +
      gstDetails +
      \`✅ *Grand Total: ₹\${completedInvoice.grand_total.toFixed(0)}*\\n\\n\` +
      \`पावती क्रमांक: \${completedInvoice.invoice_number}\\n\` +
      \`दिनांक: \${new Date(completedInvoice.date).toLocaleDateString('mr-IN')}\\n\\n\` +
      \`पुन्हा भेट द्या! 🙏\`;

    return \`https://wa.me/91\${whatsappPhone}?text=\${encodeURIComponent(messageText)}\`;
  };`;

const waReplacement = `  const getWhatsAppCustomerText = () => {
    if (!completedInvoice) return '';
    
    const itemsText = cartItems.map((item) => {
      const unitPrice = item.product.selling_price - item.discount;
      const sizeStr = item.product.size ? \` (Size: \${item.product.size})\` : '';
      const colorStr = item.product.color ? \` (Color: \${item.product.color})\` : '';
      return \`🛍️ *\${item.product.name}*\${sizeStr}\${colorStr}\\n   Qty: \${item.quantity} | Rate: ₹\${unitPrice.toFixed(0)} | Total: ₹\${(unitPrice * item.quantity).toFixed(0)}\`;
    }).join('\\n\\n');

    const discountDetails = completedInvoice.discount > 0 ? \`👉 Discount: -₹\${completedInvoice.discount.toFixed(0)}\\n\` : '';
    const gstDetails = completedInvoice.gst_amount > 0 ? \`👉 GST: ₹\${completedInvoice.gst_amount.toFixed(0)}\\n\` : '';

    const messageText = \`*\${shopName}* 🙏\\n\` +
      \`प्रिय ग्राहक *\${completedInvoice.customer_name}*,\\n\` +
      \`खरेदी केल्याबद्दल धन्यवाद! आपले बिल खालीलप्रमाणे आहे:\\n\` +
      \`===================\\n\` +
      \`\${itemsText}\\n\` +
      \`===================\\n\` +
      \`👉 Sub-Total: ₹\${completedInvoice.total_amount.toFixed(0)}\\n\` +
      discountDetails +
      gstDetails +
      \`✅ *Grand Total: ₹\${completedInvoice.grand_total.toFixed(0)}*\\n\\n\` +
      \`पावती क्रमांक: \${completedInvoice.invoice_number}\\n\` +
      \`दिनांक: \${new Date(completedInvoice.date).toLocaleDateString('mr-IN')}\\n\\n\` +
      \`पुन्हा भेट द्या! 🙏\`;

    return messageText;
  };

  const getWhatsAppCustomerUrl = () => {
    return \`https://wa.me/91\${whatsappPhone}?text=\${encodeURIComponent(getWhatsAppCustomerText())}\`;
  };

  const sendWhatsAppBillApi = async () => {
    if (!completedInvoice || !whatsappPhone) {
        alert('Please enter a mobile number');
        return;
    }
    try {
        const payload = getWhatsAppCustomerText();
        const response = await fetch('/api/send-whatsapp-bill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: whatsappPhone, payload: payload, invoice: completedInvoice })
        });
        const result = await response.json();
        if (result.success) {
            alert('WhatsApp API Message Sent Successfully!');
            addAuditLog(\`व्हाट्सॲपवर पावती पाठवली (API): \${completedInvoice.customer_name} (\${whatsappPhone})\`);
        } else {
            alert('Failed to send WhatsApp message.');
        }
    } catch (e) {
        alert('Error sending WhatsApp message.');
        console.error(e);
    }
  };`;

code = code.replace(waTarget, waReplacement);
fs.writeFileSync('src/App.tsx', code);
