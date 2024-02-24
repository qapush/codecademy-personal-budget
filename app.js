const express = require('express');
const app = express();
const cors = require('cors')
// Routers
const envelopesRouter = require('./routes/envelopes');

const PORT = 4000;

app.use(cors());
app.use('/envelopes', envelopesRouter);

app.get('/', (req, res, next) => {
  res.send('Personal budget init');
});

app.listen(PORT, () => {
  console.log(`App listening to ${PORT}`);
});
