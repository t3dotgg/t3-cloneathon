# Environment Setup Guide

This guide explains how to set up your local environment and the necessary environment variables for this project.

## 1. Environment Variables File (`.env.local`)

You will need to create a `.env.local` file in the root of the project. This file will store all your secrets and environment-specific configurations. You can typically copy an existing `.env.example` file if one is provided, or create `.env.local` from scratch.

Below are the required environment variables:

### a. Database URL (`DATABASE_URL`)

This variable tells Prisma and the application how to connect to your PostgreSQL database.

*   **For Local Docker Setup (Recommended for initial development):**
    If you follow the Docker instructions below (Section 2), your URL will look like this:
    ```
    DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/t3chatdb?schema=public"
    ```
    Replace `myuser`, `mypassword`, and `t3chatdb` if you used different values in the `docker run` command.

*   **For External/Managed PostgreSQL Database:**
    If you are using a managed database service (like Neon, Supabase, Aiven, ElephantSQL, or a cloud provider's PostgreSQL), use the connection string they provide. For example, the one used in a previous step was:
    ```
    DATABASE_URL="postgresql://postgres:postgress@142.93.37.21:5432/t3chatclonedb?schema=public"
    ```
    Ensure this points to your specific external database.

### b. NextAuth Configuration

These variables are required for user authentication.

*   **`NEXTAUTH_URL`**: The canonical URL of your Next.js application. For local development, this is usually:
    ```
    NEXTAUTH_URL="http://localhost:3000"
    ```
    Ensure this matches the port your development server is running on.

*   **`NEXTAUTH_SECRET`**: A random string used to hash tokens, sign cookies, and generate cryptographic keys. This is critical for security.
    You can generate a strong secret using OpenSSL or a similar tool:
    ```bash
    openssl rand -hex 32
    ```
    Then add it to your `.env.local`:
    ```
    NEXTAUTH_SECRET="your_generated_nextauth_secret_here"
    ```

### c. OpenAI API Key (`OPENAI_API_KEY`)

This key is required to use OpenAI's language models for chat functionality.

1.  Go to [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys).
2.  Create a new secret key.
3.  Copy this key and add it to your `.env.local` file:
    ```
    OPENAI_API_KEY="your_openai_api_key_here"
    ```
    **Remember to replace `"your_openai_api_key_here"` with your actual key.**

### Example `.env.local` structure:

```env
# Database
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/t3chatdb?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_nextauth_secret_here" # Replace with 'openssl rand -hex 32' output

# OpenAI
OPENAI_API_KEY="sk-your_actual_openai_api_key_here" # Replace with your real key
```

**Important Security Note:** Always keep your `.env.local` file out of version control. Ensure `.env.local` is listed in your `.gitignore` file.

## 2. Setting up PostgreSQL with Docker (Optional, for Local Development)

If you prefer to run PostgreSQL locally using Docker:

### a. Pull the PostgreSQL Image
If you don't have it already, pull the official PostgreSQL image:
```bash
docker pull postgres
```

### b. Run the PostgreSQL Container
```bash
docker run --name t3chat-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=t3chatdb -p 5432:5432 -d postgres
```
*   `--name t3chat-postgres`: Assigns a name for easier management.
*   `-e POSTGRES_USER=myuser`: Sets the database user.
*   `-e POSTGRES_PASSWORD=mypassword`: Sets the password. **Choose a strong password for actual deployments if not just local.**
*   `-e POSTGRES_DB=t3chatdb`: Creates an initial database.
*   `-p 5432:5432`: Maps your local port 5432 to the container's port 5432.
*   `-d`: Runs in detached mode.

You can verify the container is running with `docker ps`.

### c. Accessing the Database (Optional)
To connect using `psql` via Docker:
```bash
docker exec -it t3chat-postgres psql -U myuser -d t3chatdb
```
You will be prompted for the password (`mypassword`).

## 3. Database Migrations

Once your `.env.local` file is configured with the correct `DATABASE_URL` (either for Docker or your external database) and your database server is running:

Run the following command to apply any pending database migrations and create your database schema:
```bash
npx prisma migrate dev
```
This command will:
*   Read your `prisma/schema.prisma` file.
*   Compare it to the state of your database.
*   Generate and apply SQL migrations to synchronize your database schema.
*   It will also generate/update the Prisma Client (`@prisma/client`).

If you are prompted to name the migration, you can use a descriptive name like `init_schema` or `update_models`.

You are now ready to run the application!
```
