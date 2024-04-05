const bcrypt = require("bcrypt");
const pool = require('../Database/connection'); // Assuming this imports the PostgreSQL connection pool
const queries = require('../Database/queries/userQuery'); // Assuming this imports the SQL queries for database operations
const jwt = require('jsonwebtoken');
//const {sendRegistrationConfirmationEmail}= require('../services/emailService');
//const { uploadImageToCloudinary  } = require('../services/profileimage');
require('dotenv').config();


// User Registration API endpoint
const userRegister = async (req, res) => {
    try {
        // Extract user data from request body
        const {  name, email, password,superadmin } = req.body;

        // Check if all required fields are provided
        if (!( name && email && password && superadmin )) {
            return res.status(400).send('All fields are required');
        }

       // const profile_picture_url = await uploadImageToCloudinary(profile_picture);

        
        // Check if the email is already in use
        const existingUser = await pool.query(queries.getUserByEmail, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).send('Email is already in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        
        // Execute the SQL query to add a new user to the database
        const data = await pool.query(queries.addUser, [name, email, hashedPassword, superadmin]);

        // Generate JWT token
        const token = jwt.sign({email: email}, process.env.JWT_SCERET,{ expiresIn: '2h'});


        // Send registration confirmation email
     //   await sendRegistrationConfirmationEmail(email);

        // Respond with success message
        res.status(201).json({ success: true, token});
    } catch (err) {
        console.error('An error occurred while registering user:', err);
        // If an error occurs, respond with an internal server error message
        res.status(500).send('Internal server error');
    }
};

//Get All Users
const getUsers = async( req, res)=>{
    try{

        const data = await pool.query(queries.getAllUsers);

        res.status(200).send(data.rows);

    }catch(err){
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

//Get User By Id
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all required fields are provided
        if (!(email && password)) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Fetch user by email from the database
        const userData = await pool.query(queries.getUserByEmail, [email]);
        const user = userData.rows[0];

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid  password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SCERET, { expiresIn: '2h' });

        // Respond with success message and JWT token
        res.status(200).json({ success: true, token , user});
    } catch (err) {
        console.error('An error occurred while logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update User By ID 

const updateUser = async( req, res ) => {
    try{

        const { user_id } = req.params;

        console.log(user_id)

        const { name, email, password,  profile_picture_url, bio, website } = req.body;

        if(!user_id ){
            return res.status(400).send('User Id  required');
        }

        // Check if the user with the specified ID exists

        const checkUser = await pool.query(queries.getUserById, [user_id]);
        if(checkUser.rows.length === 0){
            return res.status(404).send('User not found')
        }

        const updateFields = [];
        const values = [];
        let index = 1;
        if(name){
            updateFields.push('name = $'+ index++);
            values.push(name);
        }
        if(email){
            updateFields.push('email = $'+ index++);
            values.push(email);
        }

        if(password){
            //Hash the new password before updating
            const hashPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = $'+ index++);
            values.push(hashPassword)
        }
        if(profile_picture_url){
            updateFields.push('profile_picture_url = $'+ index++);
            values.push(profile_picture_url);
        }
        if(bio){
            updateFields.push('bio = $'+ index++);
            values.push(bio);
        }
        if(website){
            updateFields.push('website =$'+ index++);
            values.push(website);
        }


        const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE user_id = $${index}`;
        values.push(user_id);
        
        const data = await pool.query(query, values);

        
        res.status(201).send('User Update Successfully');

    }catch(err){
        console.log(err);
        res.status(500).send('Internal server error');
    }
}


//Delete User by Id 

const deleteUser = async ( req, res ) =>{
    try{
        const { user_id } = req.params;
        
        if(!user_id){
            return res.status(400).send('User Id is required');
        }

        // Check if the user with the specified ID exists

        const checkUser = await pool.query(queries.getUserById, [user_id]);
        if(checkUser.rows.length === 0){
            return res.status(404).send('User not found')
        }


        const data = await pool.query(queries.deleteUser,[user_id]);

        res.status(204).send('User Delete Successfully :', data)

    }catch(err){
        console.log(err);
        return res.status(500).send('Internal server error');
    }
}
//get Superadmin
const getSuperadmin = async (req, res) => {
    try {
        const {user_id} = req.params;
        if(!user_id){
            return res.status(400).send('User Id is required');
        }

        const data = await pool.query(queries.getUserById, [user_id]);
 
        if(data.rows.length === 0){
            return res.status(400).send('User not found')
        }

        res.status(200).json(data.rows);
    } catch (err) {
        console.error('Error accessing superadmin dashboard:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Export the userRegister function to be used in other files
module.exports = {
    userRegister,
    getUsers,
    userLogin,
    updateUser,
    deleteUser,
    getSuperadmin
};
