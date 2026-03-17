<h1 align="center">🌐 Connecting the Department of Mathematics – A Social Hub</h1>

<p align="center">
  A web-based platform developed by <strong>Jerry Zheng</strong>, designed to showcase our team's work
  and build a collaborative social space for both students and faculty.
</p>

<p align="center">
  <img alt="Angular" src="https://img.shields.io/badge/Frontend-Angular-red?style=for-the-badge&logo=angular" />
  <img alt="Flask" src="https://img.shields.io/badge/Backend-Flask-black?style=for-the-badge&logo=flask" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql" />
  <img alt="Docker" src="https://img.shields.io/badge/DevOps-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<hr>

<h2>🚀 Features</h2>

<ul>
  <li>
    <strong>Angular (SPA)</strong><br>
    Built as a Single Page Application to provide smooth navigation without full page reloads.
  </li>
  <br>
  <li>
    <strong>Flask (Backend API)</strong><br>
    A lightweight and extensible Python microframework, ideal for building RESTful APIs and web services.
  </li>
  <br>
  <li>
    <strong>Dockerized Environment</strong><br>
    This project uses Docker to manage development, testing, and production environments efficiently.
  </li>
</ul>

<hr>

<h2>🏗️ Tech Stack</h2>

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Frontend</td>
      <td>Angular</td>
    </tr>
    <tr>
      <td>Backend</td>
      <td>Flask</td>
    </tr>
    <tr>
      <td>Database</td>
      <td>PostgreSQL</td>
    </tr>
    <tr>
      <td>DevOps</td>
      <td>Docker + Shell Scripts</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>🐳 Docker Setup</h2>

<p>
  This project uses Docker to manage a full-stack web application environment, including:
</p>

<ul>
  <li>Frontend (Angular)</li>
  <li>Backend (Flask)</li>
  <li>Database (PostgreSQL)</li>
</ul>

<p>
  It supports multiple environments for CI/CD workflows:
</p>

<ul>
  <li>🛠️ Development</li>
  <li>🧪 Testing</li>
  <li>🚀 Production</li>
</ul>

<hr>

<h2>🔧 Getting Started</h2>

<p>Before running this project locally, please make sure you have installed:</p>

<ul>
  <li>Docker</li>
  <li>Git</li>
</ul>

<p>If you want to develop the frontend, you will also need:</p>

<ul>
  <li>Node.js</li>
  <li>npm</li>
</ul>

<p>
  These tools help provide a more convenient and consistent development environment for all contributors.
</p>

<hr>

<h2>⚙️ Development Workflow</h2>

<p>We provide three environments for CI/CD:</p>

<pre><code>1dev
2test
3prod</code></pre>

<p>Each environment includes the following scripts:</p>

<pre><code>up.sh        # Start services
down.sh      # Remove containers
stop.sh      # Stop running containers
rebuild.sh   # Rebuild containers</code></pre>

<hr>

<h2>▶️ Usage</h2>

<p>Use the following pattern to run a script:</p>

<pre><code>./scripts/&lt;environment&gt;/&lt;script&gt;</code></pre>

<p>Example:</p>

<pre><code>./scripts/1dev/up.sh</code></pre>

<hr>

<h2>💡 Notes</h2>

<ul>
  <li>Docker helps ensure the project runs consistently across different machines.</li>
  <li>npm makes frontend development and dependency management easier.</li>
  <li>The project is designed with scalability in mind and can continue evolving into a larger web application.</li>
</ul>

<hr>

<p align="center">
  <em>Built to connect ideas, people, and the Department of Mathematics.</em>
</p>