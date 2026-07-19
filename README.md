# CampusConnect: An All-in-One Campus Management Portal

## Description

CampusConnect is a full-stack MERN campus portal serving as a centralized, intuitive hub for students to seamlessly manage 5+ university services and streamline daily academic operations. Built with MongoDB, Express.js, React.js, and Node.js, the platform offers a seamless experience for students and administrators alike. 

It features a secure admin dashboard powered by Google's Gemini AI for auto-generating rich-text announcements, a pinned banner for critical updates, and a comment moderation system, alongside real-time status tracking and dynamic filtering across all modules.

## Features

### Core AI Feature
- **AI-Powered Announcements:** Automatically generate official announcements using Google's Gemini AI. Provide a topic or prompt, and let the AI create well-structured, engaging rich-text content for you.

### Student Portal (Client-Side)
- **Centralized Hub:** Manage 5+ university services seamlessly from a single, modern dashboard.
- **Responsive Design:** A clean and modern UI built with Tailwind CSS that works beautifully across all devices.
- **Announcements Feed:** View official university announcements, featuring pinned critical updates and interactive comments.
- **Dynamic Filtering & Search:** Easily sort, filter, and search through announcements to find exactly what you need.
- **Secure Authentication:** Robust user authentication with email verification and password reset flows.

### Admin Dashboard (Server-Side)
- **Secure Admin Login:** A dedicated portal for administrators to manage the platform and oversee student requests.
- **Service Management:** Handle approvals, rejections, and status tracking for all student service requests in real time.
- **Announcement Management:** Create, edit, and publish announcements with a rich text editor.
- **Comment Moderation:** Full control over discussions with the ability to approve or delete student comments.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Image Storage:** ImageKit
- **AI Integration:** Google Gemini API
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB database (local or cloud).
- An ImageKit account for image storage.
- A Google Gemini API key.
- SMTP Credentials for sending verification emails.

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/The-KrishVerma/CampusConnect.git
   ```
2. **Install NPM packages for the client**
   ```sh
   cd client
   npm install
   ```
3. **Install NPM packages for the server**
   ```sh
   cd ../server
   npm install
   ```
4. **Fill the missing environment variables in a `.env` file in the `server` directory**
   ```env
   JWT_SECRET=super_long_random_secret_here
   ADMIN_EMAIL=your_email_id
   ADMIN_PASSWORD=very_strong_password
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.a7gpraw.mongodb.net/campusconnect
   IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxx
   IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxx
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/krish
   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxx
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
5. **Start the client**
   ```sh
   cd ../client
   npm run dev
   ```
6. **Start the server**
   ```sh
   cd ../server
   npm start
   ```

## 🙌 Acknowledgements
Built with ❤️ by Krish Verma
