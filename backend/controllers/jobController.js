const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// Create a new job
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    console.log("getJob controller started");

    const { keyword, location, category, type, minSalary, maxSalary } =
      req.query;

    const query = {
      isCloud: { $ne: true },
      ...(keyword && {
        title: { $regex: keyword, $options: "i" },
      }),
      ...(location && {
        location: { $regex: location, $options: "i" },
      }),
      ...(category && { category }),
      ...(type && { type }),
    };

    if (minSalary || maxSalary) {
      query.$and = [];

      if (minSalary) {
        query.$and.push({
          salaryMax: { $gte: Number(minSalary) },
        });
      }

      if (maxSalary) {
        query.$and.push({
          salaryMin: { $lte: Number(maxSalary) },
        });
      }
    }

    console.log("MongoDB query:", query);

    const jobs = await Job.find(query)
      .populate("company", "name companyName companyLogo")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Jobs found:", jobs.length);

    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

//get jobs for logged in user
exports.getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    if (role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    //Get all jobs posted by employer
    const jobs = await Job.find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean(); //.lean() makes jobs plain Js objects so we can add new fields

    //application counts
    const jobsWithApplicationCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          applicationCount,
        };
      }),
    );

    res.json(jobsWithApplicationCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get single job  by id
exports.getJobById = async (req, res) => {
  try {
    const { userId } = req.query;

    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo",
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let applicationStatus = null;

    if (userId) {
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");

      if (application) {
        applicationStatus = application.status;
      }
    }

    res.json({
      ...job.toObject(),
      applicationStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//updatee a job (employer)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: " Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: " Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Toggle close status for a job
exports.toggleCloseTab = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this job" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    res.json({ message: "job marked as closed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
