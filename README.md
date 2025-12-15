# Crowd Management System

A real-time crowd analytics dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Live occupancy, footfall, dwell time, and demographics charts
- **Crowd Entries**: Paginated visitor entry/exit records
- **Real-time Alerts**: Socket.IO powered notifications
- **Multi-site Support**: Switch between different sites

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Socket.IO Client

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/crowd-management-system.git
cd crowd-management-system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API URLs

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```

## Project Structure

```
├── app/                  # Next.js pages
│   ├── dashboard/        # Dashboard & entries pages
│   └── login/            # Login page
├── components/           # React components
│   ├── alerts/           # Alert panel
│   └── layout/           # Header, Sidebar
├── context/              # Auth context
├── lib/                  # API & Socket services
└── public/               # Static assets
```
