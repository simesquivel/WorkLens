const express = require("express");

const {
    createJob,
    getJob,
    getJobById,
    updateJob,
    deleteJob,
    toggleCloseTab,
    getJobsEmployer,
} = require("../controllers/jobController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createJob).get(getJob);

router.route("/get-jobs-employer").get(protect, getJobsEmployer);

router
    .route("/:id")
    .get(getJobById)
    .put(protect, updateJob)
    .delete(protect, deleteJob);

router.put("/:id/toggle-close", protect, toggleCloseTab);

module.exports = router;