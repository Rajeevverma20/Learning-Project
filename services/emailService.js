const { Resend } = require('resend');
require('dotenv').config();

// Initialize the Resend instance with your API key
const resend = new Resend(process.env.EMAIL_API_KEY);

// Send the email
const sendEmail = async (emailOptions, res) => {
  try {
    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: `Error sending email: ${JSON.stringify(error)}` });
    } else {
      return data;
    }
  } catch (err) {
    console.error('An error occurred while sending email:', err);
    return res.status(500).json({ error: 'An error occurred while sending email' });
  }
};

const sendRegistrationConfirmationEmail = async (userEmail, res) => {
  try {
    const emailOptions = {
      from: 'rv@learningcourse.com', // Replace with your platform's email address
      to: userEmail,
      subject: 'Registration Confirmation',
      text: 'Thank you for registering on our platform. Your account has been successfully created.',
    };

    // Call sendEmail function with emailOptions and response object
    await sendEmail(emailOptions, res);
    res.status(200).json({ message: 'Registration confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    res.status(500).json({ error: 'An error occurred while sending registration confirmation email' });
  }
};

// Add more email functions for different types of emails (e.g., password reset, course enrollment notification, etc.)

module.exports = {
  sendRegistrationConfirmationEmail,
};
