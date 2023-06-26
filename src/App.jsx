import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [astronautPosition, setAstronautPosition] = useState({
    left: 0,
    bottom: 0,
  });
  const [alienPositions, setAlienPositions] = useState([0, 1, 2, 3, 4]);
  const [rocketParts, setRocketParts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // useEffect pour gérer les événements de touche
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && !gameOver) {
        moveLeft();
      } else if (event.key === 'ArrowRight' && !gameOver) {
        moveRight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  // Fonction pour déplacer l'astronaute vers la gauche
  const moveLeft = () => {
    const newAlienPositions = alienPositions.map((position) => position - 1);
    setAlienPositions(newAlienPositions);

    if (astronautPosition.left > 0) {
      setAstronautPosition((prevPosition) => ({
        ...prevPosition,
        left: prevPosition.left - 1,
      }));
      checkCollision();
    }
  };

  // Fonction pour déplacer l'astronaute vers la droite
  const moveRight = () => {
    if (astronautPosition.left < 4) {
      setAstronautPosition((prevPosition) => ({
        ...prevPosition,
        left: prevPosition.left + 1,
      }));
      checkCollision();
    }
  };

  // Fonction pour faire sauter l'astronaute
  const jump = () => {
    if (!isJumping) {
      const jumpHeight = 200; // Hauteur du saut
      const jumpDuration = 500; // Durée du saut
      const jumpStep = jumpHeight / (jumpDuration / 16);
      const fallStep = jumpStep * 2;

      let currentHeight = 0;
      setIsJumping(true);

      const jumpInterval = setInterval(() => {
        if (currentHeight >= jumpHeight) {
          clearInterval(jumpInterval);

          const fallInterval = setInterval(() => {
            if (currentHeight <= 0) {
              clearInterval(fallInterval);
              setIsJumping(false);
            } else {
              setAstronautPosition((prevPosition) => ({
                ...prevPosition,
                bottom: prevPosition.bottom - fallStep,
              }));

              currentHeight -= fallStep;
            }
          }, 16);
        } else {
          setAstronautPosition((prevPosition) => ({
            ...prevPosition,
            bottom: prevPosition.bottom + jumpStep,
          }));

          currentHeight += jumpStep;
        }
      }, 16);
    }
  };

  // Fonction pour vérifier la collision entre l'astronaute et les parties de la fusée
  const checkCollision = () => {
    if (astronautPosition.left === rocketParts) {
      setRocketParts((prevParts) => prevParts + 1);

      if (rocketParts + 1 === 5) {
        setGameOver(true);
      }
    }
  };

  // Fonction pour démarrer le jeu
  const startGame = () => {
    setRocketParts(0);
    setGameOver(false);
    setGameStarted(true);
  };

  // Fonction pour rendre le message du jeu en fonction de l'état du jeu
  const renderGameMessage = () => {
    if (gameOver && gameStarted) {
      return (
        <div>
          <h2>Félicitations ! Vous pouvez retourner sur Terre !</h2>
          <button className='button-replay' onClick={startGame}>
            Rejouer
          </button>
        </div>
      );
    } else {
      return (
        <h2>
          Évitez les extraterrestres et collectez les morceaux de la fusée.
        </h2>
      );
    }
  };

  // Fonction pour rendre l'astronaute vivant (bouger)
  const renderAstronaut = () => {
    return (
      <div
        className={`astronaut ${isJumping ? 'jumping' : ''}`}
        style={{
          left: `${astronautPosition.left * 20}%`,
          bottom: `${astronautPosition.bottom}px`,
        }}
      >
        👨‍🚀
      </div>
    );
  };

  // Fonction pour rendre les parties de la fusée vivant
  const renderRocketParts = () => {
    const parts = [];

    for (let i = 0; i < 5; i++) {
      const collected = i < rocketParts;
      parts.push(
        <div
          key={i}
          className={`rocket-part ${collected ? 'collected' : ''}`}
          style={{ left: `${i * 20}%` }}
        >
          🚀
        </div>
      );
    }

    return parts;
  };

  // Fonction pour les extraterrestres
  const renderExtraterrestrials = () => {
    return alienPositions.map((position, index) => (
      <div
        key={index}
        className={`extraterrestrial ${
          astronautPosition.left === position ? 'active' : ''
        }`}
        style={{ left: `${position * 20}%` }}
      >
        👽
      </div>
    ));
  };

  return (
    <div className='game-container'>
      {renderGameMessage()}
      <div className='game-area'>
        {renderAstronaut()}
        {renderRocketParts()}
        {renderExtraterrestrials()}
      </div>
      <div className='controls'>
        <button onClick={moveLeft}>Gauche</button>
        <button onClick={moveRight}>Droite</button>
        <button onClick={jump}>Espace</button>
      </div>
    </div>
  );
};

export default App;

/*
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [astronautPosition, setAstronautPosition] = useState(0);
  const [rocketParts, setRocketParts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft' && !gameOver) {
        moveLeft();
      } else if (event.key === 'ArrowRight' && !gameOver) {
        moveRight();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  const moveLeft = () => {
    if (astronautPosition > 0) {
      setAstronautPosition(astronautPosition - 1);
      checkCollision();
    }
  };

  const moveRight = () => {
    if (astronautPosition < 4) {
      setAstronautPosition(astronautPosition + 1);
      checkCollision();
    }
  };

  const jump = () => {
    if (!isJumping) {
      const jumpHeight = 100;
      const jumpDuration = 500;
      const jumpStep = jumpHeight / (jumpDuration / 16);

      let currentHeight = 0;
      setIsJumping(true);

      const jumpInterval = setInterval(() => {
        if (currentHeight >= jumpHeight) {
          clearInterval(jumpInterval);

          setTimeout(() => {
            setIsJumping(false);
          }, 100);
        } else {
          setAstronautPosition((prevPosition) => ({
            ...prevPosition,
            top: prevPosition.top - jumpStep,
          }));

          currentHeight += jumpStep;
        }
      }, 16);
    }
  };

  const checkCollision = () => {
    if (astronautPosition === rocketParts) {
      setRocketParts(rocketParts + 1);

      if (rocketParts + 1 === 5) {
        setGameOver(true);
      }
    }
  };

  const renderGameMessage = () => {
    if (gameOver) {
      return <h2>Félicitations ! Vous pouvez retourner sur Terre !</h2>;
    } else {
      return (
        <h2>
          Évitez les extraterrestres et collectez les morceaux de la fusée.
        </h2>
      );
    }
  };

  const renderAstronaut = () => {
    return (
      <div
        className={`astronaut ${isJumping ? 'jumping' : ''}`}
        style={{ left: `${astronautPosition * 20}%`, bottom: 0 }}
      >
        👨‍🚀
      </div>
    );
  };

  const renderRocketParts = () => {
    const parts = [];

    for (let i = 0; i < 5; i++) {
      const collected = i < rocketParts;
      parts.push(
        <div
          key={i}
          className={`rocket-part ${collected ? 'collected' : ''}`}
          style={{ left: `${i * 20}%` }}
        >
          🚀
        </div>
      );
    }

    return parts;
  };

  const renderExtraterrestrials = () => {
    const extraterrestrials = [];

    for (let i = 0; i < 5; i++) {
      const isActive = i === astronautPosition;
      extraterrestrials.push(
        <div
          key={i}
          className={`extraterrestrial ${isActive ? 'active' : ''}`}
          style={{ left: `${i * 20}%` }}
        >
          👽
        </div>
      );
    }

    return extraterrestrials;
  };

  return (
    <div className='game-container'>
      {renderGameMessage()}
      <div className='game-area'>
        {renderAstronaut()}
        {renderRocketParts()}
        {renderExtraterrestrials()}
      </div>
      <div className='controls'>
        <button onClick={moveLeft}>Gauche</button>
        <button onClick={moveRight}>Droite</button>
        <button onClick={jump}>Espace</button>
      </div>
    </div>
  );
};

export default App;
*/
