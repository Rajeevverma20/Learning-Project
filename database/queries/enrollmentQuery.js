const createEnrollment = `CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(userID),
    FOREIGN KEY (course_id) REFERENCES Courses(courseID))`;

const addEnrollment = `INSERT INTO Enrollments (enrollment_id, user_id, course_id, enrollment_date) VALUES ($1, $2, $3, NOW())`;

const checkEnrollment = `SELECT * FROM Enrollments WHERE user_id = $1 AND course_id = $2`;

const getEnrolledCourses = `SELECT * FROM Enrollments WHERE user_id =$1`;
module.exports = {
createEnrollment,
addEnrollment,
checkEnrollment,
getEnrolledCourses
};
