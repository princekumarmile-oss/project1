const Application = require("../models/Application");
const { sendApplicationEmail } = require("../utils/emailService");

const createApplication = async (req, res) => {
  try {
    const { courseName, firstName, lastName, email, phoneNumber, address } = req.body;

    if (!courseName || !firstName || !lastName || !email || !phoneNumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user?.id || null;

    const newApplication = await Application.create({
      userId,
      courseName,
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
    });

    // Send email to admin
    await sendApplicationEmail(
      { courseName, firstName, lastName, phoneNumber, address },
      email
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return res.status(500).json({ message: "Could not submit application" });
  }
};

module.exports = {
  createApplication,
};
