const Application = require("../models/Application");
const { sendApplicationEmail } = require("../utils/emailService");

const createApplication = async (req, res) => {
  try {
    const { courseName, firstName, lastName, phoneNumber, address } = req.body;

    if (!courseName || !firstName || !lastName || !phoneNumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newApplication = await Application.create({
      userId: req.user.id,
      courseName,
      firstName,
      lastName,
      phoneNumber,
      address,
    });

    // Send email to admin
    await sendApplicationEmail(
      { courseName, firstName, lastName, phoneNumber, address },
      req.user.email
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not submit application" });
  }
};

module.exports = {
  createApplication,
};
