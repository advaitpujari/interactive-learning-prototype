# Interactive Learning Platform

## Overview

This project is an interactive learning platform designed to provide educational modules for students. It features a main entry point (`index.html`), a user dashboard (`dashboard.html`), and an authentication system (`assets/js/auth.js`).

The core of the platform is its modular structure, with educational content organized by grade and subject.

## File Structure

The project follows a clear and organized file structure:

```
.
├── index.html            # Main landing page
├── dashboard.html        # User dashboard
├── README.md             # Project summary
├── assets/
│   ├── css/main.css      # Main stylesheet
│   └── js/auth.js        # Authentication logic
└── modules/
    └── grade10/
        └── science/
            ├── gravity/      # Module: Gravity
            │   ├── index.html
            │   └── gravity.js
            └── nacl_reaction/ # Module: NaCl Reaction
                ├── index.html
                └── simulation.js
```

## Key Modules

The platform currently includes the following learning modules for 10th-grade science:

*   **Gravity**: Located in `modules/grade10/science/gravity/`, this module likely provides an interactive lesson or simulation about gravity.
*   **NaCl Reaction**: Located in `modules/grade-10/science/nacl_reaction/`, this module probably features a simulation of a Sodium Chloride chemical reaction.

This modular approach allows for easy expansion with new subjects, grades, and lessons.
