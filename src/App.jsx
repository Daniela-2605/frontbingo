import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameType, setGameType] = useState("americano");
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [lastThree, setLastThree] = useState([]);
  const [kenoNumbers, setKenoNumbers] = useState([]);

  // ⚠️ Asegura que las voces estén cargadas
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};
  }, []);

  const speak = (text) => {
    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(
      (v) =>
        v.lang.startsWith("es") &&
        /female|femenina|Helena|Laura|Google/i.test(v.name)
    );

    const selectedVoice =
      spanishVoices[0] || voices.find((v) => v.lang.startsWith("es"));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice || null;
    utterance.lang = "es-ES";
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startGame = async () => {
    try {
      await axios.post("http://localhost:3000/api/bingo/start", {
        type: gameType,
      });
      setGameStarted(true);
      setCurrentNumber(null);
      setCurrentLetter(null);
      setLastThree([]);
      setKenoNumbers([]);
    } catch (err) {
      alert("Error al iniciar el juego");
      console.error(err);
    }
  };

  const drawNumber = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/bingo/numero");
      const { numero, letra, drawnKenoNumbers } = res.data;

      setCurrentNumber(numero);
      setCurrentLetter(letra);

      if (gameType === "keno") {
        setKenoNumbers(drawnKenoNumbers || []);
      }

      setLastThree((prev) => {
        const updated = [numero, ...prev];
        return updated.slice(0, 3);
      });

      // 👇 Habla el número
      speak(`${letra} ${numero}`);
    } catch (err) {
      alert("Error al sacar número");
      console.error(err);
    }
  };

  const resetGame = async () => {
    try {
      await axios.post("http://localhost:3000/api/bingo/reset");
      setGameStarted(false);
      setCurrentNumber(null);
      setCurrentLetter(null);
      setLastThree([]);
      setKenoNumbers([]);
    } catch (err) {
      alert("Error al reiniciar el juego");
      console.error(err);
    }
  };

  const buttonStyle = (color) => ({
    backgroundColor: color,
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  });

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          color: "#facc15",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span role="img" aria-label="party">
          🎉
        </span>
        <span>BINGO</span>
        <span role="img" aria-label="party">
          🎉
        </span>
      </h1>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <select
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "0.5rem", color: "black" }}
        >
          <option value="americano">Americano</option>
          <option value="britanico">Británico</option>
          <option value="keno">Keno</option>
        </select>

        <button onClick={startGame} style={buttonStyle("blue")}>
          Iniciar Juego
        </button>

        {gameStarted && (
          <>
            <button onClick={drawNumber} style={buttonStyle("green")}>
              Sacar Número
            </button>
            <button onClick={resetGame} style={buttonStyle("red")}>
              Reiniciar
            </button>
          </>
        )}
      </div>

      {gameType === "keno" && kenoNumbers.length > 0 && (
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            maxWidth: "500px",
            marginTop: "1rem",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>Números Keno</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "0.5rem",
            }}
          >
            {kenoNumbers.map((num, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: "#facc15",
                  padding: "0.3rem 0.5rem",
                  borderRadius: "9999px",
                  textAlign: "center",
                }}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {currentNumber && (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: "1.25rem" }}>Número actual:</p>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#34d399",
              marginTop: "0.5rem",
            }}
          >
            {currentLetter} {currentNumber}
          </div>
        </div>
      )}

      {lastThree.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p style={{ fontSize: "1.125rem" }}>Últimos 3 números:</p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "0.5rem",
              justifyContent: "center",
            }}
          >
            {lastThree.map((n, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#4b5563",
                  color: "white",
                  fontSize: "1.5rem",
                  padding: "1rem",
                  borderRadius: "9999px",
                  width: "4rem",
                  height: "4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


