const express = require('express');
const envelopesRouter = express.Router();
const { getIndexById, getEnvelopeByName } = require('../utils');
const morgan = require('morgan')

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
  if (isNaN(id)) {
    const err = new Error(`Invalid id parameter`);
    err.status = 400;
    return next(err);
  }
  req.id = id;
  next();
});
envelopesRouter.use(morgan('tiny'));



const queryParams = (req, res, next) => {
  // Amount
  let amount = null;
  if (!req.query.amount) {
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
    const err = new Error(`No envelope with id ${req.id} found`);
    err.status = 400;
    return next(err);
  } else {
    res.send(envelopes[req.id]);
  }
});

// ADD NEW ENVELOPE

envelopesRouter.post('/', queryParams, (req, res, next) => {
  if (!req.name) {
    const err = new Error('Name required');
    err.status = 400; 
    return next(err); 
  }
  envelopes.push(newEnvelope(req.name.toLowerCase(), req.amount));
  res.status(201).send(envelopes[envelopes.length - 1]);
});

// CHANGE ENVELOPE BY ID

envelopesRouter.put('/:id', queryParams, (req, res, next) => {
  const envelopeIndex = getIndexById(req.id, envelopes);
  if (envelopeIndex === -1) {
    const err = new Error(`No envelope with id ${req.id} found`)
    err.status = 400;
    return next(err);
  }


  if (req.name) {
    envelopes[envelopeIndex].name = req.name.toLowerCase();
  }

  if (req.amount) {
    envelopes[envelopeIndex].balance = req.amount;
  }

  res.status(200).send(envelopes[envelopeIndex]);
});

// SEND MONEY FROM ONE TO ANOTHER

envelopesRouter.post('/transfer/:nameFrom/:nameTo', (req, res, next) => {
  
  const amount = Number(req.body.amount);  

  if(isNaN(amount)) return next( new Error('Amount should be a number'))
  if(amount < 0) return next( new Error('Amount should be greater than zero'))

  const from = getEnvelopeByName(req.params.nameFrom.toLowerCase(), envelopes);
  const to = getEnvelopeByName(req.params.nameTo.toLowerCase(), envelopes);
  
  if(!from || !to ) next( new Error('Bad envelope name'));

  console.log(from, to);
  
  // Handle insufficient funds
  if(from.balance - amount < 0) return next( new Error('There\'s not enough funds in the source envelope for this transfer'));
  
  from.balance -= amount; 
  to.balance += amount; 
  
  res.send(JSON.stringify({from, to}))

});

// REMOVE ENVELOPE BY ID

envelopesRouter.delete('/:id', queryParams, (req, res, next) => {
  const envelopeIndex = getIndexById(req.id, envelopes);
  if (envelopeIndex === -1) return next(new Error(`No envelope with id ${req.id} found`));

  envelopes.splice(envelopeIndex, 1);

  res.status(200).send(envelopes);
});

//
// ERROR HANDLING
//
envelopesRouter.use((err, req, res, next) => {
  // console.log(err.stack);
  const status = err.status || 500;
  res.status(status).send(err.message);
});


module.exports = envelopesRouter;
