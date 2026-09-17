const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// Helper: Debt Settlement Algorithm (Minimizes transactions between group members)
const calculateSettlements = (expenses) => {
  const netBalances = {}; // person -> net amount (+ = is owed money, - = owes money)
  const paidTotals = {};
  const categoryTotals = {};
  let totalTripCost = 0;

  for (const exp of expenses) {
    const amount = Number(exp.amount) || Number(exp.total) || 0;
    const payer = exp.paidBy || 'Organizer';
    const category = exp.category || 'Miscellaneous';

    totalTripCost += amount;
    paidTotals[payer] = (paidTotals[payer] || 0) + amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;

    // Credit payer
    netBalances[payer] = (netBalances[payer] || 0) + amount;

    // Debit participants
    if (exp.participants && exp.participants.length > 0) {
      for (const p of exp.participants) {
        const share = Number(p.share) || amount / exp.participants.length;
        netBalances[p.name] = (netBalances[p.name] || 0) - share;
      }
    } else {
      // Legacy fallback: split equally across "people"
      const peopleCount = Math.max(1, Number(exp.people) || 1);
      const perHead = amount / peopleCount;
      netBalances[payer] = (netBalances[payer] || 0) - perHead;
    }
  }

  // Separate debtors and creditors
  const debtors = [];
  const creditors = [];

  for (const [person, balance] of Object.entries(netBalances)) {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ person, amount: Math.abs(rounded) });
    } else if (rounded > 0.01) {
      creditors.push({ person, amount: rounded });
    }
  }

  // Sort descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount: Math.round(settledAmount)
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return {
    totalTripCost: Math.round(totalTripCost),
    paidTotals,
    categoryTotals,
    settlements
  };
};

// POST /api/expenses - create expense
const createExpense = async (req, res) => {
  try {
    const {
      tripId,
      category = 'Miscellaneous',
      description = '',
      amount,
      paidBy,
      date,
      participants = [],
      // legacy support
      hotel = 0,
      food = 0,
      transport = 0,
      other = 0,
      people = 1,
      note = ''
    } = req.body;

    const parsedAmount = Number(amount) || (Number(hotel) + Number(food) + Number(transport) + Number(other));
    const numPeople = Math.max(1, participants.length > 0 ? participants.length : Number(people) || 1);
    const perPerson = Math.round((parsedAmount / numPeople) * 100) / 100;

    const expense = await Expense.create({
      user: req.user._id,
      trip: tripId || null,
      category,
      description: description || note,
      amount: parsedAmount,
      paidBy: paidBy || req.user.fullName,
      date: date ? new Date(date) : new Date(),
      participants: participants.length > 0 ? participants : [{ name: req.user.fullName, share: perPerson }],
      // legacy
      hotel: Number(hotel),
      food: Number(food),
      transport: Number(transport),
      other: Number(other),
      people: numPeople,
      note: note || description,
      total: parsedAmount,
      perPerson
    });

    res.status(201).json({ success: true, message: 'Expense added successfully.', expense });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not create expense.', error: err.message });
  }
};

// GET /api/expenses/my - user's expenses with settlement overview
const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    const calculation = calculateSettlements(expenses);

    res.json({
      success: true,
      count: expenses.length,
      expenses,
      settlementAnalysis: calculation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch expenses.', error: err.message });
  }
};

// GET /api/expenses/trip/:tripId - trip specific expenses with settlement analysis
const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.find({ trip: tripId }).sort({ date: -1, createdAt: -1 });
    const calculation = calculateSettlements(expenses);

    res.json({
      success: true,
      count: expenses.length,
      expenses,
      settlementAnalysis: calculation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch trip expenses.', error: err.message });
  }
};

// DELETE /api/expenses/:id - delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });

    if (String(expense.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own expenses.' });
    }

    await expense.deleteOne();
    res.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete expense.', error: err.message });
  }
};

module.exports = {
  createExpense,
  getMyExpenses,
  getTripExpenses,
  deleteExpense
};
