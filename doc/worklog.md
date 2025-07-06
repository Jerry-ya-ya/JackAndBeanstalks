# jackandbeanstalk #

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

- Refactored the frontend structure and added an admin promotion feature for the super admin.