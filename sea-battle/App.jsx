import React, { useState, useEffect } from "react";
import "./styles.css"

const App = () => {
  const phases = ["start", "game", "end"];
  const [placeCellsLeftP1, setPlaceCellsLeftP1] = useState(20);
  const [placeCellsLeftP2, setPlaceCellsLeftP2] = useState(20);
  const [turnPhase, setTurnPhase] = useState(true);
  const [tP, setTP] = useState("Start");
  const [phase, setPhase] = useState(phases[0]);
  const [player, setPlayer] = useState(true);
  const [pl, setPl] = useState("1");
  const [startLeft, setStartLeft] = useState(1);
  const [cellsP1, setCellsP1] = useState(Array(100).fill(false));
  const [cellsP2, setCellsP2] = useState(Array(100).fill(false));
  const [amount, setAmount] = useState("4");
  

  const NextTurn = () => {
    const next = !turnPhase;
    setTurnPhase(next);
    setTP(next ? "Start" : "End");

    if (next) {
      setPlayer(prev => !prev);
      
      if(startLeft > 0){
        setPhase(phases[0]);
        setStartLeft(startLeft - 1);
      } else {
        setPhase(phases[1]);
      }
    }

  };

  const PlaceCell = (index) => {
    if (phase !== "start") return;

    if (player && placeCellsLeftP1 > 0 && !cellsP1[index]) {
      const newCells = [...cellsP1];
      newCells[index] = true;
      setCellsP1(newCells);
      setPlaceCellsLeftP1(prev => prev - 1);
      console.log(cellsP2, cellsP1, newCells);
    } else if (!player && placeCellsLeftP2 > 0 && !cellsP2[index]) {
      const newCells = [...cellsP2];
      newCells[index] = true;
      setCellsP2(newCells);
      setPlaceCellsLeftP2(prev => prev - 1);
      console.log(cellsP2, cellsP1, newCells);
    }
  };

  const CheckTaken = (id) => {

    if (player){
      let takenIndex = cellsP1[id];
    } else {
      let takenIndex = cellsP2[id];
    }

    takenIndex ? true : false;
  }

  const CheckPlace = (action, number, id) => {

    const lastTwoDigits = id % 100;

    if (action === "+"){
      lastTwoDigits + number > 100 ? true : false;
      CheckTaken(id + number);
    } else if (action === "-"){
      lastTwoDigits - number < 0 ? true : false;
      CheckTaken(id - number);
    } else {
      alert("Invalid action")
    }
  }


  useEffect(() => {setPl(player ? "1" : "2");}, [player]);


  return (
    <>
      <div className="interface">
        <h1 className="font heading">Sea Battle </h1>
        { phase !== "end" && <p className="starterHeader">Player {pl} Turn</p>}
        {phase === "start" && (
          <div className="field">
            {Array.from({ length: 100 }, (_, i) => {
              const placed = player ? cellsP1[i] : cellsP2[i];
              return (
                <div
                  key={i}
                  className="cell"
                  onClick={() => PlaceCell(i)}
                  style={{
                    backgroundColor: placed ? "#7ae582" : "rgba(255, 255, 255, 0.74)",
                  }}
        ></div>
      );
    })}
  </div>
)}


        <button className="button" onClick={NextTurn}>{tP} Turn</button>
      </div>
      <div className="stats starterHeader">
        { phase === "start" && <p>Player {pl} Cells Left: {player ? placeCellsLeftP1 : placeCellsLeftP2} </p>}

        { phase === "start" && 
        <div className="shipMenu">
          <div className="imageDiv"> <img className="image" src="./ship_4v-removebg-preview.png"/> </div> 
          <div className="buttons">
            <div className="previous el button1"><img className="el1 previous1" src="previous.png"/></div> 
            <div className="rotate el button1"><img className="el1 rotate1" src="rotate.png"/></div> 
            <div className="amount el button1"><p className="amountText ">{amount}</p></div> 
            <div className="confirmation el button1"><img className="el1 confirmation1" src="confirmation.png"/></div> 
            <div className="next el button1"><img  className="el1 next1" src="next.png"/></div>
          </div>
        </div>}
      </div>
    </>
  );
};


export default App;