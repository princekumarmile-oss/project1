const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApplicationEmail = async (applicationData, userEmail) => {
  const { courseName, firstName, lastName, phoneNumber, address } = applicationData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'princekumarmile@gmail.com',
    subject: `New Application Submitted for ${courseName}`,
    html: `
      <h2>New Application Received</h2>
      <p><strong>Course:</strong> ${courseName}</p>
      <p><strong>User Email:</strong> ${userEmail}</p>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Application email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendApplicationEmail,
};