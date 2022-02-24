import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Sentiment from 'sentiment'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {DebounceInput} from 'react-debounce-input';
import { Button, TextField, Pagination, Alert } from '@mui/material';
import Paste from "./paste";
const sentiment = new Sentiment()

function App() {
  const [pastes, setPastes] = useState([])
  const [age, setAge] = useState(0)
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState(0)
  const inputAge = useRef(null)
  
  const changeFilter = (e) => {
    setSearchText(e.target.innerText)
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
      let foundedAlerts = 0
      const res = await axios.get('http://localhost:8080/')
      for(let i = 0; i < res.data.length; i++){
        if(sentiment.analyze(res.data[i].content).score < 0) {
          foundedAlerts++;
        }
      }
      setAlerts(foundedAlerts)
      setPastes(res.data)
    }
    getPastes();
  },[])
  
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
        <Alert style={{width: "25%", marginButtom: "5px"}} variant="outlined" severity="warning">There are {alerts} suspicious pastes</Alert>
      <DebounceInput style={{height: "40px", width: "250px", fontSize: "25px", borderColor: "blue", borderRadius: "4px"}} id='filter-input' placeholder="enter text filtering" debounceTimeout={1000} onChange={(e)=>{setSearchText(e.target.value)}} />
      <ul>
        {pastes.slice((page-1) * 15, (page * 15)).map((p)=>{
           return <Paste age={age} paste={p} filter={searchText} changeFilter={changeFilter} />
        })}
      </ul>
      <Pagination page={page} count={10} showFirstButton showLastButton onChange={(e, v)=>{setPage(v)}}/>
      <div className="footer"><Button variant="contained" href="#filter-input">back to top</Button></div>
    </div>
    }/>
    
  </Routes>
        </div></Router>
}

export default App;