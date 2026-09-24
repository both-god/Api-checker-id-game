const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const apiRoutes = require('./routes'); // ទាញយក file routes មកប្រើ

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(xss());
app.use(hpp());

// ការពារ DDoS និងកំណត់ត្រឹម 1000req/day (Renew @ 12:00 AM KH Time)
const requestCounts = new Map();
let currentDay = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Phnom_Penh' });

function rateLimiter(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const today = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Phnom_Penh' });

    if (today !== currentDay) {
        requestCounts.clear();
        currentDay = today;
    }

    let userReqs = requestCounts.get(ip) || 0;
    if (userReqs >= 1000) {
        return res.status(429).json({ status: "error", message: "អ្នកប្រើប្រាស់អស់កំណត់ 1000 ដងហើយសម្រាប់ថ្ងៃនេះ។ រង់ចាំដល់ម៉ោង 12 យប់។" });
    }

    requestCounts.set(ip, userReqs + 1);
    next();
}

app.use('/api', rateLimiter);
app.use('/api', apiRoutes); // បញ្ចូល Routes ទៅក្នុង path /api

app.get('/', (req, res) => {
    res.json({ author: "spiderexusX", status: "Highly Secured Live Checker" });
});

module.exports = app;
