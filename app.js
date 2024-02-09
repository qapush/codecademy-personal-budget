const express = require('express');
const app = express();
// Routers
const envelopesRouter = require('./routes/envelopes');

const PORT = 3000;

app.use('/envelopes', envelopesRouter);

app.get('/', (req, res, next) => {
  res.send('Personal budget init');
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}`);
});
