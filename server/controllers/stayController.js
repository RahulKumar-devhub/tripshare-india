const Stay = require('../models/Stay');

// GET /api/stays - fetch stays with rich filters and sorting
const getAllStays = async (req, res) => {
  try {
    const {
      destination,
      propertyType,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sort = 'recommended',
      page = 1,
      limit = 24
    } = req.query;

    const query = {};

    if (destination && destination.trim() !== '') {
      const destRegex = new RegExp(destination.trim(), 'i');
      query.$or = [
        { destination: destRegex },
        { city: destRegex },
        { state: destRegex },
        { name: destRegex }
      ];
    }

    if (propertyType && propertyType !== 'all') {
      const types = propertyType.split(',').map((t) => t.trim());
      query.propertyType = { $in: types };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenityList };
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { pricePerNight: 1 };
    else if (sort === 'price_desc') sortOption = { pricePerNight: -1 };
    else if (sort === 'rating_desc') sortOption = { rating: -1, reviewCount: -1 };
    else sortOption = { featured: -1, rating: -1, createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Stay.countDocuments(query);
    const stays = await Stay.find(query).sort(sortOption).skip(skip).limit(limitNum);

    res.json({
      success: true,
      count: stays.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      stays
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch stays.', error: err.message });
  }
};

// GET /api/stays/:id - fetch single stay by ID or slug
const getStayByIdOrSlug = async (req, res) => {
  try {
    const { id } = req.params;
    let stay = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      stay = await Stay.findById(id);
    }
    if (!stay) {
      stay = await Stay.findOne({ slug: id.toLowerCase() });
    }

    if (!stay) {
      return res.status(404).json({ success: false, message: 'Stay not found.' });
    }

    res.json({ success: true, stay });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch stay details.', error: err.message });
  }
};

// POST /api/stays - admin only, create stay
const createStay = async (req, res) => {
  try {
    const slug = (req.body.slug || req.body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newStay = await Stay.create({
      ...req.body,
      slug
    });

    res.status(201).json({ success: true, message: 'Stay property created successfully.', stay: newStay });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not create stay.', error: err.message });
  }
};

// PUT /api/stays/:id - admin only, update stay
const updateStay = async (req, res) => {
  try {
    const updated = await Stay.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Stay not found.' });
    res.json({ success: true, message: 'Stay updated successfully.', stay: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update stay.', error: err.message });
  }
};

// DELETE /api/stays/:id - admin only, delete stay
const deleteStay = async (req, res) => {
  try {
    const deleted = await Stay.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Stay not found.' });
    res.json({ success: true, message: 'Stay property deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete stay.', error: err.message });
  }
};

module.exports = {
  getAllStays,
  getStayByIdOrSlug,
  createStay,
  updateStay,
  deleteStay
};
