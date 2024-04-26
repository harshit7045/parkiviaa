import mongoose from "mongoose";

// Assuming this function is responsible for finding a user
const findUser = (message) => {
    // Implementation of findUser function
    console.log("Finding user:", message);
}

const url = "mongodb+srv://harshit7045:9956228951@harshit.cntirh6.mongodb.net/?retryWrites=true&w=majority&appName=harshit";

export const connectMongoDB = async () => {
    try {
        // Connecting to MongoDB Atlas
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "parkivia" // Correct option name
        });
        console.log("mongoose connected");

        // Assuming you want to find a user after connecting to MongoDB
        const message = "Sample message"; // Sample message for demonstration
        findUser(message); // Calling the findUser function
    } catch (err) {
        console.log(err);
    }
}
