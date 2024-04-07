const createUser = "CREATE TABLE Users (user_id UUID PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL,superadmin BOOLEAN BY DEFAULT FALSE, profile_picture_url VARCHAR(255), bio TEXT, website VARCHAR(255)";

const addUser = `INSERT INTO Users (user_id, name, email, password, superadmin) VALUES ($1, $2, $3, $4, $5)`;

const getAllUsers = "SELECT * FROM Users";

const getUserByEmail = `SELECT * FROM Users WHERE email=$1`;

const getUserById = "SELECT * FROM Users WHERE user_id = $1";

const deleteUser = "DELETE FROM Users WHERE user_id = $1;"

module.exports = {
    createUser,
    addUser,
    getAllUsers,
    getUserById,
    deleteUser,
    getUserByEmail

};
