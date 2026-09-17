const express = require('express');
const router = express.Router();
const {
  createExpense,
  getMyExpenses,
  getTripExpenses,
  deleteExpense
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createExpense);
router.get('/my', getMyExpenses);
router.get('/trip/:tripId', getTripExpenses);
router.delete('/:id', deleteExpense);

module.exports = router;
