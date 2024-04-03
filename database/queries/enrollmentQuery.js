const createEnrollment =`CREATE TABLE Enrollments (
                         enrollment_id INT PRIMARY KEY,
                         user_id INT NOT NULL,
                         course_id INT NOT NULL,
                         enrollment_date DATE NOT NULL,
                         FOREIGN KEY (user_id) REFERENCES Users(user_id),
                         FOREIGN KEY (course_id) REFERENCES Courses(course_id))`;


const addEnrollement= `INSERT INTO Enrollments (user_id, course_id, enrollment_date) VALUES ($1, $2, NOW())`;                         

module.exports ={
    createEnrollment
}

