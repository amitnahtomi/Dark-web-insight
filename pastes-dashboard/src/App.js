import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import './App.css';
import moment from 'moment';
import Filter from 'bad-words';
import Sentiment from 'sentiment'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {DebounceInput} from 'react-debounce-input';
import { Button, Card, TextField, Pagination } from '@mui/material';
const filter = new Filter();
const sentiment = new Sentiment()

function App() {
  const [pastes, setPastes] = useState([])
  const [age, setAge] = useState(0)
  const [searchText, setSearchText] = useState(false)
  const [page, setPage] = useState(1);
  const inputAge = useRef(null)
  
  const changePage = (event, value) => {
    setPage(value);
  };

  const viewContent = (e) => {
    if(e.target.nextSibling.hidden === false) {
      e.target.nextSibling.hidden = true
      e.target.innerText = "open"
    }
    else {
      e.target.nextSibling.hidden = false
      e.target.innerText = "close"
    }
  }

  const setUserAge = () => {
    setAge(inputAge.current.value);
    sessionStorage.setItem("userAge", inputAge.current.value)
  }
  
  useEffect(()=>{
    if(sessionStorage.getItem("userAge")) {
      setAge(sessionStorage.getItem("userAge"))
    }
    const getPastes = async () => {
      const res = await axios.get('http://localhost:8080/')
      setPastes(res.data)
    }
    getPastes();

    const pastesEl = document.getElementsByTagName('li');
    for(let i = 0; i < pastesEl.length; i++) {
      if(pastesEl[i].innerText.includes(searchText)) {
        pastesEl[i].hidden = false
      }
      else {
        pastesEl[i].hidden = true
      }
    }
  },[searchText])
  
  return <Router><div><Routes>
    <Route path={'/'} element={
      <div style={{paddingTop: "15%", color: "steelblue", textAlign: "center"}}>
        <h1>Before you enter our website, we must know your age.</h1>
        <Button style={{marginRight: "30px", marginTop: "7px"}} size="large" variant="contained" onClick={setUserAge}><Link style={{color: "white", textDecoration: "none"}} to={'/forom'}>enter</Link></Button>
        <TextField placeholder="Your age" style={{width: "110px"}} inputRef={inputAge} type={"number"} variant={"outlined"} required></TextField>
      </div>
    }/>
    <Route path={'/forom'} element={
      <div style={{paddingBottom: '30px', textAlign: "center"}}>
      <DebounceInput style={{height: "40px", width: "250px", fontSize: "25px", borderColor: "blue", borderRadius: "4px"}} id='filter-input' placeholder="enter text filtering" debounceTimeout={1000} onChange={(e)=>{setSearchText(e.target.value)}} />
      <ul>
        {pastes.slice((page-1) * 15, (page * 15 - 1)).map((p)=>{
          if(age >= 18) {
            return <li><Card variant="outlined" style={{borderColor: "violet", padding: "8px", backgroundColor: "lightgoldenrodyellow", textAlign: "left"}}>
            <div>{p.title}</div>
            <div>by {p.author}</div>
            <div>at {moment(p.date).format('LLLL')}</div>
            <div>sentiment value: {sentiment.analyze(p.content).score}</div>
            <Button size="small" variant="outlined" onClick={viewContent}>open</Button>
            <div hidden>{p.content}</div>
            </Card></li>
          }
          else {
            return <li><Card variant="outlined" style={{borderColor: "violet", padding: "8px", backgroundColor: "lightgoldenrodyellow"}}>
              <div>{filter.clean(p.title)}</div>
              <div>by {p.author}</div>
              <div>at {moment(p.date).format('LLLL')}</div>
              <div>sentiment value: {sentiment.analyze(p.content).score}</div>
              <Button size="small" variant="outlined" onClick={viewContent}>open</Button>
              <div hidden>{filter.clean(p.content)}</div>
              </Card></li>
          }
        })}
      </ul>
      <Pagination page={page} count={10} showFirstButton showLastButton onChange={changePage}/>
      <div className="footer"><Button variant="contained" href="#filter-input">back to top</Button></div>
    </div>
    }/>
    
  </Routes>
        </div></Router>
}

export default App;
