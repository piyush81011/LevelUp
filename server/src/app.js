import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Handle multiple CORS origins
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, true); // Allow all for development
            }
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
    console.log(`[DEBUG] Request received: ${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js'
import courseRouter from './routes/course.routes.js'
import enrollmentRouter from './routes/enrollment.routes.js'
import contentRouter from './routes/content.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/courses", courseRouter)
app.use("/api/v1/enrollments", enrollmentRouter)
app.use("/api/v1/content", contentRouter)

export { app };
