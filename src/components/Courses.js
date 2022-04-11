import React, { useState, useEffect } from 'react';
import { useHistory  } from "react-router-dom";
import Course from './Course'
import axios from 'axios';

//Courses displays the courses that are saved in the database.  The courses are mapped over using the Course component.  API calls are made directly from this component.

const Courses = () => {
    //useState sets the state for the Courses component.  setCourses is called when the axios call is made to the server and the response is saved into the state.
    const [ courses, setCourses ] = useState([]);
    //React router's useHistory is used to access the history object.  We have to use useHistory since this is a functional component and is used below to red
    const history = useHistory();
    
    const getCourses = async () => {
        await axios.get('http://localhost:5000/api/courses')
        //The response from axios request is saved into the state, pushed into the array, and then the array is returned. 
        .then(response => setCourses(response.data))
            .catch(error => {
                console.log(error.message)               
                //if there's a 500 error, then the user is redirected to the error page
                history.push('/error')
            });    
        }
    
    //useEffect is called after the component is rendered and allows the axios fetch request to complete before it proceeds.  The same as componentDidMount in a class component.
    useEffect(() => {
        //Call the above function getCourses
        getCourses();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    []);
    
  return (
    <div id="root">
        <main>
            <h2 className = 'selectCourse'>Please select a course below</h2>
            <div className="wrap main--grid">
                {/* The Courses component's state is mapped over and each course is passed into the Course component. */}
                {courses.map(course => <Course info={course} key={course.id} title = {course.title} id={course.id} href= {`http://localhost:5000/api/courses/${course.id}`}/> )}
                <a className="course--module course--add--module" href="/create">
                    <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                        Add a New Course
                    </span>
                </a>
            
            </div>
        </main>
    </div>
  );
};

export default Courses;