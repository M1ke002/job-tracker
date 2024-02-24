# Job Tracker

## Overview

A web app to scrape job boards and track job application stages, built with React and Flask.

## Features

- Scrapes and displays job details from popular job websites, customizable through user settings.
- Automatically searches daily for new job postings and notifies users via email or within the website.
- Search and filter the list of jobs based on user input criteria.
- Save, edit, or delete specific job listings.
- Tracks job application stages by dragging and dropping jobs across different columns (Applied, Interview, Offer, Rejected).
- Set task reminders, store contact information, and add notes for specific job listings.
- Upload documents (CV, cover letters) and attach  them to relevant job listings.

## Tech stack

- Frontend: React, TailwindCSS, shadcn-UI
- Backend: Flask
- Database: MySQL
- File storage: Firebase

## Screenshots


<kbd><img src="https://github.com/M1ke002/job-tracker/assets/92376409/bad87362-3b7e-4bf9-9411-95900248f763" alt="first1" style="margin-bottom: 50px;"></kbd>
<kbd><img src="https://github.com/M1ke002/job-tracker/assets/92376409/87f8627d-697f-477b-9b2e-0db9e6dd5bbf" alt="first2" style="margin-bottom: 50px;"></kbd>
<kbd><img src="https://github.com/M1ke002/job-tracker/assets/92376409/f2536553-8bf7-4db7-8ffa-0800a2bf91dd" alt="first3" style="margin-bottom: 50px;"></kbd>

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
