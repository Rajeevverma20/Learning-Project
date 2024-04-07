const { Resend } = require('resend');
require('dotenv').config();


const resend = new Resend(process.env.EMAIL_API_KEY);

// Send the email
const sendEmail = async (emailOptions) => {
  try {
    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Error sending email: ${JSON.stringify(error)}`);
    } else {
      return data;
    }
  } catch (err) {
    console.error('An error occurred while sending email:', err);
    throw new Error('An error occurred while sending email');
  }
};

const sendRegistrationConfirmationEmail = async (userEmail) => {
  try {
    const emailOptions = {
      from: 'onboarding@resend.dev', 
      to: userEmail,
      subject: 'Registration Confirmation',
      text: 'Thank you for registering on our platform. Your account has been successfully created.',
    };

    // Call sendEmail function with emailOptions
    await sendEmail(emailOptions);
    return 'Registration confirmation email sent successfully';
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    throw new Error('An error occurred while sending registration confirmation email');
  }
};

const sendPasswordResetEmail = async (userEmail) => {
  try {
    const emailOptions = {
      from: 'support@resend.dev', 
      to: userEmail,
      subject: 'Password Reset',
      text: `Successfully reset your password`,
    };

    
    await sendEmail(emailOptions);
    return 'Password reset email sent successfully';
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('An error occurred while sending password reset email');
  }
};

const sendCourseEnrollmentNotification = async (userEmail, courseName) => {
  try {
    const emailOptions = {
      from: 'notifications@resend.dev', 
      to: userEmail,
      subject: 'Course Enrollment Notification',
      text: `You have been successfully enrolled in the course "${courseName}".`,
    };

    
    await sendEmail(emailOptions);
    return 'Course enrollment notification email sent successfully';
  } catch (error) {
    console.error('Error sending course enrollment notification email:', error);
    throw new Error('An error occurred while sending course enrollment notification email');
  }
};

// Export the email functions
module.exports = {
  sendRegistrationConfirmationEmail,
  sendPasswordResetEmail,
  sendCourseEnrollmentNotification,
};
