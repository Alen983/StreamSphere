const mongoose = require("mongoose");
const ContinueWatching = mongoose.model("continueWatching");
const requireLogin = require("../middleware/requireMail");


module.exports = (app) => {
     // SAVE OR UPDATE WATCH TIME
        app.post("/api/v1/continue-Watching", requireLogin, async (req, res) => {
            const userId = req.user._id; //from JWT token
            const { movieId, lastTime } = req.body;

            try{
                const record = await ContinueWatching.findOne({ userId, movieId });

                if (record) {
                    // Update existing record
                    record.lastTime = lastTime;
                    await record.save();
                    return res.status(200).json({ message: "Watch time updated successfully", record });
                }

                await ContinueWatching.create({ userId, movieId, lastTime });
                res.status(201).json({ message: "Watch time saved successfully" });
            }
            catch (error){
                res.status(500).json({ message: error.message });
            }
        });

        // GET CONTINUE WATCHING LIST
        app.get("/api/v1/continue-Watching", requireLogin, async (req, res) => {
            const userId = req.user._id; //from JWT token
            try{
                const continueWatchingList = await ContinueWatching.find({ userId });
                res.status(200).json({ continueWatchingList });
            }
            catch (error){
                res.status(500).json({ message: error.message });
            }
        });
};

//
    