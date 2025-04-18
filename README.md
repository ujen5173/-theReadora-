# 📖 Readora

Readora is a storytelling platform where users can read, write, and share stories across various genres. It offers a clean writing experience for authors and an immersive reading interface for users.

Build as a passion project.

> **Warning**
> This is a work-in-progress and not the finished product.

## 🧰 Tech Stack

- **Next.js** – for building the web application
- **NextAuth** – for user authentication
- **Zustand** – for state management
- **ShadCN** – for UI components
- **Prisma** – for working with databases
- **MongoDB** – for storing chapter content
- **PostgreSQL** – for storing structured data like users, stories, and metadata

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ujen5173/readora.git
cd readora
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create Environment Variables

Run the following command to create a `.env` file:

```bash
cp .env.example .env
```

Then, fill in the required environment variables in the `.env` file. You can find the necessary variables in the `.env.example` file.

### 4. Set Up Database

- **MongoDB**: Set up a MongoDB database and update the `MONGODB_URI` in your `.env` file.
- **PostgreSQL**: Set up a PostgreSQL database and update the `DATABASE_URL` in your `.env` file.
- **Prisma**: Run the following command to generate the Prisma client and migrate the database:

```bash
pnpm postinstall
```

### 4. Run the App Locally

```bash
pnpm dev
```

Feel free to open issues or contribute. Cheers 🍻
