export interface Product {
  id: string;
  name: string;
  category: string;
  sub_category?: string;
  brand?: string;
  supplier_id?: string;
  purchase_price: number;
  selling_price: number;
  mrp: number;
  discount: number;
  gst_percent: number;
  color?: string;
  size?: string;
  pattern?: string;
  fabric?: string;
  hsn_code?: string;
  stock_quantity: number;
  min_stock: number;
  rack_number?: string;
  remarks?: string;
  image_url?: string;
  last_updated: number;
  is_deleted?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  outstanding_balance: number;
  last_updated: number;
  is_deleted?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  gst_number?: string;
  pending_payment: number;
  last_updated: number;
  is_deleted?: boolean;
}

export interface Sale {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name: string;
  date: number;
  total_amount: number;
  discount: number;
  gst_amount: number;
  grand_total: number;
  payment_mode: 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'SPLIT';
  payment_status: 'PAID' | 'PENDING';
  last_updated: number;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplier_id: string;
  supplier_name: string;
  invoice_number?: string;
  date: number;
  amount: number;
  last_updated: number;
}

export interface StockTransaction {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'DAMAGED' | 'RETURNED';
  quantity: number;
  date: number;
  remarks?: string;
  last_updated: number;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: number;
}

export type Language = 'MARATHI' | 'HINDI' | 'ENGLISH';
export type UserRole = 'MASTER_ADMIN' | 'SHOP_ADMIN' | 'EMPLOYEE';

export interface Shop {
  id: string;
  name: string;
  address: string;
  whatsNo: string;
  upiId: string;
  gstNumber?: string;
  created_at: number;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  shopId: string | null; // null for MASTER_ADMIN
  email?: string; // Optional email for password change via OTP
  session_token?: string;
  last_updated?: number;
}
