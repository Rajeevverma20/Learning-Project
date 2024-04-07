const pool = require('../Database/connection'); 
const queries = require('../Database/queries/courseQuery'); 
const uuid = require('uuid');

const createCourse = async( req, res ) =>{
    try{

        const  course_id  = uuid.v4();

        const { title, description, category, level, price, created_by, duration, instructor } = req.body;

        if(!( title && description && category && level && price && created_by && duration &&instructor)){
                return res.status(400).json({ error: 'All fields are required' });
            }
        
        const data = await pool.query(queries.addCourse,  [course_id, title, description, category, level, price, created_by, duration, instructor]);
       
        res.status(200).send('created successfully ')

    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Get All Courses

const getAllCourses = async ( req, res ) =>{
    try{

        const data = await pool.query(queries.getCourse);

        res.status(200).send(data.rows)

    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


//Get Course By Id


const getCourseById = async ( req, res ) =>{
    
    try{
        const { course_id } = req.params;

        if(!course_id){
            return res.status(400).json({ error: 'Course Id is required' });
        }

        const data = await pool.query(queries.getCourseById, [course_id]);

        if(data.rows.length === 0){
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).send(data.rows[0])

    }catch(err){
        console.log(err);
        res.status(500).send('Internal server error');
    }
}


//Update Course By Id
const updateCourse = async (req, res) => {
    try {
        const { course_id } = req.params;
        const { title, description, category, level, price, created_by, duration, instructor } = req.body;

        if (!course_id) {
            return res.status(400).json({ error: 'Course Id is required' });
        }

        const checkCourse = await pool.query(queries.getCourseById, [course_id]);

        if (checkCourse.rows.length === 0) {
            return res.status(400).json({ error: 'Course not found' });
        }

        const updateFields = [];
        const values = [];
        let index = 1;

        if (title) {
            updateFields.push('title = $'+ index++);
            values.push(title);
        }

        if (description) {
            updateFields.push('description = $'+index++);
            values.push(description);
        }

        if (category) {
            updateFields.push('category = $'+index++);
            values.push(category);
        }

        if (level) {
            updateFields.push('level = $'+ index++);
            values.push(level);
        }

        if (price) {
            updateFields.push('price = $'+ index++);
            values.push(price);
        }

        if (created_by) {
            updateFields.push('created_by = $'+ index++);
            values.push(created_by);
        }

        if (duration) {
            updateFields.push('duration = $'+ index++);
            values.push(duration);
        }

        if (instructor) {
            updateFields.push('instructor = $'+ index++);
            values.push(instructor);
        }

        

        const query = `UPDATE Courses SET ${updateFields.join(', ')} WHERE course_id = $${index}`;
        values.push(course_id);

        const data = await pool.query(query, values);

        res.status(201).send('Course Update Successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// Delete Course By ID

const deleteCourse = async( req, res ) =>{

    try{

        const { course_id } = req.params;

        if(!course_id){
            return res.status(400).json({ error: 'Course Id is required' });
        }

        const checkCourse = await pool.query(queries.getCourseById, [course_id]);
        if(checkCourse.rows.lengt === 0){
            return res.status(400).json({ error: 'Course not found' });
        }

        const data = await pool.query(queries.deleteCourse, [course_id]);

        res.status(200).send('Course Delete Successfully')


    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}




// Endpoint to fetch courses with filtering and pagination
const getCourses = async (req, res) => {
    try {
        const { category, level, page = 1, limit = 10 } = req.query;
        
        const filters = [];
        const filterValues = [];
        
        if (category) {
            filters.push('category = $1');
            filterValues.push(category);
        }
        
        if (level) {
            filters.push('level = $2');
            filterValues.push(level);
        }
        
        const offset = (page - 1) * limit;
        
        const filterQuery = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
        const query = `
            SELECT *
            FROM courses
            ${filterQuery}
            LIMIT $${filters.length + 1} OFFSET $${filters.length + 2}
        `;
        
        const queryValues = [...filterValues, limit, offset];
        
        const { rows: courses, rowCount: totalCourses } = await pool.query(query, queryValues);
        
        const totalPages = Math.ceil(totalCourses / limit);
        
        res.status(200).json({
            courses,
            currentPage: page,
            totalPages,
            totalCourses,
        });   
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports ={
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourses
}