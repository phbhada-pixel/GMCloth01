const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const waStart = '  // WhatsApp Customer Invoice Generator\n  const getWhatsAppCustomerUrl = () => {';
const waEnd = 'https://wa.me/91${whatsappPhone}?text=${encodeURIComponent(messageText)}`;\n  };';

let idx1 = code.indexOf(waStart);
let idx2 = code.indexOf(waEnd);

if (idx1 !== -1 && idx2 !== -1) {
  const replacement = `  // WhatsApp Customer Invoice Generator
  const getWhatsAppCustomerText = () => {
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
  
  code = code.substring(0, idx1) + replacement + code.substring(idx2 + waEnd.length);
  fs.writeFileSync('src/App.tsx', code);
  console.log('WhatsApp function patched!');
} else {
  console.log('Could not find WhatsApp function bounds.');
}
