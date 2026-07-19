---
description: How to deploy the portfolio to Firebase Hosting
---

This workflow guides you through the process of deploying your Vite portfolio to Firebase Hosting.

### Prerequisites

1.  **Install Firebase CLI**: If you haven't already, install the Firebase CLI globally:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

### Deployment Steps

1.  **Build the Project**:
    Generate the production build of your portfolio:
    ```bash
    npm run build
    ```

2.  **Initialize Firebase (Optional)**:
    If you haven't initialized Firebase in this project yet:
    ```bash
    npx firebase init hosting
    ```
    - Select your Firebase project.
    - Set the public directory to `dist`.
    - Configure as a single-page app: `Yes`.
    - Set up automatic builds and deploys with GitHub: `No` (unless desired).

3.  **Deploy to Firebase**:
    You can now deploy using the custom script I added:
    ```bash
    npm run deploy
    ```
    Or manually:
    ```bash
    npx firebase deploy --only hosting
    ```

### Troubleshooting

- If the site shows a 404, ensure the `public` directory in `firebase.json` is set to `dist`.
- Ensure you have run `npm run build` before deploying.
