const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const encrypt = require('bcrypt');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

mongoose.connect('mongodb+srv://dharaniparamasivam1407:1234@cluster0.1yf9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB"+ error);
    });

// Your existing routes...

const authenticationSchema = mongoose.Schema({
    username: { required: true, type: String },
    password: { required: true, type: String },
    email: { required: true, type: String }
})

const model = mongoose.model('auth', authenticationSchema)
let auths = [];

//create item
app.post('/auth', async (req, res) => {
    const { username, password, email } = req.body;

    try {

        const hashedPassword = await encrypt.hash(password,10);

        const newauth = new model({ username, password: hashedPassword , email });
        const auths = await newauth.save();
        res.send(auths)
    } catch (error) {
        res.status(400).send({ message: "Invalid request" })
        console.log(error)
    }
})


// Sign in route
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await model.findOne({ username });

        if (!user) {
            return res.status(400).send({ message: "User  not found" });
        }

        // Compare the provided password with the hashed password
        const isMatch = await encrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" });
        }

        // If everything is okay, send a success response
        res.send({ message: "Sign in successful", user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
        console.log(error);
    }
});


const port= 5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})





