const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res, next) => {
    res.send('Personal budget init')
})

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}`);
})