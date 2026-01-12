# LMS System Architecture & Design

## 1. System Overview
The Learning Management System (LMS) is built as a monolithic client-server application using the **MERN Stack**:
- **Frontend**: React.js (Vite) + Tailwind CSS for a responsive, single-page application (SPA).
- **Backend**: Node.js + Express.js serving RESTful APIs.
- **Database**: MongoDB with Mongoose for object modeling.
- **Authentication**: Stateless JWT (JSON Web Token) authentication with HttpOnly cookies for security.

## 2. Database Schema (ER Design)

### Users Collection
Stores all user data. Role determines access level.
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (Index, Unique),
  password: String (Bcrypt Hash),
  role: StringEnum ['student', 'instructor', 'admin'],
  avatar: String (URL),
  headline: String (For instructors),
  biography: String,
  createdAt: Date
}
```

### Courses Collection
Stores course metadata and pricing.
```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  description: String,
  category: String,
  level: StringEnum ['beginner', 'intermediate', 'advanced'],
  price: Number,
  thumbnail: String (URL),
  instructor: ObjectId (Ref: User),
  status: StringEnum ['draft', 'published', 'rejected'],
  sections: [ObjectId] (Ref: Section), // Array of Section IDs
  studentsEnrolled: [ObjectId] (Ref: User),
  createdAt: Date
}
```

### Sections Collection
Logical grouping of lessons within a course.
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (Ref: Course),
  title: String,
  order: Number,
  lessons: [ObjectId] (Ref: Lesson)
}
```

### Lessons Collection
Individual content units (videos, text).
```javascript
{
  _id: ObjectId,
  sectionId: ObjectId (Ref: Section),
  title: String,
  videoUrl: String, // URL to video file
  content: String, // Markdown notes
  duration: Number, // In seconds/minutes
  isFreePreview: Boolean,
  order: Number
}
```

### Enrollments/Progress Collection
Tracks a user's progress through a course.
```javascript
{
  _id: ObjectId,
  userId: ObjectId (Ref: User),
  courseId: ObjectId (Ref: Course),
  completedLessons: [ObjectId], // Array of finished Lesson IDs
  progress: Number, // 0-100%
  enrolledAt: Date,
  lastAccessed: Date
}
```

## 3. Folder Structure

### Backend (`/server`)
We follow a **Modular MVC** pattern for scalability.
```
server/
├── src/
│   ├── config/         # Database and Env configurations
│   ├── controllers/    # Logic for handling requests
│   ├── middlewares/    # Auth, Validation, Error Handling
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # API Route definitions
│   ├── utils/          # Helper functions (APIError, AsyncHandler)
│   └── app.js          # Express App setup
└── server.js           # Server Entry Point
```

### Frontend (`/client`)
Organized by feature modules and components.
```
client/src/
├── assets/
├── components/         # Shared components
│   ├── common/         # Buttons, Inputs, Modals
│   └── layout/         # Navbar, Footer, Sidebar
├── context/            # Global State (AuthContext, CourseContext)
├── hooks/              # Custom React Hooks
├── pages/              # Page Views
│   ├── admin/          # Admin Dashboard pages
│   ├── instructor/     # Instructor Dashboard pages
│   ├── student/        # Student Dashboard pages
│   └── public/         # Landing, Login, Course page
├── services/           # API Service calls (Axios)
└── App.jsx             # Main Router
```

## 4. API Architecture
All API responses will follow a standard format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```
Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Optional validation errors
}
```
