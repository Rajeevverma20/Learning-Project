const bcrypt = require("bcrypt");
const pool = require('../Database/connection'); 
const queries = require('../Database/queries/userQuery');
const jwt = require('jsonwebtoken');
const {sendRegistrationConfirmationEmail, sendPasswordResetEmail}= require('../utils/emailService');
const { uploadImageToCloudinary  } = require('../utils/profileimage');
const { getDataUri } = require("../utils/dataUri");
const uuid = require('uuid');
require('dotenv').config();


// User Registration 
const userRegister = async (req, res) => {
    try {

        const user_id = uuid.v4();
        // Extract user data from request body
        const {  name, email, password,superadmin } = req.body;

        // Check if all required fields are provided
        if (!( name && email && password && superadmin )) {
            return res.status(400).json({ error: 'All fields are required' });;
        }


        
        // Check if the email is already in use
        const existingUser = await pool.query(queries.getUserByEmail, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        
        // Execute the SQL query to add a new user to the database
        const data = await pool.query(queries.addUser, [user_id, name, email, hashedPassword, superadmin]);

        // Generate JWT token
        const token = jwt.sign({email: email}, process.env.JWT_SCERET,{ expiresIn: '2h'});
       

        // Send registration confirmation email
            const mailSent=   await sendRegistrationConfirmationEmail(email);

            if(!mailSent){
                return res.status(400).json({ error: 'Mail not sent' });
            }
        // Respond with success message
        res.status(201).json({ success: true, token});
    } catch (err) {
        console.error('An error occurred while registering user:', err);
        // If an error occurs, respond with an internal server error message
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Login User
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

        
        const { name, email, password, bio, website } = req.body;

        const file = req.file;

        let uploadedImageUrl;

        if(!user_id ){
            return res.status(400).json({ error: 'User Id required' });
        }

        // Check if the user with the specified ID exists

        const checkUser = await pool.query(queries.getUserById, [user_id]);
        if(checkUser.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
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

            await sendPasswordResetEmail(email);
        }
        if (file) {
            // Upload the image to Cloudinary
            const dataUri = getDataUri(file)
            uploadedImageUrl = await uploadImageToCloudinary(dataUri);
            console.log(uploadedImageUrl);
            // Add the Cloudinary URL to the updateFields array
            updateFields.push('profile_picture_url = $' + index++);
            values.push(uploadedImageUrl);
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
        res.status(500).json({ error: 'Internal server error' });
    }
}


//Delete User by Id 

const deleteUser = async ( req, res ) =>{
    try{
        const { user_id } = req.params;
        
        if(!user_id){
            return res.status(400).json({ error: 'User Id is required' });
        }

        // Check if the user with the specified ID exists

        const checkUser = await pool.query(queries.getUserById, [user_id]);
        if(checkUser.rows.length === 0){
            return res.status(404).json({ error: 'User not found' });
        }


        const data = await pool.query(queries.deleteUser,[user_id]);

        res.status(200).send('User Delete Successfully');
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

//get Superadmin
const getSuperadmin = async (req, res) => {
    try {
        const {user_id} = req.params;
        if(!user_id){
            return res.status(400).json({ error: 'User Id is required' });
        }

        const data = await pool.query(queries.getUserById, [user_id]);
 
        if(data.rows.length === 0){
            return res.status(400).json({ error: 'User not found' });
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
    userLogin,
    updateUser,
    deleteUser,
    getSuperadmin
};
