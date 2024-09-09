const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; 

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/lang/messages/en',express.static(path.join(__dirname,'lang/messages/en')))

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
