import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import './App.css';
import moment from 'moment';
import Filter from 'bad-words';
import Sentiment from 'sentiment'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {DebounceInput} from 'react-debounce-input';
const filter = new Filter();
const sentiment = new Sentiment()

function App() {
  const [pastes, setPastes] = useState([])
  const [age, setAge] = useState(0)
  const [searchText, setSearchText] = useState(false)
  const inputAge = useRef(null)

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
      <div>
        <button onClick={setUserAge}><Link to={'/forom'}>enter</Link></button>
        <input ref={inputAge} type={'number'}></input>
      </div>
    }/>
    <Route path={'/forom'} element={
      <div>
      {/*<input onChange={(e)=>{setSearchText(e.target.value)}} placeholder="enter text filtering"></input>*/}
      <DebounceInput placeholder="enter text filtering" debounceTimeout={1000} onChange={(e)=>{setSearchText(e.target.value)}} />
      <ul>
        {pastes.map((p)=>{
          if(age >= 18) {
            return <li>
            <div>{p.title}</div>
            <div>by {p.author}</div>
            <div>at {moment(p.date).format('LLLL')}</div>
            <div>sentiment value: {sentiment.analyze(p.content).score}</div>
            <button onClick={viewContent}>open</button>
            <div hidden>{p.content}</div>
            </li>
          }
          else {
            return <li>
              <div>{filter.clean(p.title)}</div>
              <div>by {p.author}</div>
              <div>at {moment(p.date).format('LLLL')}</div>
              <div>sentiment value: {sentiment.analyze(p.content).score}</div>
              <button onClick={viewContent}>open</button>
              <div hidden>{filter.clean(p.content)}</div>
            </li>
          }
        })}
      </ul>
    </div>
    }/>
    
  </Routes>
        </div></Router>
}

export default App;
