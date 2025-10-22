This is my personal page with interactive features. You can also check it out at www.richardiffusion.me and download my online resume there(download feature not available atm). Thanks!

This page is created with React, node.js and javascript.

# Interactive Personal Page

## Project Structure
- `frontend/` - Frontend React
- `backend/` - Backend Express API

## Dev and prod run
```bash
# Install requirements
npm install

# Run static dev on front-end
npm run dev

# Run backend with active API(before build)
npm run preview


## Prod env deployment
# Build and start
npm start

# Only Build
npm run build

# Build local（localhost active）
VITE_API_BASE_URL=http://localhost:3001/api npm run build
```

## Env config
Dev env: .env.development
prod env: .env.production

More commands and requirements please check package.json file.

# Preview
## Main Page
<img width="2449" height="1884" alt="image" src="https://github.com/user-attachments/assets/c53e1d2d-0879-4133-8b8b-1036d1ab5cbe" />
Noted that in v1.1.0, the ai_chatbox is displayed on the front page as well. Details about this project please check the Ai_chatbox page. 
AI_chatbox: https://github.com/richardiffusion/ai_chatbox

<img width="2153" height="1729" alt="image" src="https://github.com/user-attachments/assets/2fb67419-12e9-4f4f-a071-a3fe401ebcb0" />

<img width="1897" height="1674" alt="image" src="https://github.com/user-attachments/assets/ee6da9c9-e0f0-493b-939a-03413998edb2" />

<img width="1748" height="1059" alt="image" src="https://github.com/user-attachments/assets/0023d7c7-e9d7-47fd-ba8c-2779dc93a3e2" />

## Edit Profile
After applying these codes in your local environment, you can simply click on the "edit profiles" to create your own resume.
You can also make changes to your resume on your production environment(eg. on your live website). The changes will be made on API profile.

<img width="2023" height="1701" alt="image" src="https://github.com/user-attachments/assets/56e8a83e-ce30-4c76-944f-d4007294170c" />

This allows you to quickly customize your own webpage and resume for anyone to download(download feature to be developed).

## Admin Login
With config admin password, edit profile can be activated and directly make change on the api file.
<img width="933" height="704" alt="image" src="https://github.com/user-attachments/assets/4309967c-43a4-45ef-abef-c69dca04dea1" />

