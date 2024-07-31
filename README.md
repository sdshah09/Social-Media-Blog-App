# Social Media Blog App 

A social media blog-type application built with the MERN stack (MongoDB, Express.js, React, Node.js), GraphQL for API queries, Cloudinary for image uploading, and Firebase for authentication. The app is deployed on Heroku.

## Features

- User authentication and authorization (Firebase)
- Create, read, update, and delete blog posts
- Upload and manage images with Cloudinary
- User profiles and social features
- Real-time updates with GraphQL subscriptions
- Responsive design

## Demo

Check out the live demo [here](https://gql-client-55882c1fa0c4.herokuapp.com/).

## Technologies Used

- **Frontend**: React, Apollo Client, CSS
- **Backend**: Node.js, Express.js, GraphQL, Apollo Server, MongoDB
- **Authentication**: Firebase
- **Image Upload**: Cloudinary
- **Deployment**: Heroku

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sdshah09/Social-Media-Blog.git
   cd Social-Media-Blog
   Install the dependencies for both frontend and backend:
   ```

## Setup Instructions

### Backend

1. Navigate to the `server` directory:
    ```bash
    cd ../server
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory and add the following environment variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    FIREBASE_APP_ID=your_firebase_app_id
    ```

4. Add the `fbserviceaccount.json` file to the `config` folder on the server. This file contains your Firebase keys.

### Frontend

1. Navigate to the `client` directory:
    ```bash
    cd ../client
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `client` directory and add the following environment variables:
    ```env
    REACT_APP_WEBSOCKET_URL=your_websocket_url
    REACT_APP_REST_ENDPOINT=your_rest_endpoint
    ```

### Firebase Configuration

1. Go to the Firebase Console and create a new project.
2. Enable Authentication and set up your preferred sign-in methods.
3. Copy your Firebase configuration and add it to your frontend Firebase config file.

### Start the Development Servers

1. Start the backend server:
    ```bash
    cd server
    npm start
    ```

2. Start the frontend server:
    ```bash
    cd ../client
    npm start
    ```

3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Usage

- Register a new user account or log in with existing credentials using Firebase authentication.
- Create a new blog post by clicking on the "New Post" button.
- Upload images to your post via Cloudinary integration.
- Interact with other users' posts by commenting and liking.
- Edit or delete your posts as needed.

## Project Structure
Social-Media-Blog/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── contexts/
│ ├── firebase/
│ ├── pages/
│ └── App.js
├── server/ # Node.js backend
│ ├── config/
│ ├── models/
│ ├── resolvers/
│ ├── schema/
│ └── index.js
├── .gitignore
├── README.md
└── package.json


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Create a pull request.

## Contact

For any questions or feedback, please contact [shaswatshah2727@gmail.com](mailto:shaswatshah2727@gmail.com).

Feel free to adjust any sections or details as needed for your specific project.
