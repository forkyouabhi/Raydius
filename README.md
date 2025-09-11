<div align="center">

# Raydius

Connect exclusively within your campus.  
<br />
<a href="#about-the-project"><strong>Explore the docs »</strong></a>  
<br />
<br />
<a href="https://github.com/your-username/raydius/issues">Report Bug</a>
·
<a href="https://github.com/your-username/raydius/issues">Request Feature</a>

</div>

---

[![License: MIT][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

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
<li><a href="#environment-variables">Environment Variables</a></li>
<li><a href="#roadmap">Roadmap</a></li>
<li><a href="#contributing">Contributing</a></li>
<li><a href="#license">License</a></li>
<li><a href="#contact">Contact</a></li>
</ol>
</details>

---

## About The Project

**Raydius** is a closed-community dating application designed exclusively for university students.  

It combines the discoverability of Happn, the depth of Hinge, and the simplicity of Tinder, all within a secure, university-only environment.

The goal is to provide a safe, relevant, and engaging platform for students to make genuine connections with peers they cross paths with every day on campus.

### Core Features
- ✅ **University Domain Verification** – Only whitelisted university emails allowed  
- 🔑 **Secure OTP Authentication** – Passwordless login via email OTP  
- 👤 **In-Depth Profiles** – Photos, personal info, interests & prompts  
- ❤️‍🔥 **Swiping & Matching** – Familiar card-based matching  
- 💬 **Real-time Chat** – Secure messaging once matched  

---

## Built With
- [React Native][reactnative-url]  
- [Expo][expo-url]  
- [Node.js][node.js-url]  
- [Express.js][express.js-url]  
- [MongoDB][mongodb-url]  

---

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)  
- [MongoDB Atlas](https://www.mongodb.com/) account  
- SMTP service (e.g., SendGrid, Ethereal for testing)  
- [Expo Go](https://expo.dev/client) on your phone  

### Installation & Setup

```bash
# Clone repo
git clone https://github.com/your-username/raydius.git
cd raydius
```
### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
#### Server runs on: http://localhost:4000 
### Frontend set-up
```bash
cd src
npm install
npx expo start
```
### Environment Variables

Add these to server/.env:

```
PORT=4000
MONGO_URL="mongodb+srv://..."
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
ALLOWED_DOMAINS=your-university.edu,another.edu

SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
MAIL_FROM="Raydius <no-reply@raydius.app>"
```
