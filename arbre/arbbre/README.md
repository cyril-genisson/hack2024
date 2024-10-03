# Chat with AI

This is a simple web application that allows users to chat with an AI model using Flask. The application sends user messages to a local language model (LM) server and displays the AI's responses in a chat interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Chat interface for real-time messaging
- Sends user input to an AI model
- Displays AI responses
- Simple and responsive design

## Technologies Used

- **Backend**: Flask
- **HTTP Requests**: requests
- **Frontend**: HTML, CSS, JavaScript

## Installation

To set up this project, follow these steps: 

Install LM Studio by downloading it from the official [LM Studio website](https://lmstudio.com). After installation, start the LM Studio application. Next, download the `chocolatine-3b-instruct-dpo-revised` model from the LM Studio model repository or the official GitHub page, and load the model into LM Studio by following the application's instructions to import the model. 

Then, clone the repository:

#### bash
`git clone <repository-url>
cd <repository-name>`



## Installation 
(Optional but recommended) Create a virtual environment:
`python -m venv venv
source venv/bin/activate`
 # On Windows use `venv\Scripts\activate



 `Install the required packages:
 pip install -r requirements.txt`

Usage
Ensure that your local LM Studio server is running with the chocolatine-3b-instruct-dpo-revised model loaded. Run the Flask application:
`python app.py` to run the `flask run --reload`


### Project Structure

```/your_project_folder
    /static
        style.css       # CSS file for styling
        script.js       # JavaScript file for client-side logic
    /templates
        index.html      # HTML file for the chat interface
    app.py              # Flask application
    requirements.txt    # Python dependencies```


### Files
app.py: Flask backend handling the API requests to the local LM server.
index.html: HTML file containing the chat interface.
style.css: CSS file for styling the chat application.
script.js: JavaScript file for handling user input and API requests.
