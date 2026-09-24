const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { checkMLBB, checkFreeFire } = require('./services');

// Cache រក្សាទុក ១ ម៉ោង ធ្វើអោយការឆែកលើកទី២ ប្រើពេលត្រឹម 0.001s
const cache = new NodeCache({ stdTTL: 3600 }); 

// Route សម្រាប់ MLBB
router.get('/check/ml', async (req, res) => {
    const { id, zone } = req.query;
    if (!id || !zone || isNaN(id) || isNaN(zone)) {
        return res.status(400).json({ status: "error", message: "សូមបញ្ចូល ID និង Zone ជាលេខអោយបានត្រឹមត្រូវ!" });
    }

    const cacheKey = `ml_${id}_${zone}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const result = await checkMLBB(id, zone);
    
    if (!result.success) {
        return res.status(404).json({ status: "error", message: result.message });
    }

    const successData = { status: "success", game: "Mobile Legends", source: "live_api", data: { id, zone, username: result.username } };
    cache.set(cacheKey, successData);
    res.json(successData);
});

// Route សម្រាប់ Free Fire
router.get('/check/ff', async (req, res) => {
    const { id } = req.query;
    if (!id || isNaN(id)) {
        return res.status(400).json({ status: "error", message: "សូមបញ្ចូល ID ជាលេខអោយបានត្រឹមត្រូវ!" });
    }

    const cacheKey = `ff_${id}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const result = await checkFreeFire(id);
    
    if (!result.success) {
        return res.status(404).json({ status: "error", message: result.message });
    }

    const successData = { status: "success", game: "Free Fire", source: "live_api", data: { id, username: result.username } };
    cache.set(cacheKey, successData);
    res.json(successData);
});

module.exports = router;
