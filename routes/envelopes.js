const express = require('express');
const envelopesRouter = express.Router();

const envelopes = [];
let envelopeId = 0;

const newEnvelope = () => {
    return {
        id: envelopeId++
    }
}

envelopesRouter.param('id', (req, res, next, envelopeId) => {
    const id = Number(envelopeId);
    if (!id) return res.status(404).send('Invalid id parameter')
    req.id = id;
    next();
})

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
})

envelopesRouter.get('/:id', (req, res, next) => {
    if(!envelopes[req.id]){
        res.status(404).send(`No envelope with id ${req.id} found`)
    } else {    
        res.send(envelopes[req.id])
    }
})

envelopesRouter.post('/', (req, res, next) => {
    envelopes.push(newEnvelope());
    res.status(201).send(envelopes[envelopes.length - 1]);
})

module.exports = envelopesRouter;