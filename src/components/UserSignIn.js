import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

//UserSignIn is a class component that renders the sign-in form.  See CreateCourse and Form Components to see how Form and render props work.
export default class UserSignIn extends Component  {
  
  //constructor contains code to handle goBack functionality as part of history object.
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }
  //initial state emailAddress, password, errors are blank
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }
 
  render() { 
    const {
      //emailAddress, password, errors are pulled out of state, added via form entries and setState below.
      emailAddress,
      password,
      errors,
    } = this.state
  
  
  return (
    <div id="root">
        <div className="form--centered">
        <h2>Sign In</h2>        
        <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email address" />
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
            Don't have a user account? <span className="click-here"><Link to="/signup">Click here</Link></span> to sign up!
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
    // extract context from props passed by the provider
    const { context } = this.props;
    // define "from" from props as the previous intended location for the user that hans't been redirected to the sign-in page.
    const { from } = this.props.location.state || { from: { pathname: '/courses' } };
    // unpack username and password from state
    const { emailAddress, password } = this.state;
    // call the signIn method from the context and pass email address and password into it as arguments
    context.actions.signIn(emailAddress, password)
      .then((user) => {
        if (user === null ) { 
          this.setState(() => {
            return { errors: ['Invalid username or password'] };
          });
        } else { 
          // if sign-in is successful, redirect to the original destination page, stored in location state.from in props passed from PrivateRoute
            //from https://teamtreehouse.com/library/react-authentication/react-router-and-authentication/refine-and-complete-authentication
            //Smarter Redirect from Unauthenticated Users
          this.props.history.push(from);

        //log that user has successfully signed in
          console.log(`sign-in successful, ${user.firstName} ${user.lastName} is signed in!`);
         
        }
      })
      .catch((error) => {
        console.log(error);
        this.props.history.push('/error');
      });
  }

  cancel = () => {
    this.props.history.push('/');
  }
}