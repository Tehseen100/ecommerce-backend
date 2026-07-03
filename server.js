import 'dotenv/config'; // Load environment variables from .env file
import app from './src/app.js';
import connectDB from './src/config/db.js';


const PORT = process.env.PORT || 3000;

// Connect to the database
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

startServer();