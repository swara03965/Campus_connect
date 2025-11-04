# 🎓 Campus Connect

A modern college event management platform that streamlines event organization, registration, and communication between students, clubs, and administrators.

## 🌟 Features

### For Students
- Browse and register for upcoming events
- Real-time notifications for event updates
- Track registration status and event history
- Personalized dashboard with upcoming events

### For Club Heads
- Create and manage club events
- Track attendance and registrations
- Send notifications to registered participants
- Analytics dashboard for event performance

### For PR Admins
- Review and approve event proposals
- Manage event promotions
- Control event visibility
- Monitor event metrics

### For Main Admins
- User management and role assignment
- System-wide announcements
- Analytics and reporting
- Platform configuration

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State Management**: Context API
- **Analytics**: Vercel Analytics

### Backend
- **Framework**: Spring Boot
- **Language**: Java 17
- **Database**: PostgreSQL
- **Build Tool**: Maven
- **Security**: JWT Authentication
- **Documentation**: Swagger UI

## 📦 Installation

### Prerequisites
- Node.js 18+
- Java JDK 17
- PostgreSQL 14+
- Maven 3.8+

### Frontend Setup
```bash
# Navigate to frontend directory
cd mini-main

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Build project
./mvnw clean install

# Run application
./mvnw spring-boot:run
```

## 🔧 Configuration

### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Properties (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campusconnect
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: mini-main
   - Build Command: npm run build
   - Install Command: npm install

### Backend (Options)
- **Render**: Deploy using Docker configuration
- **Oracle Cloud**: Use Always Free Tier compute instance
- **Fly.io**: Deploy with flyctl

## 📚 API Documentation
Access Swagger UI documentation at:
```
http://localhost:8080/swagger-ui.html
```

## 🧪 Testing

### Frontend Tests
```bash
cd mini-main
npm test
```

### Backend Tests
```bash
cd backend
./mvnw test
```

## 🔐 Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with BCrypt
- HTTPS enforcement in production
- CORS configuration
- Input validation and sanitization

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- Frontend Developer: [Your Name]
- Backend Developer: [Your Name]
- UI/UX Designer: [Your Name]

## 📞 Support
For support, email [your-email@example.com] or open an issue in the repository.

## 🙏 Acknowledgments
- [Next.js](https://nextjs.org/) for the frontend framework
- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [PostgreSQL](https://www.postgresql.org/) for the database
