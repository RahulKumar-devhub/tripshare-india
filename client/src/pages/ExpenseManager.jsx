import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Plus, Trash2, ArrowRight, PieChart, Users, 
  CreditCard, CheckCircle2, TrendingUp, Calendar, AlertCircle, 
  Wallet, Receipt, ArrowLeftRight
} from 'lucide-react';
import { expensesAPI, formatMoney, formatDate } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Transport',
  'Hotel',
  'Food',
  'Activity',
  'Shopping',
  'Tickets',
  'Miscellaneous'
];

export default function ExpenseManager() {
  const { user, isAuthenticated, showToast } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [settlementData, setSettlementData] = useState({
    totalTripCost: 0,
    paidTotals: {},
    categoryTotals: {},
    settlements: []
  });
  const [loading, setLoading] = useState(true);

  // New expense form modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(user?.fullName || 'Rahul');
  const [participantsInput, setParticipantsInput] = useState('Rahul, Aman, Priya');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadExpenses();
    }
  }, [isAuthenticated]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await expensesAPI.getMy();
      if (res.success) {
        setExpenses(res.expenses || []);
        if (res.settlementAnalysis) {
          setSettlementData(res.settlementAnalysis);
        }
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) {
      showToast('Please enter a valid description and amount', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const names = participantsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedAmount = Number(amount);
      const perShare = Math.round((parsedAmount / (names.length || 1)) * 100) / 100;
      const participants = names.map((name) => ({ name, share: perShare }));

      const payload = {
        category,
        description: description.trim(),
        amount: parsedAmount,
        paidBy: paidBy.trim(),
        participants
      };

      const res = await expensesAPI.create(payload);
      if (res.success) {
        showToast('Expense recorded successfully!', 'success');
        setIsAddOpen(false);
        setDescription('');
        setAmount('');
        loadExpenses();
      }
    } catch (err) {
      showToast('Could not save expense', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await expensesAPI.delete(id);
      if (res.success) {
        showToast('Expense removed', 'info');
        loadExpenses();
      }
    } catch (err) {
      showToast('Could not delete expense', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-[#0c111d] rounded-3xl border border-white/10">
          <Wallet className="w-12 h-12 text-saffron-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Trip Expense Splitter</h2>
          <p className="text-xs text-white/60 mb-6">
            Log in to manage your group travel expenses, split bills fairly, and settle debts automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Mathematical Cashflow Solver</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Trip Expense Manager & Cost Splitter
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Track shared costs, see who owes whom, and settle balances with minimum cash transfers.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-saffron py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-saffron"
          >
            <Plus className="w-4 h-4" />
            <span>Add Group Expense</span>
          </button>
        </div>

        {/* Summary Telemetry KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
            <span className="text-xs text-white/50 block mb-1">Total Trip Expenses</span>
            <span className="text-2xl font-display font-extrabold text-white font-mono">
              {formatMoney(settlementData.totalTripCost)}
            </span>
          </div>

          <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
            <span className="text-xs text-white/50 block mb-1">Expenses Logged</span>
            <span className="text-2xl font-display font-extrabold text-saffron-400 font-mono">
              {expenses.length} Records
            </span>
          </div>

          <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
            <span className="text-xs text-white/50 block mb-1">Active Debt Settlements</span>
            <span className="text-2xl font-display font-extrabold text-azure-400 font-mono">
              {settlementData.settlements.length} Transfers Needed
            </span>
          </div>

          <div className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl shadow-xl">
            <span className="text-xs text-white/50 block mb-1">Settlement Status</span>
            <span className="text-2xl font-display font-extrabold text-emerald-400 font-mono">
              {settlementData.settlements.length === 0 ? 'All Settled' : 'Unbalanced'}
            </span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Settlement Cards ("Who Owes Whom") & Category Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Who Owes Whom Engine */}
            <div className="bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-saffron-400" />
                  <span>Debt Settlement Engine ("Who Owes Whom")</span>
                </h3>
              </div>

              {settlementData.settlements.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/50">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <span>All group balances are equalized. No pending settlements!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlementData.settlements.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <span className="text-xs font-bold text-rose-400 block">{s.from}</span>
                          <span className="text-[10px] text-white/40">owes</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-saffron-400" />
                        <div className="text-left">
                          <span className="text-xs font-bold text-emerald-400 block">{s.to}</span>
                          <span className="text-[10px] text-white/40">receiver</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono block">
                          {formatMoney(s.amount)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Pay via UPI</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Distribution Bar */}
            <div className="bg-[#0c111d] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Spending by Category</h3>
              {Object.entries(settlementData.categoryTotals).map(([cat, total]) => {
                const pct = settlementData.totalTripCost > 0
                  ? Math.round((total / settlementData.totalTripCost) * 100)
                  : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">{cat}</span>
                      <span className="font-bold text-white font-mono">{formatMoney(total)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: List of Expenses Logged */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-azure-400" /> All Logged Expenses
              </h3>
              <span className="text-xs text-white/50">{expenses.length} Records</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="py-16 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8 text-white/50 text-xs">
                No trip expenses recorded yet. Click "Add Group Expense" to log your first shared hotel, food, or fuel bill!
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-saffron-400 border border-white/5">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{exp.description || 'Shared Expense'}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/5">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 mt-0.5">
                          Paid by <span className="text-saffron-400 font-semibold">{exp.paidBy}</span> • {formatDate(exp.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-white font-mono block">
                          {formatMoney(exp.amount || exp.total)}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {exp.participants?.length || exp.people || 1} people split
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteExpense(exp._id)}
                        className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-rose-400 transition-all p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        {isAddOpen && (
          <div className="modal-backdrop">
            <div className="modal-content max-w-lg bg-[#0c111c] border border-white/15 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-white">Log Group Travel Expense</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/70 block mb-1">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field bg-[#080d16] py-2.5"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/70 block mb-1">Description / Bill Purpose *</label>
                  <input
                    type="text"
                    placeholder="e.g. Gypsy fuel & toll permit, Riverside dinner..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field py-2.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/70 block mb-1">Amount Paid (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field py-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white/70 block mb-1">Paid By (Payer Name) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul"
                      value={paidBy}
                      onChange={(e) => setPaidBy(e.target.value)}
                      className="input-field py-2.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/70 block mb-1">Participants (Comma separated names) *</label>
                  <input
                    type="text"
                    placeholder="Rahul, Aman, Priya"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    className="input-field py-2.5"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    Amount will be equally split across all named participants.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="btn-outline text-xs py-2 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-saffron text-xs py-2 px-5 rounded-xl font-bold"
                  >
                    {submitting ? 'Saving...' : 'Record Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
