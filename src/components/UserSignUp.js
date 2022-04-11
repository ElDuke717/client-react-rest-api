import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form'

//state - firstName, lastName, emailAddress, password, errors

//UserSignUp is a class component that renders the sign-up form.  See CreateCourse and Form Components to see how Form and render props work.
export default class UserSignUp extends Component {
    state = { 
      firstName:'',
      lastName:'',
      emailAddress:'',
      password:'',
      errors:[]
    }
    
    render() {
      const {
        firstName, 
        lastName, 
        emailAddress, 
        password, 
        errors} = this.state;
    
        return (
          <div className="form--centered">
            <div className="grid-33 centered signin">
              <h1 className="signupheader">Sign Up</h1>
              <Form 
                cancel={this.cancel}
                errors={errors}
                submit={this.submit}
                submitButtonText="Sign Up"
                elements={() => (
                  <React.Fragment>
                    <input 
                      id="firstName" 
                      name="firstName" 
                      type="text"
                      value={firstName} 
                      onChange={this.change} 
                      placeholder="First Name" />
                      <input 
                      id="lastName" 
                      name="lastName" 
                      type="text"
                      value={lastName} 
                      onChange={this.change} 
                      placeholder="Last Name" />
                    <input 
                      id="emailAddress" 
                      name="emailAddress" 
                      type="text"
                      value={emailAddress} 
                      onChange={this.change} 
                      placeholder="Email Address" />
                    <input 
                      id="password" 
                      name="password"
                      type="password"
                      value={password} 
                      onChange={this.change} 
                      placeholder="Password" />
                  </React.Fragment>
                )} />
              <p>
                Already have a user account? <Link to="/signin">Click here</Link> to sign in!
              </p>
            </div>
          </div>
        );
      }
    
      change = (event) => {
        const name = event.target.name;
        const value = event.target.value;
    
        this.setState(() => {
          return {
            [name]: value
          };
        });
      }
    
      submit = () => {
        const { context } = this.props;
        
        const { 
          firstName, 
          lastName,
          emailAddress,
          password
      } = this.state

      //Create a user that will get passed to context.data.createUser and ultimately to the api.
        const user = { 
          firstName, 
          lastName,
          emailAddress,
          password
        }

    //Creates a new user using the createUser method in Data.js - user is passed as an argument and is the object  holds 
    //the user's information.
      context.data.createUser(user)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          //If the response from Data.js returns no errors or an empty array, it means the user was created successfully.
          //The user is logged in after successfully creating an account.
          context.actions.signIn(emailAddress, password) 
          .then(() => {
            this.props.history.push('/');    
          });      
          console.log(`${firstName} ${lastName} has been created!`);
          };
        })
        .catch( err => { //handle rejected promises
          console.log(err);
          this.props.history.push('/error'); // render the error page
        });
      //send the user to the signup page if the user is not created successfully.  This is necessary so that it unmounts the component, prevents errors and allows the 
      //validation errors to be displayed.  Without this, componentDidUnmount would need to be used to prevent memory leaks.
      this.props.history.push('/signup');
      }
    
      cancel = () => {
        this.props.history.push('/'); //push the user back to the home page
      }
    }  
  
