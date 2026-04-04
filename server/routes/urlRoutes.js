const express = require('express')
const app = express()
const router = express.Router()
const {shortenUrl,redirectUrl,getStats,getDashboardStats,deleteUrl,updateUrl} = require('../controllers/urlController')
const { protect } = require('../middleware/authMiddleware')

router.post('/api/url/shorten', protect, shortenUrl)
router.put('/api/url/:id', protect, updateUrl)
router.delete('/api/url/:id', protect, deleteUrl)
router.get('/api/dashboard/stats', protect, getDashboardStats)
router.get('/api/stats/:code', getStats)
router.get('/:code', redirectUrl)

module.exports = router