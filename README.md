# Web File Storage Clone

This repository contains a clone of a web file storage application. The project is divided into two main parts: the frontend and the backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- File upload and download
- File sharing
- Responsive design

## Tech Stack

### Frontend

- **TypeScript**
- **Vue.js**
- **CSS**
- **HTML**
- **JavaScript**

### Backend

- **Node.js**
- **Express**
- **MongoDB**

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/azrasabila/web-file-storage-clone.git
    cd web-file-storage-clone
    ```

2. Install dependencies for both frontend and backend:
    ```sh
    # Navigate to the frontend folder and install dependencies
    cd frontend
    npm install

    # Navigate to the backend folder and install dependencies
    cd ../backend
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `backend` folder and add the necessary environment variables (e.g., MongoDB connection string, JWT secret).

## Usage

### Running the Frontend

1. Navigate to the `frontend` folder:
    ```sh
    cd frontend
    ```

2. Start the development server:
    ```sh
    npm run serve
    ```

3. Open your browser and go to `http://localhost:8080`.

### Running the Backend

1. Navigate to the `backend` folder:
    ```sh
    cd backend
    ```

2. Start the server:
    ```sh
    npm run start
    ```

3. The backend server will run on `http://localhost:3000`.

## Folder Structure
