# BookWise - University Library Management System

A full-featured university library management system built with Next.js 15, Drizzle ORM, and NextAuth v5.

## Overview

BookWise is a modern library management system designed for universities to manage book borrowing, user accounts, and administrative tasks. It provides a seamless experience for both students and administrators.

## Features

- **User Authentication**: Secure sign-in/sign-up with NextAuth v5 using credentials provider
- **Book Management**: Browse, search, and borrow books from the library catalog
- **Borrow System**: Track book borrowing, due dates, and return status
- **Admin Dashboard**: Comprehensive admin panel for managing users, books, and requests
- **Email Notifications**: Automated emails for welcome, password reset, and weekly digests
- **Rate Limiting**: API protection using Upstash rate limiting
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rhixecompany/university-libary-jsm.git

# Navigate to project directory
cd university-libary-jsm

# Install dependencies
npm install

# Set up environment variables
# Create .env file with required variables (see DEVELOPER_GUIDE.md)

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design and component overview
- [User Guide](docs/USER_GUIDE.md) - End-user documentation and features
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Development setup and contribution guidelines
- [Contributing](docs/CONTRIBUTING.md) - How to contribute to this project

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: NextAuth v5
- **UI Components**: Radix UI, shadcn/ui
- **Email**: React Email, Nodemailer
- **Rate Limiting**: Upstash Redis

## License

MIT License