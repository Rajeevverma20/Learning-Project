const pool = require('../database/connection');
const enrollmentQueries = require('../database/queries/enrollmentQuery');
const courseQueries = require('../database/queries/courseQuery');
const userQueries = require('../database/queries/userQuery');
const uuid = require('uuid');
const { sendCourseEnrollmentNotification } = require('../utils/emailService');

const enroll = async (req, res) => {
    try {
        const enrollment_id = uuid.v4();
        const { user_id, course_id } = req.body;

        if (!user_id || !course_id) {
            return res.status(400).json({ error: 'All Fields are required' });
        }

        // Check if user is already enrolled in the course
        const enrollmentExists = await pool.query(enrollmentQueries.checkEnrollment, [user_id, course_id]);
        if (enrollmentExists.rows.length > 0) {
            return res.status(400).json({ error: 'User is already enrolled in this course' });
        }

        // Insert enrollment into the database
        await pool.query(enrollmentQueries.addEnrollment, [enrollment_id, user_id, course_id]);

        // Retrieve user name and course name from the database
        const user = await pool.query(userQueries.getUserById, [user_id]);
        const course = await pool.query(courseQueries.getCourseById, [course_id]);
        const userName = user.rows[0].name;
        const courseName = course.rows[0].title;

        // Send enrollment notification email
        await sendCourseEnrollmentNotification(userName, courseName);

        res.status(200).send('User enrolled successfully');
    } catch (err) {
        console.error('Error enrolling user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getCourseByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: 'User id is required' });
        }

        const data = await pool.query(enrollmentQueries.getEnrolledCourses, [user_id]);

        if (!data.rows || data.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or has not enrolled in any courses' });
        }

        res.status(200).json(data.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    enroll,
    getCourseByUser
}
