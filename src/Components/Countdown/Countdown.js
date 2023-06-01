import React, { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import Fighters from "../Fighters/Fighter";
import "./Countdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faUndo,
  faPause,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function CountdownTimer() {
  const [fighters, setFighters] = useState([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);
  const [selectedFighters, setSelectedFighters] = useState([]);
  const [newFighterName, setNewFighterName] = useState("");
  const [deleteFighterName, setDeleteFighterName] = useState("");

  const countdownRef = useRef(null);

  const handlePlayPause = () => {
    setIsTimerRunning(!isTimerRunning);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    if (countdownRef.current) {
      countdownRef.current.getApi().stop();
      countdownRef.current.getApi().start();
      setIsTimerRunning(true);
      setIsPaused(false);
      setWinner(null);
      setLoser(null);
    }
  };

  const handleStop = () => {
    if (countdownRef.current) {
      countdownRef.current.getApi().stop();
      setIsTimerRunning(false);
      setIsPaused(false);
      setWinner(null);
      setLoser(null);
    }
  };

  const createFighter = () => {
    // Lógica para crear un nuevo luchador a través de la API
    fetch("https://647840d5362560649a2d65c4.mockapi.io/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newFighterName }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedFighters = [...fighters, data.name];
        setFighters(updatedFighters);
        setNewFighterName(""); // Reinicia el nombre del nuevo luchador
      })
      .catch((error) => {
        console.error("Error creating fighter:", error);
      });
  };

  const deleteFighter = () => {
    // Lógica para eliminar un luchador por su nombre a través de la API
    fetch(
      `https://647840d5362560649a2d65c4.mockapi.io/users?name=${deleteFighterName}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const updatedFighters = fighters.filter(
          (fighter) => fighter !== deleteFighterName
        );
        setFighters(updatedFighters);
        setDeleteFighterName(""); // Reinicia el nombre del luchador a eliminar
      })
      .catch((error) => {
        console.error("Error deleting fighter:", error);
      });
  };

  const handleMatchResult = () => {
    if (winner && loser) {
      const updatedScoreboard = [...scoreboard];
      let winnerIndex = updatedScoreboard.findIndex(
        (entry) => entry.name === winner
      );
      let loserIndex = updatedScoreboard.findIndex(
        (entry) => entry.name === loser
      );

      if (winnerIndex === -1) {
        updatedScoreboard.push({ name: winner, points: 3 });
      } else {
        updatedScoreboard[winnerIndex].points += 3;
      }

      if (loserIndex === -1) {
        updatedScoreboard.push({ name: loser, points: 1 });
      } else {
        updatedScoreboard[loserIndex].points += 1;
      }

      setScoreboard(updatedScoreboard);
      setWinner(null);
      setLoser(null);
    }
  };

  const handleFighterSelect = (fighter) => {
    const updatedSelectedFighters = [...selectedFighters, fighter];
    if (updatedSelectedFighters.length > 2) {
      updatedSelectedFighters.shift();
    }
    setSelectedFighters(updatedSelectedFighters);

    if (updatedSelectedFighters.length === 2) {
      // Aquí puedes mostrar una ventana modal o un componente para seleccionar al ganador y perdedor de la pelea.
      // Por simplicidad, se muestra un prompt para seleccionar al ganador y perdedor.
      const selectedWinner = prompt(
        "Selecciona al ganador de la pelea",
        updatedSelectedFighters[0]
      );
      const selectedLoser = updatedSelectedFighters.find(
        (fighter) => fighter !== selectedWinner
      );

      if (selectedWinner && selectedLoser) {
        setWinner(selectedWinner);
        setLoser(selectedLoser);
        handleMatchResult(); // Actualizar la tabla de posiciones
      }
    }
  };

  useEffect(() => {
    // Lógica para obtener la lista de luchadores a través de la API
    fetch("https://647840d5362560649a2d65c4.mockapi.io/users")
      .then((res) => res.json())
      .then((data) => {
        const fighterNames = data.map((fighter) => fighter.name);
        setFighters(fighterNames);
      })
      .catch((error) => {
        console.error("Error fetching fighters:", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h1>Temporizador</h1>
          <div className="countdown-container">
            <Countdown
              date={Date.now() + 120000}
              ref={countdownRef}
              autoStart={false}
              onComplete={handleStop}
            />
          </div>
          <div className="buttons-container">
            <button
              className="btn btn-primary"
              onClick={handlePlayPause}
              disabled={isPaused && !isTimerRunning}
            >
              {isPaused && isTimerRunning ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                <FontAwesomeIcon icon={faPause} />
              )}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleReset}
              disabled={isTimerRunning || isPaused}
            >
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button className="btn btn-primary" onClick={handleStop}>
              <FontAwesomeIcon icon={faStop} />
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <h1>Luchadores</h1>
          <Fighters
            fighters={fighters}
            selectedFighters={selectedFighters}
            onFighterSelect={handleFighterSelect}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Nuevo Equipo</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del equipo"
              value={newFighterName}
              onChange={(e) => setNewFighterName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={createFighter}>
              Agregar
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <h2>Eliminar Equipo</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del equipo a eliminar"
              value={deleteFighterName}
              onChange={(e) => setDeleteFighterName(e.target.value)}
            />
            <button className="btn btn-danger" onClick={deleteFighter}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
