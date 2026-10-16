const fs = require("fs");
const path = require('path');
const User = require("../models/User");

//Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        //if employer, allow updating company info 
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            companyLogo: user.companyLogo,
            resume: user.resume || '',
        });    

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delte resume file 
exports.deleteResume = async (req, res) => {
    try {
        const { resumeUrl } = req.body; 

        const fileName = resumeUrl?.split('/')?.pop();

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== "jobseeker")
            res.status(403).json({ message: "Only jobseekers can delete resume" })

        //construct the full file path
        const filePath = path.join(__dirname, '../uploads', fileName);

        //check if the file exists and then delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);  //Delete the file
        }

        //set the user ka resume to an empty String
        user.resume = '';
        await user.save();

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get User public profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};