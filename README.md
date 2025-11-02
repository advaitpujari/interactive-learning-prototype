# Interactive Learning Platform

## Overview

This project is an interactive, quiz-based learning platform designed to make education engaging and fun for students. It uses a modular approach, allowing for easy expansion with new subjects and grade levels. The platform features user authentication, a personalized dashboard, and interactive simulations for various educational topics.

## Features

*   **User Authentication**: Secure login, signup, and password reset functionality using Supabase.
*   **Personalized Dashboard**: Displays available and completed modules for the logged-in user.
*   **Interactive Modules**: Each module combines a quiz with an animated simulation to explain concepts visually.
*   **Progress Tracking**: User progress is saved to the backend, and completed modules are marked on the dashboard.
*   **Modular Structure**: Content is organized by curriculum (CBSE, ICSE), grade, and subject, making it easy to add new modules.

## Getting Started

1.  **Supabase Setup**:
    *   This project uses Supabase for its backend (authentication and database).
    *   You will need to create a Supabase project and get your own URL and `anon` key.
    *   Update the `SUPABASE_URL` and `SUPABASE_KEY` constants in `assets/js/config.js` with your Supabase credentials.

2.  **Running the Platform**:
    *   No special build process is required.
    *   Simply open the `index.html` file in a modern web browser.

## Project Structure

The project is organized into the following directories:

```
.
├── index.html              # Main login/signup page
├── dashboard.html          # User dashboard, displays modules
├── profile.html            # User profile page
├── README.md               # This file
├── assets/
│   ├── css/                # Stylesheets
│   │   ├── main.css
│   │   └── auth.css
│   └── js/                 # JavaScript files
│       ├── auth.js         # Handles login, signup, etc.
│       └── config.js       # Supabase configuration
└── modules/
    ├── cbse/
    │   └── grade10/
    │       ├── history/
    │       │   └── french-revolution/
    │       └── science/
    │           ├── gravity/
    │           ├── light/
    │           └── nacl-reaction/
    └── icse/
        └── ... (coming soon)
```

## Available Modules

### CBSE - Grade 10

#### Science
*   **The Na + Cl Reaction**: An interactive simulation of the sodium and chlorine reaction.
*   **Understanding Gravity**: A module explaining the concepts of gravity.
*   **Light, Reflection & Refraction**: A module with an animated simulation of the Law of Reflection.

#### History
*   **The French Revolution**: A quiz-based module on the French Revolution.