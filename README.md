# SmileCare Dental Scheduling System

A comprehensive web-based dental office appointment scheduling system that enables patients to book, manage, and view dental appointments online.

## 🦷 Features

### For Patients
- **User Registration & Authentication**
  - Email/password registration and login
  - Google OAuth integration for quick access
  - Secure profile management

- **Appointment Booking**
  - Browse available dental services
  - Select preferred dentists
  - Choose from available time slots
  - Add special notes and requests
  - Real-time availability checking

- **Profile Management**
  - Update personal information
  - View appointment history


## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** for styling
- **Wouter** for lightweight routing
- **TanStack React Query** for server state management
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript
- **Firebase Authentication** for user management
- **Firebase Firestore** for real-time database
- **Firebase Admin SDK** for server-side operations

### Development & Deployment
- **Kubernetes** deployment configurations
- **Docker** containerization
- **AWS EKS** for production deployment
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- (For deployment) AWS CLI, kubectl, Docker

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dentaldesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

Follow the detailed setup guide: [Firebase Setup Guide](docs/FIREBASE_SETUP.md)

**Required Environment Variables:**
```bash
FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📖 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete guide for patients and staff
- **[Firebase Setup](docs/FIREBASE_SETUP.md)** - Firebase configuration instructions
- **[Deployment Guide](docs/DEPLOYMENT.md)** - AWS Kubernetes deployment

## 🏗️ Project Structure

```
dentaldesk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
|           |___firebase.ts # Firebase  setup
|           |___firestore.ts # Firestore  setup
├── shared/                # Shared types and schemas
├── docs/                  # Documentation
├── k8s/                   # Kubernetes deployment files
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication & Security

- **Firebase Authentication** with email/password and Google OAuth
- **Firestore Security Rules** for data protection
- **Token-based authentication** for API endpoints
- **Role-based access control** (patient/admin)
- **HTTPS enforcement** in production

## 🗄️ Database Schema

### Collections
- **users** - Patient and staff profiles
- **appointments** - Appointment bookings
- **dentists** - Dentist information and availability
- **services** - Available dental services

### Security Rules
Firestore security rules ensure users can only access their own data, with admin users having elevated permissions.

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment

**Docker:**
```bash
   docker build -t dentaldesk:latest
docker buildx build -t dentaldesk:latest 
docker run -p 5000:5000 dentaldesk
```

**Kubernetes on AWS:**
Follow the comprehensive [Deployment Guide](docs/DEPLOYMENT.md) for AWS EKS deployment.

## 🐛 Troubleshooting

### Common Issues

**"Unauthorized domain" error with Google Sign-in:**
- Add your domain to Firebase Authentication authorized domains
- Include both development and production domains

**Firestore permission denied:**
- Check Firestore security rules
- Verify user authentication status
- Ensure proper role assignments

**Environment variables not loading:**
- Verify all required variables are set
- Check variable names (frontend vars need `VITE_` prefix)
- Restart the application after changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Support

For issues and questions:
- Check the [User Guide](docs/USER_GUIDE.md)
- Review [Firebase Setup](docs/FIREBASE_SETUP.md)
- Create an issue in the repository

## 🎯 Roadmap

### Upcoming Features
- SMS notifications
- Payment integration
- Telehealth consultations
- Multi-location support
- Insurance verification
- Mobile app (React Native)

---

**Built with ❤️ for modern dental practices**