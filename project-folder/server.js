const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use('/COMP4537/labs/0/js', express.static(path.join(__dirname, 'COMP4537/labs/0/js')));
app.use('/COMP4537/labs/0/lang/messages/en', express.static(path.join(__dirname, 'COMP4537/labs/0/lang/messages/en')));

app.get('/', (req, res) => {
    res.redirect('/COMP4537/labs/0/');
});

app.get('/COMP4537/labs/0/', (req, res) => {
    res.sendFile(path.join(__dirname, 'COMP4537/labs/0/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
