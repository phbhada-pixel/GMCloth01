import React, { useMemo } from 'react';
import { useAuth } from '../components/AuthProvider';
import { LogOut, Bell, TrendingUp, Users, FileText, AlertCircle, Search, Menu, Package, DollarSign } from 'lucide-react';

const STATS = [
  { label: 'Total Revenue', value: '$24,592.00', trend: '+12.5%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { label: 'Active Invoices', value: '142', trend: '+4.2%', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { label: 'Total Customers', value: '1,204', trend: '+18.1%', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
];

const RECENT_INVOICES = [
  { id: '#INV-2023-001', client: 'Acme Corp', amount: '$1,200.00', status: 'Paid', statusClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: '#INV-2023-002', client: 'Globex Inc', amount: '$3,450.00', status: 'Pending', statusClass: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: '#INV-2023-003', client: 'Soylent Corp', amount: '$850.00', status: 'Overdue', statusClass: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  { id: '#INV-2023-004', client: 'Initech', amount: '$2,100.00', status: 'Paid', statusClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
];

const INVENTORY_ALERTS = [
  { item: 'MacBook Pro 16"', stock: '2 units left', urgency: 'high' },
  { item: 'Ergonomic Chair', stock: '5 units left', urgency: 'medium' },
  { item: 'Wireless Mouse', stock: '8 units left', urgency: 'low' },
];

const NAV_LINKS = [
  { icon: FileText, label: 'Overview', active: true },
  { icon: Package, label: 'Inventory', active: false },
  { icon: DollarSign, label: 'Invoices', active: false },
  { icon: Users, label: 'Customers', active: false },
];

export default function Dashboard() {
  const { session, supabase } = useAuth();
  
  const handleLogout = async () => {
    await supabase?.auth.signOut();
  };

  const userEmail = useMemo(() => session?.user?.email || 'User', [session?.user?.email]);
  const userName = useMemo(() => userEmail.split('@')[0], [userEmail]);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-['Space_Grotesk'] overflow-hidden selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus Retail</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_LINKS.map((item, idx) => (
            <a 
              key={idx}
              href="#" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col truncate pr-2">
              <span className="text-sm font-medium text-white truncate">{userName}</span>
              <span className="text-xs text-slate-400 truncate">Pro Plan</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 hover:bg-rose-500/10 rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search invoices, clients..." 
                className="w-64 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-md">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{userName}</span>
                </h1>
                <p className="text-slate-400 max-w-xl">
                  Here's what's happening with your workspace today. You have 3 pending invoices and 2 inventory alerts to review.
                </p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
            </section>

            {/* Stats Row */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STATS.map((stat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg flex items-start gap-4 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend} from last month
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Grid Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Recent Invoices */}
              <section className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-200">Recent Invoices</h2>
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View all</button>
                </div>
                
                <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">Invoice ID</th>
                        <th className="px-6 py-4 font-medium">Client</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {RECENT_INVOICES.map((invoice, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-200">{invoice.id}</td>
                          <td className="px-6 py-4 text-slate-300">{invoice.client}</td>
                          <td className="px-6 py-4 font-medium text-slate-200">{invoice.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${invoice.statusClass}`}>
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Inventory Alerts */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-200">Inventory Alerts</h2>
                </div>
                
                <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
                  {INVENTORY_ALERTS.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className={`mt-0.5 p-2 rounded-lg border ${
                        alert.urgency === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        alert.urgency === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 mb-1">{alert.item}</p>
                        <p className="text-xs text-slate-400">Low stock: <span className="font-medium text-slate-300">{alert.stock}</span></p>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full mt-2 py-3 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    View all inventory
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
