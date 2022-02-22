const express = require('express');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Paste = require('./pasteModule.js');
const {savePastes} = require('./index.js');
const WordPOS = require('wordpos'),
wordpos = new WordPOS();

app.use(express.json());
app.use(cors());

mongoose
.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {console.log("Database connected!"); await savePastes();})

app.get('/', async (req, res)=>{
  let pastes = await Paste.find({}, null, {sort: {date: -1}})
  for(let i = 0; i < pastes.length; i++) {
    let entities = await wordpos.getNouns(pastes[i].title + " " + pastes[i].content)
    for(let j = 0; j < entities.length; j++) {
      entities[j] = entities[j].toLowerCase()
    }
    let filtered = toFindDuplicates(entities)
    if(filtered.length > 0){
        pastes[i].entities = filtered
    }
    else {
      pastes[i].entities = entities;
    }
    if(pastes[i].entities.length > 5) {
      pastes[i].entities = pastes[i].entities.slice(0, 5)
    }
  }
    res.json(pastes);
    res.end();
})

app.listen(8080, ()=>{
    console.log("server running on 8080");
})

const toFindDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)