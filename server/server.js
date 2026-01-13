import "dotenv/config";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import { createServer } from "http";
import { initializeSocket } from "./src/socket.js";

const httpServer = createServer(app);
const io = initializeSocket(httpServer);

connectDB()
    .then(() => {
        httpServer.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
