const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Paste = require('./pasteModule.js');
const {savePastes} = require('./index.js')

app.use(express.json());
app.use(cors());

mongoose
.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {console.log("Database connected!"); await savePastes();})

app.get('/', async (req, res)=>{
    res.json(await Paste.find({}, null, {sort: {date: -1}}));
    res.end();
})

app.listen(8080, ()=>{
    console.log("server running on 8080");
})
