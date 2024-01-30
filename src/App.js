import './App.css';
import React, {useEffect, useState} from 'react';

{/*
https://uselessfacts.jsph.pl/
*/}

function App() {
  const [paused, setPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [words, setWords] = useState(null);
  //const [typeInput, setTypeInput] = useState('');
  const [text, setText] = useState('');
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState('');

  const fetchRandomWords = () =>{
    //get words from API
    fetch('https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt')    
      .then(res => res.text())
      .then(result => {
        setWords(result.split('\n').sort(() => Math.random() - 0.5).join(' '))      
      })
  } 

  const handleClick = () => {
    fetchRandomWords()
  }

  const handleChange = (event) =>{
    if(paused === true){
      setPaused(false)
      if(event.target.value !== ''){
        event.target.value = event.target.value[event.target.value.length-1]
      }
    }
    
    setSubstring1(event.target.value)
    setSubstring2(words.slice(event.target.value.length, words.length))
    
    if(event.target.value[event.target.value.length-1] !== words[event.target.value.length-1]){
      setMistakeCount(mistakeCount+1)
    }
  }

  const getLettersWithLoop = () => {
    let itemsArr = [];
    for(let i = 0; i < substring1.length; i++){
      if(substring1[i] !== words[i]){//if character doesn't match, give it mistake className
        itemsArr.push(<span key={i} className='mistake'>{substring1[i]}</span>)
      }else{//if character matches, it is not marked as a mistake
        itemsArr.push(<span key={i} className={words[i] === ' ' ? 'space' : null}>{substring1[i]}</span>)
      }
    }
    return(
      itemsArr
    )
  }

  const results = () => {
    //Total Number of Words = Total Keys Pressed / 5
    //wpm = Total Number of Words / Time Elapsed
    //round to nearest whole number
    setWpm(Math.round((substring1.length/5)/1))
    //set accuracy by dividing substring length by 
    //the difference between substring1 length and mistakeCount
    //multiply by 100 and round to nearest whole number to get percentage
    setAccuracy(Math.round(((substring1.length - mistakeCount)/substring1.length)*100))
  }
  useEffect(() => {
    let interval
    if(!paused){//if paused is false, update seconds
      interval = setInterval(() =>{
        setMinutes((minutes) => seconds === 0 && minutes > 0 ? minutes - 1 : minutes)
        setSeconds((seconds) => seconds > 0 ? seconds - 1 : 59)
      }, 1000)
    }
    if(minutes+seconds === 0){
      setPaused(true)
      results()
    }
    return function clear(){//clears interval if paused is true
      clearInterval(interval)
    }
    
  }, [paused, seconds, minutes])

  const reset = () =>{
    setPaused(true)
    setSeconds(0)
    setMinutes(1)
    setWords(null)
    setSubstring1('')
    setSubstring2('')
    setMistakeCount(0)
    setWpm(0)
    setAccuracy('')
  }

 // console.log('1: ', substring1)

  return (
    <div className="App">
      <div className='timer-container'>
        <div className='timer'>
          <p>
            {minutes}:{seconds < 10 ? 0 : null}{seconds}{/*if seconds is less than 10, add a 0*/}
          </p>
        </div>
        
      </div>
      <button onClick={handleClick}>Fetch</button>
      <div>
        <div className='text-body'>
          <p>
            <span className={`substring1 ${substring1[substring1.length - 1] === ' ' ? 'space-r' : null}`}>{getLettersWithLoop()}</span>
            <span className={`substring2 ${substring2[0] === ' ' ? 'space-l' : null}`}>{substring1.length === 0 ? words : substring2}</span>
          </p>
          <input className='typing-input' readOnly={minutes+seconds === 0 ? true : false}
            onChange={handleChange}></input>
        </div>
        {paused === true && minutes === 3 ? <p>Start typing to begin</p> : null}
        {minutes+seconds === 0 ? 
          <div>
            <p>Results</p>
            <p>Words Per Minute: {minutes+seconds === 0 ? wpm : null}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Mistakes: {mistakeCount}</p>          
            <button onClick={() => reset()}>Try Again</button>
          </div>
          : null}           
      </div>
    </div>
  );
}

export default App;
