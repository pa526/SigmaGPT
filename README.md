# SigmaGPT: MERN Stack AI Chatbot Implementation

## Overview

SigmaGPT is a MERN (MongoDB, Express.js, React, Node.js) stack application that implements an AI chatbot. This project demonstrates the integration of a powerful AI model with a full-stack web application, providing an interactive conversational experience.

## Features

*   **Interactive Chat Interface**: A user-friendly interface for engaging with the AI chatbot.
*   **Real-time Conversations**: Seamless, real-time communication with the AI.
*   **MERN Stack Architecture**: A robust and scalable foundation for the application.
*   **User Authentication**: Secure user login and session management (if implemented).
*   **Scalable Backend**: Designed to handle multiple concurrent user interactions.

## Technologies Used

*   **Frontend**: React.js, HTML5, CSS3, JavaScript
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **AI Integration**: (Specify AI model/API used, e.g., OpenAI GPT API, custom model)
*   **Other**: Mongoose, WebSockets (for real-time communication, if applicable)

## Getting Started

### Prerequisites

Ensure you have the following installed:

*   Node.js (LTS version recommended)
*   MongoDB
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pa526/SigmaGPT.git
    cd SigmaGPT
    ```

2.  **Install backend dependencies:**
    ```bash
    cd Backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../Frontend
    npm install
    ```

### Configuration

Create a `.env` file in the `Backend` directory and add your environment variables (e.g., MongoDB URI, AI API Key).

```
MONGO_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
PORT=5000
```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd Backend
    npm start
    ```

2.  **Start the frontend development server:**
    ```bash
    cd ../Frontend
    npm start
    ```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if applicable).
