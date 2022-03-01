import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2'
import { Chart, registerables, ArcElement } from "chart.js";
import Sentiment from 'sentiment'
Chart.register(...registerables);
Chart.register(ArcElement);
const sentiment = new Sentiment()

export default function Charts({pastes}) {
    const [sentimentData, setSentimentData] = useState([])
    const [subjectData, setSubjectData] = useState([])

    useEffect(()=>{
        let sentimentArr = [0,0,0]
        let subjectArr = [0,0,0,0,0]
        for(let i = 0; i < pastes.length; i++){
            if(sentiment.analyze(pastes[i].content).score > 0) {sentimentArr[0]++}
            else if(sentiment.analyze(pastes[i].content).score < 0) {sentimentArr[2]++}
            else {sentimentArr[1]++}

            if((pastes[i].content).toLowerCase().includes("onion")){subjectArr[0]++}
            else if((pastes[i].content).toLowerCase().includes("porn")){subjectArr[1]++}
            else if((pastes[i].content).toLowerCase().includes("weapon") || (pastes[i].content).toLowerCase().includes("gun")){subjectArr[2]++}
            else if((pastes[i].content).toLowerCase().includes("dark") || (pastes[i].content).toLowerCase().includes("black")){subjectArr[3]++}
            else {subjectArr[4]++}
        }
        setSentimentData(sentimentArr)
        setSubjectData(subjectArr)
    },[])

    return <div style={{color: "steelblue", textAlign: "center"}}><h1>Sentiment</h1><div style={{height: "600px", width: "600px", paddingLeft: "25%"}}><Pie data={{
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
            {
                label: "# of votes",
                data: sentimentData,
                backgroundColor: ["yellow", "blue", "pink"]
            }
        ],
        
    }} /></div>
    <h1>Subject</h1><div style={{height: "600px", width: "600px", paddingLeft: "25%"}}><Pie data={{
        labels: ["Onion", "Porn", "Weapon","Dark market" ,"Other"],
        datasets: [
            {
                label: "# of votes",
                data: subjectData,
                backgroundColor: ["yellow", "blue", "pink", "purple", "orange"]
            }
        ],
        
    }} /></div>
    </div>
}