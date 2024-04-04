const pool = require('../database/connection');
const queries = require('../database/queries/enrollmentQuery');

const enroll = async (req, res) => {
    try {
        const { enrollment_id, user_id, course_id } = req.body;

        if (!enrollment_id || !user_id || !course_id) {
            return res.status(400).send('All fields are required');
        }

        // Check if user is already enrolled in the course
        const enrollmentExists = await pool.query(queries.checkEnrollment, [user_id, course_id]);
        if (enrollmentExists.rows.length > 0) {
            return res.status(400).json({ error: 'User is already enrolled in this course' });
        }

        // Insert enrollment into the database
        await pool.query(queries.addEnrollment, [enrollment_id, user_id, course_id]);

        res.status(200).send('User enrolled successfully');
    } catch (err) {
        console.error('Error enrolling user:', err);
        res.status(500).send('Internal server error');
    }
}

const getCourseByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ error: 'User id is required' });
        }

        const data = await pool.query(queries.getEnrolledCourses, [user_id]);

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
