import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory  } from "react-router-dom";
import { Context } from "../Context";
import axios from "axios";
import Forbidden from './Forbidden';

//DeleteCourse is resposible for rendering the delete course page AND handling the delete course process.  It pulls the specific course data from the API, matches the author id with the authenticatedUser id, and then passes the course data to the deleteCourse function in context.data.

const DeleteCourse = () => {
    //Get context to verity the authenticatedUser
    const context = useContext(Context);
    
    //useParams is a hook that returns an object with the id of the course from the URL - it will be used in the deleteCourse function
    let { id } = useParams();
    
   //course is initiated to hold the course data, then setCourse is used to push the course data from axios into the state.
    const [ course, setCourse ] = useState([])
   
    //React router's useHistory is used to access the history object.  We have to use useHistory since this is a functional component.
    const history = useHistory();
    
    //Pull the  emailAddress and password from the context.  These are added to the course object that's passed to deleteCourse for credentials in the header.
    const { emailAddress, password } = context.authenticatedUser;

    //useEffect is called after the component is rendered and allows the axios fetch request to complete before it proceeds.  It replaces componentDidMount.
    useEffect(() => {
        
        //getCourseData pulls in the most up-to-date information from the server for the course.  It is called in the useEffect hook below.
        const getCourseData = () => {
            axios.get(`http://localhost:5000/api/courses/${id}`)
            //The response from axios request is saved into the state, pushed into the array, and then the array is returned.
            .then(response => setCourse(response.data))  
            .catch(error => {
                    console.log(error.message)
                });    
        }
        getCourseData();
        return () => {
            setCourse({}); // From stackoverflow: https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
        };
        
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ,[] //leaving the array out here as it seems to throw an error by being present.  
    );
    
    //JavaScript's Object.assign method to add the user's email and password to the course object, so that it can be accessed by deleteCourse.
    //const updatedCourse = Object.assign(course, {emailAddress:emailAddress, password:password});
    Object.assign(course, {emailAddress:emailAddress, password:password});  

    //Cancel uses history to redirect the user to the specific course page.  
    const cancel = () =>  {
        history.push(`/courses/${id}`);
    };
    
    //deleteCourse is called when the user clicks the delete button.  It calls deleteCourse in context.data
    const deleteCourse = () => {
        context.data.deleteCourse(course)
        //chain on .then method so deleteCourse can finish asynchronously before redirecting to the courses page. Thanks to Chris Adams for pointing this out.
        //important to remember that async operations need to be followed by .then methods so operations can be completed before the next operation is run.
        .then(() => {
            console.log(`Course ${course.title} has been deleted`);
            //redirect to the courses page
            history.push("/");
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    //userId of the authenticatedUser
    const authUser = context.authenticatedUser.id;
    //userId of the courseAuthor
    const courseAuth = course.userId;
    
     //If the user is not authenticated, they are redirected to the Forbidden page.
    if (courseAuth !== authUser) { 
        return <Forbidden />
       } 
    return(
        <div className='delete--message'>
            <h1>Are you sure that you want to delete</h1>
            <h2 className='delete-course-button'>{course.title} Course?</h2>
            <button className="button" onClick={deleteCourse}>Yes, Delete It!</button>
            <button className="button button-secondary" onClick={cancel} >Cancel</button>
        </div>        
    )
}

export default  DeleteCourse;