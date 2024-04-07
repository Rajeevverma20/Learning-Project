const createCourse = `CREATE TABLE Courses (course_id UUID PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50),
    price DECIMAL(10, 2),
    created_by UUID NOT NULL,
    duration INT, 
    instructor VARCHAR(255),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
)`;

const addCourse = "INSERT INTO Courses (course_id, title, description, category, level, price, created_by, duration, instructor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

const getCourse= `SELECT * FROM Courses`;


const getCourseById = `SELECT * FROM Courses WHERE course_id = $1`;


const deleteCourse = `DELETE FROM Courses WHERE course_id = $1`;

module.exports = {
    createCourse,
    addCourse,
    getCourse,
    getCourseById,
    deleteCourse
}