import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Boxes, 
  FileText, 
  Settings, 
  User, 
  TrendingUp, 
  Plus, 
  Search, 
  Trash2, 
  Users, 
  Truck, 
  Check, 
  AlertTriangle, 
  Globe, 
  Share2, 
  LogOut, 
  Database,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  PlusCircle,
  Eye,
  Percent,
  CheckCircle2,
  Printer,
  Tag,
  Barcode as BarcodeIcon,
  Send,
  Bell
} from 'lucide-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import { 
  Product, 
  Customer, 
  Supplier, 
  Sale, 
  SaleItem, 
  Purchase, 
  StockTransaction, 
  AuditLog, 
  Language, 
  UserRole,
  Shop,
  UserAccount
} from './types';
import { Loc } from './localization';

// Code 39 Barcode Patterns Table
const CODE39_PATTERNS: Record<string, string> = {
  '0': 'NNNWWNWNN', '1': 'WNNWNNNNW', '2': 'NNWWNNNNW', '3': 'WNWWNNNNN', '4': 'NNNWNNNWW',
  '5': 'WNNWNNNWN', '6': 'NNWWNNNWN', '7': 'NNNWNNWNW', '8': 'WNNWNNWNN', '9': 'NNWWNNWNN',
  'A': 'WNNNNWNNW', 'B': 'NNWNNWNNW', 'C': 'WNWNNWNNN', 'D': 'NNNNWWNNW', 'E': 'WNNNWWNNN',
  'F': 'NNWNWWNNN', 'G': 'NNNNNWNWW', 'H': 'WNNNNWNWN', 'I': 'NNWNNWNWN', 'J': 'NNNNWWNWN',
  'K': 'WNNNNNNWW', 'L': 'NNWNNNNWW', 'M': 'WNWNNNNWN', 'N': 'NNNNWNNWW', 'O': 'WNNNWNNWN',
  'P': 'NNWNWNNWN', 'Q': 'NNNNNNWWW', 'R': 'WNNNNNWWN', 'S': 'NNWNNNWWN', 'T': 'NNNNWNNWN',
  'U': 'WWNNNNNNW', 'V': 'NWWNNNNNW', 'W': 'WWWNNNNNN', 'X': 'NWNNWNNNW', 'Y': 'WWNNWNNNN',
  'Z': 'NWWNWNNNN', '-': 'NWNNNNWNW', '.': 'WWNNNNWNN', ' ': 'NWWNNNWNN', '*': 'NWNNWNWNN',
  '$': 'NWNWNWNNN', '/': 'NWNWNNNWN', '+': 'NWNNNWNWN', '%': 'NNNWNWNWN',
};

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
}

export function Barcode({ value, width = 1.3, height = 36 }: BarcodeProps) {
  const sanitizedValue = `*${value.toUpperCase().replace(/[^A-Z0-9\-\.\s\$\/\+\%]/g, '')}*`;
  
  let totalWidth = 0;
  for (let i = 0; i < sanitizedValue.length; i++) {
    const char = sanitizedValue[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    for (let j = 0; j < pattern.length; j++) {
      totalWidth += pattern[j] === 'W' ? 3 : 1;
    }
    if (i < sanitizedValue.length - 1) {
      totalWidth += 1; // Inter-character gap
    }
  }

  const rects: React.ReactNode[] = [];
  let currentX = 0;

  for (let i = 0; i < sanitizedValue.length; i++) {
    const char = sanitizedValue[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    for (let j = 0; j < pattern.length; j++) {
      const isBar = j % 2 === 0;
      const elementWidth = pattern[j] === 'W' ? 3 : 1;
      
      if (isBar) {
        rects.push(
          <rect
            key={`${i}-${j}`}
            x={currentX * width}
            y={0}
            width={elementWidth * width}
            height={height}
            fill="#000000"
          />
        );
      }
      currentX += elementWidth;
    }
    currentX += 1; // Inter-character gap
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        width={totalWidth * width}
        height={height}
        viewBox={`0 0 ${totalWidth * width} ${height}`}
        className="mx-auto"
      >
        {rects}
      </svg>
      <span className="text-[9px] font-mono tracking-[3px] mt-1 text-gray-700">
        {value.toUpperCase()}
      </span>
    </div>
  );
}

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "पैठणी साडी - पेशवाई डिझाईन",
    category: "साड्या (Sarees)",
    purchase_price: 2500,
    selling_price: 3999,
    mrp: 4500,
    discount: 501,
    gst_percent: 5,
    color: "मोरपिंखा (Peacock Green)",
    size: "प्रमाणित (Standard)",
    pattern: "काठपदर जरी वर्क",
    fabric: "प्युअर सिल्क (Pure Silk)",
    hsn_code: "5007",
    stock_quantity: 15,
    min_stock: 5,
    rack_number: "A-1",
    remarks: "लग्नसराई विशेष",
    last_updated: Date.now()
  },
  {
    id: "prod-2",
    name: "बनारसी शालू - पारंपरिक",
    category: "साड्या (Sarees)",
    purchase_price: 3500,
    selling_price: 5499,
    mrp: 6500,
    discount: 1001,
    gst_percent: 5,
    color: "लाल (Traditional Red)",
    size: "प्रमाणित (Standard)",
    pattern: "जरी बुट्टा",
    fabric: "बनारसी सिल्क",
    hsn_code: "5007",
    stock_quantity: 8,
    min_stock: 3,
    rack_number: "A-2",
    remarks: "नवरीसाठी विशेष",
    last_updated: Date.now()
  },
  {
    id: "prod-3",
    name: "जयपुरी कुर्ती - सुती बांधणी",
    category: "कुर्ती (Kurtis)",
    purchase_price: 350,
    selling_price: 699,
    mrp: 999,
    discount: 300,
    gst_percent: 5,
    color: "पिवळा (Bright Yellow)",
    size: "XL",
    pattern: "प्रिंटेड बांधणी",
    fabric: "कॉटन (Pure Cotton)",
    hsn_code: "6204",
    stock_quantity: 25,
    min_stock: 8,
    rack_number: "B-3",
    last_updated: Date.now()
  },
  {
    id: "prod-4",
    name: "डिझायनर लेहेंगा चोली - फ्लोरल",
    category: "लेहेंगा (Lehengas)",
    purchase_price: 4500,
    selling_price: 7999,
    mrp: 9500,
    discount: 1501,
    gst_percent: 5,
    color: "गुलाबी (Peach Pink)",
    size: "L",
    pattern: "जरदोजी एम्ब्रॉयडरी",
    fabric: "जॉर्जेट",
    hsn_code: "6204",
    stock_quantity: 4,
    min_stock: 5,
    rack_number: "Showroom-1",
    last_updated: Date.now()
  },
  {
    id: "prod-5",
    name: "लखनवी चिकनकारी कुर्ता - पुरुषांसाठी",
    category: "पुरुष कपडे (Menswear)",
    purchase_price: 600,
    selling_price: 1299,
    mrp: 1800,
    discount: 501,
    gst_percent: 5,
    color: "पांढरा (Classic White)",
    size: "L",
    pattern: "चिकनकारी वर्क",
    fabric: "खादी सुती",
    hsn_code: "6205",
    stock_quantity: 12,
    min_stock: 4,
    rack_number: "C-2",
    last_updated: Date.now()
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "मनिषा सचिन पाटील", mobile: "9876543210", address: "शनिवार पेठ, पुणे", outstanding_balance: 0, last_updated: Date.now() },
  { id: "cust-2", name: "अमित भालचंद्र कुलकर्णी", mobile: "9012345678", address: "राजारामपुरी, कोल्हापूर", outstanding_balance: 1500, last_updated: Date.now() },
  { id: "cust-3", name: "सुप्रिया विजय देशपांडे", mobile: "8888888888", address: "टीव्ही सेंटर, संभाजीनगर", outstanding_balance: 800, last_updated: Date.now() }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: "supp-1", name: "कोठारी टेक्स्टाईल्स - सुरत", contact: "9999988888", gst_number: "24AAACK1234F1Z5", pending_payment: 25000, last_updated: Date.now() },
  { id: "supp-2", name: "मुथा सिल्क हाऊस - येवला", contact: "9422001122", gst_number: "27AABCM5678Q2Z3", pending_payment: 12000, last_updated: Date.now() }
];

const INITIAL_SALES: Sale[] = [
  {
    id: "sale-1",
    invoice_number: "INV-2026-001",
    customer_id: "cust-1",
    customer_name: "मनिषा सचिन पाटील",
    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
    total_amount: 3999,
    discount: 200,
    gst_amount: 189.95,
    grand_total: 3988.95,
    payment_mode: "UPI",
    payment_status: "PAID",
    last_updated: Date.now()
  },
  {
    id: "sale-2",
    invoice_number: "INV-2026-002",
    customer_id: "cust-2",
    customer_name: "अमित भालचंद्र कुलकर्णी",
    date: Date.now() - 1 * 24 * 60 * 60 * 1000,
    total_amount: 1299,
    discount: 0,
    gst_amount: 64.95,
    grand_total: 1363.95,
    payment_mode: "CREDIT",
    payment_status: "PENDING",
    last_updated: Date.now()
  }
];

export default function App() {
  // Authentication & Configuration State
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('t_role');
    return saved ? (saved as UserRole) : null;
  });
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('t_lang');
    return saved ? (saved as Language) : 'MARATHI';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'billing' | 'stock' | 'reports' | 'settings' | 'shops'>(() => {
    const savedRole = localStorage.getItem('t_role');
    return savedRole === 'MASTER_ADMIN' ? 'shops' : 'home';
  });

  useEffect(() => {
    if (role === 'MASTER_ADMIN' && activeTab !== 'shops') {
      setActiveTab('shops');
    }
  }, [role, activeTab]);

  // Master Admin & Multi-Shop States
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('t_shops');
    if (saved) return JSON.parse(saved);
    const initial: Shop[] = [
      {
        id: "shop-mauli",
        name: "माऊली गारमेंट्स आणि साडी सेंटर",
        address: "मेन रोड, येवला, नाशिक - ४२३४०१",
        whatsNo: "9876543210",
        upiId: "maulicloth@oksbi",
        gstNumber: "२७एएएसीएफ१२३४ए१जेड५",
        created_at: 0 // Use 0 so cloud sync always overwrites this local mock on a new device
      }
    ];
    localStorage.setItem('t_shops', JSON.stringify(initial));
    return initial;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('t_users');
    if (saved) return JSON.parse(saved);
    const initial: UserAccount[] = [
      {
        id: "user-master",
        username: "master",
        password: "master123",
        role: "MASTER_ADMIN",
        shopId: null,
        last_updated: 0
      },
      {
        id: "user-mauli",
        username: "mauli_admin",
        password: "admin123",
        role: "SHOP_ADMIN",
        shopId: "shop-mauli",
        email: "admin@mauli.com",
        last_updated: 0
      },
      {
        id: "user-emp",
        username: "mauli_emp",
        password: "emp123",
        role: "EMPLOYEE",
        shopId: "shop-mauli",
        email: "emp@mauli.com",
        last_updated: 0
      }
    ];
    localStorage.setItem('t_users', JSON.stringify(initial));
    return initial;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('t_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentShopId, setCurrentShopId] = useState<string>(() => {
    return localStorage.getItem('current_shop_id') || 'shop-mauli';
  });

  // Supabase Integration Setup
  const [sbUrl, setSbUrl] = useState(() => localStorage.getItem('sb_url') || '');
  const [sbKey, setSbKey] = useState(() => localStorage.getItem('sb_key') || '');
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [sbSyncStatus, setSbSyncStatus] = useState<'DISCONNECTED' | 'CONNECTED' | 'ERROR'>('DISCONNECTED');
  const [autoSync, setAutoSync] = useState<boolean>(() => {
    const saved = localStorage.getItem('t_auto_sync');
    return saved === null ? true : saved === 'true';
  });
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | null }>({ message: '', type: null });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [sbSubTab, setSbSubTab] = useState<'status' | 'sql' | 'guide'>('status');
  const [masterSbSubTab, setMasterSbSubTab] = useState<'status' | 'master_sql' | 'shop_sql' | 'guide'>('status');
  const [isShopSbUnlocked, setIsShopSbUnlocked] = useState<boolean>(false);
  const [isMasterSbUnlocked, setIsMasterSbUnlocked] = useState<boolean>(false);

  // Master Admin Separate Supabase States
  const [masterSbUrl, setMasterSbUrl] = useState(() => import.meta.env.VITE_MASTER_SB_URL || import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('master_sb_url') || '');
  const [masterSbKey, setMasterSbKey] = useState(() => import.meta.env.VITE_MASTER_SB_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || localStorage.getItem('master_sb_key') || '');
  const [masterSupabaseClient, setMasterSupabaseClient] = useState<SupabaseClient | null>(null);

  // Email OTP Password Reset States
  const [showOtpChange, setShowOtpChange] = useState(false);
  const [otpStep, setOtpStep] = useState<'INPUT_USER' | 'INPUT_OTP' | 'INPUT_NEW_PASS'>('INPUT_USER');
  const [otpUser, setOtpUser] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpNewPass, setOtpNewPass] = useState('');
  const [mockEmailAlert, setMockEmailAlert] = useState<string | null>(null);

  // Low Stock Notification structure and states
  interface LowStockNotification {
    id: string;
    productId: string;
    productName: string;
    remainingStock: number;
    minStock: number;
    timestamp: number;
    read: boolean;
  }

  const [lowStockNotifs, setLowStockNotifs] = useState<LowStockNotification[]>(() => {
    const saved = localStorage.getItem('low_stock_notifs_' + (localStorage.getItem('current_shop_id') || 'shop-mauli'));
    return saved ? JSON.parse(saved) : [];
  });
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [justTriggeredLowStock, setJustTriggeredLowStock] = useState<LowStockNotification[]>([]);
  const [showLowStockOverlay, setShowLowStockOverlay] = useState<boolean>(false);

  const updateLocalNotifs = (updated: LowStockNotification[], shopId = currentShopId) => {
    setLowStockNotifs(updated);
    localStorage.setItem('low_stock_notifs_' + shopId, JSON.stringify(updated));
  };

  // Core Entity States
  const [isLargeFont, setIsLargeFont] = useState<boolean>(() => localStorage.getItem('t_large_font') === 'true');
  const [custSearch, setCustSearch] = useState<string>('');
  const [custSort, setCustSort] = useState<'name' | 'bal-desc' | 'bal-asc' | 'updated'>('bal-desc');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Shop Info State (Synced from current active shop)
  const [shopName, setShopName] = useState('माऊली गारमेंट्स आणि साडी सेंटर');
  const [shopAddress, setShopAddress] = useState('मेन रोड, येवला, नाशिक - ४२३४०१');
  const [gstNumber, setGstNumber] = useState('२७एएएसीएफ१२३४ए१जेड५');
  const [upiId, setUpiId] = useState('maulicloth@oksbi');
  const [whatsNo, setWhatsNo] = useState('9876543210');
  const [showMonthlyReportPrint, setShowMonthlyReportPrint] = useState(false);

  // Sync shop info state when currentShopId changes
  useEffect(() => {
    const activeShop = shops.find(s => s.id === currentShopId);
    if (activeShop) {
      setShopName(activeShop.name);
      setShopAddress(activeShop.address);
      setGstNumber(activeShop.gstNumber || '');
      setUpiId(activeShop.upiId);
      setWhatsNo(activeShop.whatsNo);
    }
  }, [currentShopId, shops]);

  // Initialize and load local data partitioned by active shop
  useEffect(() => {
    // Products
    const localProducts = localStorage.getItem('t_products_' + currentShopId);
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      const initial = currentShopId === 'shop-mauli' ? INITIAL_PRODUCTS : [];
      setProducts(initial);
      localStorage.setItem('t_products_' + currentShopId, JSON.stringify(initial));
    }

    // Customers
    const localCustomers = localStorage.getItem('t_customers_' + currentShopId);
    if (localCustomers) {
      setCustomers(JSON.parse(localCustomers));
    } else {
      const initial = currentShopId === 'shop-mauli' ? INITIAL_CUSTOMERS : [];
      setCustomers(initial);
      localStorage.setItem('t_customers_' + currentShopId, JSON.stringify(initial));
    }

    // Suppliers
    const localSuppliers = localStorage.getItem('t_suppliers_' + currentShopId);
    if (localSuppliers) {
      setSuppliers(JSON.parse(localSuppliers));
    } else {
      const initial = currentShopId === 'shop-mauli' ? INITIAL_SUPPLIERS : [];
      setSuppliers(initial);
      localStorage.setItem('t_suppliers_' + currentShopId, JSON.stringify(initial));
    }

    // Sales
    const localSales = localStorage.getItem('t_sales_' + currentShopId);
    if (localSales) {
      setSales(JSON.parse(localSales));
    } else {
      const initial = currentShopId === 'shop-mauli' ? INITIAL_SALES : [];
      setSales(initial);
      localStorage.setItem('t_sales_' + currentShopId, JSON.stringify(initial));
    }

    // Purchases
    const localPurchases = localStorage.getItem('t_purchases_' + currentShopId);
    if (localPurchases) {
      setPurchases(JSON.parse(localPurchases));
    } else {
      setPurchases([]);
      localStorage.setItem('t_purchases_' + currentShopId, JSON.stringify([]));
    }

    // Audit Logs
    const localLogs = localStorage.getItem('t_audit_logs_' + currentShopId);
    if (localLogs) {
      setAuditLogs(JSON.parse(localLogs));
    } else {
      const initialLogs: AuditLog[] = [
        { id: "log-1", action: "कपडा दुकान व्यवस्थापन प्रणाली सुरू झाली", user: "सिस्टम", timestamp: Date.now() }
      ];
      setAuditLogs(initialLogs);
      localStorage.setItem('t_audit_logs_' + currentShopId, JSON.stringify(initialLogs));
    }

    // Low Stock Notifications
    const localNotifs = localStorage.getItem('low_stock_notifs_' + currentShopId);
    if (localNotifs) {
      setLowStockNotifs(JSON.parse(localNotifs));
    } else {
      setLowStockNotifs([]);
    }

    // Load shop-specific Supabase credentials
    const matchedShop = shops.find(s => s.id === currentShopId);
    const shopUrl = matchedShop?.sbUrl || localStorage.getItem('sb_url_' + currentShopId) || localStorage.getItem('sb_url') || '';
    const shopKey = matchedShop?.sbKey || localStorage.getItem('sb_key_' + currentShopId) || localStorage.getItem('sb_key') || '';
    setSbUrl(shopUrl);
    setSbKey(shopKey);
  }, [currentShopId, shops]);

  // Sync Supabase Client if credentials exist
  useEffect(() => {
    if (sbUrl && sbKey) {
      try {
        const client = createClient(sbUrl, sbKey);
        setSupabaseClient(client);
        setSbSyncStatus('CONNECTED');
        addAuditLog("Supabase डेटाबेसशी यशस्वी संपर्क प्रस्थापित झाला");
      } catch (err) {
        setSbSyncStatus('ERROR');
        console.error(err);
      }
    } else {
      setSupabaseClient(null);
      setSbSyncStatus('DISCONNECTED');
    }
  }, [sbUrl, sbKey]);

  // Sync Master Supabase Client if credentials exist
  useEffect(() => {
    if (masterSbUrl && masterSbKey) {
      try {
        const client = createClient(masterSbUrl, masterSbKey);
        setMasterSupabaseClient(client);
        console.log("Master Supabase database client initialized successfully");
      } catch (err) {
        console.error("Master Supabase initialization error:", err);
      }
    } else {
      setMasterSupabaseClient(null);
    }
  }, [masterSbUrl, masterSbKey]);

  // Helper to upload a list to Supabase
  const uploadTableToSupabase = async (tableName: string, dataArray: any[], forceUseMaster: boolean = false) => {
    const isMasterTable = tableName === 't_shops' || tableName === 't_user_accounts';
    const useMaster = forceUseMaster || (isMasterTable && role === 'MASTER_ADMIN');

    const url = useMaster ? masterSbUrl : sbUrl;
    const key = useMaster ? masterSbKey : sbKey;
    let client = useMaster ? masterSupabaseClient : supabaseClient;

    if (!url || !key) return { success: false, error: 'Supabase URL किंवा Key कॉन्फिगर केलेली नाही' };
    if (!client) {
      try {
        client = createClient(url, key);
      } catch (e: any) {
        return { success: false, error: e?.message || String(e) };
      }
    }
    if (!client) return { success: false, error: 'Supabase client initialize होऊ शकले नाही' };

    try {
      const formattedData = dataArray.map(item => {
        const copy = { ...item };
        if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
          copy.shop_id = currentShopId;
        }
        return copy;
      });

      const { error } = await client
        .from(tableName)
        .upsert(formattedData, { onConflict: 'id' });

      if (error) {
        console.error(`Supabase sync error for ${tableName}:`, error);
        const errorMsg = error.message || error.details || error.hint || JSON.stringify(error);
        return { success: false, error: errorMsg };
      }
      return { success: true };
    } catch (err: any) {
      console.error(`Sync exception for table ${tableName}:`, err);
      const errorMsg = err?.message || err?.details || JSON.stringify(err) || String(err);
      return { success: false, error: errorMsg };
    }
  };

  // Helper: Persist and sync lists
  const updateLocalProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('t_products_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_products', updated);
    }
  };

  const updateLocalCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    localStorage.setItem('t_customers_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_customers', updated);
    }
  };

  const updateLocalSuppliers = (updated: Supplier[]) => {
    setSuppliers(updated);
    localStorage.setItem('t_suppliers_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_suppliers', updated);
    }
  };

  const updateLocalSales = (updated: Sale[]) => {
    setSales(updated);
    localStorage.setItem('t_sales_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_sales', updated);
    }
  };

  const updateLocalPurchases = (updated: Purchase[]) => {
    setPurchases(updated);
    localStorage.setItem('t_purchases_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_purchases', updated);
    }
  };

  const addAuditLog = (action: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      user: role === 'MASTER_ADMIN' ? 'मास्टर अॅडमीन' : role === 'SHOP_ADMIN' ? 'दुकान मालक' : role === 'EMPLOYEE' ? 'कर्मचारी' : 'अतिथी',
      timestamp: Date.now()
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('t_audit_logs_' + currentShopId, JSON.stringify(updated));
    if (autoSync) {
      uploadTableToSupabase('t_audit_logs', [newLog]);
    }
  };

  // State for forms/dialogs
  const [showAddProd, setShowAddProd] = useState(false);
  const [showAddCust, setShowAddCust] = useState(false);
  const [showAddSupp, setShowAddSupp] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showStockAdjust, setShowStockAdjust] = useState(false);

  // Barcode Label State
  const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState<Product | null>(null);
  const [barcodePrintQty, setBarcodePrintQty] = useState(12);
  const [showBarcodeShopName, setShowBarcodeShopName] = useState(true);
  const [showBarcodeProdName, setShowBarcodeProdName] = useState(true);
  const [showBarcodePrice, setShowBarcodePrice] = useState(true);
  const [showBarcodeAttrs, setShowBarcodeAttrs] = useState(true);

  // Active Billing Cart state
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [billingSearch, setBillingSearch] = useState('');
  const [billPaymentMode, setBillPaymentMode] = useState<'CASH' | 'UPI' | 'CARD' | 'CREDIT'>('CASH');
  const [cartDiscount, setCartDiscount] = useState(0);
  const [completedInvoice, setCompletedInvoice] = useState<Sale | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');

  // WhatsApp Customer Invoice Generator
  const getWhatsAppCustomerUrl = () => {
    if (!completedInvoice) return '#';
    
    const itemsText = cartItems.map((item) => {
      const unitPrice = item.product.selling_price - item.discount;
      const sizeStr = item.product.size ? ` (Size: ${item.product.size})` : '';
      const colorStr = item.product.color ? ` (Color: ${item.product.color})` : '';
      return `🛍️ *${item.product.name}*${sizeStr}${colorStr}\n   Qty: ${item.quantity} | Rate: ₹${unitPrice.toFixed(0)} | Total: ₹${(unitPrice * item.quantity).toFixed(0)}`;
    }).join('\n\n');

    const discountDetails = completedInvoice.discount > 0 ? `👉 Discount: -₹${completedInvoice.discount.toFixed(0)}\n` : '';
    const gstDetails = completedInvoice.gst_amount > 0 ? `👉 GST: ₹${completedInvoice.gst_amount.toFixed(0)}\n` : '';

    const messageText = `*${shopName}* 🙏\n` +
      `प्रिय ग्राहक *${completedInvoice.customer_name}*,\n` +
      `खरेदी केल्याबद्दल धन्यवाद! आपले बिल खालीलप्रमाणे आहे:\n` +
      `------------------------------------------\n` +
      `📄 *बिल तपशील (Bill Details):*\n` +
      `• बिल क्रमांक (Bill No): ${completedInvoice.invoice_number}\n` +
      `• दिनांक (Date): ${new Date(completedInvoice.date).toLocaleDateString('mr-IN')}\n` +
      `• पेमेंट पद्धत (Payment): ${completedInvoice.payment_mode}\n` +
      `------------------------------------------\n` +
      `🧾 *खरेदी साहित्य (Items Purchased):*\n` +
      `${itemsText}\n` +
      `------------------------------------------\n` +
      `👉 Sub Total: ₹${completedInvoice.total_amount.toFixed(0)}\n` +
      discountDetails +
      gstDetails +
      `*🔥 Grand Total: ₹${completedInvoice.grand_total.toFixed(0)}/-\n` +
      `------------------------------------------\n` +
      `📍 पत्ता: ${shopAddress}\n` +
      `📞 संपर्क: +91 ${whatsNo}\n` +
      `------------------------------------------\n` +
      `🌸 *आपली सेवा हीच आमची ओळख! पुन्हा अवश्य यावे.*`;

    const encodedMessage = encodeURIComponent(messageText);
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    return `https://wa.me/${finalPhone}?text=${encodedMessage}`;
  };

  // Change language helper
  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('t_lang', newLang);
    addAuditLog(`अॅपची भाषा ${newLang} मध्ये बदलली`);
  };

  // Role login helper
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    localStorage.setItem('t_role', selectedRole);
    if (selectedRole === 'MASTER_ADMIN') {
      setActiveTab('shops');
    } else {
      setActiveTab('home');
    }
    addAuditLog(`${selectedRole} लॉगिन यशस्वी`);
  };

  const loginWithCredentials = (usernameVal: string, passwordVal: string) => {
    const matched = users.find(u => u.username.toLowerCase() === usernameVal.trim().toLowerCase() && u.password === passwordVal);
    if (matched) {
      const sessionToken = "sess-" + Date.now() + "-" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('t_session_token', sessionToken);

      const updatedUser = { 
        ...matched, 
        session_token: sessionToken, 
        last_updated: Date.now() 
      };

      const nextUsers = users.map(u => u.id === matched.id ? updatedUser : u);
      setUsers(nextUsers);
      localStorage.setItem('t_users', JSON.stringify(nextUsers));

      setRole(matched.role);
      localStorage.setItem('t_role', matched.role);
      if (matched.role === 'MASTER_ADMIN') {
        setActiveTab('shops');
      } else {
        setActiveTab('home');
      }
      setCurrentUser(updatedUser);
      localStorage.setItem('t_active_user', JSON.stringify(updatedUser));
      
      if (matched.shopId) {
        setCurrentShopId(matched.shopId);
        localStorage.setItem('current_shop_id', matched.shopId);
      }
      
      // Setup default audit log for successful login
      const targetShopId = matched.shopId || currentShopId;
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        action: `${matched.role === 'MASTER_ADMIN' ? 'मास्टर' : 'दुकान'} लॉगिन यशस्वी: ${matched.username} (नवीन सत्र सुरू झाले)`,
        user: matched.role === 'MASTER_ADMIN' ? 'मास्टर अॅडमीन' : matched.role === 'SHOP_ADMIN' ? 'दुकान मालक' : 'कर्मचारी',
        timestamp: Date.now()
      };
      
      const localLogs = localStorage.getItem('t_audit_logs_' + targetShopId);
      const parsedLogs = localLogs ? JSON.parse(localLogs) : [];
      localStorage.setItem('t_audit_logs_' + targetShopId, JSON.stringify([newLog, ...parsedLogs]));
      
      // Instantly push this user account update to Supabase
      uploadTableToSupabase('t_user_accounts', nextUsers);

      return { success: true };
    }
    return { success: false };
  };

  // Logout helper
  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    localStorage.removeItem('t_role');
    localStorage.removeItem('t_active_user');
    setActiveTab('home');
  };

  // Handler: Add Product
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: data.get('name') as string,
      category: data.get('category') as string,
      purchase_price: Number(data.get('purchase_price')),
      selling_price: Number(data.get('selling_price')),
      mrp: Number(data.get('mrp')),
      discount: Number(data.get('discount') || 0),
      gst_percent: Number(data.get('gst_percent') || 5),
      color: data.get('color') as string,
      size: data.get('size') as string,
      fabric: data.get('fabric') as string,
      stock_quantity: Number(data.get('stock_quantity') || 0),
      min_stock: Number(data.get('min_stock') || 5),
      rack_number: data.get('rack_number') as string,
      last_updated: Date.now()
    };

    updateLocalProducts([newProd, ...products]);
    addAuditLog(`नवीन उत्पादन जोडले: ${newProd.name}`);
    setShowAddProd(false);
  };

  // Handler: Add Customer
  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: data.get('name') as string,
      mobile: data.get('mobile') as string,
      address: data.get('address') as string,
      outstanding_balance: Number(data.get('outstanding_balance') || 0),
      last_updated: Date.now()
    };

    updateLocalCustomers([newCust, ...customers]);
    addAuditLog(`नवीन ग्राहक जोडला: ${newCust.name}`);
    setShowAddCust(false);
  };

  // Handler: Add Supplier
  const handleAddSupplier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newSupp: Supplier = {
      id: `supp-${Date.now()}`,
      name: data.get('name') as string,
      contact: data.get('contact') as string,
      gst_number: data.get('gst_number') as string,
      pending_payment: Number(data.get('pending_payment') || 0),
      last_updated: Date.now()
    };

    updateLocalSuppliers([newSupp, ...suppliers]);
    addAuditLog(`नवीन सप्लायर जोडला: ${newSupp.name}`);
    setShowAddSupp(false);
  };

  // Billing calculation helpers
  const cartTotals = () => {
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
  };

  // Add Item to Cart
  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      alert(Loc.t("out_of_stock", lang));
      return;
    }
    const existIndex = cartItems.findIndex(item => item.product.id === product.id);
    if (existIndex > -1) {
      const updated = [...cartItems];
      if (updated[existIndex].quantity >= product.stock_quantity) {
        alert("स्टॉकमध्ये यापेक्षा जास्त माल उपलब्ध नाही!");
        return;
      }
      updated[existIndex].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, { product, quantity: 1, discount: 0 }]);
    }
  };

  // Complete and submit Bill
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!selectedCust) {
      alert("कृपया आधी ग्राहक निवडा किंवा जोडा!");
      return;
    }

    const { subTotal, gstAmount, grandTotal } = cartTotals();
    const invoiceNum = `INV-2026-${String(sales.length + 1).padStart(3, '0')}`;
    
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoice_number: invoiceNum,
      customer_id: selectedCust.id,
      customer_name: selectedCust.name,
      date: Date.now(),
      total_amount: subTotal,
      discount: cartDiscount,
      gst_amount: Number(gstAmount.toFixed(2)),
      grand_total: Number(grandTotal.toFixed(2)),
      payment_mode: billPaymentMode,
      payment_status: billPaymentMode === 'CREDIT' ? 'PENDING' : 'PAID',
      last_updated: Date.now()
    };

    // Update stocks
    const updatedProducts = products.map(p => {
      const cartItem = cartItems.find(item => item.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock_quantity: Math.max(0, p.stock_quantity - cartItem.quantity)
        };
      }
      return p;
    });
    updateLocalProducts(updatedProducts);

    // Detect products falling below minimum stock during this transaction
    const lowStockTriggers: LowStockNotification[] = [];
    cartItems.forEach(item => {
      const p = item.product;
      const oldStock = p.stock_quantity;
      const newStock = Math.max(0, oldStock - item.quantity);
      if (newStock <= p.min_stock) {
        lowStockTriggers.push({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: p.id,
          productName: p.name,
          remainingStock: newStock,
          minStock: p.min_stock,
          timestamp: Date.now(),
          read: false
        });
      }
    });

    if (lowStockTriggers.length > 0) {
      const alertLines = lowStockTriggers.map(t => 
        `⚠️ '${t.productName}' चा स्टॉक कमी झाला आहे! (शिल्लक: ${t.remainingStock} | किमान मर्यादा: ${t.minStock})`
      );
      
      // Automated browser alert
      setTimeout(() => {
        alert(`🔴 स्टॉक चेतावणी (LOW STOCK ALERT):\n\n${alertLines.join('\n')}\n\nकृपया नवीन माल खरेदी करा किंवा स्टॉक वाढवा!`);
      }, 500);

      // Save to persistent notifications
      const updatedNotifs = [...lowStockTriggers, ...lowStockNotifs];
      updateLocalNotifs(updatedNotifs);

      // Save to display elegant overlay
      setJustTriggeredLowStock(lowStockTriggers);
      setShowLowStockOverlay(true);

      // Log in system audits
      lowStockTriggers.forEach(t => {
        addAuditLog(`⚠️ अत्यंत कमी स्टॉक चेतावणी: ${t.productName} (शिल्लक: ${t.remainingStock})`);
      });
    }

    // Update Customer outstanding balance if credit sale
    if (billPaymentMode === 'CREDIT') {
      const updatedCustomers = customers.map(c => {
        if (c.id === selectedCust.id) {
          return {
            ...c,
            outstanding_balance: c.outstanding_balance + grandTotal
          };
        }
        return c;
      });
      updateLocalCustomers(updatedCustomers);
    }

    // Save sale
    const updatedSales = [newSale, ...sales];
    updateLocalSales(updatedSales);
    addAuditLog(`नवीन विक्री पावती ${invoiceNum} तयार केली (${selectedCust.name})`);
    setCompletedInvoice(newSale);
    setWhatsappPhone(selectedCust?.mobile || '');

    // Trigger confetti for visual celebration!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#386a20', '#b58900', '#ebdca0']
    });
  };

  // Reset checkout/billing
  const resetBilling = () => {
    setCartItems([]);
    setSelectedCust(null);
    setCartDiscount(0);
    setCompletedInvoice(null);
    setBillingSearch('');
    setWhatsappPhone('');
  };

  // Handler: Purchase Log
  const handleRecordPurchase = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const supplierIdValue = data.get('supplier_id') as string;
    const selectedSupplier = suppliers.find(s => s.id === supplierIdValue);
    if (!selectedSupplier) return;

    const amount = Number(data.get('amount'));
    const newPurchase: Purchase = {
      id: `pur-${Date.now()}`,
      supplier_id: supplierIdValue,
      supplier_name: selectedSupplier.name,
      invoice_number: data.get('invoice_number') as string,
      date: Date.now(),
      amount,
      last_updated: Date.now()
    };

    // Update supplier pending balance
    const updatedSuppliers = suppliers.map(s => {
      if (s.id === supplierIdValue) {
        return {
          ...s,
          pending_payment: s.pending_payment + amount
        };
      }
      return s;
    });

    updateLocalSuppliers(updatedSuppliers);
    updateLocalPurchases([newPurchase, ...purchases]);
    addAuditLog(`नवीन माल खरेदी नोंदवला: ${selectedSupplier.name} कडून ₹${amount}`);
    setShowPurchaseDialog(false);
  };

  // Handler: Quick Stock Adjust
  const handleStockAdjust = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const pId = data.get('product_id') as string;
    const adjustQty = Number(data.get('adjust_qty'));
    const typeValue = data.get('type') as 'IN' | 'OUT' | 'ADJUSTMENT' | 'DAMAGED';

    const updated = products.map(p => {
      if (p.id === pId) {
        let finalQty = p.stock_quantity;
        if (typeValue === 'IN') finalQty += adjustQty;
        else if (typeValue === 'OUT' || typeValue === 'DAMAGED') finalQty = Math.max(0, p.stock_quantity - adjustQty);
        else if (typeValue === 'ADJUSTMENT') finalQty = adjustQty;
        return {
          ...p,
          stock_quantity: finalQty
        };
      }
      return p;
    });

    updateLocalProducts(updated);
    const pName = products.find(p => p.id === pId)?.name || '';
    addAuditLog(`स्टॉकमध्ये बदल केला: ${pName} (${typeValue} -> ${adjustQty} नग)`);
    setShowStockAdjust(false);
  };

  // Helper to download a table from Supabase
  const downloadTableFromSupabase = async (tableName: string, forceUseMaster: boolean = false) => {
    const isMasterTable = tableName === 't_shops' || tableName === 't_user_accounts';
    const useMaster = forceUseMaster || (isMasterTable && role === 'MASTER_ADMIN');

    const url = useMaster ? masterSbUrl : sbUrl;
    const key = useMaster ? masterSbKey : sbKey;
    let client = useMaster ? masterSupabaseClient : supabaseClient;

    if (!url || !key) return null;
    if (!client) {
      try {
        client = createClient(url, key);
      } catch (e) {
        return null;
      }
    }
    if (!client) return null;

    try {
      let query = client.from(tableName).select('*');
      if (tableName !== 't_shops' && tableName !== 't_user_accounts') {
        query = query.eq('shop_id', currentShopId);
      } else if (tableName === 't_user_accounts' && role !== 'MASTER_ADMIN') {
        // Shop admin only downloads users for their shop!
        query = query.eq('shopId', currentShopId);
      }
      const { data, error } = await query;
      if (error) {
        console.error(`Fetch error for ${tableName}:`, error);
        return null;
      }
      return data;
    } catch (err) {
      console.error(`Fetch exception for ${tableName}:`, err);
      return null;
    }
  };

  // Smart Bi-directional sync for a single table
  const smartSyncTable = async (tableName: string, localItems: any[], updateLocalState: (merged: any[]) => void, localStorageKey: string, forceUseMaster: boolean = false) => {
    setSyncLogs(prev => [...prev, `⏳ '${tableName}' टेबल सिंक करत आहे...`]);
    const cloudItems = await downloadTableFromSupabase(tableName, forceUseMaster);
    
    if (cloudItems === null) {
      const errorMsg = `❌ '${tableName}' डेटा क्लाउडवरून मिळवता आला नाही. कृपया खात्री करा की टेबल तयार आहे!`;
      setSyncLogs(prev => [...prev, errorMsg]);
      throw new Error(errorMsg);
    }

    const mergedMap = new Map<string, any>();
    
    // Add local items
    localItems.forEach(item => {
      mergedMap.set(item.id, item);
    });

    let newFromCloudCount = 0;
    let updatedFromCloudCount = 0;
    let localUpdatedCount = 0;

    // Merge cloud items
    cloudItems.forEach((cloudItem: any) => {
      const localItem = mergedMap.get(cloudItem.id);
      if (!localItem) {
        mergedMap.set(cloudItem.id, cloudItem);
        newFromCloudCount++;
      } else {
        const cloudTime = cloudItem.last_updated || cloudItem.timestamp || cloudItem.created_at || 0;
        const localTime = localItem.last_updated || localItem.timestamp || localItem.created_at || 0;
        
        if (cloudTime > localTime) {
          mergedMap.set(cloudItem.id, cloudItem);
          updatedFromCloudCount++;
        } else if (localTime > cloudTime) {
          localUpdatedCount++;
        }
      }
    });

    const mergedList = Array.from(mergedMap.values());
    
    // Update state and storage
    updateLocalState(mergedList);
    localStorage.setItem(localStorageKey, JSON.stringify(mergedList));

    // If there were local updates or list expanded, upload to cloud
    if (localUpdatedCount > 0 || mergedList.length > cloudItems.length) {
      setSyncLogs(prev => [...prev, `📤 '${tableName}' मधील ${localUpdatedCount || (mergedList.length - cloudItems.length)} बदल क्लाउडवर पाठवत आहे...`]);
      const res = await uploadTableToSupabase(tableName, mergedList, forceUseMaster);
      if (!res?.success) {
        setSyncLogs(prev => [...prev, `⚠️ '${tableName}' चे बदल क्लाउडवर सेव्ह करताना त्रुटी आली!`]);
      }
    }

    setSyncLogs(prev => [
      ...prev, 
      `✅ '${tableName}' सिंक झाले! (नवीन: ${newFromCloudCount}, अपडेट: ${updatedFromCloudCount})`
    ]);
  };

  // Master Smart Sync
  const handleSmartSync = async () => {
    if (role === 'MASTER_ADMIN') {
      if (!masterSbUrl || !masterSbKey) {
        alert("कृपया आधी मास्टर Supabase क्रेडेंशियल भरा!");
        return;
      }
      setIsSyncing(true);
      setSyncLogs(["🔄 मास्टर क्लाउड द्विमार्गी स्मार्ट सिंक्रोनाइझेशन सुरू...", "दुकाने आणि सर्व युजर्स खाती सिंक केली जात आहेत..."]);
      try {
        await smartSyncTable('t_shops', shops, setShops, 't_shops');
        await smartSyncTable('t_user_accounts', users, setUsers, 't_users');
        setSyncLogs(prev => [...prev, "🎉 मास्टर डेटा यशस्वीरित्या सिंक झाला!"]);
        addAuditLog("मास्टर क्लाउड डेटा सिंक पूर्ण केला");
        alert("मास्टर सिंक्रोनाइझेशन यशस्वीरित्या पूर्ण झाले! 🎉");
      } catch (err: any) {
        console.error(err);
        setSyncLogs(prev => [...prev, `❌ एरर: ${err?.message}`]);
        alert("मास्टर सिंक अयशस्वी! कृपया खात्री करा की मास्टर Supabase मध्ये 't_shops' आणि 't_user_accounts' टेबल्स तयार आहेत.");
      } finally {
        setIsSyncing(false);
      }
      return;
    }

    // Shop Admin sync
    if (!sbUrl || !sbKey) {
      alert("कृपया आधी Supabase क्रेडेंशियल भरा!");
      return;
    }
    setIsSyncing(true);
    setSyncLogs(["🔄 द्विमार्गी (Bi-directional) स्मार्ट सिंक्रोनाइझेशन सुरू झाले आहे...", `सक्रिय दुकान आयडी: ${currentShopId}`]);
    
    try {
      // 1. Sync user accounts (staff belonging to this shop)
      await smartSyncTable('t_user_accounts', users, setUsers, 't_users');

      // 2. Sync products
      await smartSyncTable('t_products', products, setProducts, 't_products_' + currentShopId);

      // 3. Sync customers
      await smartSyncTable('t_customers', customers, setCustomers, 't_customers_' + currentShopId);

      // 4. Sync suppliers
      await smartSyncTable('t_suppliers', suppliers, setSuppliers, 't_suppliers_' + currentShopId);

      // 5. Sync sales
      await smartSyncTable('t_sales', sales, setSales, 't_sales_' + currentShopId);

      // 6. Sync purchases
      await smartSyncTable('t_purchases', purchases, setPurchases, 't_purchases_' + currentShopId);

      // 7. Sync audit logs
      await smartSyncTable('t_audit_logs', auditLogs, setAuditLogs, 't_audit_logs_' + currentShopId);

      setSyncLogs(prev => [...prev, "🎉 अभिनंदन! सर्व टेबल्स क्लाउड डेटाबेससह यशस्वीरित्या सिंक झाली आहेत."]);
      addAuditLog("Supabase डेटाबेसशी स्मार्ट सिंक पूर्ण केले");
      alert("स्मार्ट सिंक्रोनाइझेशन यशस्वीरित्या पूर्ण झाले! 🎉");
    } catch (err: any) {
      console.error(err);
      setSyncLogs(prev => [...prev, `❌ सिंक्रोनाइझेशन थांबले: ${err?.message || 'कनेक्शन अयशस्वी'}`]);
      alert("सिंक्रोनाइझेशन अयशस्वी! कृपया खात्री करा की तुमच्या Supabase मध्ये सर्व टेबल्स तयार आहेत (खालील SQL स्क्रिप्ट रन करा).");
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual Backup: Download local storage as JSON
  const handleManualBackup = () => {
    try {
      const backupData: Record<string, string | null> = {};
      
      if (role === 'MASTER_ADMIN') {
        // Master admin backs up everything
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            backupData[key] = localStorage.getItem(key);
          }
        }
      } else {
        // Shop admin backs up only their shop's data and global settings
        const globalKeys = ['t_role', 't_lang', 'current_shop_id', 't_active_user'];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            if (globalKeys.includes(key) || key.includes(currentShopId)) {
               backupData[key] = localStorage.getItem(key);
            }
          }
        }
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${role === 'MASTER_ADMIN' ? 'master' : currentShopId}_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addAuditLog("स्थानिक डेटाचा मॅन्युअल बॅकअप डाउनलोड केला");
      alert("✅ यशस्वीरित्या बॅकअप डाउनलोड झाला! (Backup Downloaded Successfully)");
    } catch (err) {
      console.error(err);
      alert("❌ बॅकअप घेण्यात अडचण आली!");
    }
  };

  // Manual Restore: Load JSON file into local storage
  const handleManualRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm("⚠️ सावधान! या फाईलमधील डेटा सध्याच्या डेटाला ओव्हरराईट करेल. तुम्हाला सुरू ठेवायचे आहे का?")) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        
        // Safety check to ensure it's a valid backup object
        if (typeof backupData !== 'object' || Array.isArray(backupData)) {
          throw new Error("Invalid backup format");
        }

        for (const key in backupData) {
          if (backupData.hasOwnProperty(key)) {
            const val = backupData[key];
            if (val !== null && typeof val === 'string') {
              localStorage.setItem(key, val);
            }
          }
        }
        
        alert("✅ बॅकअप यशस्वीरित्या रिस्टोर झाला! अॅप आता रीस्टार्ट होईल.");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("❌ बॅकअप फाईल अवैध आहे किंवा वाचता आली नाही!");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Silent auto-sync for background synchronization
  const silentSmartSync = async () => {
    if (isSyncing || !navigator.onLine) return;
    setIsSyncing(true);
    try {
      let syncDone = false;

      // 1. Sync master tables if master database is configured
      if (masterSbUrl && masterSbKey) {
        try {
          await smartSyncTable('t_shops', shops, setShops, 't_shops', true);
          await smartSyncTable('t_user_accounts', users, setUsers, 't_users', true);
          syncDone = true;
        } catch (err) {
          console.warn("Silent master sync failed:", err);
        }
      }

      // 2. Sync shop-specific tables if shop database is configured and role is active
      const isMaster = role === 'MASTER_ADMIN';
      if (!isMaster && sbUrl && sbKey) {
        try {
          if (!masterSbUrl || !masterSbKey) {
            await smartSyncTable('t_user_accounts', users, setUsers, 't_users', false);
          }
          await smartSyncTable('t_products', products, setProducts, 't_products_' + currentShopId, false);
          await smartSyncTable('t_customers', customers, setCustomers, 't_customers_' + currentShopId, false);
          await smartSyncTable('t_suppliers', suppliers, setSuppliers, 't_suppliers_' + currentShopId, false);
          await smartSyncTable('t_sales', sales, setSales, 't_sales_' + currentShopId, false);
          await smartSyncTable('t_purchases', purchases, setPurchases, 't_purchases_' + currentShopId, false);
          await smartSyncTable('t_audit_logs', auditLogs, setAuditLogs, 't_audit_logs_' + currentShopId, false);
          syncDone = true;
        } catch (err) {
          console.warn("Silent shop sync failed:", err);
        }
      }
      
      if (syncDone) {
        setSyncToast({
          message: "✅ क्लाउड डेटाबेससह स्वयंचलित सिंक्रोनाइझेशन यशस्वीरित्या पूर्ण झाले!",
          type: "success"
        });
        setTimeout(() => setSyncToast(prev => prev.message.includes("यशस्वीरित्या") ? { message: '', type: null } : prev), 3500);
      }
    } catch (err) {
      console.warn("Silent sync could not complete (network may be weak):", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Manage Online/Offline Transition and Sync triggers
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncToast({
        message: "📶 इंटरनेट कनेक्शन सुरू झाले! प्रलंबित डेटा आपोआप क्लाउडवर सिंक होत आहे...",
        type: "info"
      });
      setTimeout(() => setSyncToast(prev => prev.message.includes("इंटरनेट") ? { message: '', type: null } : prev), 5000);
      
      if (sbUrl && sbKey) {
        silentSmartSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncToast({
        message: "⚠️ इंटरनेट कनेक्शन खंडित झाले! डेटा ऑफलाईन मोडमध्ये सुरक्षितपणे सेव्ह केला जाईल.",
        type: "warning"
      });
      setTimeout(() => setSyncToast(prev => prev.message.includes("खंडित") ? { message: '', type: null } : prev), 6000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Run initial silent sync if online and configured
    if (navigator.onLine && ((sbUrl && sbKey) || (masterSbUrl && masterSbKey))) {
      silentSmartSync();
    }

    // Background checker: Retry syncing every 15 seconds if online
    const interval = setInterval(() => {
      if (navigator.onLine && ((sbUrl && sbKey) || (masterSbUrl && masterSbKey))) {
        silentSmartSync();
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [sbUrl, sbKey, currentShopId, shops, users, products, customers, suppliers, sales, purchases, auditLogs]);

  // Active session checker (Single Session Enforcement)
  useEffect(() => {
    const checkActiveSession = async () => {
      if (!currentUser || !navigator.onLine) return;
      
      const isMaster = currentUser.role === 'MASTER_ADMIN';
      const url = isMaster ? masterSbUrl : sbUrl;
      const key = isMaster ? masterSbKey : sbKey;
      if (!url || !key) return;
      
      try {
        const client = createClient(url, key);
        const { data, error } = await client
          .from('t_user_accounts')
          .select('session_token')
          .eq('id', currentUser.id)
          .single();
          
        if (error) {
          console.warn("Session check error:", error);
          return;
        }
        
        if (data) {
          const localToken = localStorage.getItem('t_session_token');
          if (data.session_token && localToken && data.session_token !== localToken) {
            alert("⚠️ सुरक्षा चेतावणी: आपले खाते दुसऱ्या उपकरणावरून किंवा ब्राउझरवरून लॉगिन झाले आहे! त्यामुळे आपले हे चालू सत्र स्वयंचलितपणे समाप्त करण्यात आले आहे.");
            handleLogout();
          }
        }
      } catch (err) {
        console.warn("Session check failed:", err);
      }
    };

    // Check once every 15 seconds
    const sessionInterval = setInterval(checkActiveSession, 15000);
    return () => clearInterval(sessionInterval);
  }, [currentUser, sbUrl, sbKey, masterSbUrl, masterSbKey]);

  // Local user sync session change monitor
  useEffect(() => {
    if (currentUser) {
      const matchedInList = users.find(u => u.id === currentUser.id);
      if (matchedInList) {
        const localToken = localStorage.getItem('t_session_token');
        if (matchedInList.session_token && localToken && matchedInList.session_token !== localToken) {
          alert("⚠️ सुरक्षा चेतावणी: आपले खाते दुसऱ्या उपकरणावरून किंवा ब्राउझरवरून लॉगिन झाले आहे! त्यामुळे आपले हे चालू सत्र स्वयंचलितपणे समाप्त करण्यात आले आहे.");
          handleLogout();
        }
      }
    }
  }, [users, currentUser]);

  // Manual Force Push (overwrite cloud)
  const handlePushToCloud = async () => {
    if (!sbUrl || !sbKey) return;
    if (!confirm("⚠️ तुम्ही चालू स्थानिक डेटासह क्लाउड डेटा पूर्णपणे रीराईट (overwrite) करत आहात. पुढे जावे?")) return;
    setIsSyncing(true);
    setSyncLogs(["📤 क्लाउडवर सर्व स्थानिक डेटा अपलोड करत आहे..."]);
    try {
      await uploadTableToSupabase('t_shops', shops);
      await uploadTableToSupabase('t_user_accounts', users);
      await uploadTableToSupabase('t_products', products);
      await uploadTableToSupabase('t_customers', customers);
      await uploadTableToSupabase('t_suppliers', suppliers);
      await uploadTableToSupabase('t_sales', sales);
      await uploadTableToSupabase('t_purchases', purchases);
      await uploadTableToSupabase('t_audit_logs', auditLogs);
      
      setSyncLogs(prev => [...prev, "✅ सर्व स्थानिक डेटा यशस्वीरित्या क्लाउडवर अपलोड झाला आहे!"]);
      addAuditLog("स्थानिक डेटा मॅन्युअली क्लाउडवर पुश केला");
      alert("स्थानिक डेटा क्लाउडवर यशस्वीरित्या अपलोड झाला! 📤");
    } catch (err: any) {
      setSyncLogs(prev => [...prev, `❌ अपलोड एरर: ${err?.message || err}`]);
      alert("अपलोड अयशस्वी!");
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual Force Pull (overwrite local)
  const handlePullFromCloud = async () => {
    if (!sbUrl || !sbKey) return;
    if (!confirm("⚠️ तुम्ही क्लाउड डेटासह चालू स्थानिक डेटा पूर्णपणे रीराईट करत आहात. स्थानिक डेटा रिप्लेस होईल. पुढे जावे?")) return;
    setIsSyncing(true);
    setSyncLogs(["📥 क्लाउड डेटा स्थानिक मेमरीमध्ये रिस्टोर करत आहे..."]);
    try {
      const cloudShops = await downloadTableFromSupabase('t_shops');
      const cloudUsers = await downloadTableFromSupabase('t_user_accounts');
      const cloudProducts = await downloadTableFromSupabase('t_products');
      const cloudCustomers = await downloadTableFromSupabase('t_customers');
      const cloudSuppliers = await downloadTableFromSupabase('t_suppliers');
      const cloudSales = await downloadTableFromSupabase('t_sales');
      const cloudPurchases = await downloadTableFromSupabase('t_purchases');
      const cloudAuditLogs = await downloadTableFromSupabase('t_audit_logs');

      if (cloudShops) { setShops(cloudShops); localStorage.setItem('t_shops', JSON.stringify(cloudShops)); }
      if (cloudUsers) { setUsers(cloudUsers); localStorage.setItem('t_users', JSON.stringify(cloudUsers)); }
      if (cloudProducts) { setProducts(cloudProducts); localStorage.setItem('t_products_' + currentShopId, JSON.stringify(cloudProducts)); }
      if (cloudCustomers) { setCustomers(cloudCustomers); localStorage.setItem('t_customers_' + currentShopId, JSON.stringify(cloudCustomers)); }
      if (cloudSuppliers) { setSuppliers(cloudSuppliers); localStorage.setItem('t_suppliers_' + currentShopId, JSON.stringify(cloudSuppliers)); }
      if (cloudSales) { setSales(cloudSales); localStorage.setItem('t_sales_' + currentShopId, JSON.stringify(cloudSales)); }
      if (cloudPurchases) { setPurchases(cloudPurchases); localStorage.setItem('t_purchases_' + currentShopId, JSON.stringify(cloudPurchases)); }
      if (cloudAuditLogs) { setAuditLogs(cloudAuditLogs); localStorage.setItem('t_audit_logs_' + currentShopId, JSON.stringify(cloudAuditLogs)); }

      setSyncLogs(prev => [...prev, "✅ सर्व क्लाउड डेटा स्थानिक मेमरीमध्ये यशस्वीरित्या रिस्टोर झाला!"]);
      addAuditLog("क्लाउड डेटा मॅन्युअली स्थानिक मेमरीमध्ये पुल केला");
      alert("क्लाउड डेटा यशस्वीरित्या रिस्टोर झाला! 📥");
    } catch (err: any) {
      setSyncLogs(prev => [...prev, `❌ डाऊनलोड एरर: ${err?.message || err}`]);
      alert("डाऊनलोड अयशस्वी!");
    } finally {
      setIsSyncing(false);
    }
  };

  // Receive customer outstanding balance (Udhaari)
  const handleReceiveUdhaari = (customerId: string, amount: number) => {
    if (isNaN(amount) || amount <= 0) {
      alert("कृपया योग्य रक्कम प्रविष्ट करा!");
      return;
    }
    const customerObj = customers.find(c => c.id === customerId);
    if (!customerObj) return;

    const updated = customers.map(c => {
      if (c.id === customerId) {
        const nextBalance = Math.max(0, c.outstanding_balance - amount);
        return {
          ...c,
          outstanding_balance: nextBalance,
          last_updated: Date.now()
        };
      }
      return c;
    });

    updateLocalCustomers(updated);
    addAuditLog(`${customerObj.name} यांच्याकडून ₹${amount} उधारी जमा केली.`);
    alert(`💰 ₹${amount} उधारी यशस्वीरीत्या जमा केली! शिल्लक उधारी: ₹${Math.max(0, customerObj.outstanding_balance - amount)}`);
  };

  // Download entire Customer database as CSV
  const downloadCustomerCSV = () => {
    // Column Headers in Marathi and English
    const headers = [
      "ग्राहक आयडी (Customer ID)",
      "नाव (Customer Name)",
      "मोबाईल नंबर (Mobile Number)",
      "पत्ता / गाव (Address)",
      "उधारी बाकी रक्कम (Outstanding Balance)",
      "शेवटचे अपडेट (Last Updated)"
    ];

    // Map active/all customer rows
    const activeCustomers = customers.filter(c => !c.is_deleted);
    const rows = activeCustomers.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.mobile,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      c.outstanding_balance,
      new Date(c.last_updated).toLocaleString('mr-IN')
    ]);

    // CSV Content with BOM for Excel UTF-8 Marathi support
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `कापड_दुकान_ग्राहक_डेटाबेस_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print full customer list / ledger directory
  const handlePrintCustomers = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("कृपया पॉप-अप ब्लॉकर बंद करा!");
      return;
    }
    
    const activeCustomers = customers.filter(c => !c.is_deleted);
    const totalCredit = activeCustomers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);

    const html = `
      <html>
        <head>
          <title>${shopName} - ग्राहक रजिस्टर (Customer Ledger)</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
            body { font-family: 'Poppins', sans-serif; padding: 30px; color: #111827; }
            .header { text-align: center; border-bottom: 3px double #d1d5db; padding-bottom: 20px; margin-bottom: 30px; }
            .shop-name { font-size: 24px; font-weight: 800; color: #047857; margin: 0; }
            .shop-address { font-size: 13px; color: #4b5563; margin: 5px 0 0 0; }
            .report-title { font-size: 18px; font-weight: 600; margin: 15px 0 0 0; color: #111827; background: #f3f4f6; display: inline-block; padding: 6px 16px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background-color: #f3f4f6; padding: 10px; border: 1px solid #e5e7eb; font-weight: 600; text-align: left; }
            td { padding: 10px; border: 1px solid #e5e7eb; }
            .text-right { text-align: right; }
            .bold { font-weight: bold; }
            .summary-box { display: flex; justify-content: space-between; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-top: 30px; font-size: 13px; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; }
            @media print {
              body { padding: 10px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1 class="shop-name">✨ ${shopName} ✨</h1>
            <p class="shop-address">📍 पत्ता: ${shopAddress} | 📞 संपर्क: ${whatsNo} ${gstNumber ? ' | GST: ' + gstNumber : ''}</p>
            <h2 class="report-title">📋 अधिकृत ग्राहक रजिस्टर (Customer Ledger Directory)</h2>
          </div>
          
          <table>
            <thead>
              <tr>
                <th width="8%">#</th>
                <th width="35%">ग्राहकाचे नाव (Customer Name)</th>
                <th width="17%">मोबाईल (Mobile)</th>
                <th width="25%">पत्ता / गाव (Address)</th>
                <th width="15%" class="text-right">शिल्लक उधारी (Outstanding)</th>
              </tr>
            </thead>
            <tbody>
              ${activeCustomers.map((c, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="bold">${c.name}</td>
                  <td>${c.mobile}</td>
                  <td>${c.address || 'येवला'}</td>
                  <td class="text-right bold" style="color: ${c.outstanding_balance > 0 ? '#dc2626' : '#047857'}">
                    ₹${c.outstanding_balance.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-box">
            <span><strong>एकूण नोंदणीकृत ग्राहक:</strong> ${activeCustomers.length} जण</span>
            <span><strong>एकूण बाजारातील उधारी:</strong> <strong style="color: #dc2626; font-size: 15px;">₹${totalCredit.toFixed(2)}</strong></span>
          </div>

          <div class="footer">
            <p>डिजिटल प्लॅटफॉर्म द्वारे व्युत्पन्न केलेला अधिकृत अहवाल. तारीख: ${new Date().toLocaleString('mr-IN')}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // WhatsApp Outstanding reminder message
  const handleSendWhatsAppReminder = (customer: Customer) => {
    const text = `नमस्कार ${customer.name} जी, आपल्या ${shopName} कडील कापड खरेदीचे ₹${customer.outstanding_balance} उधारी बाकी आहे. कृपया सवडीनुसार जमा करावी ही विनंती. धन्यवाद! 🙏`;
    const formattedMobile = customer.mobile.startsWith('+91') 
      ? customer.mobile 
      : customer.mobile.length === 10 
        ? `91${customer.mobile}` 
        : customer.mobile;
    const url = `https://api.whatsapp.com/send?phone=${formattedMobile}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Save Supabase config in setting
  const handleSaveSbConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const url = (data.get('url') as string || '').trim();
    const key = (data.get('key') as string || '').trim();

    if (!url || !key) {
      alert("❌ कृपया प्रोजेक्ट URL आणि ॲनॉन की दोन्ही भरा!");
      return;
    }

    // Check if currently locked
    const hasSbCreds = !!localStorage.getItem('sb_url_' + currentShopId) && !!localStorage.getItem('sb_key_' + currentShopId);
    const isLocked = hasSbCreds && !isShopSbUnlocked;
    if (isLocked && role !== 'MASTER_ADMIN') {
      alert("⚠️ क्रेडेंशियल्स आधीपासूनच सेव्ह करून लॉक केलेले आहेत! बदल करण्यासाठी आधी 'अनलॉक करा' बटणावर क्लिक करा.");
      return;
    }

    setSbUrl(url);
    setSbKey(key);
    localStorage.setItem('sb_url_' + currentShopId, url);
    localStorage.setItem('sb_key_' + currentShopId, key);
    
    // Also save in shops list so it's synchronized to master Supabase
    const updatedShops = shops.map(s => s.id === currentShopId ? { ...s, sbUrl: url, sbKey: key } : s);
    setShops(updatedShops);
    localStorage.setItem('t_shops', JSON.stringify(updatedShops));
    if (masterSbUrl && masterSbKey) {
      uploadTableToSupabase('t_shops', updatedShops);
    }

    // Fallback global values
    if (!localStorage.getItem('sb_url')) localStorage.setItem('sb_url', url);
    if (!localStorage.getItem('sb_key')) localStorage.setItem('sb_key', key);

    setIsShopSbUnlocked(false);
    addAuditLog("Supabase क्रेडेंशियल्स यशस्वीरित्या सेव्ह करून लॉक केली");
    alert("Supabase क्रेडेंशियल्स यशस्वीरित्या सेव्ह आणि लॉक केले! 💾🔒");
  };

  // Login component
  if (!role) {
    return (
      <div className="min-h-screen bg-[#F4F6F0] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-forest-100 overflow-hidden">
          {/* Cover & Brand Accent */}
          <div className="bg-gradient-to-br from-forest-500 via-forest-600 to-forest-700 p-6 text-white text-center relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-zari-300 via-zari-500 to-zari-300"></div>
            <div className="w-16 h-16 bg-forest-50/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-inner border border-forest-400">
              👕
            </div>
            <h1 className="mt-3 text-xl font-bold tracking-tight">{Loc.t('app_title', lang)}</h1>
            <p className="text-[10px] text-forest-100 mt-0.5">{Loc.t('tagline', lang)}</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Language Selector */}
            <div className="flex flex-col items-center space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-forest-500" /> भाषा निवडा / Choose Language
              </span>
              <div className="inline-flex rounded-xl bg-forest-50 p-1 border border-forest-100">
                {(['MARATHI', 'HINDI', 'ENGLISH'] as Language[]).map(l => (
                  <button
                    key={l}
                    onClick={() => changeLanguage(l)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      lang === l 
                        ? 'bg-forest-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-forest-600'
                    }`}
                  >
                    {l === 'MARATHI' ? 'मराठी' : l === 'HINDI' ? 'हिंदी' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            {/* Credential Login Form / OTP Password Change */}
            {showOtpChange ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-extrabold text-xs text-forest-700 flex items-center gap-1.5">
                    <span>🔑</span> ईमेल OTP द्वारे पासवर्ड बदला
                  </h3>
                  <button
                    onClick={() => {
                      setShowOtpChange(false);
                      setOtpStep('INPUT_USER');
                      setMockEmailAlert(null);
                    }}
                    className="text-[10px] text-forest-600 hover:underline font-black bg-forest-50 px-2 py-1 rounded-lg"
                  >
                    ← लॉगिनवर जा
                  </button>
                </div>

                {mockEmailAlert && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[10px] font-semibold text-blue-900 font-mono whitespace-pre-wrap leading-relaxed shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl">
                      EMAIL OUTBOX
                    </div>
                    {mockEmailAlert}
                  </div>
                )}

                {otpStep === 'INPUT_USER' && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const u = (fd.get('otp_username') as string).trim();
                    const emailInput = (fd.get('otp_email') as string).trim();

                    if (!u || !emailInput) return;

                    const matched = users.find(user => user.username.toLowerCase() === u.toLowerCase());
                    if (!matched) {
                      alert("❌ या नावाचे वापरकर्ता खाते सापडले नाही!");
                      return;
                    }
                    if (matched.role !== 'SHOP_ADMIN') {
                      alert("❌ ही सुरक्षा सुविधा फक्त 'दुकान चालक' (Shop Admin) लॉगिनसाठी उपलब्ध आहे!");
                      return;
                    }

                    // If they have email set, verify it matches
                    if (matched.email && matched.email.toLowerCase() !== emailInput.toLowerCase()) {
                      alert(`❌ नोंदणीकृत ईमेल जुळत नाही! (Hint: ${matched.email.replace(/(.).*@/, "$1***@")})`);
                      return;
                    }

                    // Generate OTP
                    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setOtpUser(matched.username);
                    setOtpEmail(emailInput);
                    setGeneratedOtp(otpCode);

                    // Update user's email if not already present
                    if (!matched.email) {
                      const nextUsers = users.map(user => user.id === matched.id ? { ...user, email: emailInput } : user);
                      setUsers(nextUsers);
                      localStorage.setItem('t_users', JSON.stringify(nextUsers));
                    }

                    // Send Simulated Email
                    const alertMsg = `To: ${emailInput}\nविषय: पासवर्ड बदला OTP कूट\n\nप्रिय ${matched.username},\nतुमच्या खात्याचा पासवर्ड बदलण्यासाठी OTP कूट खालीलप्रमाणे आहे:\n🔑 OTP Code: ${otpCode}\n(हा कोड टाका)`;
                    setMockEmailAlert(alertMsg);
                    setOtpStep('INPUT_OTP');
                  }} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block">वापरकर्तानाव (Username)</label>
                      <input 
                        type="text" 
                        name="otp_username" 
                        placeholder="उदा. mauli_admin" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold text-gray-800 bg-white"
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block">नोंदणीकृत ईमेल (Registered Email)</label>
                      <input 
                        type="email" 
                        name="otp_email" 
                        placeholder="उदा. admin@mauli.com" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold text-gray-800 bg-white"
                        required 
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      ✉️ OTP मिळवा (Request OTP)
                    </button>
                  </form>
                )}

                {otpStep === 'INPUT_OTP' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-[10px] text-gray-500 font-bold text-center">
                      आम्ही <span className="text-forest-600">{otpEmail}</span> वर ६ अंकी OTP पाठवला आहे.
                    </p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block text-center">OTP कोड टाका (Enter OTP)</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="उदा. 123456" 
                        className="w-full text-center text-sm tracking-widest border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-black text-gray-800 bg-white"
                        required 
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (enteredOtp === generatedOtp) {
                          setOtpStep('INPUT_NEW_PASS');
                          setMockEmailAlert(null);
                        } else {
                          alert("❌ चुकीचा OTP कूट! कृपया ईमेल आऊटबॉक्समध्ये पाहून योग्य कोड टाका.");
                        }
                      }}
                      className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                    >
                      ✅ OTP सत्यापित करा (Verify OTP)
                    </button>
                  </div>
                )}

                {otpStep === 'INPUT_NEW_PASS' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100 text-center">
                      ✓ OTP यशस्वीरित्या सत्यापित! नवीन पासवर्ड सेट करा.
                    </p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block">नवीन पासवर्ड (New Password)</label>
                      <input 
                        type="password" 
                        value={otpNewPass}
                        onChange={(e) => setOtpNewPass(e.target.value)}
                        placeholder="किमान ४ अक्षरे" 
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold text-gray-800 bg-white"
                        required 
                      />
                    </div>
                    <button
                      onClick={() => {
                        const trimmed = otpNewPass.trim();
                        if (trimmed.length < 4) {
                          alert("❌ पासवर्ड कमीत कमी ४ अक्षरांचा असावा!");
                          return;
                        }
                        const nextUsers = users.map(user => 
                          user.username.toLowerCase() === otpUser.toLowerCase() 
                            ? { ...user, password: trimmed } 
                            : user
                        );
                        setUsers(nextUsers);
                        localStorage.setItem('t_users', JSON.stringify(nextUsers));
                        
                        alert("🎉 पासवर्ड यशस्वीरित्या बदलला! आता तुम्ही नवीन पासवर्डने लॉगिन करू शकता.");
                        
                        // Reset states
                        setShowOtpChange(false);
                        setOtpStep('INPUT_USER');
                        setOtpUser('');
                        setOtpEmail('');
                        setGeneratedOtp('');
                        setEnteredOtp('');
                        setOtpNewPass('');
                        setMockEmailAlert(null);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                    >
                      💾 पासवर्ड जतन करा (Save Password)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const u = data.get('username') as string;
                const p = data.get('password') as string;
                const res = loginWithCredentials(u, p);
                if (!res.success) {
                  alert(lang === 'MARATHI' ? '❌ चुकीचे क्रेडेंशियल्स!' : lang === 'HINDI' ? '❌ गलत क्रेडेंशियल्स!' : '❌ Invalid credentials!');
                }
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">वापरकर्तानाव (Username)</label>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="उदा. master / mauli_admin" 
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold text-gray-800" 
                    required 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">पासवर्ड (Password)</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="••••••••" 
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forest-500 font-bold text-gray-800" 
                    required 
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {lang === 'ENGLISH' ? '🔐 Sign In' : '🔐 लॉगिन करा (Sign In)'}
                </button>

                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpChange(true);
                      setOtpStep('INPUT_USER');
                      setMockEmailAlert(null);
                    }}
                    className="text-[10px] text-forest-600 hover:underline font-extrabold"
                  >
                    🔑 ईमेल OTP द्वारे पासवर्ड बदला (Change Password via OTP)
                  </button>
                </div>
              </form>
            )}

            {/* Master Cloud Recovery Section */}
            <div className="pt-3 border-t border-gray-100">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-indigo-50/50 text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider select-none">
                  <span>☁️ मास्टर क्लाउड सिंक सेटअप (New Device Setup)</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100 mt-2 space-y-3 text-xs">
                  <p className="text-[10px] text-indigo-900 leading-relaxed">
                    नवीन साधनावर (New Device) पहिल्यांदा लॉगिन करत असल्यास, खाली तुमचे मास्टर Supabase क्रेडेंशियल्स टाका आणि मास्टर डेटा स्थानिक पातळीवर ओढून घ्या.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-indigo-700 block">Master Supabase Project URL</label>
                      <input 
                        type="text" 
                        placeholder="https://your-master-project.supabase.co" 
                        value={masterSbUrl}
                        onChange={(e) => {
                          setMasterSbUrl(e.target.value);
                          localStorage.setItem('master_sb_url', e.target.value);
                        }}
                        className="w-full border border-indigo-200 p-2 rounded-lg font-mono text-[10px] bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-indigo-700 block">Master Supabase Anon Key</label>
                      <input 
                        type="password" 
                        placeholder="eyJhbGciOi..." 
                        value={masterSbKey}
                        onChange={(e) => {
                          setMasterSbKey(e.target.value);
                          localStorage.setItem('master_sb_key', e.target.value);
                        }}
                        className="w-full border border-indigo-200 p-2 rounded-lg font-mono text-[10px] bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!masterSbUrl || !masterSbKey) {
                          alert("❌ कृपया मास्टर Supabase प्रोजेक्ट URL आणि Anon Key भरा!");
                          return;
                        }
                        try {
                          const client = createClient(masterSbUrl, masterSbKey);
                          const { data: cloudShops, error: errShops } = await client.from('t_shops').select('*');
                          const { data: cloudUsers, error: errUsers } = await client.from('t_user_accounts').select('*');

                          if (errShops || errUsers) {
                            alert(`❌ डेटाबेसवरून माहिती मिळवता आली नाही: ${errShops?.message || errUsers?.message}\n(कृपया खात्री करा की तुमच्या Supabase मध्ये 't_shops' आणि 't_user_accounts' टेबल्स तयार आहेत)`);
                            return;
                          }

                          if (cloudShops) {
                            setShops(cloudShops);
                            localStorage.setItem('t_shops', JSON.stringify(cloudShops));
                          }
                          if (cloudUsers) {
                            setUsers(cloudUsers);
                            localStorage.setItem('t_users', JSON.stringify(cloudUsers));
                          }
                          alert("🎉 मास्टर डेटाबेस यशस्वीरित्या जोडला गेला! सर्व दुकाने आणि युजर्सचे पासवर्ड सिंक झाले आहेत. आता तुम्ही योग्य पासवर्डने लॉगिन करू शकता.");
                        } catch (err: any) {
                          alert(`❌ डाउनलोड अयशस्वी: ${err?.message}`);
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 rounded-lg text-[10px] uppercase transition-colors shadow-sm flex items-center justify-center gap-1"
                    >
                      📥 क्लाउडवरून मास्टर डेटा ओढा (Pull Master Data)
                    </button>
                  </div>
                </div>
              </details>
            </div>

            {/* Quick Demo logins section */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-2">
                झटपट डेमो लॉगिन (Quick Demo Logins)
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => loginWithCredentials('master', 'master123')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👑</span>
                    <div>
                      <h4 className="font-bold text-xs text-purple-950">मास्टर अॅडमीन (Master Admin)</h4>
                      <p className="text-[9px] text-purple-600">सर्व दुकाने व्यवस्थापित करा (Multiple Shops)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-850 font-extrabold px-2 py-0.5 rounded">master</span>
                </button>

                <button
                  onClick={() => loginWithCredentials('mauli_admin', 'admin123')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏬</span>
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950">दुकान चालक (Mauli Shop Admin)</h4>
                      <p className="text-[9px] text-emerald-600">माऊली गारमेंट्सचे मालक (Config & Billing)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-850 font-extrabold px-2 py-0.5 rounded">mauli_admin</span>
                </button>

                <button
                  onClick={() => loginWithCredentials('mauli_emp', 'emp123')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧑‍💼</span>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">कर्मचारी (Shop Employee)</h4>
                      <p className="text-[9px] text-amber-600">मर्यादित प्रवेश (Billing & Stock only)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-850 font-extrabold px-2 py-0.5 rounded">mauli_emp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Dashboard calculations
  const lowStockCount = products.filter(p => p.stock_quantity <= p.min_stock).length;
  const totalSalesVal = sales.reduce((sum, item) => sum + item.grand_total, 0);
  const estimatedProfit = totalSalesVal * 0.35; // 35% standard clothing margin
  const totalOutstanding = customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);
  
  // Monthly Report Calculation
  const monthlyStats = React.useMemo(() => {
    const stats: Record<string, { monthKey: string, monthLabel: string, totalSales: number, totalProfit: number, pendingCollections: number }> = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('mr-IN', { month: 'long', year: 'numeric' });
      
      if (!stats[monthKey]) {
        stats[monthKey] = {
          monthKey,
          monthLabel,
          totalSales: 0,
          totalProfit: 0,
          pendingCollections: 0
        };
      }
      
      stats[monthKey].totalSales += sale.grand_total;
      stats[monthKey].totalProfit += sale.grand_total * 0.35; // Standard 35% profit assumption
      
      if (sale.payment_status === 'PENDING') {
        stats[monthKey].pendingCollections += sale.grand_total;
      }
    });
    
    return Object.values(stats).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [sales]);

  const paymentMethodData = {
    UPI: sales.filter(s => s.payment_mode === 'UPI').reduce((sum, s) => sum + s.grand_total, 0),
    CASH: sales.filter(s => s.payment_mode === 'CASH').reduce((sum, s) => sum + s.grand_total, 0),
    CREDIT: sales.filter(s => s.payment_mode === 'CREDIT').reduce((sum, s) => sum + s.grand_total, 0),
  };

  return (
    <div className={`min-h-screen bg-[#F9F9F6] flex flex-col pb-16 md:pb-0 ${isLargeFont ? 'large-text-mode' : ''}`}>
      {/* Dynamic Sync Toast Notification */}
      {syncToast.message && (
        <div className="fixed bottom-16 md:bottom-6 right-6 max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-50 animate-bounce-short transition-all">
          <div className="flex gap-3 items-start">
            <span className="text-xl">
              {syncToast.type === 'success' ? '✅' : syncToast.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 leading-normal">
                {syncToast.message}
              </p>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setSyncToast({ message: '', type: null })}
                  className="text-[10px] text-gray-400 hover:text-gray-700 font-extrabold"
                >
                  बंद करा (Dismiss)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Premium Ribbon Header */}
      <header className="sticky top-0 bg-white border-b border-forest-100 shadow-sm z-30">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-zari-400 via-zari-200 to-zari-500"></div>
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-3xl shrink-0">👕</span>
            <div>
              {role === 'MASTER_ADMIN' ? (
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-purple-600 text-white border border-purple-700 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      👑 Master Admin Mode
                    </span>
                    <span className="text-[10px] text-gray-400 font-extrabold">सक्रिय दुकान संदर्भ (Selected Shop Context):</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <select
                      value={currentShopId}
                      onChange={(e) => {
                        const targetShopId = e.target.value;
                        setCurrentShopId(targetShopId);
                        addAuditLog(`मास्टर अॅडमीनने दुकान संदर्भ ${targetShopId} वर बदलला`);
                      }}
                      className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-950 font-black text-sm sm:text-base py-1.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 max-w-xs"
                    >
                      {shops.map(s => (
                        <option key={s.id} value={s.id}>
                          🏪 {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 flex flex-wrap items-center gap-1.5 font-medium">
                    <span>📍 {shopAddress}</span>
                    {gstNumber && <span className="bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded text-[9px] font-bold">GST: {gstNumber}</span>}
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="font-extrabold text-forest-500 text-lg sm:text-xl tracking-tight">{shopName}</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍 {shopAddress}</span>
                    {gstNumber && <span className="bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded text-[10px] font-bold">GST: {gstNumber}</span>}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-700 font-bold text-[11px] py-1 px-2 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none"
              title="भाषा निवडा / Choose Language"
            >
              <option value="MARATHI">मराठी (Marathi)</option>
              <option value="ENGLISH">English</option>
              <option value="HINDI">हिंदी (Hindi)</option>
            </select>

            {/* Dynamic Large Font Accessibility Toggle for rural older shopkeepers */}
            <button
              onClick={() => {
                const next = !isLargeFont;
                setIsLargeFont(next);
                localStorage.setItem('t_large_font', String(next));
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-black border flex items-center gap-1 transition-all shadow-sm ${
                isLargeFont 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600' 
                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
              }`}
              title="मोठी अक्षरे चालू किंवा बंद करा"
            >
              <span>🔎</span>
              <span>मोठी अक्षरे (Large Text): {isLargeFont ? 'चालू' : 'बंद'}</span>
            </button>

            {/* Active Shop selection hidden for MASTER_ADMIN for security */}

            {/* Internet connection indicator */}
            <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${
              isOnline 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{isOnline ? '🌐 ऑनलाईन' : '📶 ऑफलाईन (स्थानिक सेव्ह)'}</span>
            </div>

            {/* Sync indicator */}
            <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${
              sbSyncStatus === 'CONNECTED' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <Database className="w-3 h-3" />
              <span>{sbSyncStatus === 'CONNECTED' ? 'डेटाबेस सिंक्रोनाइज्ड' : 'ऑफलाईन डेटाबेस'}</span>
            </div>

            <span className="text-xs bg-zari-100 text-zari-700 font-bold px-2.5 py-1 rounded-lg border border-zari-300">
              {role === 'MASTER_ADMIN' ? '👑 मास्टर अॅडमीन' : role === 'SHOP_ADMIN' ? '🏬 दुकान मालक' : '🧑‍💼 कर्मचारी'}
            </span>

            {/* Low Stock Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-1.5 rounded-lg transition-colors relative flex items-center justify-center ${
                  showNotifDropdown 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
                }`}
                title="स्टॉक कमी असलेल्या वस्तूंच्या सूचना (Stock Warnings)"
              >
                <Bell className="w-5 h-5" />
                {lowStockNotifs.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white animate-bounce">
                    {lowStockNotifs.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden font-sans">
                  <div className="bg-amber-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-extrabold text-amber-900 text-xs flex items-center gap-1.5">
                      <span>⚠️</span> स्टॉक सूचना केंद्र ({lowStockNotifs.length})
                    </span>
                    {lowStockNotifs.length > 0 && (
                      <button
                        onClick={() => {
                          const cleared = lowStockNotifs.map(n => ({ ...n, read: true }));
                          updateLocalNotifs(cleared);
                        }}
                        className="text-[10px] text-amber-800 hover:underline font-bold"
                      >
                        सर्व वाचले (Mark all read)
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {lowStockNotifs.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 font-medium text-xs">
                        🎉 सर्व उत्पादनांचा स्टॉक पुरेसा आहे! कोणतीही चेतावणी नाही.
                      </div>
                    ) : (
                      lowStockNotifs.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3 transition-colors ${n.read ? 'bg-white opacity-70' : 'bg-red-50/50 hover:bg-red-50'}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-extrabold text-gray-800 text-xs block truncate max-w-[200px]">
                              {n.productName}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">
                              {new Date(n.timestamp).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-red-600 font-bold mt-1">
                            शिल्लक स्टॉक: {n.remainingStock} (किमान मर्यादा: {n.minStock})
                          </p>

                          <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-dashed border-gray-100">
                            <button
                              onClick={() => {
                                setActiveTab('stock');
                                setShowNotifDropdown(false);
                              }}
                              className="text-[9px] bg-forest-50 hover:bg-forest-100 text-forest-800 px-2 py-0.5 rounded-md font-black"
                            >
                              🔍 माल साठा व्यवस्थापित करा
                            </button>

                            <div className="flex gap-1.5">
                              {!n.read && (
                                <button
                                  onClick={() => {
                                    const updated = lowStockNotifs.map(notif => 
                                      notif.id === n.id ? { ...notif, read: true } : notif
                                    );
                                    updateLocalNotifs(updated);
                                  }}
                                  className="text-[9px] text-blue-600 hover:underline font-bold"
                                >
                                  वाचले (Read)
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const updated = lowStockNotifs.filter(notif => notif.id !== n.id);
                                  updateLocalNotifs(updated);
                                }}
                                className="text-[9px] text-gray-400 hover:text-red-600 font-bold"
                                title="काढून टाका"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {lowStockNotifs.length > 0 && (
                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm("सर्व सूचना इतिहास डिलीट करायचा आहे का?")) {
                            updateLocalNotifs([]);
                          }
                        }}
                        className="text-[10px] text-red-600 hover:underline font-bold"
                      >
                        🗑️ सर्व इतिहास पुसा (Clear History)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="लॉगआउट"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Navigation */}
        <nav className="hidden md:flex flex-col gap-2 w-64 bg-white p-4 rounded-2xl border border-forest-100 h-fit">
          <p className="text-xs font-bold text-gray-400 px-3 uppercase tracking-wider">मेनू (Navigation)</p>
          {[
            { id: 'home', icon: TrendingUp, label: '📊 ' + Loc.t('home', lang) },
            { id: 'billing', icon: ShoppingBag, label: '🛍️ ' + Loc.t('billing', lang) },
            { id: 'stock', icon: Boxes, label: '📦 ' + Loc.t('stock', lang) },
            { id: 'reports', icon: FileText, label: '📑 ' + Loc.t('reports', lang) },
            { id: 'settings', icon: Settings, label: '⚙️ ' + Loc.t('settings', lang) },
            ...(role === 'MASTER_ADMIN' ? [{ id: 'shops', icon: Settings, label: '🏬 ' + (lang === 'MARATHI' ? 'दुकान व्यवस्थापन' : lang === 'HINDI' ? 'दुकान प्रबंधन' : 'Shop Management') }] : [])
          ].filter(item => {
            if (role === 'MASTER_ADMIN') {
              return item.id === 'shops';
            } else {
              return item.id !== 'shops';
            }
          }).map(item => {
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isSel 
                    ? 'bg-forest-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-forest-50 hover:text-forest-600'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'stock' && lowStockCount > 0 && (
                  <span className={`ml-auto px-2 py-0.5 text-xs rounded-full font-black tracking-wide shadow-sm transition-colors ${
                    isSel ? 'bg-white text-forest-600' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {lowStockCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Content Canvas */}
        <main className="flex-1 min-w-0 bg-white p-4 sm:p-6 rounded-3xl border border-forest-100 shadow-sm">
          {/* TAB: DASHBOARD */}
          {activeTab === 'home' && role !== 'MASTER_ADMIN' && (
            <div className="space-y-6">
              {/* Regional Warm Welcome Header Banner */}
              <div className="bg-gradient-to-r from-forest-600 via-forest-700 to-emerald-800 p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
                <div className="absolute right-0 inset-y-0 w-32 bg-zari-400 opacity-10 rounded-l-full"></div>
                <div className="relative z-10 space-y-1">
                  <h2 className="text-lg sm:text-xl font-black">राम राम! आपल्या {shopName} च्या डिजिटल प्लॅटफॉर्ममध्ये आपले स्वागत आहे. 🙏</h2>
                  <p className="text-xs text-forest-100 font-medium">येथे आपण आपले कापड बिल बनवू शकता, माल साठा पाहू शकता आणि ग्राहकांची उधारी अत्यंत सोप्या पद्धतीने सांभाळू शकता.</p>
                </div>
              </div>

              {/* Alert for Shop Admin to set up Supabase on First Login */}
              {role === 'SHOP_ADMIN' && (!sbUrl || !sbKey) && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-purple-200 p-5 rounded-3xl text-purple-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-purple-900 flex items-center gap-1.5">
                      <span>🔄</span> क्लाउड डेटा सिंक सेट करा (Setup Cloud Sync)
                    </h3>
                    <p className="text-[11px] text-purple-700 font-medium">
                      तुमचे नवीन दुकान सुरू झाले आहे! कृपया पहिल्या लॉगइनच्या वेळी तुमच्या सुपा बेस (Supabase) डेटाबेसचे URL आणि Anon Key अपलोड करा. एकदा सेव्ह केल्यावर हे क्रेडेंशियल्स सुरक्षिततेसाठी स्वयंचलित लॉक होतील.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setSbSubTab('status');
                    }}
                    className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                  >
                    🚀 आता अपलोड करा (Configure)
                  </button>
                </div>
              )}

              {/* Quick Actions Panel - "झटपट कार्ये" */}
              <div className="border border-forest-100 rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-gray-50/50 to-white shadow-sm space-y-3.5">
                <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                  <span>⚡</span> झटपट कार्ये (Quick Tools)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Action 1: New Sale */}
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100/80 border border-orange-100 rounded-2xl text-center transition-all group active:scale-95 shadow-sm min-h-[96px]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
                    <span className="font-bold text-xs text-orange-950 mt-1.5">नवीन बिल बनवा</span>
                    <span className="text-[9px] text-orange-600">Create New Bill</span>
                  </button>

                  {/* Action 2: Add Product */}
                  <button
                    onClick={() => {
                      setActiveTab('stock');
                      setShowAddProd(true);
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 rounded-2xl text-center transition-all group active:scale-95 shadow-sm min-h-[96px]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">👗</span>
                    <span className="font-bold text-xs text-emerald-950 mt-1.5">नवीन कापड जोडा</span>
                    <span className="text-[9px] text-emerald-600">Add New Fabric</span>
                  </button>

                  {/* Action 3: Add Customer */}
                  <button
                    onClick={() => setShowAddCust(true)}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-2xl text-center transition-all group active:scale-95 shadow-sm min-h-[96px]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🤝</span>
                    <span className="font-bold text-xs text-blue-950 mt-1.5">नवीन ग्राहक नोंदवा</span>
                    <span className="text-[9px] text-blue-600">Add Customer</span>
                  </button>

                  {/* Action 4: Data Sync */}
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setSbSubTab('status');
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100/80 border border-purple-100 rounded-2xl text-center transition-all group active:scale-95 shadow-sm min-h-[96px]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🔄</span>
                    <span className="font-bold text-xs text-purple-950 mt-1.5">डेटाबॅकप आणि सिंक</span>
                    <span className="text-[9px] text-purple-600">Database & Cloud</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
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
              </div>

              {/* Customer Outstanding (Udhaari) Ledger for Rural Actionability */}
              <div className="border border-red-100 rounded-3xl p-4 sm:p-5 bg-red-50/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                      <span className="text-red-600">💰</span> शेतकरी व ग्राहक उधारी रजिस्टर (Customer Outstanding Balances)
                    </h3>
                    <p className="text-[10px] text-gray-500">उधारी जमा करण्यासाठी नावापुढील 'पैसे जमा करा' बटनावर क्लिक करा.</p>
                  </div>
                  <span className="bg-red-100 text-red-800 font-black text-[10px] px-2.5 py-1 rounded-xl">
                    {customers.filter(c => c.outstanding_balance > 0).length} थकबाकीदार
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {customers.filter(c => c.outstanding_balance > 0).map(c => (
                    <div key={c.id} className="bg-white p-3.5 rounded-2xl border border-red-100 shadow-sm hover:border-red-300 transition-all flex justify-between items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-xs text-gray-800 truncate">{c.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">📞 {c.mobile} | 📍 {c.address || 'येवला'}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-50 text-red-700 text-[10px] font-black border border-red-100">
                          <span>शिल्लक उधारी:</span>
                          <span>₹{c.outstanding_balance}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const amtStr = window.prompt(
                            `✍️ ग्राहक '${c.name}' यांच्याकडून जमा झालेली रक्कम प्रविष्ट करा:\n\nसध्याची एकूण उधारी बाकी: ₹${c.outstanding_balance}`,
                            String(c.outstanding_balance)
                          );
                          if (amtStr !== null) {
                            const amt = parseFloat(amtStr);
                            if (!isNaN(amt)) {
                              handleReceiveUdhaari(c.id, amt);
                            } else {
                              alert("कृपया योग्य अंक प्रविष्ट करा!");
                            }
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 hover:scale-[1.02] active:scale-95"
                      >
                        💰 जमा करा (Receive)
                      </button>
                    </div>
                  ))}

                  {customers.filter(c => c.outstanding_balance > 0).length === 0 && (
                    <div className="col-span-full text-center py-8 bg-white rounded-2xl border border-gray-100">
                      <span className="text-3xl block">🎉</span>
                      <p className="text-xs text-gray-500 font-extrabold mt-1">सर्व उधारी खाती पूर्ण जमा आहेत! थकबाकी शून्य आहे.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Mode distribution */}
              <div className="bg-forest-50 rounded-2xl p-4 border border-forest-100">
                <h3 className="font-bold text-sm text-gray-800 mb-3">पेमेंट वर्गीकरण (Payment Mode Distribution)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "यूपीआय (UPI)", val: paymentMethodData.UPI, color: "bg-forest-500" },
                    { label: "रोख (Cash)", val: paymentMethodData.CASH, color: "bg-zari-500" },
                    { label: "उधारी (Credit)", val: paymentMethodData.CREDIT, color: "bg-red-500" }
                  ].map((p, idx) => {
                    const pct = totalSalesVal > 0 ? (p.val / totalSalesVal) * 100 : 0;
                    return (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-forest-100">
                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                          <span>{p.label}</span>
                          <span>₹{p.val.toFixed(0)} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${p.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lower grid: Low Stock alerts & Recent Sales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Panel */}
                <div className="border border-forest-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 text-amber-700">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> कमी स्टॉक सूचना (Low Stock Alerts)
                    </h3>
                    <span className="text-xs bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                      {products.filter(p => p.stock_quantity <= p.min_stock).length} उत्पादने
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {products.filter(p => p.stock_quantity <= p.min_stock).map(p => (
                      <div key={p.id} className="flex justify-between items-center p-2.5 bg-amber-50/50 hover:bg-amber-50 rounded-xl border border-amber-100 text-xs">
                        <div>
                          <p className="font-bold text-gray-800">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.category} | रॅक नं: {p.rack_number || '-'}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600">{p.stock_quantity} नग शिल्लक</span>
                          <p className="text-[9px] text-gray-400">किमान सीमा: {p.min_stock}</p>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => p.stock_quantity <= p.min_stock).length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-6">सर्व मालाचा स्टॉक समाधानकारक आहे. 👍</p>
                    )}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="border border-forest-100 rounded-2xl p-4">
                  <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-forest-500" /> अलीकडील विक्री (Recent Sales)
                  </h3>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {sales.slice(0, 5).map(s => (
                      <div key={s.id} className="flex justify-between items-center p-2.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl border border-gray-100 text-xs">
                        <div>
                          <p className="font-bold text-gray-800">{s.customer_name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                            <span className="font-bold">{s.invoice_number}</span>
                            <span>•</span>
                            <span className={`px-1 rounded-sm text-[9px] font-bold ${
                              s.payment_mode === 'CREDIT' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                            }`}>{s.payment_mode}</span>
                          </div>
                        </div>
                        <div className="text-right font-black text-gray-800">
                          ₹{s.grand_total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BILLING / SALES */}
          {activeTab === 'billing' && role !== 'MASTER_ADMIN' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">🛍️ विक्री काउंटर (Billing Desk)</h2>

              {completedInvoice ? (
                /* Invoice Print Preview after Success */
                <div className="bg-forest-50 p-6 rounded-2xl border border-forest-200 max-w-xl mx-auto space-y-4">
                  <div className="text-center space-y-1">
                    <CheckCircle2 className="w-12 h-12 text-forest-500 mx-auto" />
                    <h3 className="font-bold text-lg text-gray-800">विक्री यशस्वीरीत्या नोंदवली गेली!</h3>
                    <p className="text-xs text-gray-500">पावती क्रमांक: {completedInvoice.invoice_number}</p>
                  </div>

                  {/* Receipt Box */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-xs font-mono space-y-3">
                    <div className="text-center border-b pb-2">
                      <p className="font-bold text-sm">{shopName}</p>
                      <p className="text-[10px]">{shopAddress}</p>
                      <p className="text-[10px]">मोबाईल: {whatsNo}</p>
                      {gstNumber && <p className="text-[10px]">GSTIN: {gstNumber}</p>}
                    </div>

                    <div className="flex justify-between">
                      <span>दिनांक: {new Date(completedInvoice.date).toLocaleDateString('mr-IN')}</span>
                      <span>पावती: {completedInvoice.invoice_number}</span>
                    </div>

                    <div className="border-b pb-1">
                      <p>ग्राहक: <span className="font-bold">{completedInvoice.customer_name}</span></p>
                    </div>

                    {/* Invoice items lists */}
                    <div className="border-b py-2 space-y-1">
                      <div className="flex justify-between font-bold text-gray-700">
                        <span className="w-1/2">मालाचे नाव</span>
                        <span className="w-1/6 text-right">नग</span>
                        <span className="w-1/3 text-right">किंमत</span>
                      </div>
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="w-1/2 text-[11px] truncate">{item.product.name}</span>
                          <span className="w-1/6 text-right">{item.quantity}</span>
                          <span className="w-1/3 text-right">₹{((item.product.selling_price - item.discount) * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>उप-एकूण (Sub Total)</span>
                        <span>₹{completedInvoice.total_amount.toFixed(2)}</span>
                      </div>
                      {completedInvoice.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>सवलत (Discount)</span>
                          <span>-₹{completedInvoice.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>जीएसटी (GST)</span>
                        <span>₹{completedInvoice.gst_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm border-t pt-1">
                        <span>एकूण देय (Grand Total)</span>
                        <span>₹{completedInvoice.grand_total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-center pt-3 border-t text-[10px] text-gray-500">
                      <p>पेमेंट पद्धत: {completedInvoice.payment_mode}</p>
                      <p className="font-bold">भेट दिल्याबद्दल धन्यवाद! पुन्हा यावे.</p>
                    </div>
                  </div>

                  {/* WhatsApp Delivery Panel */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-emerald-600" /> ग्राहकाच्या व्हाट्सॲपवर पावती पाठवा (Send Invoice via WhatsApp)
                    </h4>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">+91</span>
                        <input
                          type="text"
                          placeholder="ग्राहकाचा मोबाईल नंबर प्रविष्ट करा"
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          className="w-full text-xs border border-emerald-200 rounded-xl pl-11 pr-3 py-2 bg-white font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <a 
                        href={getWhatsAppCustomerUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          addAuditLog(`व्हाट्सॲपवर पावती पाठवली: ${completedInvoice.customer_name} (${whatsappPhone})`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Send className="w-4 h-4" /> पाठवा (Send)
                      </a>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                      onClick={() => window.print()}
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Printer className="w-4 h-4" /> पावती प्रिंट काढा (Print)
                    </button>

                    <button 
                      onClick={resetBilling}
                      className="bg-forest-500 hover:bg-forest-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                    >
                      नवीन बिल बनवा (New Bill)
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Billing Interface */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left panel: Cart & Checkout (Lg: 5cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="border border-forest-100 rounded-2xl p-4 bg-gray-50/50 space-y-4">
                      <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 border-b pb-2">
                        🛒 खरेदी कार्ट (Cart)
                      </h3>

                      {/* Select Customer */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 block">ग्राहक निवडा (Customer Selection)</label>
                        <div className="flex gap-2">
                          <select 
                            className="flex-1 text-xs border border-forest-100 rounded-xl px-3 py-2 bg-white"
                            value={selectedCust?.id || ''}
                            onChange={(e) => {
                              const c = customers.find(cust => cust.id === e.target.value);
                              setSelectedCust(c || null);
                            }}
                          >
                            <option value="">-- ग्राहक निवडा --</option>
                            {customers.map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => setShowAddCust(true)}
                            className="bg-forest-100 hover:bg-forest-200 text-forest-700 p-2.5 rounded-xl text-xs font-bold"
                            title="नवीन ग्राहक जोडा"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items list */}
                      <div className="space-y-2 max-h-64 overflow-y-auto min-h-24">
                        {cartItems.map((item, idx) => {
                          const unitPrice = item.product.selling_price - item.discount;
                          return (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-forest-100 text-xs">
                              <div className="flex-1 min-w-0 pr-2">
                                <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                                <p className="text-[10px] text-gray-400">दर: ₹{unitPrice} | आकार: {item.product.size || '-'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number"
                                  min="1"
                                  max={item.product.stock_quantity}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const qtyVal = Number(e.target.value);
                                    const updated = [...cartItems];
                                    updated[idx].quantity = Math.min(item.product.stock_quantity, Math.max(1, qtyVal));
                                    setCartItems(updated);
                                  }}
                                  className="w-12 text-center border rounded-lg py-0.5 text-xs font-bold"
                                />
                                <span className="font-bold text-gray-800 min-w-16 text-right">
                                  ₹{(unitPrice * item.quantity).toFixed(0)}
                                </span>
                                <button 
                                  onClick={() => {
                                    const updated = cartItems.filter((_, i) => i !== idx);
                                    setCartItems(updated);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {cartItems.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <ShoppingBag className="w-8 h-8 mx-auto opacity-20 mb-2" />
                            <p className="text-xs">कार्ट रिकामे आहे. उजवीकडील मालावर क्लिक करून जोडा.</p>
                          </div>
                        )}
                      </div>

                      {/* Summary calculations */}
                      {cartItems.length > 0 && (
                        <div className="border-t pt-3 space-y-1.5 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>उप-एकूण (Sub Total)</span>
                            <span>₹{cartTotals().subTotal.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center justify-between">
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
                          </div>

                          <div className="flex justify-between">
                            <span>जीएसटी (GST)</span>
                            <span>₹{cartTotals().gstAmount.toFixed(2)}</span>
                          </div>

                          {/* Payment mode choice */}
                          <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-bold text-gray-500 block uppercase">पेमेंट मोड (Payment Mode)</label>
                            <div className="grid grid-cols-4 gap-1">
                              {(['CASH', 'UPI', 'CARD', 'CREDIT'] as const).map(mode => (
                                <button
                                  key={mode}
                                  onClick={() => setBillPaymentMode(mode)}
                                  className={`py-1.5 rounded-lg text-[10px] font-extrabold border transition-all ${
                                    billPaymentMode === mode 
                                      ? 'bg-forest-500 text-white border-forest-500 shadow-sm' 
                                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  {mode === 'CREDIT' ? 'उधारी (Credit)' : mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between font-extrabold text-sm text-gray-800 border-t pt-3">
                            <span>एकूण बिल रक्कम</span>
                            <span className="text-forest-500">₹{cartTotals().grandTotal.toFixed(2)}</span>
                          </div>

                          <button 
                            onClick={handleCheckout}
                            className="w-full bg-forest-500 hover:bg-forest-600 text-white font-black py-3 rounded-xl mt-3 text-xs shadow-md tracking-wider flex items-center justify-center gap-2 transition-colors"
                          >
                            <Check className="w-4 h-4" /> पावती तयार करा (Generate Bill)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right panel: Product catalog list (Lg: 7cols) */}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                      {products
                        .filter(p => p.name.toLowerCase().includes(billingSearch.toLowerCase()) || (p.category && p.category.toLowerCase().includes(billingSearch.toLowerCase())))
                        .map(p => (
                          <div 
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-3 rounded-2xl border border-forest-100 hover:border-forest-400 cursor-pointer transition-all flex flex-col justify-between text-left group hover:shadow-sm"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <p className="font-bold text-xs text-gray-800 group-hover:text-forest-500 transition-colors line-clamp-2">{p.name}</p>
                                <span className="bg-forest-50 text-forest-700 px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0">{p.category}</span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1">कापड: {p.fabric || '-'} | रॅक: {p.rack_number || '-'}</p>
                            </div>

                            <div className="flex justify-between items-center mt-3 border-t pt-2">
                              <div>
                                <span className="text-xs font-black text-forest-500">₹{p.selling_price}</span>
                                {p.mrp > p.selling_price && (
                                  <span className="text-[9px] text-gray-400 line-through ml-1">₹{p.mrp}</span>
                                )}
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                p.stock_quantity <= 0 ? 'bg-red-50 text-red-600' : p.stock_quantity <= p.min_stock ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {p.stock_quantity <= 0 ? 'स्टॉक संपला' : `${p.stock_quantity} शिल्लक`}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: STOCK / INVENTORY */}
          {activeTab === 'stock' && role !== 'MASTER_ADMIN' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">📦 इन्व्हेंटरी आणि माल साठा (Inventory Control)</h2>
                  <p className="text-xs text-gray-500">कापड स्टॉक, खरेदी नोंदी आणि सप्लायर्स माहिती</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setShowAddProd(true)}
                    className="bg-forest-500 hover:bg-forest-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> नवीन कापड उत्पादन जोडा
                  </button>

                  <button 
                    onClick={() => setShowStockAdjust(true)}
                    className="bg-forest-100 hover:bg-forest-200 text-forest-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    स्टॉक ऍडजस्ट करा
                  </button>

                  <button 
                    onClick={() => setShowAddSupp(true)}
                    className="bg-zari-100 hover:bg-zari-200 text-zari-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    नवीन सप्लायर जोडा
                  </button>
                </div>
              </div>

              {/* Grid: 3 lists (Products, Suppliers, Purchases log) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Products Table/List (7cols) */}
                <div className="xl:col-span-8 border border-forest-100 rounded-2xl p-4">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">सर्व कापड साठा यादी (Sarees, Kurtis & Fabrics)</h3>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-forest-50 text-gray-700 border-b border-forest-100">
                          <th className="p-2.5">उत्पादनाचे नाव</th>
                          <th className="p-2.5">श्रेणी</th>
                          <th className="p-2.5 text-right">खरेदी दर</th>
                          <th className="p-2.5 text-right">विक्री दर</th>
                          <th className="p-2.5 text-center">स्टॉक प्रमाण</th>
                          <th className="p-2.5 text-center">बारकोड</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-2.5 font-bold text-gray-800">
                              <p>{p.name}</p>
                              {p.color && <span className="text-[9px] text-gray-500">रंग: {p.color} • आकार: {p.size || '-'}</span>}
                            </td>
                            <td className="p-2.5 text-gray-500">{p.category}</td>
                            <td className="p-2.5 text-right">₹{p.purchase_price}</td>
                            <td className="p-2.5 text-right font-bold text-forest-600">₹{p.selling_price}</td>
                            <td className="p-2.5 text-center">
                              <span className={`inline-block font-extrabold px-2 py-0.5 rounded-full ${
                                p.stock_quantity <= p.min_stock ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {p.stock_quantity} नग
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => {
                                  setSelectedBarcodeProduct(p);
                                  setShowBarcodeDialog(true);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-700 font-bold rounded-lg border border-forest-100 transition-all hover:border-forest-300 shadow-sm"
                                title="बारकोड लेबल प्रिंट करा"
                              >
                                <BarcodeIcon className="w-3.5 h-3.5" />
                                <span className="text-[10px]">बारकोड</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Suppliers & Pending Payments (4cols) */}
                <div className="xl:col-span-4 space-y-4">
                  <div className="border border-forest-100 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-sm text-gray-800">सप्लायर्स आणि थकबाकी (Suppliers)</h3>
                      <button 
                        onClick={() => setShowPurchaseDialog(true)}
                        className="bg-forest-500 text-white font-bold text-[10px] px-2 py-1 rounded"
                      >
                        माल खरेदी नोंदवा
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {suppliers.map(s => (
                        <div key={s.id} className="p-2.5 bg-gray-50 hover:bg-gray-100/50 rounded-xl border border-gray-100 text-xs">
                          <div className="flex justify-between">
                            <p className="font-bold text-gray-800">{s.name}</p>
                            <span className="text-red-600 font-extrabold">₹{s.pending_payment} देय</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">मोबाईल: {s.contact} {s.gst_number && `| GST: ${s.gst_number}`}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchases records logs */}
                  <div className="border border-forest-100 rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-gray-800 mb-3">अलीकडील खरेदी व्यवहार (Purchases Log)</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {purchases.map(pur => (
                        <div key={pur.id} className="p-2.5 bg-forest-50/50 rounded-xl border border-forest-100 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-800">{pur.supplier_name}</p>
                            <p className="text-[9px] text-gray-400">बिल नं: {pur.invoice_number || '-'}</p>
                          </div>
                          <span className="font-bold text-gray-700">₹{pur.amount}</span>
                        </div>
                      ))}
                      {purchases.length === 0 && (
                        <p className="text-[10px] text-gray-400 text-center py-4">काहीही व्यवहार आढळले नाहीत.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && role !== 'MASTER_ADMIN' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">📑 रिपोर्ट आणि अहवाल (Reports Room)</h2>

              {role === 'EMPLOYEE' ? (
                /* Access Restricted for employees */
                <div className="bg-red-50 p-8 rounded-3xl border border-red-200 text-center space-y-3">
                  <span className="text-4xl block">🔒</span>
                  <h3 className="font-bold text-lg text-red-800">अहवाल पाहण्यासाठी परवानगी नाही</h3>
                  <p className="text-xs text-red-600">नफा-तोटा आणि अहवाल पाहण्याचे अधिकार फक्त 'मालक / अॅडमीन' लॉगिनसाठी मर्यादित आहेत.</p>
                </div>
              ) : (
                /* Report Content */
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                    <div className="absolute right-0 inset-y-0 w-32 bg-zari-500 opacity-10 rounded-l-full"></div>
                    <p className="text-xs text-forest-100 uppercase font-bold tracking-wider">एकूण संचित नफा आणि तोटा (Cumulative Profit & Loss)</p>
                    <p className="text-4xl font-black mt-2">₹{estimatedProfit.toFixed(2)}</p>
                    <div className="flex justify-between items-center text-xs text-forest-100 mt-4 border-t border-forest-500 pt-3">
                      <span>एकूण विक्री: ₹{totalSalesVal.toFixed(0)}</span>
                      <span>एकूण व्यवहार संख्या: {sales.length}</span>
                    </div>
                  </div>

                  {/* Monthly Reports */}
                  {monthlyStats.length > 0 && (
                    <div className="border border-forest-100 rounded-3xl p-5 bg-white shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                        <div>
                          <h3 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                            <span>📅</span> मासिक अहवाल (Monthly Reports)
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">महिन्यानुसार एकूण विक्री, नफा आणि थकबाकीची माहिती.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setShowMonthlyReportPrint(true);
                              setTimeout(() => {
                                window.print();
                                setShowMonthlyReportPrint(false);
                              }, 300);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                            title="मासिक अहवाल PDF म्हणून प्रिंट करा"
                          >
                            🖨️ प्रिंट (Print)
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {monthlyStats.map((stat) => (
                          <div key={stat.monthKey} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col gap-2">
                            <h4 className="font-bold text-sm text-gray-800 border-b border-gray-200 pb-2">{stat.monthLabel}</h4>
                            <div className="flex justify-between items-center text-xs mt-1">
                              <span className="text-gray-500 font-bold">एकूण विक्री (Sales)</span>
                              <span className="font-black text-gray-800">₹{stat.totalSales.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-bold">नफा (Profit)</span>
                              <span className="font-black text-forest-600">₹{stat.totalProfit.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 font-bold">बाकी (Pending)</span>
                              <span className={`font-black ${stat.pendingCollections > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                ₹{stat.pendingCollections.toFixed(0)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top selling Items */}
                  <div className="border border-forest-100 rounded-2xl p-4">
                    <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-1.5">
                      ⭐ सर्वात जास्त विकली जाणारी कापड उत्पादने (Top Selling Products)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {products.slice(0, 3).map((p, idx) => (
                        <div key={p.id} className="bg-gray-50 border border-gray-100 p-3 rounded-2xl flex items-center gap-3">
                          <span className="text-2xl">⭐</span>
                          <div>
                            <p className="font-bold text-xs text-gray-800 truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] text-gray-500">स्टॉक: {p.stock_quantity} नग</p>
                            <p className="text-xs font-bold text-forest-500 mt-1">₹{p.selling_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer outstanding reports & Advanced DB Hub */}
                  <div className="border border-forest-100 rounded-3xl p-5 bg-white shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-extrabold text-base text-gray-800 flex items-center gap-2">
                          <span>👥</span> ग्राहक डेटाबेस आणि उधारी केंद्र (Customer Database Hub)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">सर्व ग्राहकांची यादी पहा, उधारी व्यवस्थापित करा आणि एक्सेल फाईल डाऊनलोड करा.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {/* CSV Export Button */}
                        <button
                          onClick={downloadCustomerCSV}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          title="सर्व ग्राहक एक्सेल स्वरूपात डाऊनलोड करा"
                        >
                          <span>📥</span> CSV फाईल डाऊनलोड
                        </button>
                        {/* Print Ledger Button */}
                        <button
                          onClick={handlePrintCustomers}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                          title="प्रिंट करण्यासाठी किंवा PDF म्हणून सेव्ह करण्यासाठी"
                        >
                          <span>🖨️</span> प्रिंट रजिस्टर
                        </button>
                      </div>
                    </div>

                    {/* Stats strip inside Hub */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">एकूण नोंदणीकृत</span>
                        <p className="text-lg font-black text-gray-800 mt-0.5">{customers.filter(c => !c.is_deleted).length} जण</p>
                      </div>
                      <div className="bg-red-50 border border-red-100 p-3 rounded-2xl">
                        <span className="text-[10px] text-red-700 font-bold uppercase">थकबाकी खातेदार</span>
                        <p className="text-lg font-black text-red-600 mt-0.5">{customers.filter(c => !c.is_deleted && c.outstanding_balance > 0).length} जण</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase">एकूण बाजारात येणे</span>
                        <p className="text-lg font-black text-emerald-600 mt-0.5">₹{customers.filter(c => !c.is_deleted).reduce((sum, c) => sum + (c.outstanding_balance || 0), 0).toFixed(0)}</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 p-3 rounded-2xl">
                        <span className="text-[10px] text-purple-700 font-bold uppercase">शून्य थकबाकी</span>
                        <p className="text-lg font-black text-purple-600 mt-0.5">{customers.filter(c => !c.is_deleted && c.outstanding_balance === 0).length} जण</p>
                      </div>
                    </div>

                    {/* Search & Sort filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                          type="text"
                          placeholder="ग्राहकाचे नाव, मोबाईल किंवा पत्ता शोध घ्या..."
                          value={custSearch}
                          onChange={(e) => setCustSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={custSort}
                          onChange={(e) => setCustSort(e.target.value as any)}
                          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-forest-500"
                        >
                          <option value="bal-desc">💸 जास्त उधारी आधी (Outstanding High-Low)</option>
                          <option value="bal-asc">📉 कमी उधारी आधी (Outstanding Low-High)</option>
                          <option value="name">🔠 नाव अ-ज्ञ (Alphabetical A-Z)</option>
                          <option value="updated">🔄 नुकतेच अपडेट केलेले (Recently Updated)</option>
                        </select>
                      </div>
                    </div>

                    {/* Table listing */}
                    <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-700 text-[11px] font-black uppercase font-sans">
                            <th className="p-3">ग्राहकाचे नाव</th>
                            <th className="p-3">मोबाईल</th>
                            <th className="p-3">पत्ता / गाव</th>
                            <th className="p-3 text-right">शिल्लक उधारी</th>
                            <th className="p-3 text-center">जलद कृती (Actions)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(() => {
                            const activeAndFiltered = customers
                              .filter(c => !c.is_deleted)
                              .filter(c => {
                                const term = custSearch.toLowerCase();
                                return (
                                  c.name.toLowerCase().includes(term) ||
                                  c.mobile.includes(term) ||
                                  (c.address || '').toLowerCase().includes(term)
                                );
                              })
                              .sort((a, b) => {
                                if (custSort === 'name') {
                                  return a.name.localeCompare(b.name, 'mr-IN');
                                } else if (custSort === 'bal-desc') {
                                  return b.outstanding_balance - a.outstanding_balance;
                                } else if (custSort === 'bal-asc') {
                                  return a.outstanding_balance - b.outstanding_balance;
                                } else if (custSort === 'updated') {
                                  return b.last_updated - a.last_updated;
                                }
                                return 0;
                              });

                            if (activeAndFiltered.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-xs text-gray-500 font-bold">
                                    🔍 शोधलेले कोणतेही ग्राहक सापडले नाहीत!
                                  </td>
                                </tr>
                              );
                            }

                            return activeAndFiltered.map(c => (
                              <tr key={c.id} className="hover:bg-gray-50/50 text-xs transition-all">
                                <td className="p-3 font-extrabold text-gray-800">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-forest-400"></span>
                                    <span>{c.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-bold text-gray-600">{c.mobile}</td>
                                <td className="p-3 text-gray-500 font-medium">{c.address || 'येवला'}</td>
                                <td className={`p-3 text-right font-black text-xs ${c.outstanding_balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                  ₹{c.outstanding_balance.toFixed(2)}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {/* Action: Receive payment */}
                                    <button
                                      onClick={() => {
                                        const amtStr = window.prompt(
                                          `✍️ '${c.name}' यांच्याकडून जमा झालेली रक्कम प्रविष्ट करा:\n\nशिल्लक उधारी बाकी: ₹${c.outstanding_balance}`,
                                          String(c.outstanding_balance)
                                        );
                                        if (amtStr !== null) {
                                          const amt = parseFloat(amtStr);
                                          if (!isNaN(amt)) {
                                            handleReceiveUdhaari(c.id, amt);
                                          } else {
                                            alert("कृपया योग्य रक्कम प्रविष्ट करा!");
                                          }
                                        }
                                      }}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1"
                                      title="उधारी रक्कम जमा करा"
                                    >
                                      💰 जमा
                                    </button>

                                    {/* Action: Send Reminder */}
                                    {c.outstanding_balance > 0 && (
                                      <button
                                        onClick={() => handleSendWhatsAppReminder(c)}
                                        className="bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1"
                                        title="WhatsApp द्वारे उधारी आठवण मेसेज पाठवा"
                                      >
                                        💬 रिमांडर
                                      </button>
                                    )}

                                    {/* Action: Delete */}
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`⚠️ ग्राहक '${c.name}' डेटाबेसमधून नक्की हटवायचा आहे का?`)) {
                                          const updated = customers.map(cust => {
                                            if (cust.id === c.id) {
                                              return { ...cust, is_deleted: true, last_updated: Date.now() };
                                            }
                                            return cust;
                                          });
                                          updateLocalCustomers(updated);
                                          addAuditLog(`ग्राहक हटवला: ${c.name}`);
                                          alert("ग्राहक यशस्वीरीत्या काढला गेला! 🗑️");
                                        }
                                      }}
                                      className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1.5 rounded-lg font-bold text-[10px] transition-all"
                                      title="ग्राहक डिलीट करा"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && role !== 'MASTER_ADMIN' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">⚙️ सेटिंग्ज आणि कॉन्फिगरेशन (Shop Settings)</h2>

              {/* Shop Profile Form */}
              <div className="border border-forest-100 rounded-2xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">{Loc.t('shop_details', lang)}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const nameVal = data.get('name') as string;
                  const addVal = data.get('address') as string;
                  const gstVal = data.get('gst') as string;
                  const upiVal = data.get('upi') as string;
                  const whatsVal = data.get('whats') as string;

                  setShopName(nameVal);
                  setShopAddress(addVal);
                  setGstNumber(gstVal);
                  setUpiId(upiVal);
                  setWhatsNo(whatsVal);

                  localStorage.setItem('shop_name', nameVal);
                  localStorage.setItem('shop_address', addVal);
                  localStorage.setItem('shop_gst', gstVal);
                  localStorage.setItem('shop_upi', upiVal);
                  localStorage.setItem('shop_whats', whatsVal);

                  addAuditLog("दुकान माहिती आणि सेटिंग्ज अद्ययावत केली");
                  alert("दुकान सेटिंग्ज जतन केल्या!");
                }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 block">{Loc.t('shop_name', lang)}</label>
                    <input type="text" name="name" defaultValue={shopName} className="w-full border p-2 rounded-lg" required />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 block">{Loc.t('whats_no', lang)}</label>
                    <input type="text" name="whats" defaultValue={whatsNo} className="w-full border p-2 rounded-lg" required />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-gray-600 block">{Loc.t('shop_address', lang)}</label>
                    <input type="text" name="address" defaultValue={shopAddress} className="w-full border p-2 rounded-lg" required />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 block">{Loc.t('gst_number', lang)}</label>
                    <input type="text" name="gst" defaultValue={gstNumber} className="w-full border p-2 rounded-lg" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 block">{Loc.t('upi_id', lang)}</label>
                    <input type="text" name="upi" defaultValue={upiId} className="w-full border p-2 rounded-lg" />
                  </div>

                  <div className="sm:col-span-2">
                    <button type="submit" className="bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-xl font-bold">
                      {Loc.t('save_settings', lang)}
                    </button>
                  </div>
                </form>
              </div>

              {/* Supabase connection Config */}
              <div className="border border-purple-200 bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 text-purple-700 p-2.5 rounded-2xl">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-purple-950">
                        🔄 Supabase क्लाउड डेटाबेस सिंक केंद्र (Supabase Sync Hub)
                      </h3>
                      <p className="text-xs text-purple-600">तुमचा कापड व्यवसाय सुरक्षित क्लाउडवर साठवून ठेवा आणि सर्व साधनांवर सिंक करा.</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {sbSyncStatus === 'CONNECTED' ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                        कनेक्टेड 🟢 (Connected)
                      </span>
                    ) : sbSyncStatus === 'ERROR' ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-black">
                        एरर 🔴 (Connection Error)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">
                        ऑफलाईन ⚪ (Offline Mode)
                      </span>
                    )}
                  </div>
                </div>

                {/* Internal Sub-navigation Tabs */}
                <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 text-xs font-bold">
                  <button
                    onClick={() => setSbSubTab('status')}
                    className={`flex-1 py-2 text-center rounded-lg transition-all ${
                      sbSubTab === 'status' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🔄 सिंक डॅशबोर्ड
                  </button>
                  <button
                    onClick={() => setSbSubTab('sql')}
                    className={`flex-1 py-2 text-center rounded-lg transition-all ${
                      sbSubTab === 'sql' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📋 SQL टेबल स्क्रिप्ट
                  </button>
                  <button
                    onClick={() => setSbSubTab('guide')}
                    className={`flex-1 py-2 text-center rounded-lg transition-all ${
                      sbSubTab === 'guide' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ℹ️ वापर मार्गदर्शक
                  </button>
                </div>

                {/* TAB 1: STATUS & OPERATIONS */}
                {sbSubTab === 'status' && (() => {
                  const hasSbSaved = (!!localStorage.getItem('sb_url_' + currentShopId) && !!localStorage.getItem('sb_key_' + currentShopId));
                  const isSbLocked = hasSbSaved && !isShopSbUnlocked;
                  return (
                    <div className="space-y-4">
                      {/* Credentials form */}
                      <div className="bg-purple-50/30 p-4 rounded-2xl border border-purple-100">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-extrabold text-xs text-purple-900">🔑 क्रेडेंशियल्स अपडेट करा:</h4>
                          {isSbLocked ? (
                            <span className="bg-rose-50 border border-rose-200 text-rose-700 font-black text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                              🔒 क्रेडेंशियल्स सुरक्षितपणे लॉक आहेत (Locked)
                            </span>
                          ) : (
                            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                              🔓 क्रेडेंशियल्स संपादन सुरू (Editable)
                            </span>
                          )}
                        </div>
                        <form onSubmit={handleSaveSbConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-600 block flex items-center gap-1">
                              <span>Supabase Project URL</span>
                            </label>
                            <input 
                              type="text" 
                              name="url" 
                              value={sbUrl} 
                              onChange={(e) => !isSbLocked && setSbUrl(e.target.value)}
                              disabled={isSbLocked}
                              placeholder="https://your-project.supabase.co" 
                              className={`w-full border p-2 rounded-lg font-mono ${isSbLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white'}`} 
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-600 block flex items-center gap-1">
                              <span>Supabase Anon Key</span>
                            </label>
                            <input 
                              type="password" 
                              name="key" 
                              value={sbKey} 
                              onChange={(e) => !isSbLocked && setSbKey(e.target.value)}
                              disabled={isSbLocked}
                              placeholder={isSbLocked ? "••••••••••••••••••••••••••••••••••••••••" : "eyJhbGciOi..."} 
                              className={`w-full border p-2 rounded-lg font-mono ${isSbLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white'}`} 
                              required
                            />
                          </div>
                          <div className="sm:col-span-2 flex flex-wrap justify-between items-center gap-3 mt-1 border-t pt-3">
                            {!isSbLocked ? (
                              <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-colors shadow-sm">
                                💾 क्रेडेंशियल्स सेव्ह आणि लॉक करा (Save & Lock)
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button"
                                  onClick={() => setIsShopSbUnlocked(true)}
                                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-black text-xs transition-colors shadow-sm flex items-center gap-1"
                                >
                                  🔓 अनलॉक करा (Unlock to Edit)
                                </button>
                                <span className="text-[10px] text-rose-600 font-extrabold">
                                  ⚠️ बदल करण्यासाठी प्रथम अनलॉक करा.
                                </span>
                              </div>
                            )}
                            
                            {sbSyncStatus === 'CONNECTED' && (
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border hover:bg-gray-50 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={autoSync} 
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setAutoSync(val);
                                  localStorage.setItem('t_auto_sync', String(val));
                                  addAuditLog(`स्वयंचलित सिंक ${val ? 'सुरू' : 'बंद'} केले`);
                                }}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" 
                              />
                              <div>
                                <span className="text-[11px] font-black text-gray-700">स्वयंचलित सिंक (Auto-Sync Changes)</span>
                              </div>
                            </label>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Sync Actions (Active only if connected) */}
                    {sbSyncStatus === 'CONNECTED' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            onClick={handleSmartSync}
                            disabled={isSyncing}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-all hover:shadow disabled:opacity-50"
                          >
                            <span className="text-xl">🔄</span>
                            <span>द्विमार्गी स्मार्ट सिंक</span>
                            <span className="text-[9px] font-medium text-purple-100">(Bi-directional Sync)</span>
                          </button>

                          <button
                            onClick={handlePushToCloud}
                            disabled={isSyncing}
                            className="bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200 p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-all disabled:opacity-50"
                          >
                            <span className="text-xl">📤</span>
                            <span>स्थानिक डेटा क्लाउडवर पाठवा</span>
                            <span className="text-[9px] font-medium text-purple-400">(Push Local to Cloud)</span>
                          </button>

                          <button
                            onClick={handlePullFromCloud}
                            disabled={isSyncing}
                            className="bg-white hover:bg-purple-50 text-purple-700 border-2 border-purple-200 p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-all disabled:opacity-50"
                          >
                            <span className="text-xl">📥</span>
                            <span>क्लाउडवरून स्थानिक डेटा रिस्टोर करा</span>
                            <span className="text-[9px] font-medium text-purple-400">(Pull Cloud to Local)</span>
                          </button>
                        </div>

                        {/* Local/Cloud Inventory Stat Overview */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs space-y-2">
                          <h4 className="font-extrabold text-gray-700 flex items-center gap-1.5 mb-1">
                            📊 डेटा इन्व्हेंटरी संख्या (Local State Stats):
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                              <span className="text-gray-400 text-[10px] block font-bold">एकूण उत्पादने (Products)</span>
                              <span className="text-sm font-black text-purple-900">{products.length} नग</span>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                              <span className="text-gray-400 text-[10px] block font-bold">नोंदणीकृत ग्राहक (Customers)</span>
                              <span className="text-sm font-black text-purple-900">{customers.length} जण</span>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-gray-100 text-center">
                              <span className="text-gray-400 text-[10px] block font-bold">एकूण विक्री (Sales Bills)</span>
                              <span className="text-sm font-black text-purple-900">{sales.length} बिले</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Sync Logs Box */}
                        {syncLogs.length > 0 && (
                          <div className="bg-zinc-900 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1 shadow-inner">
                            <div className="font-bold text-gray-400 border-b border-zinc-800 pb-1.5 flex justify-between items-center mb-1.5">
                              <span>🖥️ सिंक प्रगती लॉग्स (Sync Logs):</span>
                              {isSyncing && <span className="animate-pulse text-purple-400">सिंक्रोनाइझिंग चालू आहे...</span>}
                            </div>
                            {syncLogs.map((log, i) => (
                              <div key={i}>{log}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
                        <p className="font-bold flex items-center gap-1.5">
                          <span>⚠️ क्लाउड डेटा सिंक ऑफलाईन आहे!</span>
                        </p>
                        <p className="text-amber-700">तुमचा डेटा सध्या सुरक्षित राहण्यासाठी स्थानिक मेमरीमध्ये साठवला जात आहे. क्लाउड बॅकअप सुरू करण्यासाठी वर Supabase प्रोजेक्ट URL आणि Anon Key भरून "क्रेडेंशियल्स जतन करा" वर क्लिक करा.</p>
                      </div>
                    )}
                    
                    {/* Manual Force Backup Section */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-3 mt-4">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">💽</span>
                        <div>
                          <h4 className="font-extrabold text-gray-800">स्थानिक डेटा मॅन्युअल बॅकअप (Manual Backup & Restore)</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">जर क्लाउड सिंक काम करत नसेल किंवा इंटरनेट नसेल, तर तुम्ही तुमच्या डेटाचा सुरक्षित JSON फाईलमध्ये बॅकअप घेऊ शकता.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        <button
                          onClick={handleManualBackup}
                          className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition-all"
                        >
                          <span className="text-lg">⬇️</span>
                          <span>बॅकअप डाउनलोड करा</span>
                          <span className="text-[9px] text-gray-400 font-medium">(Download JSON Backup)</span>
                        </button>
                        
                        <div className="relative">
                          <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleManualRestore}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700 h-full p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all">
                            <span className="text-lg">⬆️</span>
                            <span>फाईलमधून रिस्टोर करा</span>
                            <span className="text-[9px] text-gray-400 font-medium">(Restore from JSON)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )})()}

                {/* TAB 2: SQL SCHEMA GENERATOR */}
                {sbSubTab === 'sql' && (
                  <div className="space-y-3">
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-xs">
                      <p className="font-bold">⚠️ महत्त्वपूर्ण पायरी (Important Step):</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">डेटाबेस सिंक सुरू करण्यापूर्वी, तुम्हाला खालील SQL कोड कॉपी करून तुमच्या Supabase Dashboard मधील **SQL Editor** मध्ये पेस्ट करून 'RUN' करायचा आहे. यामुळे तुमच्या क्रेडेंशियल्समध्ये आवश्यक टेबल्स तयार होतील.</p>
                    </div>

                    <div className="relative">
                      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-2xl font-mono text-[10px] max-h-60 overflow-auto whitespace-pre leading-relaxed scrollbar-thin">
{`-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- ३. उत्पादने टेबल (Products Table)
CREATE TABLE IF NOT EXISTS t_products (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT,
  supplier_id TEXT,
  purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  selling_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  mrp DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  color TEXT,
  size TEXT,
  pattern TEXT,
  fabric TEXT,
  hsn_code TEXT,
  stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_stock DOUBLE PRECISION NOT NULL DEFAULT 0,
  rack_number TEXT,
  remarks TEXT,
  image_url TEXT,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ४. ग्राहक टेबल (Customers Table)
CREATE TABLE IF NOT EXISTS t_customers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  outstanding_balance DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ५. पुरवठादार टेबल (Suppliers Table)
CREATE TABLE IF NOT EXISTS t_suppliers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  gst_number TEXT,
  pending_payment DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ६. विक्री बिलिंग टेबल (Sales Table)
CREATE TABLE IF NOT EXISTS t_sales (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  date BIGINT NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  grand_total DOUBLE PRECISION NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  last_updated BIGINT NOT NULL
);

-- ७. खरेदी टेबल (Purchases Table)
CREATE TABLE IF NOT EXISTS t_purchases (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  supplier_id TEXT,
  supplier_name TEXT NOT NULL,
  invoice_number TEXT,
  date BIGINT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL
);

-- ८. ऑडिट लॉग्स टेबल (Audit Logs)
CREATE TABLE IF NOT EXISTS t_audit_logs (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`}
                      </pre>
                      <button
                        onClick={() => {
                          const sqlCode = `-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- ३. उत्पादने टेबल (Products Table)
CREATE TABLE IF NOT EXISTS t_products (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT,
  supplier_id TEXT,
  purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  selling_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  mrp DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  color TEXT,
  size TEXT,
  pattern TEXT,
  fabric TEXT,
  hsn_code TEXT,
  stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_stock DOUBLE PRECISION NOT NULL DEFAULT 0,
  rack_number TEXT,
  remarks TEXT,
  image_url TEXT,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ४. ग्राहक टेबल (Customers Table)
CREATE TABLE IF NOT EXISTS t_customers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  outstanding_balance DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ५. पुरवठादार टेबल (Suppliers Table)
CREATE TABLE IF NOT EXISTS t_suppliers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  gst_number TEXT,
  pending_payment DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ६. विक्री बिलिंग टेबल (Sales Table)
CREATE TABLE IF NOT EXISTS t_sales (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  date BIGINT NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  grand_total DOUBLE PRECISION NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  last_updated BIGINT NOT NULL
);

-- ७. खरेदी टेबल (Purchases Table)
CREATE TABLE IF NOT EXISTS t_purchases (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  supplier_id TEXT,
  supplier_name TEXT NOT NULL,
  invoice_number TEXT,
  date BIGINT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL
);

-- ८. ऑडिट लॉग्स टेबल (Audit Logs)
CREATE TABLE IF NOT EXISTS t_audit_logs (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`;
                          navigator.clipboard.writeText(sqlCode);
                          alert("SQL कोड यशस्वीरित्या कॉपी केला! आता तो Supabase मध्ये जाऊन पेस्ट करू शकता. 📋");
                        }}
                        className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] transition-colors"
                      >
                        📋 SQL कॉपी करा (Copy)
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SETUP GUIDE */}
                {sbSubTab === 'guide' && (
                  <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-700 leading-relaxed space-y-3">
                    <h4 className="font-extrabold text-purple-900 text-sm">🌐 नवीन Supabase डेटाबेस सेटअप करण्याची सोपी पद्धत:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>
                        <strong>Supabase वर नोंदणी करा:</strong> <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-purple-700 font-bold underline">supabase.com</a> वर जाऊन विनामूल्य (Free) खाते उघडा आणि नवीन प्रोजेक्ट तयार करा.
                      </li>
                      <li>
                        <strong>टेबल्स तयार करा (SQL Editor):</strong> डावीकडील <strong>"SQL टेबल स्क्रिप्ट"</strong> टॅबमधील कोड कॉपी करा. Supabase डॅशबोर्डवरील डाव्या मेनूमध्ये <code>SQL Editor</code> वर क्लिक करा, त्यात कोड पेस्ट करा आणि <code>RUN</code> करा.
                      </li>
                      <li>
                        <strong>क्रेडेंशियल्स मिळवा:</strong> प्रोजेक्टच्या <code>Project Settings</code> मधील <code>API</code> सेक्शनमध्ये जा. तेथून <strong>Project URL</strong> आणि <strong>anon / public key</strong> मिळवा.
                      </li>
                      <li>
                        <strong>या ॲपमध्ये पेस्ट करा:</strong> क्रेडेंशियल्स या सिंक केंद्रात पहिल्या टॅबमध्ये भरा आणि जतन करा! त्यानंतर तुमच्या ॲपचा संपूर्ण डेटा सुरक्षितपणे ढगाशी सिंक होईल.
                      </li>
                    </ol>
                    <p className="text-[10.5px] font-bold text-emerald-700">💡 टीप: एकदा सिंक केल्यानंतर, तुम्हीstone तुमचे ॲप दुसऱ्या कॉम्प्युटरवर उघडून क्रेडेंशियल्स पेस्ट करून "क्लाउडवरून रिस्टोर करा" किंवा "स्मार्ट सिंक" वापरून पूर्ण डेटा परत मिळवू शकता!</p>
                  </div>
                )}
              </div>

              {/* System Audit log list */}
              <div className="border border-forest-100 rounded-2xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3">सिस्टम ऑडिट लॉग (System Audit Trail)</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {auditLogs.map(log => (
                    <div key={log.id} className="text-xs p-2.5 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-bold text-forest-600 mr-2">[{log.user}]</span>
                        <span className="text-gray-700">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('mr-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Management section for SHOP_ADMIN */}
              {role === 'SHOP_ADMIN' && (
                <div className="border border-indigo-100 bg-white rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <span className="text-2xl">🧑‍💼</span>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-800">
                        कर्मचारी व्यवस्थापन (Staff & Employee Accounts)
                      </h3>
                      <p className="text-xs text-gray-500">तुमच्या दुकानासाठी कर्मचारी लॉगिन खाती तयार करा आणि व्यवस्थापित करा.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Staff Form */}
                    <div className="md:col-span-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                      <h4 className="font-extrabold text-xs text-indigo-950">➕ नवीन कर्मचारी खाते जोडा</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const uName = (fd.get('staff_username') as string).trim().toLowerCase();
                        const uPass = fd.get('staff_password') as string;

                        if (!uName || !uPass) return;

                        if (users.some(u => u.username.toLowerCase() === uName)) {
                          alert("❌ या नावाचे वापरकर्ता खाते आधीपासूनच अस्तित्वात आहे!");
                          return;
                        }

                        const newUser: UserAccount = {
                          id: `user-${Date.now()}`,
                          username: uName,
                          password: uPass,
                          role: 'EMPLOYEE',
                          shopId: currentShopId
                        };

                        const nextUsers = [...users, newUser];
                        setUsers(nextUsers);
                        localStorage.setItem('t_users', JSON.stringify(nextUsers));
                        
                        addAuditLog(`नवीन कर्मचारी खाते जोडले: ${uName}`);
                        alert(`कर्मचारी खाते '${uName}' यशस्वीरित्या तयार केले!`);
                        e.currentTarget.reset();
                        
                        // Sync with Supabase if online/autoSync is enabled
                        if (autoSync && sbUrl && sbKey) {
                          uploadTableToSupabase('t_user_accounts', nextUsers);
                        }
                      }} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 block">वापरकर्तानाव (Username)</label>
                          <input type="text" name="staff_username" placeholder="उदा. mauli_emp" className="w-full border p-2 rounded-lg font-bold text-gray-800" required />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 block">पासवर्ड (Password)</label>
                          <input type="text" name="staff_password" placeholder="उदा. emp123" className="w-full border p-2 rounded-lg font-bold text-gray-800" required />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors">
                          🔐 खाते तयार करा (Create Staff)
                        </button>
                      </form>
                    </div>

                    {/* Existing Staff List */}
                    <div className="md:col-span-2 space-y-3">
                      <h4 className="font-extrabold text-xs text-gray-800">📋 तुमचे नोंदणीकृत कर्मचारी:</h4>
                      {users.filter(u => u.shopId === currentShopId && u.role === 'EMPLOYEE').length === 0 ? (
                        <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-bold">
                          ⚠️ तुमच्या दुकानासाठी अजून कोणतेही कर्मचारी खाते तयार केलेले नाही. डावीकडील फॉर्म वापरून खाते तयार करा!
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {users.filter(u => u.shopId === currentShopId && u.role === 'EMPLOYEE').map(acc => (
                            <div key={acc.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                              <div>
                                <p className="font-extrabold text-gray-800 flex items-center gap-1.5">
                                  <span>👤 {acc.username}</span>
                                  <span className="text-[9px] bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded font-black">
                                    कर्मचारी
                                  </span>
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">पासवर्ड: <span className="font-mono font-bold text-gray-600">{acc.password}</span></p>
                              </div>
                              <div className="flex flex-col gap-1.5 shrink-0 items-end">
                                <button
                                  onClick={() => {
                                    const nextPass = prompt(`'${acc.username}' साठी नवीन पासवर्ड टाका:`, acc.password);
                                    if (nextPass !== null) {
                                      const trimmed = nextPass.trim();
                                      if (!trimmed) {
                                        alert("❌ पासवर्ड रिकामा असू शकत नाही!");
                                        return;
                                      }
                                      const nextUsers = users.map(u => u.id === acc.id ? { ...u, password: trimmed } : u);
                                      setUsers(nextUsers);
                                      localStorage.setItem('t_users', JSON.stringify(nextUsers));
                                      addAuditLog(`दुकान मालकाने कर्मचारी ${acc.username} चा पासवर्ड रिसेट केला`);
                                      alert(`👤 '${acc.username}' चा पासवर्ड यशस्वीरित्या बदलून '${trimmed}' करण्यात आला आहे!`);

                                      if (autoSync && sbUrl && sbKey) {
                                        uploadTableToSupabase('t_user_accounts', nextUsers);
                                      }
                                    }
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 text-[10px] font-black hover:bg-indigo-50 px-2 py-1 rounded"
                                >
                                  🔑 पासवर्ड रिसेट
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`वापरकर्ता '${acc.username}' डिलीट करायचा आहे का?`)) {
                                      const nextUsers = users.filter(u => u.id !== acc.id);
                                      setUsers(nextUsers);
                                      localStorage.setItem('t_users', JSON.stringify(nextUsers));
                                      addAuditLog(`कर्मचारी खाते डिलीट केले: ${acc.username}`);
                                      
                                      if (autoSync && sbUrl && sbKey) {
                                        uploadTableToSupabase('t_user_accounts', nextUsers);
                                      }
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-bold px-2 py-1 hover:bg-red-50 rounded"
                                >
                                  डिलीट
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SHOPS MANAGEMENT */}
          {activeTab === 'shops' && role === 'MASTER_ADMIN' && (
            <div className="space-y-6">
              {/* Premium Developer & System Branding Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-500/20">
                <div className="absolute top-0 right-0 transform translate-x-16 -translate-y-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 transform -translate-x-16 translate-y-16 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative space-y-6">
                  {/* Developer Details Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase">
                        🚀 System Developer & Integrator
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                        Raghvendra Traders and Devolopers, Latur
                      </h2>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
                        मल्टी-टेनंट कापड व्यवसाय मॅनेजमेंट सॉफ्टवेअर (Multi-Tenant Textile ERP Platform) - प्रगत सुरक्षा, रीयल-टाइम क्लाउड सिंक आणि अत्याधुनिक इन्व्हेंटरी व्यवस्थापन प्रणाली.
                      </p>
                    </div>
                    
                    <div className="shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center md:items-start gap-1.5 shadow-lg">
                      <span className="text-[9px] text-indigo-300 font-extrabold uppercase tracking-widest">📞 Support & Dev Helpline</span>
                      <a href="tel:8080003689" className="text-xl font-black text-white hover:text-indigo-300 transition-colors flex items-center gap-2">
                        <span>📱</span> +91 8080003689
                      </a>
                      <span className="text-[9px] text-slate-400 font-bold">लातूर, महाराष्ट्र, भारत</span>
                    </div>
                  </div>

                  {/* Master Multi-Shop Control Header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <span>🏬</span> बहु-दुकान व्यवस्थापन केंद्र (Master Control Hub)
                      </h3>
                      <p className="text-xs text-slate-300">सर्व नोंदणीकृत कापड दुकाने, व्यवस्थापक खाती आणि सुरक्षित डेटाबेस सिंक व्यवस्थापित करा.</p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 flex-1 md:flex-initial">
                        <span className="text-[9px] uppercase font-black text-indigo-200 tracking-wider">एकूण दुकाने (Total Shops)</span>
                        <p className="text-2xl font-black mt-0.5">{shops.length} 🏪</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 flex-1 md:flex-initial">
                        <span className="text-[9px] uppercase font-black text-indigo-200 tracking-wider">एकूण युजर्स (Total Accounts)</span>
                        <p className="text-2xl font-black mt-0.5">{users.length} 🧑‍💻</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Supabase Database Sync Panel */}
              <div className="border border-indigo-200 bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-2xl">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-indigo-950">
                        🔄 मास्टर अॅडमीन क्लाउड डेटाबेस सिंक (Master Cloud DB Sync Hub)
                      </h3>
                      <p className="text-xs text-indigo-600">सर्व दुकाने आणि चालक खात्यांचा पासवर्ड सुरक्षित स्वतंत्र मास्टर क्लाउडवर सेव्ह करा.</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {masterSbUrl && masterSbKey ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                        🟢 मास्टर कनेक्टेड (Master Connected)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-black">
                        🔴 क्लाउड डिस्कनेक्टेड
                      </span>
                    )}
                  </div>
                </div>

                {/* Internal Sub-navigation Tabs for Master Admin */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-indigo-50/50 p-1 rounded-xl border border-indigo-100 text-[11px] font-black">
                  <button
                    onClick={() => setMasterSbSubTab('status')}
                    className={`py-2 text-center rounded-lg transition-all ${
                      masterSbSubTab === 'status' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-900 hover:bg-indigo-100/50'
                    }`}
                  >
                    🔄 सिंक डॅशबोर्ड
                  </button>
                  <button
                    onClick={() => setMasterSbSubTab('master_sql')}
                    className={`py-2 text-center rounded-lg transition-all ${
                      masterSbSubTab === 'master_sql' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-900 hover:bg-indigo-100/50'
                    }`}
                  >
                    👑 मास्टर SQL स्क्रिप्ट
                  </button>
                  <button
                    onClick={() => setMasterSbSubTab('shop_sql')}
                    className={`py-2 text-center rounded-lg transition-all ${
                      masterSbSubTab === 'shop_sql' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-900 hover:bg-indigo-100/50'
                    }`}
                  >
                    🏬 दुकान SQL स्क्रिप्ट
                  </button>
                  <button
                    onClick={() => setMasterSbSubTab('guide')}
                    className={`py-2 text-center rounded-lg transition-all ${
                      masterSbSubTab === 'guide' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-900 hover:bg-indigo-100/50'
                    }`}
                  >
                    ℹ️ वापर मार्गदर्शक
                  </button>
                </div>

                {/* TAB 1: STATUS & OPERATIONS */}
                {masterSbSubTab === 'status' && (() => {
                  const hasMasterSbSaved = !!localStorage.getItem('master_sb_url') && !!localStorage.getItem('master_sb_key');
                  const isMasterSbLocked = hasMasterSbSaved && !isMasterSbUnlocked;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                      <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-extrabold text-xs text-indigo-950 flex items-center gap-1">
                            <span>🔑</span> मास्टर Supabase क्रेडेंशियल्स (Master Credentials)
                          </h4>
                          {isMasterSbLocked ? (
                            <span className="bg-rose-50 border border-rose-200 text-rose-700 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                              🔒 लॉक (Locked)
                            </span>
                          ) : (
                            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                              🔓 अनलॉक (Editable)
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 block">Master Supabase Project URL</label>
                            <input 
                              type="text" 
                              placeholder="https://your-master-project.supabase.co" 
                              value={masterSbUrl}
                              onChange={(e) => {
                                if (!isMasterSbLocked) {
                                  setMasterSbUrl(e.target.value);
                                }
                              }}
                              disabled={isMasterSbLocked}
                              className={`w-full border p-2 rounded-lg font-mono text-[11px] ${
                                isMasterSbLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white text-gray-800'
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-500 block">Master Supabase Anon Key</label>
                            <input 
                              type="password" 
                              placeholder={isMasterSbLocked ? "••••••••••••••••••••••••••••••••••••••••" : "eyJhbGciOi..."} 
                              value={masterSbKey}
                              onChange={(e) => {
                                if (!isMasterSbLocked) {
                                  setMasterSbKey(e.target.value);
                                }
                              }}
                              disabled={isMasterSbLocked}
                              className={`w-full border p-2 rounded-lg font-mono text-[11px] ${
                                isMasterSbLocked ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white text-gray-800'
                              }`}
                            />
                          </div>

                          <div className="pt-2 border-t border-indigo-100 flex flex-wrap gap-2">
                            {!isMasterSbLocked ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (!masterSbUrl.trim() || !masterSbKey.trim()) {
                                    alert("❌ कृपया मास्टर प्रोजेक्ट URL आणि ॲनॉन की दोन्ही भरा!");
                                    return;
                                  }
                                  localStorage.setItem('master_sb_url', masterSbUrl.trim());
                                  localStorage.setItem('master_sb_key', masterSbKey.trim());
                                  setIsMasterSbUnlocked(false);
                                  setMasterSbUrl(masterSbUrl.trim());
                                  setMasterSbKey(masterSbKey.trim());
                                  alert("🎉 मास्टर Supabase क्रेडेंशियल्स यशस्वीरित्या सेव्ह आणि लॉक केले! 💾🔒");
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-sm"
                              >
                                💾 सेव्ह आणि लॉक करा (Save & Lock)
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsMasterSbUnlocked(true)}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
                              >
                                🔓 अनलॉक करा (Unlock to Edit)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-4 bg-purple-50/40 rounded-2xl border border-purple-100">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-xs text-purple-950 flex items-center gap-1">
                            <span>⚡</span> डेटाबेस सिंक कृती (Sync Master Data)
                          </h4>
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            मास्टर क्लाउडवर दुकानांची यादी (`t_shops`) आणि सर्व युजर्स पासवर्ड (`t_user_accounts`) अपलोड करा किंवा क्लाउडवरून संपूर्ण डेटा पुन्हा ओढा.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <button
                            onClick={async () => {
                              if (!masterSbUrl || !masterSbKey) {
                                alert("❌ आधी मास्टर Supabase क्रेडेंशियल भरा आणि सेव्ह करा!");
                                return;
                              }
                              setIsSyncing(true);
                              try {
                                const res1 = await uploadTableToSupabase('t_shops', shops);
                                const res2 = await uploadTableToSupabase('t_user_accounts', users);
                                if (res1.success && res2.success) {
                                  alert("🎉 मास्टर डेटा यशस्वीरित्या स्वतंत्र मास्टर क्लाउडवर सुरक्षितपणे अपलोड करण्यात आला आहे!");
                                } else {
                                  alert(`❌ काही त्रुटी आली: ${res1.error || res2.error || 'अज्ञात एरर'}`);
                                }
                              } catch (err: any) {
                                alert(`❌ अपलोड अयशस्वी: ${err?.message}`);
                              } finally {
                                setIsSyncing(false);
                              }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            📤 क्लाउडवर पाठवा
                          </button>
                          <button
                            onClick={async () => {
                              if (!masterSbUrl || !masterSbKey) {
                                alert("❌ आधी मास्टर Supabase क्रेडेंशियल भरा आणि सेव्ह करा!");
                                return;
                              }
                              if (confirm("⚠️ सावधान! क्लाउडवरून डेटा ओढल्यास स्थानिक बदल ओव्हरराईट होऊ शकतात. सुरू ठेवायचे?")) {
                                setIsSyncing(true);
                                try {
                                  const client = createClient(masterSbUrl, masterSbKey);
                                  const { data: cloudShops, error: errShops } = await client.from('t_shops').select('*');
                                  const { data: cloudUsers, error: errUsers } = await client.from('t_user_accounts').select('*');

                                  if (errShops || errUsers) {
                                    alert(`❌ डेटाबेसवरून माहिती मिळवता आली नाही: ${errShops?.message || errUsers?.message}`);
                                    return;
                                  }

                                  if (cloudShops) {
                                    setShops(cloudShops);
                                    localStorage.setItem('t_shops', JSON.stringify(cloudShops));
                                  }
                                  if (cloudUsers) {
                                    setUsers(cloudUsers);
                                    localStorage.setItem('t_users', JSON.stringify(cloudUsers));
                                  }
                                  alert("🎉 अभिनंदन! क्लाउडवरून सर्व दुकाने, मास्टर आणि इतर युजर्सचा डेटा यशस्वीरित्या मिळवून स्थानिक पातळीवर रिस्टोर केला आहे.");
                                } catch (err: any) {
                                  alert(`❌ डाउनलोड अयशस्वी: ${err?.message}`);
                                } finally {
                                  setIsSyncing(false);
                                }
                              }
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                          >
                            📥 क्लाउडवरून ओढा
                          </button>
                        </div>
                      </div>
                      
                      {/* Manual Force Backup Section (Master Admin) */}
                      <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-3 mt-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">💽</span>
                          <div>
                            <h4 className="font-extrabold text-gray-800">संपूर्ण मास्टर डेटा मॅन्युअल बॅकअप (Full Master Backup & Restore)</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">येथून डाउनलोड केलेला बॅकअप तुमच्या ब्राउझरमधील सर्व दुकाने, युजर्स आणि मास्टर सेटिंग्जसह *संपूर्ण* स्थानिक मेमरी जतन करेल.</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          <button
                            onClick={handleManualBackup}
                            className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm transition-all"
                          >
                            <span className="text-lg">⬇️</span>
                            <span>संपूर्ण बॅकअप डाउनलोड करा</span>
                            <span className="text-[9px] text-gray-400 font-medium">(Download All App Data)</span>
                          </button>
                          
                          <div className="relative">
                            <input 
                              type="file" 
                              accept=".json" 
                              onChange={handleManualRestore}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-700 h-full p-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all">
                              <span className="text-lg">⬆️</span>
                              <span>फाईलमधून सर्व डेटा रिस्टोर करा</span>
                              <span className="text-[9px] text-gray-400 font-medium">(Restore Full Local Storage)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()}

                {/* TAB 2: MASTER SQL SCRIPT */}
                {masterSbSubTab === 'master_sql' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-2xl p-4 text-xs">
                      <p className="font-extrabold flex items-center gap-1">
                        <span>🔑</span> मास्टर डेटाबेस सेटअप सूचना (Master SQL Script Setup):
                      </p>
                      <p className="text-[11px] text-indigo-900 mt-1">
                        हा SQL कोड <strong>मास्टर अॅडमीन प्रोजेक्ट</strong> च्या Supabase SQL Editor मध्ये रन करा. यामध्ये फक्त दुकाने (Shops) आणि त्यांच्या युजर्सचे लॉगिन क्रेडेंशियल्स साठवले जातील.
                      </p>
                    </div>
                    <div className="relative">
                      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-2xl font-mono text-[10px] max-h-64 overflow-auto whitespace-pre leading-relaxed scrollbar-thin">
{`-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts Table)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;`}
                      </pre>
                      <button
                        onClick={() => {
                          const sqlCode = `-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts Table)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;`;
                          navigator.clipboard.writeText(sqlCode);
                          alert("मास्टर SQL कोड यशस्वीरित्या कॉपी केला! 📋");
                        }}
                        className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[10px] transition-colors"
                      >
                        📋 SQL कॉपी करा (Copy)
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SHOP SQL SCRIPT */}
                {masterSbSubTab === 'shop_sql' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl p-4 text-xs">
                      <p className="font-extrabold flex items-center gap-1">
                        <span>🏬</span> प्रत्येक कापड दुकानदाराचा SQL सेटअप (Shop SQL Setup):
                      </p>
                      <p className="text-[11px] text-amber-900 mt-1">
                        हा संपूर्ण SQL कोड दुकान मालक (Shop Owner) च्या स्वतःच्या स्वतंत्र Supabase प्रोजेक्टमध्ये रन करायचा आहे. यामध्ये दुकानाचे सर्व उत्पादने, बिले, खरेदी आणि ग्राहक डेटा साठवला जाईल.
                      </p>
                    </div>
                    <div className="relative">
                      <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-2xl font-mono text-[10px] max-h-64 overflow-auto whitespace-pre leading-relaxed scrollbar-thin">
{`-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- ३. उत्पादने टेबल (Products Table)
CREATE TABLE IF NOT EXISTS t_products (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT,
  supplier_id TEXT,
  purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  selling_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  mrp DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  color TEXT,
  size TEXT,
  pattern TEXT,
  fabric TEXT,
  hsn_code TEXT,
  stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_stock DOUBLE PRECISION NOT NULL DEFAULT 0,
  rack_number TEXT,
  remarks TEXT,
  image_url TEXT,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ४. ग्राहक टेबल (Customers Table)
CREATE TABLE IF NOT EXISTS t_customers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  outstanding_balance DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ५. पुरवठादार टेबल (Suppliers Table)
CREATE TABLE IF NOT EXISTS t_suppliers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  gst_number TEXT,
  pending_payment DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ६. विक्री बिलिंग टेबल (Sales Table)
CREATE TABLE IF NOT EXISTS t_sales (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  date BIGINT NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  grand_total DOUBLE PRECISION NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  last_updated BIGINT NOT NULL
);

-- ७. खरेदी टेबल (Purchases Table)
CREATE TABLE IF NOT EXISTS t_purchases (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  supplier_id TEXT,
  supplier_name TEXT NOT NULL,
  invoice_number TEXT,
  date BIGINT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL
);

-- ८. ऑडिट लॉग्स टेबल (Audit Logs)
CREATE TABLE IF NOT EXISTS t_audit_logs (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`}
                      </pre>
                      <button
                        onClick={() => {
                          const sqlCode = `-- १. दुकाने टेबल (Shops Table)
CREATE TABLE IF NOT EXISTS t_shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  "whatsNo" TEXT NOT NULL,
  "upiId" TEXT NOT NULL,
  "gstNumber" TEXT,
  created_at BIGINT NOT NULL,
  sb_url TEXT,
  sb_key TEXT
);

-- २. वापरकर्ता खाती टेबल (User Accounts)
CREATE TABLE IF NOT EXISTS t_user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL,
  "shopId" TEXT REFERENCES t_shops(id) ON DELETE SET NULL
);

-- ३. उत्पादने टेबल (Products Table)
CREATE TABLE IF NOT EXISTS t_products (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT,
  supplier_id TEXT,
  purchase_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  selling_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  mrp DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  color TEXT,
  size TEXT,
  pattern TEXT,
  fabric TEXT,
  hsn_code TEXT,
  stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0,
  min_stock DOUBLE PRECISION NOT NULL DEFAULT 0,
  rack_number TEXT,
  remarks TEXT,
  image_url TEXT,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ४. ग्राहक टेबल (Customers Table)
CREATE TABLE IF NOT EXISTS t_customers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address TEXT,
  outstanding_balance DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ५. पुरवठादार टेबल (Suppliers Table)
CREATE TABLE IF NOT EXISTS t_suppliers (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  gst_number TEXT,
  pending_payment DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- ६. विक्री बिलिंग टेबल (Sales Table)
CREATE TABLE IF NOT EXISTS t_sales (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  date BIGINT NOT NULL,
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION NOT NULL DEFAULT 0,
  gst_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  grand_total DOUBLE PRECISION NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  last_updated BIGINT NOT NULL
);

-- ७. खरेदी टेबल (Purchases Table)
CREATE TABLE IF NOT EXISTS t_purchases (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  supplier_id TEXT,
  supplier_name TEXT NOT NULL,
  invoice_number TEXT,
  date BIGINT NOT NULL,
  amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  last_updated BIGINT NOT NULL
);

-- ८. ऑडिट लॉग्स टेबल (Audit Logs)
CREATE TABLE IF NOT EXISTS t_audit_logs (
  id TEXT PRIMARY KEY,
  shop_id TEXT REFERENCES t_shops(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  "user" TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- 🔓 Row-Level Security (RLS) RLS disable to simplify initial connection
ALTER TABLE t_shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_user_accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE t_audit_logs DISABLE ROW LEVEL SECURITY;`;
                          navigator.clipboard.writeText(sqlCode);
                          alert("दुकान SQL कोड यशस्वीरित्या कॉपी केला! 📋");
                        }}
                        className="absolute top-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[10px] transition-colors"
                      >
                        📋 SQL कॉपी करा (Copy)
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 4: SETUP GUIDE */}
                {masterSbSubTab === 'guide' && (
                  <div className="bg-gray-50 p-5 rounded-2xl text-xs text-gray-700 leading-relaxed space-y-4 animate-fadeIn">
                    <div className="border-b pb-3 border-gray-200">
                      <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-1.5">
                        <span>👑</span> १. मास्टर अॅडमीन क्लाउड सेटअप (Master Admin Setup Guide):
                      </h4>
                      <ol className="list-decimal list-inside space-y-1.5 mt-2 text-[11.5px] text-gray-600 pl-1">
                        <li>
                          <strong>Supabase वर नवीन प्रोजेक्ट तयार करा:</strong> <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-700 font-bold underline">supabase.com</a> वर जाऊन विनामूल्य मास्टर प्रोजेक्ट तयार करा.
                        </li>
                        <li>
                          <strong>मास्टर SQL रन करा:</strong> वर उपलब्ध असलेला <strong>"👑 मास्टर SQL स्क्रिप्ट"</strong> मधील कोड कॉपी करा. Supabase च्या <code>SQL Editor</code> मध्ये पेस्ट करा आणि <code>RUN</code> वर क्लिक करा.
                        </li>
                        <li>
                          <strong>कनेक्ट करा:</strong> तुमच्या प्रोजेक्टचे URL आणि anon / public key वरील क्रेडेंशियल्समध्ये टाका आणि सुरक्षित सिंक सुरू करा.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-purple-900 text-sm flex items-center gap-1.5">
                        <span>🏬</span> २. दुकान मालकाचा स्वतंत्र डेटाबेस सेटअप (Shop Owner Setup Guide):
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                        कापड व्यवसायिकांचा डेटा सुरक्षित आणि स्वतंत्र ठेवण्यासाठी प्रत्येक दुकानाचा स्वतंत्र Supabase डेटाबेस असणे उत्तम आहे.
                      </p>
                      <ol className="list-decimal list-inside space-y-1.5 mt-2 text-[11.5px] text-gray-600 pl-1">
                        <li>
                          <strong>दुकानदारासाठी नवीन Supabase खाते/प्रोजेक्ट तयार करा.</strong>
                        </li>
                        <li>
                          <strong>दुकान SQL रन करा:</strong> वर उपलब्ध असलेला <strong>"🏬 दुकान SQL स्क्रिप्ट"</strong> कॉपी करून त्यांच्या डेटाबेसच्या <code>SQL Editor</code> मध्ये रन करा.
                        </li>
                        <li>
                          <strong>दुकान सेटिंग्जमध्ये जोडा:</strong> नवीन दुकानाच्या मालकाला त्यांची प्रोजेक्ट URL आणि Anon Key त्यांच्या ॲप मधील <strong>"⚙️ सेटिंग्ज" ➔ "Supabase क्लाउड सिंक"</strong> मध्ये पेस्ट करण्यास सांगा.
                        </li>
                      </ol>
                    </div>
                    <p className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      💡 टीप: स्वतंत्र डेटाबेस मॉडेलमुळे सर्व दुकानांचा स्वतःचा डेटा अत्यंत सुरक्षित आणि खाजगी राहतो. मास्टर डेटाबेस फक्त दुकानांची यादी आणि पासवर्ड सुरक्षित ठेवण्यास मदत करतो.
                    </p>
                  </div>
                )}
              </div>

              {/* Main admin workflow section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Forms column */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Form 1: Create Shop */}
                  <div className="bg-white rounded-2xl p-5 border border-forest-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5 border-b pb-2">
                      <span>🏪 नवीन दुकान जोडा</span>
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const sName = fd.get('shop_name') as string;
                      const sAddr = fd.get('shop_address') as string;
                      const sWhats = fd.get('shop_whats') as string;
                      const sUpi = fd.get('shop_upi') as string;
                      const sGst = fd.get('shop_gst') as string;
                      const sUrl = (fd.get('shop_sb_url') as string || '').trim();
                      const sKey = (fd.get('shop_sb_key') as string || '').trim();

                      const newShop: Shop = {
                        id: `shop-${Date.now()}`,
                        name: sName,
                        address: sAddr,
                        whatsNo: sWhats,
                        upiId: sUpi,
                        gstNumber: sGst,
                        sbUrl: sUrl || undefined,
                        sbKey: sKey || undefined,
                        created_at: Date.now()
                      };

                      const nextShops = [...shops, newShop];
                      setShops(nextShops);
                      localStorage.setItem('t_shops', JSON.stringify(nextShops));
                      addAuditLog(`नवीन दुकान जोडले: ${sName}`);
                      alert(`'${sName}' दुकान यशस्वीरित्या जोडले गेले!`);
                      e.currentTarget.reset();

                      if (autoSync && masterSbUrl && masterSbKey) {
                        uploadTableToSupabase('t_shops', nextShops);
                      }
                    }} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">दुकान नाव (Shop Name)</label>
                        <input type="text" name="shop_name" placeholder="उदा. माऊली कलेक्शन" className="w-full border p-2 rounded-lg font-bold text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">पत्ता (Address)</label>
                        <input type="text" name="shop_address" placeholder="उदा. येवला रोड, नाशिक" className="w-full border p-2 rounded-lg text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">व्हॉट्सॲप क्रमांक (WhatsApp No.)</label>
                        <input type="text" name="shop_whats" placeholder="9876543210" className="w-full border p-2 rounded-lg text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">UPI आयडी (UPI ID for QR Code)</label>
                        <input type="text" name="shop_upi" placeholder="pay@upi" className="w-full border p-2 rounded-lg text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">GST क्रमांक (GST No. - ऐच्छिक)</label>
                        <input type="text" name="shop_gst" placeholder="उदा. 27AAA..." className="w-full border p-2 rounded-lg uppercase text-gray-800" />
                      </div>
                      <div className="space-y-1 border-t pt-2 mt-2">
                        <label className="font-bold text-purple-700 block">Supabase Project URL (स्वतंत्र डेटाबेस - ऐच्छिक)</label>
                        <input type="text" name="shop_sb_url" placeholder="https://your-shop-project.supabase.co" className="w-full border p-2 rounded-lg text-gray-800 font-mono text-[11px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-purple-700 block">Supabase Anon Key (स्वतंत्र डेटाबेस - ऐच्छिक)</label>
                        <input type="text" name="shop_sb_key" placeholder="eyJhbGciOi..." className="w-full border p-2 rounded-lg text-gray-800 font-mono text-[11px]" />
                      </div>
                      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition-colors">
                        ➕ दुकान तयार करा (Add Shop)
                      </button>
                    </form>
                  </div>

                  {/* Form 2: Create Shop Admin User */}
                  <div className="bg-white rounded-2xl p-5 border border-forest-100 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5 border-b pb-2">
                      <span>🔐 नवीन चालक / कर्मचारी खाते</span>
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const targetShop = fd.get('user_shop_id') as string;
                      const uName = (fd.get('user_name') as string).trim().toLowerCase();
                      const uPass = fd.get('user_pass') as string;
                      const uRole = fd.get('user_role') as UserRole;
                      const uEmail = (fd.get('user_email') as string || '').trim().toLowerCase();

                      if (users.some(u => u.username.toLowerCase() === uName)) {
                        alert("❌ या नावाचे वापरकर्ता खाते आधीपासूनच अस्तित्वात आहे!");
                        return;
                      }

                      const newUser: UserAccount = {
                        id: `user-${Date.now()}`,
                        username: uName,
                        password: uPass,
                        role: uRole,
                        shopId: targetShop,
                        email: uEmail || undefined
                      };

                      const nextUsers = [...users, newUser];
                      setUsers(nextUsers);
                      localStorage.setItem('t_users', JSON.stringify(nextUsers));
                      
                      const associatedShop = shops.find(s => s.id === targetShop);
                      addAuditLog(`नवीन वापरकर्ता ${uName} (${uRole}) दुकान ${associatedShop?.name || ''} साठी जोडला`);
                      alert(`वापरकर्ता '${uName}' यशस्वीरित्या जोडला गेला!`);
                      e.currentTarget.reset();

                      if (autoSync && masterSbUrl && masterSbKey) {
                        uploadTableToSupabase('t_user_accounts', nextUsers);
                      }
                    }} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">दुकान निवडा (Select Shop)</label>
                        <select name="user_shop_id" className="w-full border p-2 rounded-lg font-bold bg-white text-gray-800" required>
                          {shops.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">वापरकर्तानाव (Username)</label>
                        <input type="text" name="user_name" placeholder="उदा. ganesh_admin" className="w-full border p-2 rounded-lg font-bold text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">पासवर्ड (Password)</label>
                        <input type="text" name="user_pass" placeholder="उदा. ganesh123" className="w-full border p-2 rounded-lg font-bold text-gray-800" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">ईमेल आयडी (Email ID - Optional)</label>
                        <input type="email" name="user_email" placeholder="उदा. admin@example.com" className="w-full border p-2 rounded-lg text-gray-800" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block">भूमिका (User Role)</label>
                        <select name="user_role" className="w-full border p-2 rounded-lg bg-white font-bold text-gray-800" required>
                          <option value="SHOP_ADMIN">🏬 SHOP_ADMIN (दुकान मालक)</option>
                          <option value="EMPLOYEE">🧑‍💼 EMPLOYEE (कर्मचारी)</option>
                        </select>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors">
                        🔐 खाते तयार करा (Create Account)
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right registered Shops column */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-forest-100 shadow-sm">
                    <h3 className="font-extrabold text-sm text-gray-800 mb-4 border-b pb-2">🏬 नोंदणीकृत दुकाने आणि खाती (Registered Shops Inventory)</h3>
                    
                    <div className="space-y-4">
                      {shops.map(s => {
                        return (
                          <div 
                            key={s.id} 
                            className="p-5 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/20 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl shadow-inner">
                                🏬
                              </div>
                              <div>
                                <h4 className="font-extrabold text-purple-950 text-sm tracking-tight">{s.name}</h4>
                                <p className="text-[10px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                                  <span>🔒</span> डेटा सुरक्षितता सक्रिय (Data Security Lock Active)
                                </p>
                              </div>
                            </div>
                            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-black">
                              🟢 सक्रीय भाडेकरू (Active Tenant)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shop Admin Password Reset Card for Master Admin */}
                  <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <span className="text-xl">🔑</span>
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-800">
                          दुकान चालक पासवर्ड रिसेट (Shop Admin Password Reset)
                        </h3>
                        <p className="text-[10px] text-gray-500">मास्टर अॅडमीन म्हणून तुम्ही कोणत्याही दुकान मालक (Shop Admin) चा पासवर्ड थेट रिसेट करू शकता.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {users.filter(u => u.role === 'SHOP_ADMIN').length === 0 ? (
                        <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-bold">
                          ⚠️ सध्या कोणतीही दुकान चालक खाती अस्तित्वात नाहीत.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {users.filter(u => u.role === 'SHOP_ADMIN').map(adminUser => {
                            const shop = shops.find(s => s.id === adminUser.shopId);
                            return (
                              <div key={adminUser.id} className="p-3 rounded-xl border border-purple-100 bg-purple-50/30 flex flex-col justify-between gap-2.5">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-xs text-purple-950">👤 {adminUser.username}</span>
                                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">
                                      चालक (Admin)
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 font-bold">🏪 दुकान: {shop?.name || 'अज्ञात दुकान'}</p>
                                  {adminUser.email && (
                                    <p className="text-[10px] text-gray-400 font-mono">📧 {adminUser.email}</p>
                                  )}
                                  <p className="text-[10px] text-gray-600 font-medium">
                                    सध्याचा पासवर्ड: <span className="font-mono font-bold text-indigo-700 bg-white border px-1.5 py-0.5 rounded">{adminUser.password || 'N/A'}</span>
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    const nextPass = prompt(`'${adminUser.username}' साठी नवीन पासवर्ड टाका:`, adminUser.password);
                                    if (nextPass !== null) {
                                      const trimmed = nextPass.trim();
                                      if (!trimmed) {
                                        alert("❌ पासवर्ड रिकामा असू शकत नाही!");
                                        return;
                                      }
                                      const nextUsers = users.map(u => u.id === adminUser.id ? { ...u, password: trimmed } : u);
                                      setUsers(nextUsers);
                                      localStorage.setItem('t_users', JSON.stringify(nextUsers));
                                      addAuditLog(`मास्टर अॅडमीनने ${adminUser.username} चा पासवर्ड रिसेट केला`);
                                      alert(`👤 '${adminUser.username}' चा पासवर्ड यशस्वीरित्या बदलून '${trimmed}' करण्यात आला आहे!`);

                                      if (autoSync && masterSbUrl && masterSbKey) {
                                        uploadTableToSupabase('t_user_accounts', nextUsers);
                                      }
                                    }
                                  }}
                                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] py-1.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1"
                                >
                                  🔐 पासवर्ड रिसेट करा (Reset Password)
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Software Developer Footer Branding */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400 font-bold no-print">
            <span>© {new Date().getFullYear()} सर्व हक्क सुरक्षित.</span>
            <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-gray-500 hover:text-forest-600 hover:bg-forest-50/50 transition-all">
              <span>💻</span> Software by: <strong className="text-forest-700">Raghvendra Traders and Devolopers Latur</strong> <span className="text-gray-300">|</span> 📞 <a href="tel:8080003689" className="text-blue-600 hover:underline">8080003689</a>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-forest-100 shadow-lg py-2 flex justify-around z-40">
        {[
          { id: 'home', icon: TrendingUp, label: '📊 ' + Loc.t('home', lang) },
          { id: 'billing', icon: ShoppingBag, label: '🛍️ ' + Loc.t('billing', lang) },
          { id: 'stock', icon: Boxes, label: '📦 ' + Loc.t('stock', lang) },
          { id: 'reports', icon: FileText, label: '📑 ' + Loc.t('reports', lang) },
          ...(role === 'MASTER_ADMIN' ? [{ id: 'shops', icon: Settings, label: '🏬 ' + (lang === 'ENGLISH' ? 'Shop Management' : 'दुकाने') }] : [{ id: 'settings', icon: Settings, label: '⚙️ ' + Loc.t('settings', lang) }]),
        ].filter(item => {
          if (role === 'MASTER_ADMIN') {
            return item.id === 'shops';
          } else {
            return item.id !== 'shops';
          }
        }).map(item => {
          const isSel = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className="flex flex-col items-center gap-1 text-[10px] font-bold"
            >
              <div className={`p-1.5 px-3.5 rounded-full transition-all relative ${
                isSel ? 'bg-forest-100 text-forest-700' : 'text-gray-500'
              }`}>
                <item.icon className="w-5 h-5" />
                {item.id === 'stock' && lowStockCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-white">
                    {lowStockCount}
                  </span>
                )}
              </div>
              <span className={isSel ? 'text-forest-700' : 'text-gray-500'}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* DIALOGS & OVERLAYS */}

      {/* DIALOG: Low Stock Warning Dedicated Notification UI */}
      {showLowStockOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-red-200 p-6 w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Visual Header Indicator Banner */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-600"></div>
            
            <div className="flex items-center gap-3 mt-2 mb-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-extrabold text-base text-red-950">स्टॉक इशारा (LOW STOCK ALERT!)</h3>
                <p className="text-[11px] text-red-600 font-bold">विक्री व्यवहारादरम्यान काही कापड माल किमान मर्यादेखाली गेला आहे!</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 font-medium leading-relaxed">
              खालील कापड उत्पादनांचा शिल्लक साठा खूप कमी झाला आहे. भविष्यातील ग्राहकांसाठी कृपया लवकरात लवकर खरेदी करा:
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
              {justTriggeredLowStock.map((item, idx) => (
                <div key={idx} className="bg-red-50/70 border border-red-100 rounded-xl p-3 flex justify-between items-center">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-extrabold text-gray-800 text-xs truncate">{item.productName}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">किमान मर्यादा: {item.minStock} नग</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                      फक्त {item.remainingStock} नग शिल्लक
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setShowLowStockOverlay(false);
                  setActiveTab('stock');
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                📦 साठा व्यवस्थापित करा (Manage Stock)
              </button>
              <button
                onClick={() => setShowLowStockOverlay(false)}
                className="sm:px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
              >
                बंद करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG: Add Product */}
      {showAddProd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-gray-800 border-b pb-3 mb-4">नवीन कापड उत्पादन जोडा</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-600 block">उत्पादनाचे नाव (Saree / Kurti Name)</label>
                <input type="text" name="name" placeholder="उदा. पैठणी साडी - महारानी" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">श्रेणी (Category)</label>
                <select name="category" className="w-full border p-2 rounded-lg">
                  <option>साड्या (Sarees)</option>
                  <option>कुर्ती (Kurtis)</option>
                  <option>लेहेंगा (Lehengas)</option>
                  <option>पुरुष कपडे (Menswear)</option>
                  <option>लहान मुलांचे कपडे (Kidswear)</option>
                  <option>इतर कापड (Uncategorized)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">कापड प्रकार (Fabric Type)</label>
                <input type="text" name="fabric" placeholder="उदा. सिल्क, कॉटन" className="w-full border p-2 rounded-lg animate-pulse" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">खरेदी किंमत दर (Purchase Price)</label>
                <input type="number" name="purchase_price" placeholder="उदा. १५००" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">विक्री किंमत दर (Selling Price)</label>
                <input type="number" name="selling_price" placeholder="उदा. २५००" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">एमआरपी (MRP Price)</label>
                <input type="number" name="mrp" placeholder="उदा. ३००0" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">अॅपमधील जीएसटी % (GST)</label>
                <input type="number" name="gst_percent" defaultValue="5" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">स्टॉक नग प्रमाण (Stock Qty)</label>
                <input type="number" name="stock_quantity" placeholder="उदा. १०" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">किमान स्टॉक मर्यादा (Min alert)</label>
                <input type="number" name="min_stock" defaultValue="5" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">रंग (Color)</label>
                <input type="text" name="color" placeholder="उदा. लाल" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">आकार (Size)</label>
                <input type="text" name="size" placeholder="उदा. XL, प्रमाणित" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">रॅक नंबर (Rack Number)</label>
                <input type="text" name="rack_number" placeholder="उदा. A-1, B-3" className="w-full border p-2 rounded-lg" />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 border-t pt-3 mt-2">
                <button type="button" onClick={() => setShowAddProd(false)} className="px-4 py-2 border rounded-xl text-gray-600">रद्द करा</button>
                <button type="submit" className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold">जतन करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: Add Customer */}
      {showAddCust && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-md shadow-xl text-xs">
            <h3 className="font-bold text-base text-gray-800 border-b pb-3 mb-4">नवीन ग्राहक जोडा</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">ग्राहकाचे नाव (Customer Name)</label>
                <input type="text" name="name" placeholder="उदा. राहुल कुलकर्णी" className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">मोबाईल क्रमांक (Mobile)</label>
                <input type="text" name="mobile" placeholder="उदा. ९८७६५४३२१०" className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">पत्ता (Address)</label>
                <input type="text" name="address" placeholder="उदा. शनिवार पेठ" className="w-full border p-2 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">प्रारंभिक उधारी रक्कम (Outstanding)</label>
                <input type="number" name="outstanding_balance" defaultValue="0" className="w-full border p-2 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowAddCust(false)} className="px-4 py-2 border rounded-xl text-gray-600">रद्द करा</button>
                <button type="submit" className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold">ग्राहक जोडा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: Add Supplier */}
      {showAddSupp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-md shadow-xl text-xs">
            <h3 className="font-bold text-base text-gray-800 border-b pb-3 mb-4">नवीन सप्लायर जोडा</h3>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">सप्लायर / मिल नाव (Supplier Name)</label>
                <input type="text" name="name" placeholder="उदा. कोठारी सिल्क मिल" className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">मोबाईल संपर्क (Mobile Contact)</label>
                <input type="text" name="contact" placeholder="उदा. ९८७६५..." className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">जीएसटी क्रमांक (GSTIN)</label>
                <input type="text" name="gst_number" placeholder="२४एएए..." className="w-full border p-2 rounded-lg" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">प्रारंभिक देय बाकी (Pending Balance)</label>
                <input type="number" name="pending_payment" defaultValue="0" className="w-full border p-2 rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowAddSupp(false)} className="px-4 py-2 border rounded-xl text-gray-600">रद्द करा</button>
                <button type="submit" className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold">जतन करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: Record Purchase inward */}
      {showPurchaseDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-md shadow-xl text-xs">
            <h3 className="font-bold text-base text-gray-800 border-b pb-3 mb-4">नवीन माल खरेदी नोंदणी (Purchase Inward)</h3>
            <form onSubmit={handleRecordPurchase} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">सप्लायर निवडा (Select Supplier)</label>
                <select name="supplier_id" className="w-full border p-2 rounded-lg" required>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">सप्लायर बिल क्रमांक (Invoice No)</label>
                <input type="text" name="invoice_number" placeholder="उदा. SPL-123" className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">एकूण खरेदी रक्कम (Total Bill Amount)</label>
                <input type="number" name="amount" placeholder="उदा. १५०००" className="w-full border p-2 rounded-lg" required />
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowPurchaseDialog(false)} className="px-4 py-2 border rounded-xl text-gray-600">रद्द करा</button>
                <button type="submit" className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold">नोंद करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: Quick Stock Adjustment */}
      {showStockAdjust && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-md shadow-xl text-xs">
            <h3 className="font-bold text-base text-gray-800 border-b pb-3 mb-4">स्टॉक ऍडजस्ट करा (Quick Adjustment)</h3>
            <form onSubmit={handleStockAdjust} className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">उत्पादन निवडा (Product)</label>
                <select name="product_id" className="w-full border p-2 rounded-lg" required>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (स्टॉक: {p.stock_quantity})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">प्रकार (Adjustment Type)</label>
                <select name="type" className="w-full border p-2 rounded-lg">
                  <option value="IN">स्टॉक आवक वाढवा (IN)</option>
                  <option value="OUT">स्टॉक कमी करा (OUT)</option>
                  <option value="DAMAGED">खराब/डॅमेज माल कमी करा (DAMAGED)</option>
                  <option value="ADJUSTMENT">नवीन मूल्य सेट करा (RESET)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">नग प्रमाण (Quantity)</label>
                <input type="number" name="adjust_qty" placeholder="नग" className="w-full border p-2 rounded-lg" required />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button type="button" onClick={() => setShowStockAdjust(false)} className="px-4 py-2 border rounded-xl text-gray-600">रद्द करा</button>
                <button type="submit" className="px-4 py-2 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold">बदल जतन करा</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG: Barcode Generator */}
      {showBarcodeDialog && selectedBarcodeProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn no-print">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 w-full max-w-4xl shadow-2xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto text-xs">
            {/* Left: Settings Panel */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <div className="p-2 bg-forest-100 text-forest-700 rounded-xl">
                  <BarcodeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-800">बारकोड लेबल जनरेटर (Barcode Studio)</h3>
                  <p className="text-[10px] text-gray-500">उत्पादनांसाठी चिकटवण्यासाठी बारकोड लेबल्स तयार करा</p>
                </div>
              </div>

              {/* Product Card Info */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-1">
                <span className="text-[9px] bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded font-bold uppercase">{selectedBarcodeProduct.category}</span>
                <h4 className="font-bold text-gray-800 text-xs mt-1">{selectedBarcodeProduct.name}</h4>
                <p className="text-[10px] text-gray-500">आयडी (ID): <span className="font-mono font-bold">{selectedBarcodeProduct.id}</span></p>
              </div>

              {/* Print Quantity */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-600 block">प्रिंट करायची संख्या (Print Quantity)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={barcodePrintQty}
                    onChange={(e) => setBarcodePrintQty(Math.max(1, Number(e.target.value)))}
                    className="w-20 border p-2 rounded-xl text-center font-bold text-sm"
                  />
                  <div className="flex gap-1.5 flex-wrap">
                    {[4, 12, 24, 48].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setBarcodePrintQty(qty)}
                        className={`px-3 py-1.5 rounded-lg font-bold border text-[10px] transition-all ${
                          barcodePrintQty === qty
                            ? 'bg-forest-500 text-white border-forest-500 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {qty} लेबल्स
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Design Toggles */}
              <div className="space-y-2 border-t pt-3">
                <h5 className="font-bold text-gray-700">लेबल डिझाईन पर्याय (Label Content):</h5>
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={showBarcodeShopName}
                      onChange={(e) => setShowBarcodeShopName(e.target.checked)}
                      className="rounded border-gray-300 text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">दुकान नाव (Shop Name)</span>
                  </label>

                  <label className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={showBarcodeProdName}
                      onChange={(e) => setShowBarcodeProdName(e.target.checked)}
                      className="rounded border-gray-300 text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">उत्पादन नाव (Product Name)</span>
                  </label>

                  <label className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={showBarcodePrice}
                      onChange={(e) => setShowBarcodePrice(e.target.checked)}
                      className="rounded border-gray-300 text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">किंमत आणि MRP (Price)</span>
                  </label>

                  <label className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={showBarcodeAttrs}
                      onChange={(e) => setShowBarcodeAttrs(e.target.checked)}
                      className="rounded border-gray-300 text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="font-medium text-gray-700">रंग व आकार (Attributes)</span>
                  </label>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-[10px] text-amber-800 space-y-1">
                <p className="font-bold">💡 प्रिंटर टीप:</p>
                <p>उत्तम रिझोल्यूशनसाठी, प्रिंटरच्या सेटिंग्जमध्ये 'Scale' 100% ठेवा आणि 'Headers & Footers' बंद करा.</p>
              </div>

              <div className="flex gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowBarcodeDialog(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addAuditLog(`बारकोड प्रिंट केले: ${selectedBarcodeProduct.name} - ${barcodePrintQty} प्रती`);
                    window.print();
                  }}
                  className="flex-1 py-2.5 bg-forest-500 hover:bg-forest-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md text-xs"
                >
                  <Printer className="w-4 h-4" /> प्रिंट काढा (Print)
                </button>
              </div>
            </div>

            {/* Right: Preview Panel */}
            <div className="w-full md:w-[360px] bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center">
              <h4 className="font-bold text-[10px] text-gray-500 mb-3 uppercase tracking-wider">लेबल पूर्वदृश्य (Live Preview)</h4>
              
              {/* Single Label Card Preview */}
              <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-lg w-64 h-64 relative">
                <div className="absolute top-2 right-2 text-[8px] font-black text-forest-500 bg-forest-50 px-1 py-0.5 rounded">PREVIEW</div>
                
                {showBarcodeShopName && (
                  <p className="text-[10px] font-black text-forest-700 uppercase tracking-wide border-b border-gray-100 pb-1 w-full text-center truncate">
                    {shopName}
                  </p>
                )}

                <div className="flex-1 flex flex-col items-center justify-center py-2 w-full">
                  {showBarcodeProdName && (
                    <p className="text-[11px] font-bold text-gray-800 line-clamp-2 w-full text-center leading-tight">
                      {selectedBarcodeProduct.name}
                    </p>
                  )}

                  {showBarcodeAttrs && (selectedBarcodeProduct.size || selectedBarcodeProduct.color) && (
                    <p className="text-[9px] text-gray-500 mt-1">
                      {[
                        selectedBarcodeProduct.size ? `आकार: ${selectedBarcodeProduct.size}` : '',
                        selectedBarcodeProduct.color ? `रंग: ${selectedBarcodeProduct.color}` : ''
                      ].filter(Boolean).join(' | ')}
                    </p>
                  )}

                  <div className="my-3 p-1 bg-white border border-gray-100 rounded">
                    <Barcode value={selectedBarcodeProduct.id} width={1.2} height={40} />
                  </div>
                </div>

                {showBarcodePrice && (
                  <div className="border-t border-gray-100 pt-2 w-full text-center">
                    <span className="text-[8px] text-gray-400 block">विक्री किंमत</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-black text-forest-600">₹{selectedBarcodeProduct.selling_price}</span>
                      {selectedBarcodeProduct.mrp > selectedBarcodeProduct.selling_price && (
                        <span className="text-xs text-gray-400 line-through">₹{selectedBarcodeProduct.mrp}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-3">A4 किंवा ३x२ इंच लेबल शीटवर सुसंगत</p>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY AREA FOR BARCODES */}
      {showBarcodeDialog && selectedBarcodeProduct && (
        <div className="hidden print-only bg-white text-black p-4">
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: barcodePrintQty }).map((_, i) => (
              <div key={i} className="label-card border border-gray-400 p-4 flex flex-col items-center justify-center text-center rounded-lg bg-white text-black h-48 w-48 mx-auto">
                {showBarcodeShopName && (
                  <p className="text-[10px] font-bold text-black uppercase line-clamp-1 border-b border-gray-200 pb-1 w-full tracking-wide">
                    {shopName}
                  </p>
                )}
                {showBarcodeProdName && (
                  <p className="text-[10px] font-bold text-gray-900 mt-1.5 line-clamp-2 w-full text-center leading-tight">
                    {selectedBarcodeProduct.name}
                  </p>
                )}
                {showBarcodeAttrs && (selectedBarcodeProduct.size || selectedBarcodeProduct.color) && (
                  <p className="text-[8px] text-gray-700 mt-1">
                    {[
                      selectedBarcodeProduct.size ? `आकार: ${selectedBarcodeProduct.size}` : '',
                      selectedBarcodeProduct.color ? `रंग: ${selectedBarcodeProduct.color}` : ''
                    ].filter(Boolean).join(' | ')}
                  </p>
                )}
                
                <div className="my-3 flex items-center justify-center bg-white p-1 rounded">
                  <Barcode value={selectedBarcodeProduct.id} width={1.2} height={38} />
                </div>

                {showBarcodePrice && (
                  <div className="text-center w-full mt-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-[11px] font-extrabold text-black">₹{selectedBarcodeProduct.selling_price}</span>
                      {selectedBarcodeProduct.mrp > selectedBarcodeProduct.selling_price && (
                        <span className="text-[9px] text-gray-500 line-through">₹{selectedBarcodeProduct.mrp}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINT-ONLY AREA FOR INVOICE */}
      {!showBarcodeDialog && completedInvoice && (
        <div className="hidden print-only bg-white text-black p-4 w-full">
          <div className="thermal-receipt mx-auto bg-white p-2 text-black font-mono">
            {/* Header */}
            <div className="text-center space-y-1 pb-2">
              <h2 className="text-base font-black tracking-tight uppercase border-b-2 border-black pb-1">
                {shopName}
              </h2>
              <p className="text-[11px] font-bold">कापडाचे भव्यदालन (Premium Apparel)</p>
              <p className="text-[10px] leading-tight max-w-[240px] mx-auto">{shopAddress}</p>
              <p className="text-[10px] font-bold">मोबाईल (Mob): +91 {whatsNo}</p>
              {gstNumber && <p className="text-[10px] font-bold">GSTIN: {gstNumber}</p>}
              <div className="text-[11px] font-bold border-y border-dashed border-black py-1 my-2">
                टॅक्स इनव्हॉइस / TAX INVOICE
              </div>
            </div>

            {/* Bill Info Grid */}
            <div className="text-[10px] space-y-1 pb-2 border-b border-dashed border-black">
              <div className="flex justify-between">
                <span>बिल क्र (Bill No): <strong>{completedInvoice.invoice_number}</strong></span>
                <span>दिनांक (Date): {new Date(completedInvoice.date).toLocaleDateString('mr-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>वेळ (Time): {new Date(completedInvoice.date).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                <span>पेमेंट (Pay): <strong>{completedInvoice.payment_mode}</strong></span>
              </div>
              <div className="border-t border-dotted border-gray-400 pt-1 mt-1">
                <p>ग्राहक (Customer): <strong>{completedInvoice.customer_name}</strong></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="text-[10px] my-2 w-full">
              <thead>
                <tr className="border-b border-dashed border-black font-bold">
                  <th className="py-1 w-1/2 text-left">तपशील (Item Description)</th>
                  <th className="py-1 w-1/6 text-right">दर (Rate)</th>
                  <th className="py-1 w-1/6 text-center">नग (Qty)</th>
                  <th className="py-1 w-1/6 text-right">एकूण (Total)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dotted divide-gray-400">
                {cartItems.map((item, idx) => {
                  const unitRate = item.product.selling_price - item.discount;
                  const itemTotal = unitRate * item.quantity;
                  return (
                    <tr key={idx} className="py-1">
                      <td className="py-1 text-left font-semibold">
                        <div>{item.product.name}</div>
                        {(item.product.size || item.product.color) ? (
                          <div className="text-[9px] text-gray-700 font-normal">
                            {[
                              item.product.size ? `आकार: ${item.product.size}` : '',
                              item.product.color ? `रंग: ${item.product.color}` : ''
                            ].filter(Boolean).join(', ')}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-1 text-right">₹{unitRate.toFixed(0)}</td>
                      <td className="py-1 text-center font-bold">{item.quantity}</td>
                      <td className="py-1 text-right font-bold">₹{itemTotal.toFixed(0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Billing calculations */}
            <div className="border-t border-dashed border-black pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>एकूण वस्तू (Total Items):</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} नग</span>
              </div>
              <div className="flex justify-between">
                <span>उप-एकूण (Sub Total):</span>
                <span>₹{completedInvoice.total_amount.toFixed(2)}</span>
              </div>
              {completedInvoice.discount > 0 && (
                <div className="flex justify-between font-semibold text-black">
                  <span>खास सवलत (Discount):</span>
                  <span>-₹{completedInvoice.discount.toFixed(2)}</span>
                </div>
              )}
              {completedInvoice.gst_amount > 0 && (
                <>
                  <div className="flex justify-between text-[10px]">
                    <span>CGST (2.5%):</span>
                    <span>₹{(completedInvoice.gst_amount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>SGST (2.5%):</span>
                    <span>₹{(completedInvoice.gst_amount / 2).toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {/* Grand Total */}
              <div className="flex justify-between font-black text-xs border-y-2 border-double border-black py-1.5 my-1.5">
                <span>एकूण देय (GRAND TOTAL):</span>
                <span>₹{completedInvoice.grand_total.toFixed(2)}/-</span>
              </div>
            </div>

            {/* UPI QR or payment status message */}
            {completedInvoice.payment_mode === 'UPI' && upiId && (
              <div className="my-3 py-2 border border-black rounded-lg text-center space-y-1">
                <p className="text-[9px] font-bold">BHIM UPI पेमेंट करा</p>
                <p className="text-[10px] font-mono font-bold text-gray-800">{upiId}</p>
                <p className="text-[8px] text-gray-500">Scan QR at the counter to pay</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="text-[9px] text-gray-800 space-y-0.5 mt-4 pt-2 border-t border-dotted border-black leading-tight">
              <p className="font-bold border-b border-black pb-0.5 mb-1">टीप आणि अटी (Terms & Conditions):</p>
              <p>१) विकलेला माल बदलून मिळण्याची वेळ सकाळी ११ ते सायं ५.</p>
              <p>२) बदलून आणताना मूळ बिल सोबत आणणे बंधनकारक आहे.</p>
              <p>३) धुतलेले किंवा वापरलेले कापड बदलून मिळणार नाही.</p>
              <p>४) खरेदीनंतर ८ दिवसांच्या आतच कपडे बदलून मिळतील.</p>
            </div>

            {/* Greeting footer */}
            <div className="text-center pt-4 border-t border-dashed border-black mt-4 space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest">!!! धन्यवाद !!!</p>
              <p className="text-[10px]">भेट दिल्याबद्दल धन्यवाद! पुन्हा अवश्य यावे.</p>
              <p className="text-[8px] text-gray-400 pt-2 border-t border-dotted border-gray-300">Powered by Mauli Garments billing</p>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY AREA FOR MONTHLY REPORT */}
      {showMonthlyReportPrint && monthlyStats.length > 0 && (
        <div className="hidden print-only bg-white text-black p-8 w-full max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black uppercase tracking-wider border-b-4 border-black pb-2">{shopName}</h1>
            <p className="text-sm font-bold mt-2">मासिक अहवाल (Monthly Business Report)</p>
            <p className="text-xs mt-1">दिनांक: {new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | वेळ: {new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border-2 border-black p-3 text-center">
              <p className="text-xs font-bold uppercase mb-1">एकूण विक्री (Total Sales)</p>
              <p className="text-xl font-black">₹{totalSalesVal.toFixed(0)}</p>
            </div>
            <div className="border-2 border-black p-3 text-center">
              <p className="text-xs font-bold uppercase mb-1">अंदाजित नफा (Total Profit)</p>
              <p className="text-xl font-black">₹{estimatedProfit.toFixed(0)}</p>
            </div>
            <div className="border-2 border-black p-3 text-center">
              <p className="text-xs font-bold uppercase mb-1">एकूण थकबाकी (Total Pending)</p>
              <p className="text-xl font-black">₹{totalOutstanding.toFixed(0)}</p>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">महिना (Month)</th>
                <th className="border border-black p-2 text-right">एकूण विक्री (Sales)</th>
                <th className="border border-black p-2 text-right">नफा (Profit - 35%)</th>
                <th className="border border-black p-2 text-right">थकबाकी (Pending)</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat, i) => (
                <tr key={stat.monthKey} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-black p-2 font-bold">{stat.monthLabel}</td>
                  <td className="border border-black p-2 text-right">₹{stat.totalSales.toFixed(0)}</td>
                  <td className="border border-black p-2 text-right">₹{stat.totalProfit.toFixed(0)}</td>
                  <td className="border border-black p-2 text-right text-red-600 font-bold">₹{stat.pendingCollections.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-12 flex justify-between border-t border-black pt-2 text-xs font-bold">
            <p>Generated by: {role} ({currentUser?.username || 'Admin'})</p>
            <p>Authorised Signatory</p>
          </div>
        </div>
      )}
    </div>
  );
}
