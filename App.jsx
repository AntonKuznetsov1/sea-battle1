import React, { useState, useEffect } from "react";
import "styles.css";

const App = () => {
  const phases = ["before", "start", "game", "end"];
  const [placeCellsLeftP1, setPlaceCellsLeftP1] = useState(10);
  const [placeCellsLeftP2, setPlaceCellsLeftP2] = useState(10);
  const [turnPhase, setTurnPhase] = useState(true);
  const [tP, setTP] = useState("Start");
  const [phase, setPhase] = useState(phases[0]);
  const [player, setPlayer] = useState(true);
  const [pl, setPl] = useState("1");
  const [cellsP1, setCellsP1] = useState(Array(100).fill(false));
  const [cellsP2, setCellsP2] = useState(Array(100).fill(false));
  const [amount1P1, setAmount1P1] = useState(4);
  const [amount2P1, setAmount2P1] = useState(3);
  const [amount3P1, setAmount3P1] = useState(2);
  const [amount4P1, setAmount4P1] = useState(1);
  const [amount1P2, setAmount1P2] = useState(4);
  const [amount2P2, setAmount2P2] = useState(3);
  const [amount3P2, setAmount3P2] = useState(2);
  const [amount4P2, setAmount4P2] = useState(1);
  const [imageNumber, setImageNumber] = useState(4);
  const [isVertical, setIsVertical] = useState("v");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [turnButtonClicks, setTurnButtonClicks] = useState(0);
  const [hitStatusP1, setHitStatusP1] = useState(Array(100).fill(0));
  const [hitStatusP2, setHitStatusP2] = useState(Array(100).fill(0));
  const [spacesLeftP1, setSpacesLeftP1] = useState(null);
  const [spacesLeftP2, setSpacesLeftP2] = useState(null);
  const [winner, setWinner] = useState(null);
  const a = "Turn"
  const b = "Win"
  const [isDone1, setIsDone1] = useState(false);
  const [isDone2, setIsDone2] = useState(false);

  useEffect(() => {
    setPl(player ? "1" : "2");
  }, [player]);

  useEffect(() => {
    if (spacesLeftP1 === 0 || spacesLeftP2 === 0){
        setWinner(player)
        setPhase(phases[3])
  }}, [spacesLeftP1, spacesLeftP2]);

  const amountMap = player
    ? {
        1: amount1P1,
        2: amount2P1,
        3: amount3P1,
        4: amount4P1,
      }
    : {
        1: amount1P2,
        2: amount2P2,
        3: amount3P2,
        4: amount4P2,
      };

  const amountSetterMap = player
    ? {
        1: setAmount1P1,
        2: setAmount2P1,
        3: setAmount3P1,
        4: setAmount4P1,
      }
    : {
        1: setAmount1P2,
        2: setAmount2P2,
        3: setAmount3P2,
        4: setAmount4P2,
      };

  const Confirm = () => {
    setIsConfirmed((prev) => !prev);
  };

  const checkSurrounding = (cells, id, imageNumber, isVertical) => {
    const shipPositions = [];
    for (let i = 0; i < imageNumber; i++) {
      const pos = isVertical ? id + i * 10 : id + i;
      shipPositions.push(pos);
    }

    for (const pos of shipPositions) {
      const row = Math.floor(pos / 10);
      const col = pos % 10;
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          const neighbor = r * 10 + c;
          if (
            r >= 0 &&
            r < 10 &&
            c >= 0 &&
            c < 10 &&
            !shipPositions.includes(neighbor) &&
            cells[neighbor]
          ) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const ShipCheck = (id) => {
    if (!isConfirmed || amountMap[imageNumber] <= 0) return;

    const isV = isVertical === "v";
    const cells = player ? [...cellsP1] : [...cellsP2];

    for (let i = 0; i < imageNumber; i++) {
      const offset = isV ? i * 10 : i;
      const target = id + offset;
      if (isV) {
        if (Math.floor(id / 10) + imageNumber > 10) {
          setIsConfirmed(false);
          alert("The ship is placed out of bounds");
          return;
        }
      } else {
        if (id % 10 + imageNumber > 10) {
          setIsConfirmed(false);
          alert("The ship is placed out of bounds");
          return;
        }
      }
      if (!checkSurrounding(cells, id, imageNumber, isV)) {
        setIsConfirmed(false);
        return;
      }
      cells[target] = true;
    }

    if (player) {
      setCellsP1(cells);
      setPlaceCellsLeftP1((prev) => prev - 1);
    } else {
      setCellsP2(cells);
      setPlaceCellsLeftP2((prev) => prev - 1);

    }

    player ? setSpacesLeftP1((prev) => prev + imageNumber) : setSpacesLeftP2((prev) => prev + imageNumber)

    amountSetterMap[imageNumber]((prev) => prev - 1);
  };

  const isHit = (id) => {
    const opponentCells = player ? [...cellsP2] : [...cellsP1];
    const newStatus = player ? [...hitStatusP1] : [...hitStatusP2];

    if (player) {
      if (!isDone1){
        if (opponentCells[id] === true) {
      if (player) {
        setCellsP2(opponentCells);
        setSpacesLeftP2((prev) => prev - 1);
      } else {
        setCellsP1(opponentCells);
        setSpacesLeftP1((prev) => prev - 1);
      }
      newStatus[id] = 1; // Hit
    } else {
      newStatus[id] = 2; // Miss
    }
      }
    } else if (!isDone2){
        if (opponentCells[id] === true) {
      if (player) {
        setCellsP2(opponentCells);
        setSpacesLeftP2((prev) => prev - 1);
      } else {
        setCellsP1(opponentCells);
        setSpacesLeftP1((prev) => prev - 1);
      }
      newStatus[id] = 1; // Hit
    } else {
      newStatus[id] = 2; // Miss
    }
      }

    player ? setHitStatusP1(newStatus) : setHitStatusP2(newStatus);
    player ? setIsDone1(true) : setIsDone2(true) 
  };

  const Previous = () => {
    if (imageNumber > 1) setImageNumber((prev) => prev - 1);
  };

  const Next = () => {
    if (imageNumber < 4) setImageNumber((prev) => prev + 1);
  };

  const Rotate = () => {
    setIsVertical((prev) => (prev === "v" ? "h" : "v"));
  };

  const NextTurn = () => {
    setTurnButtonClicks((prevClicks) => {
      const newClicks = prevClicks + 1;

      if (newClicks === 1) {
        setPhase("start");
        setTP("End");
      } else if (newClicks === 2) {
        setTP("Start");
        setPlayer(false);
      } else if (newClicks === 3) {
        setTP("End");
      } else if (newClicks === 4) {
        setPhase("game");
        setPlayer(true);
        setTP("Next Turn");
      }

      return newClicks;
    });

    if (phase === "game") {
      setPlayer((prev) => !prev);
    }
    
    if (phase === "game"){
      setIsDone1(false);
      setIsDone2(false);
    }
  };

  return (
    <div className="container">
      <div className="mainLayout">
        <div className="interface">
          <h1 className="font heading">Sea Battle</h1>
          <p className="starterHeader">Player {pl} {phase !== "end" ? a : b}</p>
          {phase === "start" && (
            <div className="field">
              {Array.from({ length: 100 }, (_, i) => {
                const placed = player ? cellsP1[i] : cellsP2[i];
                return (
                  <div
                    key={i}
                    className="cell"
                    onClick={() => ShipCheck(i)}
                    style={{
                      backgroundColor: placed
                        ? "#7ae582"
                        : "rgba(255, 255, 255, 0.74)",
                    }}
                  ></div>
                );
              })}
            </div>
          )}
          {phase === "game" && (
            <div className="fieldSection">
              <div className="field opponent">
                {Array.from({ length: 100 }, (_, i) => {
                  const status = player ? hitStatusP1[i] : hitStatusP2[i];
                  return (
                    <div
                      key={i}
                      className="cell"
                      onClick={() => isHit(i)}
                      style={{
                        backgroundColor:
                          status === 1
                            ? "#e63946"
                            : status === 2
                            ? "#fff3b0"
                            : "rgba(255, 255, 255, 0.74)",
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          )}


          { phase !== "end" ? <button className="button" onClick={NextTurn}>
            {tP}
          </button>: undefined}
        </div>

        <div className="stats starterHeader">
          {phase === "start" && (
            <>
              <p>
                Player {pl} Ships Left:{" "}
                {player ? placeCellsLeftP1 : placeCellsLeftP2}
              </p>
              <div className="shipMenu">
                <div className="imageDiv">
                  <img
                    className="image"
                    src={`ship${imageNumber}${isVertical}.png`}
                    alt="Ship"
                  />
                </div>
                <div className="buttons">
                  <div className="previous el button1">
                    <img
                      className="el1 previous1"
                      src="previous.png"
                      onClick={Previous}
                    />
                  </div>
                  <div className="rotate el button1">
                    <img
                      className="el1 rotate1"
                      src="rotate.png"
                      onClick={Rotate}
                    />
                  </div>
                  <div className="amount el button1">
                    <p className="amountText">{amountMap[imageNumber]}</p>
                  </div>
                  <div className="confirmation el button1">
                    <img
                      className="el1 confirmation1"
                      src={
                        isConfirmed ? "notconfirmed.png" : "confirmation.png"
                      }
                      onClick={Confirm}
                    />
                  </div>
                  <div className="next el button1">
                    <img
                      className="el1 next1"
                      src="next.png"
                      onClick={Next}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
