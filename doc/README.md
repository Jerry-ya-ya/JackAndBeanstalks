# Connecting the Department of Mathematics – A Social Hub
A web-based platform developed by Jerry Zheng, designed to show the work of our team and become a social platform for students and teachers.

## 🚀 Features
- 🐦‍🔥 **Angular** – Single Page Application (SPA) provides smooth page transitions without the need for full page reloads.
- 🔒 **Account Verification** – Gmail-based registration with email confirmation to ensure user authenticity.
- 🦎 **Web-crawler** - Schedule the crawler to make it fetch data every 15 minutes.

## 📜 Pages
- 🏠 **Home** - Showcase Our Team's Vision, Recruitment Requirements, and Goals.
- 👤 **Team member** - Show the key members of our team.
- 🖼️ **Showcase** – (Planned) A dynamic display of team projects, competition records, and individual achievements.
- 📬 **Contact & Join** – (Planned) Centralized page for reaching out and joining the team.
- 🎨 **Customizable 3D Exhibit View** – (Planned) Showcase projects with an interactive 3D gallery using Three.js.
- 💃 **User square** - Display all user profiles in the User Square.
- 📸 **Hacknews Crawler** – Periodically fetches and displays recent posts from Hacker News.
- 🧑‍💻 **Admin Panel** – (Planned) Role-based access to manage content and settings.

## 🔧 Tech Stack

| Layer        | Technology                     
|--------------|--------------------------------
| Frontend     | Angular, HTML/CSS, TypeScript
| Backend      | Flask (Python) + Nginx
| Database     | PostgreSQL
| Others       | SQLAlchemy, JWT, Docker, Nginx

## 🧱 Project Structure
```
├── frontend/                 # Angular frontend
├── backend/                  # Flask backend with factory pattern
├── docker-compose.yml        # Production configuration
├── docker-compose.dev.yml    # Development configuration with hot reload
└── README.md                 # You're here!
```

# 🐳 Fullstack App with Docker (Angular + Flask + PostgreSQL)
This project uses Docker to manage both development and production environments for a fullstack web application built with Angular (frontend), Flask (backend), and PostgreSQL (database).

## 🔐 Environment Variables
Create a .env file in the root folder.
Then copy .env.example to .env and update the values as needed.

## 🔁 Development Mode (with hot reload)
Ideal for active development and debugging.
- Angular uses ng serve with live reload.
- Flask uses flask run --reload.
- Source code is mounted via volumes.
- PostgreSQL runs in the same container network.

```bash
docker-compose -f docker-compose.dev.yml up --build
```

To stop:
```bash
docker-compose -f docker-compose.dev.yml down -v
```

## 🚀 Production Mode (for deployment)

Builds and runs optimized production images.
- Angular is served as static files through Nginx.
- Flask is served via Gunicorn.
- PostgreSQL runs with persistent volume.
- No code reloading. Use this for deployment or testing final builds.

```bash
docker-compose up --build -d
```

To stop:

```bash
docker-compose down
```

## 🧪 Useful Commands
| Task             | Command                               |
| ---------------- | ------------------------------------- |
| Check containers | `docker ps`                           |
| Enter container  | `docker exec -it flask-dev /bin/bash` |
| Rebuild images   | `docker-compose build --no-cache`     |
| Reset DB volume  | `docker-compose down -v`              |

# 🛑 Notes
- Don't commit .env, .venv/, or node_modules/.

- Add those to .gitignore in both frontend and backend folders.

- In production mode, do not use hot reload or volume mounts.