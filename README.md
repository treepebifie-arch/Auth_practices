# Auth_practices

## description
This is a project that performs basic authentication and authorization functions. It follows MVC architure for clarity, scalability and easier debugging.

## Technologies Used
Node.js: Runtime environment 

Express.js.: Nodejs framework

MongoDB: non-relational Database

Mongoose: ODM for MongoDB

Morgan: middleware for easier debugging

Bcryptjs: for password hashing

Jsonwebtoken: authorization/generating token

nodemailer: sending emails from the backend

## Folder Structure
The folder structure is based on the MVC architecture, which helps to keep the code organized, and to make debugging easier.The root directory, src, contains other directories such as controllers, models, routes and config


```text

├── .gitignore      // Specifies files/folders Git should ignore.
├── package.json    // contains all dependencies used in this project.
├── index.js        // The main entry point and Express application setup.
├── README.md       // Brief description of the project and how to run it.
└──src 
    ├── models/         // Database Schemas
    ├── routes/         // Defines all route endpoints for user's authentication and authorization.
    ├── config/         // Database connection, email setup and authorization middleware.
    └── controllers/    // Holds logic/endpoint controllers

```

## How to run Locally 
* Clone this Repository
* Install all Dependencies listed in the package.json file
* Create the required .env file that will contain your mongoDB connection URI and port.

* Start the Server using 'node index.js' or 'npm run dev' after installing nodemon as a devDependency for nodemon to automatically run the server. 

The server will run on http://localhost: (the port specified in your .env).

* You can now test the endpoints using thunder client or postman,  interacting with the database via the /api/users route.

## ENDPOINTS 

| Method | Endpoint | Description | 
| :--- | :--- | :--- | 
| **POST** | `/api/users/signup` | Creates a new user. |
| **POST** | `/api/users/login` | login an existing user |
| **PUT** | `/api/users/verify-otp` | Verify user's account using otp. |
| **PUT** | `/api/users/resend-otp` | Resends a new otp if otp has expired. |
| **GET** | `/api/users/get-all-users` | allows only admin to see all users | 
| **PATCH** | `/api/users/make-admin` | allows an admin to change the role of a user to an admin | 
| **PUT** | `/api/user/resetpassword`| Create or Reset a new password for users. |

