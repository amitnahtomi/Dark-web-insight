import axios from "axios";
import { useEffect, useState } from 'react';

function App() {
  const [pastes, setPastes] = useState([])
  
  useEffect(()=>{
    const getPastes = async () => {
      const res = await axios.get('http://localhost:8080/')
      setPastes(res.data)
    }
    getPastes();
  },[])
  
  return <div>
    <ul>
      {pastes.map((p)=>{
        return <li>
          <span>{p.title}</span>
          <span>{p.author}</span>
          <span>{p.date}</span>
          <div>{p.content}</div>
        </li>
      })}
    </ul>
  </div>
  
}

export default App;
