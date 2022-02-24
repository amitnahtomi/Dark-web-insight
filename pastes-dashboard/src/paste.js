import React from "react";
import { useState } from 'react';
import moment from 'moment';
import Filter from 'bad-words';
import Sentiment from 'sentiment'
import { Button, Card } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
const wordFilter = new Filter();
const sentiment = new Sentiment()

export default function Paste({paste, age, filter, changeFilter}) {
    const [visible, setVisible] = useState(true)

    const buttonSym = () => {
        if(visible) {
            return <ExpandMoreRoundedIcon />
        }
        else {
            return <ExpandLessRoundedIcon />
        }
    }

    if(age >= 18){
        return <li hidden={!paste.content.toLowerCase().includes(filter) && !paste.title.toLowerCase().includes(filter)}><Card variant="outlined" style={{borderColor: "violet", padding: "8px", backgroundColor: "lightgoldenrodyellow", textAlign: "left"}}>
            <div style={{textAlign: "right", float: "right", width: "50%"}} hidden={sentiment.analyze(paste.content).score >= 0}><WarningAmberRoundedIcon fontSize="large" style={{height: "13%", width: "13%"}} /></div>
            <div style={{width: "50%"}}>{paste.title}</div>
            <div>by {paste.author}</div>
            <div>at {moment(paste.date).format('LLLL')}</div>
            <div>sentiment value: {sentiment.analyze(paste.content).score}</div>
            <Button size="small" variant="outlined" onClick={()=>{setVisible(!visible)}}>{buttonSym()}</Button>
            <div hidden={visible}>{paste.content}</div>
            <div style={{textAlign: "right"}}>{paste.entities.map((ent)=>{
              return <span className="labels" onClick={changeFilter}>{ent}</span>
            })}</div>
            </Card></li>
    }
    else {
        return <li hidden={!paste.content.toLowerCase().includes(filter) && !paste.title.toLowerCase().includes(filter)}><Card variant="outlined" style={{borderColor: "violet", padding: "8px", backgroundColor: "lightgoldenrodyellow", textAlign: "left"}}>
              <div style={{textAlign: "right", float: "right", width: "50%"}} hidden={sentiment.analyze(paste.content).score >= 0}><WarningAmberRoundedIcon fontSize="large" style={{height: "13%", width: "13%"}} /></div>
              <div style={{width: "50%"}}>{wordFilter.clean(paste.title)}</div>
              <div>by {paste.author}</div>
              <div>at {moment(paste.date).format('LLLL')}</div>
              <div>sentiment value: {sentiment.analyze(paste.content).score}</div>
              <Button size="small" variant="outlined" onClick={()=>{setVisible(!visible)}}>{buttonSym()}</Button>
              <div hidden={visible}>{wordFilter.clean(paste.content)}</div>
              <div style={{textAlign: "right"}}>{paste.entities.map((ent)=>{
              return <span className="labels" onClick={changeFilter}>{wordFilter.clean(ent)}</span>
              })}</div>
              </Card></li>
    }
}