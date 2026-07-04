import { env } from './src/config/env.js';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// Connect to the database
const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
}

startServer();