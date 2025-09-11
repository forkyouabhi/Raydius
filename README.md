# Raydius
Connect exclusively within your campus.

Raydius is a closed-community dating application designed for university students. It combines the discoverability of Happn, the depth of Hinge, and the simplicity of Tinder, all within a secure, university-only environment.

About The Project
This project is a full-stack mobile application built with a modern tech stack. The goal is to provide a safe, relevant, and engaging platform for students to make genuine connections with peers they cross paths with every day on campus.

Core Features:

Email Domain Verification: Ensures exclusivity by allowing sign-ups only from whitelisted university email domains.

OTP Authentication: Secure, passwordless login using one-time codes sent to the user's university email.

Profile Creation: Users can build a detailed profile with photos, personal information, interests, and ice-breaker prompts.

Swiping & Matching: A familiar card-swiping interface to like or pass on profiles, with mutual likes resulting in a match.

Real-time Chat: Once matched, users can communicate through a private chat.

Tech Stack
This project is built with the following technologies:

Backend (Node.js)

Framework: Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT) & bcryptjs for hashing

Validation: Joi

Email Service: Nodemailer

File Storage: AWS S3 for photo uploads (planned)

Frontend (React Native)

Framework: Expo (with Expo Router)

Language: TypeScript

Navigation: Expo Router

State Management: React Context

HTTP Client: Axios

UI: React Native core components

Getting Started
To get a local copy up and running, follow these steps.

Prerequisites
Make sure you have the following software installed on your machine:

Node.js (LTS version recommended)

MongoDB Atlas Account (for the database)

An SMTP service for sending emails (e.g., SendGrid or a test service like Ethereal)

Expo Go App on your mobile device for testing.

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/raydius.git](https://github.com/your-username/raydius.git)
cd raydius

Backend Setup:

# Navigate to the server directory
cd server

# Install NPM packages
npm install

# Create a .env file from the example
# (You will need to fill this with your own credentials)
cp .env.example .env

# Start the backend server
npm run dev

The server will be running on http://localhost:4000.

Frontend Setup:

# Navigate to the frontend directory from the root
cd src

# Install NPM packages
npm install

# Start the Expo development server
npx expo start

Scan the QR code with the Expo Go app on your phone.

Environment Variables
You will need to create a .env file in the server/ directory and add the following variables. These are essential for the backend to function correctly.

# Server Port
PORT=4000

# Your MongoDB connection string
MONGO_URL="mongodb+srv://..."

# A strong, secret key for signing JWTs
JWT_SECRET="YOUR_SUPER_SECRET_KEY"

# Comma-separated list of allowed university email domains
ALLOWED_DOMAINS=your-university.edu,another.edu

# SMTP credentials for sending OTP emails
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
MAIL_FROM="Raydius <no-reply@raydius.app>"

Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE.txt for more information.
