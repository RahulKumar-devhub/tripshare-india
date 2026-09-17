const express = require('express');
const router = express.Router();
const { getAllDestinations, getDestinationBySlug } = require('../controllers/destinationController');

router.get('/', getAllDestinations);
router.get('/:slug', getDestinationBySlug);

module.exports = router;
