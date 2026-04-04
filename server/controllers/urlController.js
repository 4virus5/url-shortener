const url = require('../models/Url')
const generateCode = require('../utils/base62')

const shortenUrl = async (req,res)=>{
    try{
        const {originalUrl} = req.body
        const userId = req.user._id // Provided by authMiddleware

        let shortUrl;
        let exist = true;

        while(exist){
            shortUrl = generateCode()
            exist = await url.findOne({shortUrl})
        }

        const newUrl = await url.create({
            originalUrl,
            shortUrl,
            user: userId
        })

        res.status(201).json({
            message:"Short Url created Successfully",
            shortUrl:`http://localhost:3000/${shortUrl}`
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
const redirectUrl = async (req,res)=>{
    try{
        const {code} = req.params
        const urlData = await url.findOne({shortUrl:code})
        if(!urlData){
            res.status(404).json({
                message:"URL not found"
            })
        }
        urlData.clicks+=1
        urlData.clickHistory.push({ timestamp: new Date() })
        await urlData.save()
        res.redirect(urlData.originalUrl)

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

const getStats = async (req,res)=>{
    try{
        const {code} = req.params
        const urlData = await url.findOne({shortUrl:code})
        if(!urlData){
            return res.status(404).json({
                message:'URL not found'
            })
        }

        res.status(200).json({
            originalUrl:urlData.originalUrl,
            shortUrl:urlData.shortUrl,
            clicks:urlData.clicks
        })
    } catch(error){
        res.status(500).json({
            message:error.message
        })
    }

}

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // 1. Get all links for this user
        const userUrls = await url.find({ user: userId }).sort({ createdAt: -1 });
        
        // Calculate basic stats
        const totalLinks = userUrls.length;
        const totalClicks = userUrls.reduce((acc, curr) => acc + curr.clicks, 0);
        const activeLinks = userUrls.filter(u => u.isActive).length;
        
        // Build 7-day click history chart data
        const clickData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize last 7 days to 0
        for(let i=6; i>=0; i--) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            clickData.push({ name: days[d.getDay()], clicks: 0, _dateDate: d.getDate() });
        }
        
        // Populate clickData
        userUrls.forEach(u => {
            if(u.clickHistory && u.clickHistory.length > 0) {
                u.clickHistory.forEach(ch => {
                    const chDate = new Date(ch.timestamp);
                    const diffTime = Math.abs(new Date() - chDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    if(diffDays <= 7) {
                        const dayObj = clickData.find(cd => cd.name === days[chDate.getDay()]);
                        if(dayObj) {
                            dayObj.clicks += 1;
                        }
                    }
                });
            }
        });

        res.status(200).json({
            totalLinks,
            totalClicks,
            activeLinks,
            clickData,
            recentLinks: userUrls.map(u => ({
                id: u._id,
                original: u.originalUrl,
                short: `${process.env.BASE_URL || 'http://localhost:3000'}/${u.shortUrl}`,
                clicks: u.clicks,
                date: u.createdAt,
                status: u.isActive ? 'Active' : 'Expired',
                shortCode: u.shortUrl
            }))
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUrl = async (req, res) => {
    try {
        const urlId = req.params.id;
        const userId = req.user._id;
        const deletedUrl = await url.findOneAndDelete({ _id: urlId, user: userId });
        if (!deletedUrl) return res.status(404).json({ message: "URL not found or unauthorized" });
        res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUrl = async (req, res) => {
    try {
        const urlId = req.params.id;
        const userId = req.user._id;
        const { originalUrl } = req.body;
        const updatedUrl = await url.findOneAndUpdate(
            { _id: urlId, user: userId }, 
            { originalUrl }, 
            { new: true }
        );
        if (!updatedUrl) return res.status(404).json({ message: "URL not found or unauthorized" });
        res.status(200).json(updatedUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {shortenUrl,redirectUrl,getStats,getDashboardStats,deleteUrl,updateUrl}

// short URL clicked
//     ↓
// MongoDB hit
//     ↓
// redirect
// Every click = database query

// OPTIMIZATION USING REDIS / REDIS STORES DATA IN CACHE THAT IS RAM AND IT IS FASTER DUE TO THIS REASON
// REDIS STORES DATA IN CACHE NOT ON DISK

// short URL clicked
//     ↓
// check Redis
//     ↓
// if found → redirect
//     ↓
// else → MongoDB → save in Redis


//First request  → 120ms
//Second request → 10ms
// THIS REDUCES LATENCY