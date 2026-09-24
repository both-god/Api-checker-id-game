const axios = require('axios');

// Service សម្រាប់ឆែក Mobile Legends
const checkMLBB = async (id, zone) => {
    try {
        // ប្រើប្រាស់ Public API ពិតប្រាកដដើម្បីឆែកឈ្មោះ ML
        const url = `https://api.elitedev.my.id/api/game/mlbb?id=${id}&zone=${zone}`;
        const response = await axios.get(url);
        
        // បើ Server ហ្គេមឆ្លើយតបថាគ្មានឈ្មោះ ឬ Error
        if (response.data.status !== true || !response.data.data.username) {
            return { success: false, message: "មិនមាន ID នេះនៅក្នុង Mobile Legends ទេ!" };
        }
        
        return { success: true, username: response.data.data.username };
    } catch (error) {
        return { success: false, message: "មិនមាន ID នេះទេ ឬ Server កំពុងរវល់!" };
    }
};

// Service សម្រាប់ឆែក Free Fire
const checkFreeFire = async (id) => {
    try {
        // ប្រើប្រាស់ Public API ពិតប្រាកដដើម្បីឆែកឈ្មោះ FF
        const url = `https://api.elitedev.my.id/api/game/freefire?id=${id}`;
        const response = await axios.get(url);
        
        if (response.data.status !== true || !response.data.data.username) {
            return { success: false, message: "មិនមាន ID នេះនៅក្នុង Free Fire ទេ!" };
        }
        
        return { success: true, username: response.data.data.username };
    } catch (error) {
        return { success: false, message: "មិនមាន ID នេះទេ ឬ Server កំពុងរវល់!" };
    }
};

module.exports = { checkMLBB, checkFreeFire };
