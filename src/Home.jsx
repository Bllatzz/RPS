import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import RoulettePro from "react-roulette-pro";
import "react-roulette-pro/dist/index.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong } from '@fortawesome/free-solid-svg-icons';

import "./home.css";

import sound from './assets/paysandu.mp3';

const prizes = [
  {
    id: "1",
    image: "./public/images/rock.png",
    text: "Pedra",
  },
  {
    id: "2",
    image: "./public/images/paper.png",
    text: "Papel",
  },
  {
    id: "3",
    image: "./public/images/scissors.png",
    text: "Tesoura",
  },
];

const winPrizeIndex = 0;

const reproductionArray = (array = [], length = 0) => [
  ...Array(length)
    .fill("_")
    .map(() => array[Math.floor(Math.random() * array.length)]),
];

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const App = () => {
  const [start, setStart] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showModalStart, setShowModalStart] = useState(true);
  const [selectedPrize, setSelectedPrize] = useState(prizes[0]);
  const [difficulty, setDifficulty] = useState(null); 
  
  const [prizeList, setPrizeList] = useState(() => {
    const reproducedPrizeList = [
      ...prizes,
      ...reproductionArray(prizes, prizes.length * 3),
      ...prizes,
      ...reproductionArray(prizes, prizes.length),
    ];

    return shuffleArray(reproducedPrizeList).map((prize) => ({
      ...prize,
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : generateId(),
    }));
  });

  const [score, setScore] = useState({ wins: 0, losses: 0 });
  const [finalScore, setFinalScore] = useState({ wins: 0, losses: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCircleIndex, setCurrentCircleIndex] = useState(0);


  const prizeIndex = prizes.length * 4 + winPrizeIndex;

  const handleStart = () => {
    if (!isModalOpen && difficulty)  {
      setPrizeList((prevList) => shuffleArray(prevList));
      setStart(true);
      setShowLevel(false);
      setShowModalStart(false);
      setCurrentCircleIndex(0)
    }
  };
  const showFinalModal = () => {
    let modal = document.querySelector('.modal');
    modal.style.display = "block";
  };
  const showLevelChoose = () => {
    setShowModalStart(false);
    setShowLevel(true);
    fecharModalCriar()

  };
  const circleVisibility = () => {
    const circle1 = document.getElementById("circle-1");
    const circle2 = document.getElementById("circle-2");
    const circle3 = document.getElementById("circle-3");
    const circle4 = document.getElementById("circle-4");
    const circle5 = document.getElementById("circle-5");

    if (difficulty === "facil") {
      circle1.style.display = "block"
      circle2.style.display = "block"
      circle3.style.display = "block"
      circle4.style.display = "none"
      circle5.style.display = "none"
    } if( difficulty === "medio"){
      circle1.style.display = "block"
      circle2.style.display = "block"
      circle3.style.display = "block"
      circle4.style.display = "block"
      circle5.style.display = "none"

    }
    if( difficulty === "dificil"){
      circle1.style.display = "block"
      circle2.style.display = "block"
      circle3.style.display = "block"
      circle4.style.display = "block"
      circle5.style.display = "block"
    }
    
  };

  const handleDifficultySelect = (e) => {
    setDifficulty(e.target.value);
  };

  const handleFinish = async () => {
    setFinalScore(score);
    setStart(false);
    showFinalModal();
    setScore({ wins: 0, losses: 0 });
    const circles = document.querySelectorAll(".circle")
    circles.forEach(circle => {
      circle.style.background = "#f9f9f9";
    });
  };

  const handlePrizeDefined = async () => {
    const pcPrize = prizeList[prizeIndex];
    let resultMessage = '';

    if (selectedPrize.text === pcPrize.text) {
      resultMessage = "Empate!";
      alert(resultMessage);
    } else if (
      (selectedPrize.text === "Pedra" && pcPrize.text === "Papel") ||
      (selectedPrize.text === "Papel" && pcPrize.text === "Tesoura") ||
      (selectedPrize.text === "Tesoura" && pcPrize.text === "Pedra")
    ) {
      setScore((prevScore) => ({ ...prevScore, losses: prevScore.losses + 1 }));
    } else {
      setScore((prevScore) => ({ ...prevScore, wins: prevScore.wins + 1 }));
      const circles = document.querySelectorAll(".circle");
        if (currentCircleIndex < circles.length) {
          circles[currentCircleIndex].style.background = '#00FF00';
          setCurrentCircleIndex(currentCircleIndex + 1); 
        }
        resultMessage = "Você ganhou!";
        alert(resultMessage);
    }

   
    setStart(false);
  };



  const handleSelectPrize = (prize) => {
    setSelectedPrize(prize);
  };

  const fecharModalCriar = async () => {
    let modal = document.querySelector('.modal');
    modal.style.display = "none";
    setIsModalOpen(false);
  };

  const handleModalClick =  (e) => {
    if (e.target.className === 'modal') {
     fecharModalCriar();
    }
  };

  const handleLevelSelect = () => {
    setShowLevel(false); 
    setShowModalStart(false);
    alert(`Voce selecionou a dificuldade ${difficulty}`)
  };
  const audio = new Audio(sound);
  audio.volume = 0.1;

  useEffect(() => {
    if (start) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    if (start) {
      const circles = document.querySelectorAll(".circle");
      circles.forEach(circle => {
        circle.style.background = "#f9f9f9";
      });
    }

    const winCondition =
      difficulty === "facil"
        ? 3
        : difficulty === "medio"
        ? 4 
        : 5; 

    if (score.wins >= winCondition || score.losses >= 1) {
      handleFinish();
    }
    circleVisibility()
  }, [score, difficulty,start]);

  return (
    <>
      {showModalStart && (
        <div className="modalStart">
          <div className="center">
            <h2>Como jogar?</h2>
            <p>Você terá 3 opções para jogar,o Modo Fácil, o Modo Médio e o Modo Difícil</p>
            <p>Você ganhará mais conforme maior a dificuldade</p>
            <p>Se você PERDER UMA VEZ, perderá o valor apostado!</p>
            <button onClick={showLevelChoose}>Continuar</button>
          </div>
        </div>
      )}

      {showLevel && (
       <div className="modalStart levelChoose">
       <div className="center">
         <div className="difficulty-options">
           <div className="difficulty-option">
             <input 
               type="radio" 
               name="difficulty" 
               value="facil" 
               onChange={handleDifficultySelect}
               id="facil"
             />
             <label htmlFor="facil" className="difficulty-label">
               <h3>Fácil</h3>
               <p>Aqui você terá que ganhar uma melhor de 5</p>
               <p>O valor de cada rodada será o menor possível</p>
             </label>
           </div>
     
           <div className="difficulty-option">
             <input 
               type="radio" 
               name="difficulty" 
               value="medio" 
               onChange={handleDifficultySelect}
               id="medio"
             />
             <label htmlFor="medio" className="difficulty-label">
              <h3>Médio</h3>
              <p>Aqui você terá que ganhar uma melhor de 7</p>
              <p>O valor de cada rodada será mais justo possível</p>
             </label>
           </div>
     
           <div className="difficulty-option">
             <input 
               type="radio" 
               name="difficulty" 
               value="dificil" 
               onChange={handleDifficultySelect}
               id="dificil"
             />
             <label htmlFor="dificil" className="difficulty-label">
              <h3>Difícil</h3>
              <p>Aqui você terá que ganhar uma melhor de 9</p>
              <p>O valor de cada rodada será o maior possível</p>
             </label>
           </div>
         </div>
         <button 
           onClick={handleLevelSelect} 
           disabled={!difficulty} 
         >
           Jogar!
         </button>
       </div>
     </div>
     
      )}

      <div className="modal" onClick={handleModalClick}>
        <div className="center">
          <h1>Jogo finalizado!</h1>
          <h2 className="my-4">{
          finalScore.wins > finalScore.losses
          ? 'Você ganhou!'
          : (finalScore.wins === 0 && finalScore.losses === 0)
          ? 'Você saiu no 0 a 0!'
          : 'Você perdeu tudo!'
        }
</h2>
          <Button onClick={showLevelChoose} className="text-black">Continuar</Button>
        </div>
      </div>

      <div className="bg-black container-main d-flex align-items-center justify-content-center">
        <div className="d-flex text-white player w-33">
          <div>
            {prizes.map((prize) => (
              <div key={prize.id} className="d-flex flex-column justify-content-center align-items-center choose-container">
                <input 
                  type="radio" 
                  name="prize" 
                  id={`prize-${prize.id}`} 
                  value={prize.text} 
                  onChange={() => handleSelectPrize(prize)} 
                  checked={selectedPrize.text === prize.text} 
                  disabled={start}
                />
                <label htmlFor={`prize-${prize.id}`} className="position-relative">
                  <img src={prize.image} alt={prize.text} />
                  {selectedPrize.text === prize.text && (
                    <FontAwesomeIcon 
                      icon={faRightLong} 
                      className="selected-arrow" 
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="my-5 w-33 text-center">
          <div className="score-display mt-3 text-white">
            <div className="score-card">
              <div className="score-item">
                <h2 className="score-label">Vitórias</h2>
                <p className="score-value">{score.wins}</p>
              </div>
              <div className="score-item">
                <h2 className="score-label">Derrotas</h2>
                <p className="score-value">{score.losses}</p>
              </div>
            </div>
          </div>
          <div className="way">
            <div className="circle" id="circle-1"></div>
            <div className="circle" id="circle-2"> </div>
            <div className="circle" id="circle-3"> </div>
            <div className="circle" id="circle-4"></div>
            <div className="circle" id="circle-5"> </div>
          </div>
          <div className="meme"></div>
          <div className="d-grid gap-4">
            <Button onClick={handleStart} className="text-dark fw-bolder" disabled={start}>
              Jogar
            </Button>
            <Button onClick={handleFinish} className="text-dark fw-bolder" disabled={start}>
              Encerrar Aposta
            </Button>
          </div>
        </div>

        <RoulettePro
          prizes={prizeList}
          prizeIndex={prizeIndex}
          start={start}
          type="vertical"
          spinningTime={5}
          onPrizeDefined={handlePrizeDefined}
          defaultDesignOptions={{ prizesWithText: true }}
          options={{ stopInCenter: false, withoutAnimation: false }}
        />
      </div>
    </>
  );
};

export default App;