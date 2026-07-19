import { Language } from '../types';

const translations: Record<string, Record<Language, string>> = {
  app_title: {
    MARATHI: "कपडा बाजार प्रो",
    HINDI: "कपड़ा बाजार प्रो",
    ENGLISH: "Kapada Bazar Pro"
  },
  tagline: {
    MARATHI: "कापड दुकान व्यवस्थापन प्रणाली",
    HINDI: "कपड़ा दुकान प्रबंधन प्रणाली",
    ENGLISH: "Textile Shop Management System"
  },
  owner_login: {
    MARATHI: "मालक लॉगिन",
    HINDI: "मालिक लॉगिन",
    ENGLISH: "Owner Login"
  },
  employee_login: {
    MARATHI: "कर्मचारी लॉगिन",
    HINDI: "कर्मचारी लॉगिन",
    ENGLISH: "Employee Login"
  },
  home: {
    MARATHI: "📊 होम",
    HINDI: "📊 होम",
    ENGLISH: "📊 Dashboard"
  },
  billing: {
    MARATHI: "🛍️ विक्री",
    HINDI: "🛍️ बिक्री",
    ENGLISH: "🛍️ Billing"
  },
  stock: {
    MARATHI: "📦 स्टॉक",
    HINDI: "📦 स्टॉक",
    ENGLISH: "📦 Inventory"
  },
  reports: {
    MARATHI: "📑 रिपोर्ट",
    HINDI: "📑 रिपोर्ट",
    ENGLISH: "📑 Reports"
  },
  settings: {
    MARATHI: "⚙️ सेटिंग",
    HINDI: "⚙️ सेटिंग",
    ENGLISH: "⚙️ Settings"
  },
  shop_details: {
    MARATHI: "दुकान माहिती",
    HINDI: "दुकान का विवरण",
    ENGLISH: "Shop Details"
  },
  shop_name: {
    MARATHI: "दुकानचे नाव",
    HINDI: "दुकान का नाम",
    ENGLISH: "Shop Name"
  },
  shop_address: {
    MARATHI: "पत्ता",
    HINDI: "पता",
    ENGLISH: "Address"
  },
  gst_number: {
    MARATHI: "जीएसटी क्रमांक (GSTIN)",
    HINDI: "जीएसटी नंबर (GSTIN)",
    ENGLISH: "GSTIN Number"
  },
  upi_id: {
    MARATHI: "यूपीआय आयडी (UPI ID)",
    HINDI: "यूपीआई आईडी (UPI ID)",
    ENGLISH: "UPI ID"
  },
  whats_no: {
    MARATHI: "व्हाट्सॲप क्रमांक",
    HINDI: "व्हाट्सएप नंबर",
    ENGLISH: "WhatsApp Number"
  },
  save_settings: {
    MARATHI: "सेटिंग्ज जतन करा",
    HINDI: "सेटिंग्स सहेजें",
    ENGLISH: "Save Settings"
  },
  add_product: {
    MARATHI: "नवीन कापड उत्पादन जोडा",
    HINDI: "नया कपड़ा उत्पाद जोड़ें",
    ENGLISH: "Add New Product"
  },
  search_product: {
    MARATHI: "उत्पादन शोधा (साडी, कुर्ती...)",
    HINDI: "उत्पाद खोजें (साड़ी, कुर्ती...)",
    ENGLISH: "Search product (Saree, Kurti...)"
  },
  stock_qty: {
    MARATHI: "स्टॉक प्रमाण",
    HINDI: "स्टॉक मात्रा",
    ENGLISH: "Stock Qty"
  },
  selling_price: {
    MARATHI: "विक्री दर",
    HINDI: "बिक्री मूल्य",
    ENGLISH: "Selling Price"
  },
  purchase_price: {
    MARATHI: "खरेदी दर",
    HINDI: "खरीद मूल्य",
    ENGLISH: "Purchase Price"
  },
  customer: {
    MARATHI: "ग्राहक",
    HINDI: "ग्राहक",
    ENGLISH: "Customer"
  },
  payment_mode: {
    MARATHI: "पेमेंट मोड",
    HINDI: "पेमेंट मोड",
    ENGLISH: "Payment Mode"
  },
  grand_total: {
    MARATHI: "एकूण देय रक्कम",
    HINDI: "कुल देय राशि",
    ENGLISH: "Grand Total"
  },
  total: {
    MARATHI: "एकूण",
    HINDI: "कुल",
    ENGLISH: "Total"
  },
  sub_total: {
    MARATHI: "उप-एकूण",
    HINDI: "उप-कुल",
    ENGLISH: "Sub Total"
  },
  discount: {
    MARATHI: "सवलत (सूट)",
    HINDI: "छूट",
    ENGLISH: "Discount"
  },
  gst: {
    MARATHI: "जीएसटी (GST)",
    HINDI: "जीएसटी (GST)",
    ENGLISH: "GST"
  },
  recent_sales: {
    MARATHI: "अलीकडील विक्री व्यवहार",
    HINDI: "हाल की बिक्री",
    ENGLISH: "Recent Sales Transactions"
  },
  out_of_stock: {
    MARATHI: "स्टॉकमध्ये नाही!",
    HINDI: "स्टॉक में नहीं है!",
    ENGLISH: "Out of Stock!"
  },
  low_stock: {
    MARATHI: "कमी स्टॉक",
    HINDI: "कम स्टॉक",
    ENGLISH: "Low Stock"
  },
  add_supplier: {
    MARATHI: "सप्लायर जोडा",
    HINDI: "आपूर्तिकर्ता जोड़ें",
    ENGLISH: "Add Supplier"
  },
  add_customer: {
    MARATHI: "नवीन ग्राहक जोडा",
    HINDI: "नया ग्राहक जोड़ें",
    ENGLISH: "Add Customer"
  },
  logout: {
    MARATHI: "लॉगआउट 🚪",
    HINDI: "लॉगआउट 🚪",
    ENGLISH: "Logout 🚪"
  },
  active_user: {
    MARATHI: "सक्रिय वापरकर्ता",
    HINDI: "सक्रिय उपयोगकर्ता",
    ENGLISH: "Active User"
  }
};

export const Loc = {
  t: (key: string, lang: Language): string => {
    return translations[key]?.[lang] || key;
  }
};
