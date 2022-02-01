require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;
const passcode = process.env.PASSCODE;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/', async (req, res) => {
  const luckyNumber = req.body.luckyNumber;
  if (!luckyNumber || luckyNumber !== passcode) {
    return res.status(400).json({ message: 'Not a lucky number' });
  }
  const smsBody = req.body.smsBody;
  const smsFrom = req.body.smsFrom;
  const smsTo = parseInt(req.body.smsTo);
  if (!smsBody || !smsFrom || !smsTo) {
    return res.status(400).send({ message: 'Missing SMS body/from/to' });
  }
  try {
    const message = await client.messages
                                .create({
                                  body: smsBody,
                                  from: smsFrom,
                                  to: smsTo
                                });
    res.json(message);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});