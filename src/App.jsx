import { useState } from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti"

function App() {
  //state variables
  

  const [currentWord,setcurrentWord] = useState(getRandomWord());
  const [guessedLetters,setguessedLetters] = useState([]);
  
  // derived values

  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

  const isGameLoss = wrongGuessCount >= languages.length - 1

  const isGameOver = isGameLoss || isGameWon

  const gameInProcess = !isGameOver
  
  const lastGuessdLetter = guessedLetters[guessedLetters.length - 1]

  const lastGuessdLetterWrong = !currentWord.includes(lastGuessdLetter)

  const lastGuessdlanguages = languages[wrongGuessCount - 1]

  //static variables
  const alpha = "abcdefghijklmnopqrstuvwx".split("")

  const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLoss || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLoss && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

  
  
  function addGuessedLetters(letter){
    setguessedLetters(prevLetters => {
      const lettersSet = new Set(prevLetters)
      lettersSet.add(letter)
      return Array.from(lettersSet)
    })
  }


  const KeyboardElements = alpha.map((letter)=> {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <><button disabled={isGameOver}
      className={className}
      key={letter} onClick={()=> addGuessedLetters(letter)}>{letter.toUpperCase()}</button></>
    )
  })

  const languagesNew = 
    languages.map((box,index) => {
      const isLostLanguage = index < wrongGuessCount
      const className = clsx("chip",isLostLanguage && "lost")
      return (
        <>
        <span key={box.name} className={className} id="languages"
           style={{
              backgroundColor : box.backgroundColor,
              color : box.color
           }}
            
            >{box.name}</span>
        </>
    )
  })


  function startNewGame(){
    setcurrentWord(getRandomWord())
    setguessedLetters([])
  }



  return (
    <>
      <main>
         {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
      <header>
        <h1> Assembly: Endgame</h1>
        <p>Geuss the word in 8 attempts to save the programing languages from Assembly!</p>
      </header>
      {gameInProcess && (<section className="status-">
        <h2></h2>
        <p></p>
      {gameInProcess && lastGuessdLetterWrong && lastGuessdlanguages && (
        
          <p className="farewelltext">
            {getFarewellText(lastGuessdlanguages.name)}
          </p>
      )}
      </section>)}
      {isGameLoss && <section className="status-loss">
        <h2>You Lost</h2>
        <p>Better to start learning the Assembly Language</p>
      </section>}
      {isGameWon && <section className="status-won">
        <h2>You win</h2>
        <p>Well done</p>
      </section>}
      <section>
        <div className="languages-new">{languagesNew}</div>
      </section>
      <section className="word">
        {letterElements}
      </section>

      <section className="keyboard">
        {KeyboardElements}
      </section>
      {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}

      </main>
    </>
  )
}

export default App;

// Remove the pageElement export to a new file


