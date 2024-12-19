import React, { useState, useEffect, useRef, useTransition } from "react";
import { Board } from "../board";
import { useDispatch } from "react-redux";
import { updateStats, updateGamesHistory } from "../../redux/user-slice";
import { useNavigate } from "react-router-dom";
import { saveData, getData } from "../../utils/localStorage";
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { Timer } from "../timer";
import { useTimer as RestartTimer } from "../roomsForm/timer";
import { useLocation } from "react-router-dom";
import { ChatWindow } from "./chatWindow";
import { calculateWinner } from "../../utils";
import Modal from "../modal/modal";
import useOnlineStatus from "./onlineCheck";
import "./index.css";

export function GameOnline({ player }) {
  const dispatch = useDispatch();
  const [sessionData, setSessionData] = useState({})
  const location = useLocation();
  const navigate = useNavigate()
  const roomId = location.pathname.split("/")[3]
  localStorage.setItem("roomId", roomId)
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  // const scores = useRef({ X: 0, O: 0 });
  const [scores, setScores] = useState({X: 0, O: 0})
  const [timeUntilChaos, setTimeUntilChaos] = useState(5);
  // const [gameOver, setGameOver] = useState(false);
  const gameOver = useRef(false);
  const [gameStarted, setGameStarted] = useState(false); // Состояние для отслеживания начала игры
  const [isPlayerTurn, setIsPlayerTurn] = useState("p1")
  const [playerSide, setPlayerSide] = useState("")
  const { timeRemaining, setTimeRemaining, uiElement, start, setStart } = RestartTimer("Game restarts in");
  const [isGameExist, setIsGameExist] = useState(true)
  const [hasEffectRun, setHasEffectRun] = useState(false);
  
  const [isPlayerLeaved, setIsPlayerLeaved] = useState({})
  const [isTabHidden, setIsTabHidden] = useState({})
  const [isDisconnected, setIsDisconnected] = useState({})

  const [isShowModal, setIsShowModal] = useState(false)
  const [modalContent, setIsModalContent] = useState('')
  const currentFunc = useRef({buttonsCount: 1, func: function () {}})
  const userIds = useRef([])


  const winnerUpdated = useRef(false);
  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(square => square !== null);
  const isOnline = useOnlineStatus();

  const isUser = () => {
    const role = localStorage.getItem("role");
    if (role === 'user') {
      return true;
    } else {
      navigate("/history");
      return false; // Return false if not admin
    }
  };

    useEffect(() => {
      isUser()
    }, []); // Add navigate to the dependency arra
  
    useEffect(() => {
      if (currentSquares.includes("X") || currentSquares.includes("O")) {
        setGameStarted(true)
      }
    }, [currentSquares])

    useEffect(() => {
        const res = Boolean(currentSquares.includes("X") || currentSquares.includes("O"))
        setGameStarted(res)
    }, [currentSquares])

  //----DB setters

  useEffect(() => {
    const username = localStorage.getItem("username");
  
    const setHiddenTabStatus = async (value) => {
      const actions = await trackUsersActions();
      await actions.hideTabSet(roomId, value, true);
    };
  
    const isPlayerLeaved = async () => {
      const actions = await trackUsersActions();
      await actions.setPlayerLeave(roomId, { status: true, byUsername: username }, true);
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setHiddenTabStatus({ status: true, byUsername: username });
      } else {
        setHiddenTabStatus({ status: false, byUsername: username });
      }
    };
  
    const handleBeforeUnload = (event) => {
      setIsModalContent("Are u sure that u gonna do this action?")
      setIsShowModal(true)
      currentFunc.current = {buttonsCount: 2, func: function () {isPlayerLeaved}}
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {

    const setDisconnected = async () => {
      const actions = await trackUsersActions()
      await actions.setDisconnected(roomId, {status: true, byUsername: localStorage.getItem("username")}, true)
    }

    if (!isOnline) {
      setDisconnected()
    }
  }, [isOnline]);

  //----DB setters


  //----DB getters
  useEffect(() => {
    const getPlayerLeaveStatus = async () => {
      const actions = await trackUsersActions()
      await actions.getPlayerLeaveStatus(roomId, setIsPlayerLeaved, true)
    }
    getPlayerLeaveStatus()
  }, []);

  useEffect(() => {
    const getHiddenTabStatus = async () => {
      const actions = await trackUsersActions()
      await actions.getHiddenTabStatus(roomId, setIsTabHidden, true)
    }
    getHiddenTabStatus()
  }, []);

  useEffect(() => {
    const getIsDisconnected = async () => {
      const actions = await trackUsersActions()
      await actions.getIfDisconnected(roomId, setIsDisconnected, true)
    }
    getIsDisconnected()
  }, []);
  //----DB getters

  //----DB triggers actions
  useEffect(() => {
    if (isPlayerLeaved.status) {
      const currentNickName = localStorage.getItem("username")
      localStorage.removeItem("roomId")
      if (isPlayerLeaved.byUsername !== currentNickName) {
        setIsModalContent(`Sorry, your opponent ${isPlayerLeaved.byUsername} is leaved the game, room will be deleted...`);
        setIsShowModal(true)
        currentFunc.current = {buttonsCount: 1, func: function () { return navigate('/chooseGameMode')}}
      }
    }
  }, [isPlayerLeaved])

  useEffect(() => {
    if (isTabHidden.status) {
      const currentNickName = localStorage.getItem("username")
      if (isTabHidden.byUsername !== currentNickName) {
        setIsModalContent(`Sorry, your opponent ${isTabHidden.byUsername} is changed the tab, please wait a little bit... :)`);
        setIsShowModal(true)
      }
    }
  }, [isTabHidden])
  

  useEffect(() => {
    if (isDisconnected.status) {
      const currentNickName = localStorage.getItem("username")
      if (isDisconnected.byUsername !== currentNickName) {
        setIsModalContent(`Sorry, your opponent ${isDisconnected.byUsername} is disconnected from the internet, room will be deleted...`);
        setIsShowModal(true)

        localStorage.removeItem("roomId")
        handleGameDestroy()
        setIsGameExist(false) 
      } else {
        setIsModalContent(`Sorry, you is disconnected from the internet, room was deleted`);
        setIsShowModal(true)

        localStorage.removeItem("roomId")
        handleGameDestroy()
        setIsGameExist(false) 
      }
    }
  }, [isDisconnected])

  useEffect(() => {
    if (!isGameExist) {
      navigate("/chooseGameMode")
    }
  }, [isGameExist])

  //----DB triggers actions



  // const isAuthorizedUser = (accessedNames) => {
  //   const username = localStorage.getItem("username")
  //   const role = localStorage.getItem("role")
  //   const userId = localStorage.getItem("id")
  //   if (username && role && userId) {
  //     !accessedNames.includes(username) && navigate("/auth/signin")
  //   } else {
  //     return false
  //   }
  // }





  useEffect(() => {
    const defineSession = async () => {
      try {
        const actions = await roomActions();
        const data = await actions.getRoomData(roomId)
        setSessionData(data)
        setScores(data.scores)
        userIds.current = data.ids
        const players = [{name: data.player1, key: "p1"}, {name: data.player2, key: "p2"}]
        // const accessedNames = [data.player1, data.player2]
        // await isAuthorizedUser(accessedNames)
        const username = localStorage.getItem("username")
        const currentRight = players.filter((el) => el.name === username)[0]
        setPlayerSide(currentRight.key)
      } catch (e) {
  
      }
    }

    defineSession()
  }, [])

  useEffect(() => {
    if (!sessionData) {
      navigate("/auth/signin");
    }
  }, [sessionData, navigate]);

  // useEffect(() => {
  //   const savedScores = getData("scores") || { X: 0, O: 0 };
  //  setScores(savedScores);
  // }, []);

  // useEffect(() => {
  //   if (gameOver.current) return;

  //   const chaosTimer = setInterval(() => {
  //     setTimeUntilChaos(prevTime => {
  //       if (prevTime <= 1) {
  //         chaos();
  //         return 5;
  //       }
  //       return prevTime - 1;
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(chaosTimer)
  //   };
  // }, [gameOver.current, currentSquares]);

  const updateSquares = async (data) => {
    try {
      const actions = await roomActions();
      await actions.updateRoomSquares(roomId, data)
      await actions.updatePlayerTurn(roomId, isPlayerTurn)
    } catch {

    }
  }

  const chaos = () => { // edit updated twice
    // const newSquares = [...currentSquares];
    // for (let i = newSquares.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [newSquares[i], newSquares[j]] = [newSquares[j], newSquares[i]];
    // }

    // updateSquares(newSquares);
    // setCurrentMove(prevMove => prevMove);
  };


  // const updateSquaresDB = async () => {
  //   const actions = await roomActions();
  //   await actions.updateRoomSquares(roomId, currentSquares)
  // }


  async function handlePlay(nextSquares, index) {
    // Check if the game is over, the square is already occupied, or it's not the player's turn
    if (gameOver.current || nextSquares[index] || (isPlayerTurn != playerSide)) return;

    const updatedSquares = nextSquares.slice();


 
    if (isPlayerTurn == playerSide) {
      // updatedSquares[index] = xIsNext ? "X" : "O"; // Set X or O in the selected square

    try {
    // Update the squares in the database
    await updateSquares(updatedSquares);
    } catch {

    }


    // Reset chaos timer
    setTimeUntilChaos(5);

    // Update the current move
    setCurrentMove(prevMove => prevMove + 1);

    }
    
}
 
  useEffect(() => {
    
    const loadSquaresFromDB = async () => {
      try {
        const actions = await trackUsersActions()
        await actions.checkForSquares(roomId, setCurrentSquares, true)
        await actions.checkForPlayerTurn(roomId, setIsPlayerTurn, true)
        await actions.getScoresStats(roomId, setScores, true)
      } catch {
  
      }
    }

    loadSquaresFromDB()
  }, [])

  async function resetGame() {
    try {
      setCurrentMove(0);
      winnerUpdated.current = false;
      setTimeUntilChaos(5);
      setIsPlayerTurn("p1"); // Сброс хода на игрока
      await updateSquares(Array(9).fill(null));
    } catch {

    }
  }


  useEffect(() => {

      const updateScoresData = async (data) => {
        const actions = await trackUsersActions()
        await actions.setScoresStats(roomId, data, true)
      }

    if (winner && !winnerUpdated.current && !gameOver.current) {
      gameOver.current = true;
      setStart(true)

      // Обновляем счет только один раз за победу
      const newScores = { ...scores };
      newScores[winner.winner] += 1;
      updateScoresData(newScores)
      winnerUpdated.current = true; // Устанавливаем, что победитель обновлен

      const currentUserName = localStorage.getItem("username")
      const opponent = [sessionData.player1, sessionData.player2].filter((name) => name !== currentUserName)[0]
      const isOppositePlayerLeaved = Boolean((isDisconnected.byUsername !== currentUserName && isPlayerLeaved.byUsername !== currentUserName) && gameStarted)
      const ids = userIds.current
      // Обновляем статистику игрока
        dispatch(
          updateStats({ result: winner.winner === "X" ? "wins" : "losses"}),
        );
        dispatch(
          updateGamesHistory({ result: winner.winner, opponent: opponent, isAutomaticWin: isOppositePlayerLeaved, type: 'online', ids, sessionData })
        );
    } else if (!winner && isBoardFull && !gameOver.current) {
      gameOver.current = true
      setStart(true)
      dispatch(updateStats({ result: "draws" }));
    }
  }, [winner, winnerUpdated.current, dispatch, isBoardFull, gameOver.current]);

  useEffect(() => {
    if (isBoardFull || winner || gameOver.current === true) {
      setStart(true)
    }
  }, [isBoardFull, winner, gameOver.current])

  useEffect(() => {
    const handleEndTimer = async () => {
      try {
        await resetGame()
        gameOver.current = false;
        setStart(false)
        setTimeRemaining(5)
      } catch {
  
      }
    }  

    if (timeRemaining === 1) {
      handleEndTimer()
    }
  }, [timeRemaining])



  // Функция обработчик для завершения таймера
  // const handleTimerEnd = () => {
  //   if (!gameOver.current) {
  //     chaos();
  //   }
  // };

  const handleGameDestroy = async () => {
    await localStorage.removeItem("roomId")
    const actions = await roomActions()
    await actions.deleteRoom(roomId)
    setIsGameExist(false)
  }


  const handleGameExit = async () => {
    try {
      const trackActions = await trackUsersActions()
      await trackActions.setPlayerLeave(roomId, {status: true, byUsername: localStorage.getItem("username")}, true).then(() => localStorage.removeItem("roomId")).then(() => handleGameDestroy())
    } catch {
      
    }

  }



  const currentRightsPlayer_id = isPlayerTurn === "p1" ? "player1" : "player2" 
  const currentRightToSet = sessionData[currentRightsPlayer_id]
  
  const toggleModal = (onCloseFunc = function () {}) => {
    setIsShowModal((prev) => !prev);
    onCloseFunc()
  };

  return (
    <div className="game">

<Modal isOpen={isShowModal} onClose={toggleModal} content={modalContent}>
    {currentFunc.current.buttonsCount === 1 ? 
    (<button className="auth-button" onClick={() => toggleModal(currentFunc.current.func)}>Okay</button>) 
    : ([<button className="auth-button" onClick={() => toggleModal(currentFunc.current.func)}>Yes, i'm sure</button>,
    <button className="auth-button" onClick={() => toggleModal}>No, close the modal</button>]) }
    {/* <button className="auth-button" onClick={toggleModal}>No, close the modal</button> */}
    </Modal>

    <div className="game-container">
      <div className="game-main">
        <p>Now {currentRightToSet}'s turn</p>
        {/* {gameStarted && timeUntilChaos > 0 && !gameOver.current && (
          <Timer remainingTime={timeUntilChaos} onTimerEnd={handleTimerEnd} />
        )} */}
        <div className="game-board">
          <Board
            xIsNext={currentMove % 2 === 0}
            squares={currentSquares}
            onPlay={handlePlay}
            winnerLine={winner ? winner.line : null}
            isPlayerTurn={isPlayerTurn}
            playerSide={playerSide}
            sessionData={sessionData}
          />
        </div>
        
        <div className="game-scores">
          <div className="score-container">
            <p className="score-label">{sessionData.player1}</p>
            <div className="score">{scores.X}</div>
          </div>
          <div className="score-container">
            <p className="score-label">{sessionData.player2}</p>
            <div className="score">{scores.O}</div>
          </div>
        </div>
        <button type="button" className="reset-button" onClick={handleGameExit}>
            Leave the game
          </button>
        {start && timeRemaining > 1 && uiElement()}
      </div>
        {roomId && <ChatWindow roomId={roomId} />}
    </div>
  </div>
);
};