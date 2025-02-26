## Overview
This backend is responsible for handling API requests, processing data, and managing interactions with the database, and in the future, interactions with GCP. It is built using **Node.js** with **Express.js** and connects to a **MongoDB** database.


## Installation
### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/lroe34/csi-43c9-capstone-tuberculosis.git
   cd csi-43c9-capstone-tuberculosis/backend
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Create a `.env` file in the root of the backend folder and set the required environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   yarn dev
   ```
   The backend should now be running at `http://localhost:5000`.

## API Endpoints
### Authentication
#### Note: These endpoints will be updated with better naming conventions pertaining to authentication in the future
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - User login and token generation
