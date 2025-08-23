# jackandbeanstalk #

<h1 style="color:gold;"> V1 </h1>

## 2025/06/09 ##

- Set up the website architecture.

## 2025/06/11 ##

- Set up routing to implement SPA navigation and add a crawler page.

- 💥 Didn't change branches before developing. Now there’s a huge conflict mess.

- Text and artwork for the homepage.

- Text and artwork for the loginpage and minor homepage adjustments.

- 💥 Due to unknown reasons, some files reverted to their original version. I need to restore the previous commit from GitHub.

- Text and artwork for the memberpage and added nav for memberpage.

- 💥 Can't select the input blocks and button of loginpage.

- Text and artwork for the register page. Complete the register component. Add some decorate.

## 2025/06/12 ##

- Rebase all the branch to branch Jerry.

- 🔧 Fix the bug ID:1 and the animations of title box in memberpage.

## 2025/06/13 ##

- Complete the Login page and create the forgotpasswordpage for it.
    (routerLink should add '/' for root-level redirection)

- Complete the login and logout feature, turn some navbar to private and connect SQL.

- Complete the todo feature, create an interceptor, and inject it.

- Complete the profile feature with editable email, nickname, and avatar.

## 2025/06/14 ##

- Complete the Usersquarepage.

- Complete the change password feature in setting page.

- Complete the crawler for Hacker News and schedule it to run every 15 minutes.

## 2025/06/16 ##

- Complete the email verification when registering an account.

<h1 style="color:gold;"> V2 </h1>

## 2025/06/16 ##

- Dockerlize the whole project and switch Microsoft SQL to PostgreSQL.

- 💥 Nginx often returns a 404 error, and users need to re-enter the URL to get redirected to the homepage.

- Create and adjust the Nginx configuration.

## 2025/06/21 ##

- Architecture design supporting multi-mode Docker configuration, successfully building a dual-container system for both development and deployment environments.

## 2025/06/22 ##

- Implement README and Todo documents.

- Implement a feature to resend the verification email using Gmail.

## 2025/06/23 ##

- Restructure the project by linking subpages to the main page, and organizing subpage components under the main page’s folder. Separate the crawler logs from Python application logs.

- 💥 The root cause appears to be blocking or concurrent execution of scheduled threads, leading to missed jobs.

- 🔧 Fix thread blocking issues and implemented proper exception handling to improve stability.

- 💥 The current crawler process freezes after approximately five runs. To resolve this, we plan to migrate the task scheduling to Celery for more reliable asynchronous execution.

## 2025/06/24 ##

- 💥 Platform incompatibility with native binaries was caused by lock files and node_modules created on Windows. To resolve this, remove the lock files and node_modules, allowing Docker to perform a clean installation during the build process.

- Implement Playwright support along with a dedicated container to perform end-to-end testing of Angular content and interactive UI components.

## 2025/06/28 ##

- 💥 Docker consumes too much memory, so the user configured .wslconfig settings.

- 💥 The memory limit set for Docker was too low and no swap was configured, causing the disk usage to spike to 100%.

## 2025/06/29 ##

- Organize the project, environments, and related .yml configurations to support three stages: development, testing, and deployment.

- Completed Playwright automation for verifying the registration feature and facilitating future tests of post-login functionalities. Additionally, exposed a test API on the backend for the test environment.

## 2025/06/30 ##

- 💥 Playwright is unable to properly load components and data that require login access

## 2025/07/02 ##

- 💥 Playwright is currently unable to connect to the Angular container, so automated tests are temporarily executed on the local machine instead.

- Refactored the structure to separate Playwright from the Angular frontend.

## 2025/07/03 ##

- Adjusted the photos on the team members page and cleaned up the images in the public directory.

- Implemented super admin and admin functionalities, updated the .env file, and revised Playwright test functions.

## 2025/07/04 ##

- Implemented role checks for admin and super admin, and added a dedicated navbar for them.

## 2025/07/06 ##

- Refactored the frontend structure and implemented an admin promotion feature for the super admin.

## 2025/07/07 ##

- Implemented a feature that allows the super admin to demote an admin.

- 💥 The .yml failed to load the .env from the env folder during container build, so the .env was moved to the project root.

- 💥 Changed the exposed port of the Docker container’s database to avoid conflicts with the local database.

## 2025/07/08 ##

- Implemented a Redis container, updated the YAML file, and moved the .env file back to the project root directory.

- Implemented a Celery container.

- 💥 Changing user roles caused the query results to become unordered, so a sorting rule was implemented on the backend to maintain consistent order.

## 2025/07/13 ##

- Connected Celery with Redis to enable Celery Beat to schedule and execute tasks.

## 2025/07/14 ##

- Improved the visual design of the navbar, implemented responsive layout for various screen sizes, enhanced color contrast, and updated the logout button with a red color for better visibility.

- Improved the design of the registration page.

## 2025/07/15 ##

- Redesigned the navbar into a hamburger menu for better responsiveness, adjusted the layout of the Single Page Application and navbar, and applied CSS refinements to various pages.

## 2025/07/16 ##

- Improved the visual design of the user square, refined the member page’s CSS, resolved image rendering issues on the promote page, and made layout adjustments to the navbar for better consistency.

## 2025/07/17 ##

- Improved the design of the user profile and fixed CSS issues on several pages.

- Improved the design of the user's Todo List page.

<h1 style="color:gold;"> V3 </h1>

- Implemented a feature that allows users to add friends.

## 2025/07/18 ##

- Implemented a feature that allows users to delete friends.

- 💥 Fixed an issue where the public navbar would disappear when the user did not have super admin privileges.

- Implemented the functionality to send, accept, and remove friend requests.

## 2025/07/21 ##

- Implemented the functionality to enter a user's public page by clicking on their name, and improved the design of the friends page.

## 2025/08/15 ##

- Trying to pulled images from Docker Hub to Microsoft Azure containers.

## 2025/08/16 ##

- Go through setbacks and hardships.

## 2025/08/17 ##

- Go through setbacks and hardships.

## 2025/08/18 ##

- 💥 Removed dependency on prod.yml, added a health check for Angular, and modified the Nginx configuration.

- Successfully pulled the Angular image from Docker Hub to a Microsoft Azure container and deployed it with HTTPS enabled.

## 2025/08/19 ##

- 💥 Added a health check route for Flask and modified the database connection logic to prevent the app from shutting down on failure.

- Successfully pulled Flask from Docker Hub into a Microsoft Azure container and connected it to a PostgreSQL database.

## 2025/08/20 ##

- 💥 Fixed all hardcoded API URLs in the frontend and corrected the allowed HTTP methods.

- Made most features functional after deployment to Azure, except for the scheduled crawler.

## 2025/08/21 ##

- 💥 Each query requires reconnecting to the database, resulting in the need to re-establish the connection before every session, which negatively impacts user experience.

- Connection Pooling the PostgreSQL database and updated the .env.example file.

- Created and improved the design of the website introduction page.

- Improved the design of the Member page.

## 2025/08/22 ##
- Improved the design of the Resendverification page.

- Created and improved the design of the post-wall page.

## 2025/08/23 ##

- 💥 The API for fetching GitHub repository data is causing users to be forcibly logged out. To avoid triggering the logout logic, a new HTTP client without interceptors was created.

- Created and improved the design of the userhome page. Added the user creation time to the user cards on the Square page.