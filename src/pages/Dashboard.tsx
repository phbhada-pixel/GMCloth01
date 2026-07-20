import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  Menu,
  X,
  TrendingUp, Users,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { session, supabase } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  const userEmail = session?.user?.email || 'Guest User';

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: FileText, label: 'Invoices', active: false },
    { icon: Package, label: 'Inventory', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Background ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          bg-slate-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Nexus OS
              </span>
            </div>
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-indigo-200">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{userEmail}</p>
                <p className="text-xs text-slate-400 truncate">Pro Plan</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* Header */}
          <header className="h-20 shrink-0 flex items-center justify-between px-6 lg:px-10 bg-slate-900/20 backdrop-blur-md border-b border-white/5 z-10">
            <div className="flex items-center gap-4">
              <button 
                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 focus-within:bg-white/10 focus-within:border-indigo-500/50 transition-all w-80">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
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
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Welcome Banner */}
              <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 backdrop-blur-md">
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{userEmail.split('@')[0]}</span>
                  </h1>
                  <p className="text-slate-400 max-w-xl">
                    Here's what's happening with your workspace today. You have 3 pending invoices and 2 inventory alerts to review.
                  </p>
                </div>
                
                {/* Decorative element inside banner */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
              </section>

              {/* Stats Row */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Revenue', value: '$24,592.00', trend: '+12.5%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
                  { label: 'Active Invoices', value: '142', trend: '+4.2%', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
                  { label: 'Total Customers', value: '1,204', trend: '+18.1%', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
                ].map((stat, idx) => (
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
                        {[
                          { id: '#INV-2023-001', client: 'Acme Corp', amount: '$1,200.00', status: 'Paid', statusClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                          { id: '#INV-2023-002', client: 'Globex Inc', amount: '$3,450.00', status: 'Pending', statusClass: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
                          { id: '#INV-2023-003', client: 'Soylent Corp', amount: '$850.00', status: 'Overdue', statusClass: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
                          { id: '#INV-2023-004', client: 'Initech', amount: '$2,100.00', status: 'Paid', statusClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                        ].map((invoice, idx) => (
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
                    {[
                      { item: 'MacBook Pro 16"', stock: '2 units left', urgency: 'high' },
                      { item: 'Ergonomic Chair', stock: '5 units left', urgency: 'medium' },
                      { item: 'Wireless Mouse', stock: '8 units left', urgency: 'low' },
                    ].map((alert, idx) => (
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
          </div>
        </main>
      </div>
    </div>
  );
}
