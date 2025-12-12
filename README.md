# Crowd Management System

A modern, real-time crowd analytics and monitoring platform built with Next.js 14, TypeScript, and Tailwind CSS. This application provides comprehensive insights into venue occupancy, footfall patterns, dwell time analytics, and visitor demographics.

## 🚀 Features

### Authentication & Security
- Secure login with email/password authentication
- JWT token-based authorization
- Protected routes with middleware
- Persistent auth state with Zustand

### Dashboard Analytics
- **Live Occupancy Tracking**: Real-time visitor count with percentage comparisons
- **Today's Footfall**: Total visitor count with trend indicators
- **Average Dwell Time**: Visitor duration analytics with insights
- **Occupancy Timeline**: Interactive time-series charts showing occupancy trends
- **Demographics Analysis**: Gender-based breakdown with pie and line charts

### Crowd Entries Management
- Comprehensive visitor entry/exit table
- Real-time dwell time calculation
- Pagination for efficient data browsing
- Gender and timestamp tracking

### Real-time Updates
- Socket.IO integration for live occupancy updates
- Alert notifications for entry/exit events
- Auto-refreshing dashboard metrics

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

## 🛠️ Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/rutvikraut2001/kloudspot_assignment.git
cd kloudspot_assignment
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration

Create a \`.env.local\` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the \`.env.local\` file:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://hiring-dev.internal.kloudspot.com
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Test Credentials

- **Email**: \`test@test.com\`
- **Password**: \`1234567890\`

## 📁 Project Structure

\`\`\`
kloudspot_assignment/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API services
├── types/                 # TypeScript types
└── public/                # Static assets
\`\`\`

## 🎨 Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **Recharts**: Data visualization
- **Axios**: HTTP client
- **Socket.IO**: Real-time communication
- **React Hot Toast**: Notifications

## 📡 API Endpoints

### Authentication
- \`POST /api/auth/login\` - User login

### Analytics
- \`POST /api/analytics/dwell\` - Average dwell time
- \`POST /api/analytics/footfall\` - Today's footfall
- \`POST /api/analytics/occupancy\` - Occupancy data
- \`POST /api/analytics/demographics\` - Demographics breakdown
- \`POST /api/analytics/entry-exit\` - Entry/exit records

### Real-time (Socket.IO)
- \`alert\` - Entry/exit events
- \`live_occupancy\` - Live occupancy updates

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

\`\`\`bash
npm start
\`\`\`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy!

## 🔧 Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
\`\`\`

## 🐛 Troubleshooting

### Development Server Won't Start
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### API Connection Issues
- Verify \`.env.local\` configuration
- Check API base URL
- Ensure network connectivity

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`NEXT_PUBLIC_API_BASE_URL\` | Backend API URL | \`https://hiring-dev.internal.kloudspot.com\` |
| \`NEXT_PUBLIC_SOCKET_URL\` | Socket.IO server URL | \`http://localhost:4000\` |

## 👨‍💻 Developer

Built by [Rutvik Raut](https://github.com/rutvikraut2001)

---

**Note**: This application is designed for modern browsers (Chrome, Firefox, Safari, Edge).
