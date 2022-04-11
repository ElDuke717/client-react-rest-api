import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useHistory} from "react-router-dom"
//import context from "export const Context = React.createContext();" in Context.js to access authenticatedUser 
import { Context } from '../Context';
import ReactMarkdown from 'react-markdown';


//Click on "Update Course" button from Courses.js, then import course specific information from the course props and use to populate data in this view
//Course details are passed via props from Courses.js

//import course specific information from the course object
const CourseDetail = (props) => {
    //useState sets the state for the Courses component.  setCourses is called when the axios call is made to the server and the response is saved into the state.
    const [ course, setCourse ] = useState([]);
    //React router's useHistory is used to access the history object.  We have to use useHistory since this is a functional component and is used below to red
    const history = useHistory();
    
    //useContext is used to access the authenticatedUser state from the Context.js file 
    const {authenticatedUser} = useContext(Context);
    //authId is used to compare the autthenticatedUser's id with the course creator's id to determine if the authenticatedUser is the creator of the course
    //if authenticatedUser is null, then the id is set to zero so the comparison logic can be used.
    let authId;
    if (authenticatedUser === null) {
        authId = 0;
    } else {
        authId = authenticatedUser.id;
    }//}
    //userId is initiated so that conditional logic can be used below - if it's not used, then course.userId will be undefined
    let userId; 
    //logic that sets the userId variable for logic using in rendering buttons below.
    course.user ? userId = course.user.id : userId = "";

    //id gets the course id from the URL throuugh useParams - :id is set in the route in app, and useParams is able to pull the id from the URL based on the route's id.
    let { id } = useParams();

  //useEffect is called after the component is rendered and allows the axios fetch request to complete before it proceeds. 
    useEffect(() => {
    //`http://localhost:5000/api/courses/${id}` pulls in the course id from the URL and uses it to pull the course information from the server.
        const getData = () => {
            axios.get(`http://localhost:5000/api/courses/${id}`)
            //The response from axios request is saved into the state, pushed into the array, and then the array is returned.
            .then(response => setCourse(response.data))
                .catch(error => {
                    if (error.message === 'Network Error') {
                        console.log(error.message)
                        console.log(error)
                        //if there's a 500 error, then the user is redirected to the error page
                        history.push('/error')
                    } else {
                    //redirects to the notfound page if the course id is not found
                    history.push('/notfound');
                }});    
            } 

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]); //is used to prevent the useEffect from running on every render.  Leaving it out will cause the useEffect to run on every render and thus continuously fetch the data.


    return (
    <div id="root">
        <main>
            <div className="actions--bar">
                <div className="wrap">
                {    
                    //if the authenticatedUser is not null and authenticatedUser Id matches the userId for the course, then the user is logged in and the following buttons are rendered
                    userId === authId ?
                    <span>
                    <Link className="button" to={{pathname:`/courses/${id}/update`}}>Update Course </Link>
                    <Link className="button" to={{pathname:`/courses/${id}/delete`}}>Delete Course</Link>
                    </span> 
                    : ""
                    }
                    <a className="button button-secondary" href="/">Back to Course List</a>
                </div>
            </div>
            
            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course.title}</h4>
                            {course.user ? <p>By {course.user.firstName} {course.user.lastName} </p> : <p> No User Found </p>}
                            {/* ReactMarkdown is used allow Markdown to be appropriately displayed */}
                            <ReactMarkdown children = {course.description}/>
                            
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course.estimatedTime}</p>

                            <h3 className="course--detail--title">Materials Needed</h3>
                            <div className ="course--detail--list">
                                <ReactMarkdown children = {course.materialsNeeded}/>
                            </div>                            
                        </div>
                    </div>
                </form>
            </div>
        </main>
    </div>

    );
  };

  export default CourseDetail;