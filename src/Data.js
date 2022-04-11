import config from './config';

//Data is where all the CRUD operations are handled.  This is where all the Form api calls are made.
export default class Data {
  //requiresAuth and credentials have default values passed in case no values or undefined are passed for either of them
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    //const url configures the URL path using the base URL defined in config.js 
    const url = config.apiBaseUrl + path;
    
    //options is an object that sends a request with the HTTP method (GET, POST, etc.) and request headers as a stringified body.
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    // Check if auth is required
    if (requiresAuth) {
      // btoa creates a base-64 encoded string from a string of text.  It is used to encode the credentials.
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      //decoded credentials are used for error checking
      // const decodedCredentials = atob(encodedCredentials);
      // console.log(decodedCredentials);
      // Adds authorization header to the request by appending the headers object
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    //accepts url from above as first arg, options as second arg that is a configuration object that lets you control request settings
    return fetch(url, options);
  }

  //Performs an async operation to GET an existing user using the api method above to the /users endpoint.
  async getUser(emailAddress, password) {
    // calls the api method above and passes in the path to the endpoint and the method (GET), sets requiresAuth to true and passes in
    // credentials from the user object.
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    console.log(`getUser server response: ${response.status}`);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  //Performs an async operation to POST/create a user using the api method above to the /users endpoint.
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    console.log(`createUser server response: ${response.status}`);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  //Performs an async operation to POST/create a new course using the api method above to the /courses endpoint.
  async createCourse(course) { 
    const response = await this.api('/courses', 'POST', course, true, { emailAddress: course.emailAddress, password: course.password });
    console.log(`createCourse server response: ${response.status}`);
    if(response.status === 201) { return []; }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  
  //Performs an async operation to PUT/update an existing course using the api method above to the /courses endpoint.
  async updateCourse(course) { 
    const response = await this.api(`/courses/${course.courseId}`, 'PUT', course, true, { emailAddress: course.emailAddress, password: course.password });
    console.log(`updateCourse server response: ${response.status}`);
    if(response.status === 201 || response.status === 204) { return []; }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    } else if (response.status === 500) {
      return response.json().then(data => {
        return data.errors;
      });

    }
    else {
      throw new Error();
    }
  }

  //Performs an async operation to DELETE an existing course using the api method above to the /courses endpoint.
  async deleteCourse(course) { 
    const response = await this.api(`/courses/${course.id}`, 'DELETE', course, true, { emailAddress: course.emailAddress, password: course.password });
    console.log(` deleteCourse server response: ${response.status}`);
    if(response.status === 201 || response.status === 204 || response.status === 200) { return []; }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

}

