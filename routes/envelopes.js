const express = require('express');
const envelopesRouter = express.Router();
const { getIndexById } = require('../utils');

const envelopes = [
  {
    id: 0,
    balance: 3500,
    name: 'apartment',
  },
  {
    id: 1,
    balance: 1000,
    name: 'food',
  },
];

let envelopeId = envelopes.length;

const newEnvelope = (name, balance) => {
  return {
    id: envelopeId++,
    balance,
    name,
  };
};

//
//   MIDDLEWARES
//

envelopesRouter.use(express.json());

envelopesRouter.param('id', (req, res, next, envelopeId) => {
  const id = Number(envelopeId);
  if (isNaN(id)) return next(new Error(`Invalid id parameter`));
  req.id = id;
  next();
});

const queryParams = (req, res, next) => {
  // Amount
  let amount = null;
  if (req.query.amount !== 0 && !req.query.amount) {
    amount = 0;
  } else {
    amount = Number(req.query.amount);
  }
  if (isNaN(amount)) return next(new Error('Bad amount parameter'));
  req.amount = amount;

  // Name
  req.name = req.query.name;
  next();
};

//
//   METHODS
//

// GET ALL ENVELOPES

envelopesRouter.get('/', (req, res, next) => {
  res.send(envelopes);
});

// GET ENVELOPE BY ID

envelopesRouter.get('/:id', (req, res, next) => {
  if (!envelopes[req.id]) {
    next(new Error(`No envelope with id ${req.id} found`));
  } else {
    res.send(envelopes[req.id]);
  }
});

// ADD NEW ENVELPE

envelopesRouter.post('/', queryParams, (req, res, next) => {
  if (!req.name) return next(new Error('Name required'));
  envelopes.push(newEnvelope(req.name, req.amount));
  res.status(201).send(envelopes[envelopes.length - 1]);
});

// CHANGE ENVELOPE BY ID

envelopesRouter.put('/:id', queryParams, (req, res, next) => {
  const envelopeIndex = getIndexById(req.id, envelopes);
  if (envelopeIndex === -1) return next(new Error(`No envelope with id ${req.id} found`));

  if (req.name) {
    envelopes[envelopeIndex].name = req.name;
  }

  if (req.amount) {
    envelopes[envelopeIndex].balance = req.amount;
  }

  res.status(200).send(envelopes[envelopeIndex]);
});

// SEND MONEY FROM ONE TO ANOTHER

// 2DO

//
// ERROR HANDLING
//

envelopesRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

module.exports = envelopesRouter;
