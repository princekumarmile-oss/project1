const courses = require("../config/courses");

const getDashboard = (req, res) => {
  res.status(200).json({
    heading: "Welcome to GROWUP ADMISSIONS",
    admissionOpen: true,
    admissionYear: "2026-27",
    user: req.user,
    courses,
    contact: {
      phone: "8962253601",
      email: "growupadmissions@gmail.com",
      address: "MIG-210, Gautam Nagar, Bhopal, MP 462023",
    },
  });
};

module.exports = {
  getDashboard,
};
