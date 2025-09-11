<div align="center">

<h1 align="center">Raydius</h1>

<p align="center">
Connect exclusively within your campus.
<br />
<a href="#about-the-project"><strong>Explore the docs »</strong></a>
<br />
<br />
<a href="https://www.google.com/search?q=https://github.com/your-username/raydius/issues">Report Bug</a>
·
<a href="https://www.google.com/search?q=https://github.com/your-username/raydius/issues">Request Feature</a>
</p>
</div>

[][license-url]
[][linkedin-url]

<!-- TABLE OF CONTENTS -->

<details>
<summary>Table of Contents</summary>
<ol>
<li>
<a href="#about-the-project">About The Project</a>
<ul>
<li><a href="#built-with">Built With</a></li>
</ul>
</li>
<li>
<a href="#getting-started">Getting Started</a>
<ul>
<li><a href="#prerequisites">Prerequisites</a></li>
<li><a href="#installation--setup">Installation & Setup</a></li>
</ul>
</li>
<li><a href="#roadmap">Roadmap</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#contact">Contact</a></li>
</ol>
</details>

About The Project
Raydius is a closed-community dating application designed exclusively for university students. It combines the discoverability of Happn, the depth of Hinge, and the simplicity of Tinder, all within a secure, university-only environment.

The goal is to provide a safe, relevant, and engaging platform for students to make genuine connections with peers they cross paths with every day on campus.

Core Features:

✅ University Domain Verification: Ensures exclusivity by allowing sign-ups only from whitelisted university email domains.

🔑 Secure OTP Authentication: Passwordless login using one-time codes sent directly to the user's university email.

👤 In-Depth Profile Creation: Users can build a detailed profile with photos, personal information, interests, and ice-breaker prompts.

❤️‍🔥 Swiping & Matching: A familiar card-swiping interface to like or pass on profiles, with mutual likes resulting in a match.

💬 Real-time Chat: Once matched, users can communicate through a private, secure chat.

Built With
This project is built with a modern, full-stack JavaScript/TypeScript toolchain.

[][ReactNative-url]

[][Expo-url]

[][Node.js-url]

[][Express.js-url]

[][MongoDB-url]

Getting Started
To get a local copy up and running, follow these steps.

Prerequisites
Make sure you have the following software installed on your machine:

Node.js: Download Node.js (LTS version recommended)

MongoDB: A MongoDB Atlas Account for the database.

SMTP Service: An email service for sending OTPs (e.g., SendGrid or a test service like Ethereal).

Expo Go: The Expo Go App on your mobile device for testing.

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/raydius.git](https://github.com/your-username/raydius.git)
cd raydius

Backend Setup:

# Navigate to the server directory
cd server

# Install NPM packages
npm install

# Create a .env file (fill with your own credentials)
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
You will need to create a .env file in the server/ directory and add the following variables.

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

Roadmap
[x] User Authentication with OTP

[x] Profile Creation & Management

[ ] Swiping & Matching Logic

[ ] Real-time Chat with Socket.IO

[ ] Geolocation-based "Crossed Paths" Feature

[ ] User Settings (Discovery, Notifications, etc.)

See the open issues for a full list of proposed features (and known issues).

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

Contact
Your Name - @your_twitter - email@example.com

Project Link: https://github.com/your-username/raydius

<!-- MARKDOWN LINKS & IMAGES -->

[]: #
[license-url]: https://www.google.com/search?q=https://github.com/your-username/raydius/blob/main/LICENSE.txt
[]: #
[linkedin-url]: https://www.google.com/search?q=https://linkedin.com/in/your-linkedin
[]: #
[reactnative-url]: https://reactnative.dev/
[]: #
[expo-url]: https://expo.dev/
[]: #
[node.js-url]: https://nodejs.org/
[]: #
[express.js-url]: https://expressjs.com/
[]: #
[mongodb-url]: https://www.mongodb.com/
