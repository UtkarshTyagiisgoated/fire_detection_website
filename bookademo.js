// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema for demo requests
const demoSchema = new mongoose.Schema({
    name: String,
    email: String,
    company: String,
    phone: String
});

// Create a model based on the schema
const Demo = mongoose.model('Demo', demoSchema);

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/book-demo', (req, res) => {
    // Create a new demo object based on the submitted data
    const newDemo = new Demo({
        name: req.body.name,
        email: req.body.email,
        company: req.body.company,
        phone: req.body.phone
    });

    // Save the demo object to the database
    newDemo.save((err, demo) => {
        if (err) {
            console.error('Error saving demo:', err);
            res.status(500).send('Error saving demo');
        } else {
            console.log('Demo saved successfully:', demo);
            res.send('Demo booked successfully!');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
