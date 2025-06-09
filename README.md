# T3 Chat Cloneathon

The first ever "Cloneathon"

Build an open source clone of T3 Chat and win up to $5,000 in prizes.

This repo is very much a vibe coded WIP. More coming soon.

If you contribute, please file the PR with a screenshot of your changes.

## Getting Started

Follow these steps to set up and run the project locally for development.

### 1. Clone the Repository

```bash
git clone <repository_url> # Replace <repository_url> with the actual URL
cd <repository_directory_name>
```

### 2. Install Dependencies

This project uses `pnpm` as the package manager. Install it if you haven't already (e.g., `npm install -g pnpm`).

Then, install the project dependencies:
```bash
pnpm install
```

### 3. Set Up Environment Variables

Environment variables are crucial for configuring database connections, authentication, and API keys.

*   **Create `.env.local` file:**
    If an `.env.example` file exists in the root of the project, copy it to a new file named `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    If `.env.example` does not exist, create `.env.local` manually.

*   **Configure Variables:**
    Open `.env.local` and fill in the required values. Refer to the detailed [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) guide for instructions on each variable, including:
    *   `DATABASE_URL` (for PostgreSQL)
    *   `NEXTAUTH_URL`
    *   `NEXTAUTH_SECRET`
    *   `OPENAI_API_KEY`

    **Important:** Ensure your PostgreSQL database server is running and accessible before proceeding to the next step. For local development, you can use Docker as described in `ENVIRONMENT_SETUP.md`.

### 4. Run Database Migrations

Apply database schema migrations using Prisma:
```bash
npx prisma migrate dev
```
This command will set up your database tables according to the schema defined in `prisma/schema.prisma` and generate the Prisma Client. You might be prompted to name your first migration (e.g., "init").

### 5. Run the Development Server

Start the Next.js development server:
```bash
pnpm dev
```
The application should now be running, typically at `http://localhost:3000` (or the port specified in `NEXTAUTH_URL`).

## Testing Checklist

After setting up the project, manually verify the following key functionalities to ensure everything is working correctly:

1.  **User Registration:**
    *   Can you create a new user account successfully?
    *   Are appropriate error messages shown for invalid input (e.g., existing email, short password)?

2.  **User Login & Logout:**
    *   Can you log in with a registered account?
    *   Are invalid credentials handled correctly?
    *   Does the logout functionality work as expected, clearing the session?

3.  **Chat Page Access:**
    *   Is the `/chat` page protected? (i.e., redirects to login if not authenticated).
    *   Can authenticated users access the chat page?

4.  **Chat Functionality:**
    *   Can you send a message?
    *   Does the AI respond with a streamed message?
    *   Are messages (both user and AI) displayed correctly in the UI?

5.  **Chat History:**
    *   Are user messages saved to the database immediately upon sending?
    *   Are AI responses saved to the database after being fully received?
    *   Is the chat history correctly loaded and displayed when you revisit the chat page or refresh?
    *   (If multi-user context applies) Is chat history specific to the logged-in user? (This implementation is user-specific by design).

6.  **Error Handling (Basic Checks):**
    *   While full error testing is complex, observe if the application handles basic issues gracefully (e.g., if the OpenAI API key is invalid, does it show an error rather than crashing?).
    *   Are database-related errors (e.g., failure to save a message) indicated in some way?

This checklist provides a baseline for manual testing. Automated tests (unit, integration, end-to-end) would be beneficial for more comprehensive coverage.

## Deployment

We recommend deploying this Next.js application to [Vercel](https://vercel.com), the creators of Next.js, for a seamless hosting experience.

### Steps to Deploy on Vercel:

1.  **Sign Up/Log In:**
    *   Go to [Vercel](https://vercel.com) and sign up for a new account or log in if you already have one.

2.  **Add New Project:**
    *   Once logged in, click the "Add New..." button and select "Project".

3.  **Import Git Repository:**
    *   Connect your Git provider (e.g., GitHub, GitLab, Bitbucket) and import the repository for this project.

4.  **Project Configuration:**
    *   Vercel should automatically detect that this is a Next.js project and configure most of the build settings appropriately. You typically won't need to change these defaults.
    *   The "Framework Preset" should be "Next.js".
    *   The "Root Directory" should be the root of your project.

5.  **Configure Environment Variables:**
    *   This is a crucial step. In your Vercel project settings, navigate to "Settings" -> "Environment Variables".
    *   Add the following environment variables. Refer to [ENVIRONMENT_SETUP.MD](./ENVIRONMENT_SETUP.MD) for more details on how to obtain or generate their values:
        *   `DATABASE_URL`: Your production PostgreSQL connection string. **Ensure your database is configured to accept connections from Vercel's servers if it has IP whitelisting.**
        *   `NEXTAUTH_URL`: The production URL Vercel assigns to your project (e.g., `https://your-project-name.vercel.app`). You'll usually know this after the first deployment, so you might need to update it.
        *   `NEXTAUTH_SECRET`: A strong, unique secret for production. Generate a new one specifically for your deployed application.
        *   `OPENAI_API_KEY`: Your OpenAI API key.

6.  **Deploy:**
    *   Click the "Deploy" button. Vercel will start the build process and deploy your application.

7.  **Test Your Deployment:**
    *   Once the deployment is complete, Vercel will provide you with a production URL (e.g., `your-project-name.vercel.app`).
    *   Visit this URL to test your live application thoroughly, using the "Testing Checklist" above as a guide.

### Important Notes for Production:

*   **Database Accessibility:** If your external PostgreSQL database has IP whitelisting enabled, you must add Vercel's egress IP addresses to your allowlist. You can find information on Vercel's IPs in their documentation or by contacting their support if necessary.
*   **Database Migrations:** Vercel's build process **does not** automatically run database migrations against your production database. If your database schema changes, you will need to run migrations manually or as a separate step in your deployment pipeline. For Prisma, the command `npx prisma migrate deploy` is typically used for production environments. This command applies pending migrations and does not generate new ones or prompt for input.
    ```bash
    npx prisma migrate deploy
    ```
    Consider how you will manage schema changes and run this command safely for your production database.
*   **Domain Name:** After deployment, you can assign a custom domain name to your Vercel project through the Vercel dashboard.
