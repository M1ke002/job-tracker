# Job Tracker

## Overview

A web app to scrape job boards and track job application stages, built with React and Flask.

## Features

- Scrape and display job details of popular job websites, based on user-defined settings
- Daily searches for new job postings and notify the user via email or on the website
- Search, and filter the list of jobs based on user input
- Save, edit, or delete a specific job
- Track job application stages by dragging and dropping jobs on different columns (Applied, Interview, Offer, Rejected) 
- Set task reminders, contacts info and notes for a specific job
- Allows uploading documents (CV, Cover letter) and attach them to jobs

## Technologies Used

- Frontend: React, TailwindCSS, shadcn-UI
- Backend: Flask
- Database: MySQL
- File storage: Firebase

## Installation

### 1. Clone this repository

```
git clone https://github.com/M1ke002/discord-app.git
```

### 2.1. Frontend

Navigate to the `frontend` directory and install the dependencies

```
npm install
```
Run the app (on http://localhost:5173)
```
npm run dev
```
### 2.2. Backend

Navigate to the `backend` directory, create and activate a python virtual environment:

```
python -m venv my_env
my_env\Scripts\activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Create a .env file and setup env variables:

```
# db config
DB_NAME=job_tracker
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_HOST=

GMAIL_USERNAME = name@gmail.com
GMAIL_APP_PASSWORD = your_google_acc_app_password

#Firebase config
FIREBASE_API_KEY = 
FIREBASE_AUTH_DOMAIN = 
FIREBASE_DATABASE_URL = 
FIREBASE_PROJECT_ID = 
FIREBASE_STORAGE_BUCKET =
FIREBASE_MESSAGING_SENDER_ID =
FIREBASE_APP_ID =
FIREBASE_MEASUREMENT_ID =
```
Run the server (on http://127.0.0.1:5000)
```
flask run
```
