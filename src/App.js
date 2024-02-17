import './App.css';
import React, {useEffect, useState} from 'react';

function App() {
  const [paused, setPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(3);
  const [words, setWords] = useState(null);
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const fetchRandomWords = () =>{
    //get words from API
    fetch('https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt')    
      .then(res => res.text())
      .then(result => {
        setWords(result.split('\n').sort(() => Math.random() - 0.5).join(' '))      
      })
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

  const results = () => {
    //Total Number of Words = Total Keys Pressed / 5
    //wpm = Total Number of Words / Time Elapsed
    //round to nearest whole number
    setWpm(Math.round((substring1.length/5)/3))
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
    if(words === null){
      fetchRandomWords()
    }
    return function clear(){//clears interval if paused is true
      clearInterval(interval)
    }
    
  }, [paused, seconds, minutes])

  const reset = () =>{
    setPaused(true)
    setSeconds(0)
    setMinutes(3)
    fetchRandomWords()
    setSubstring1('')
    setSubstring2('')
    setMistakeCount(0)
    setWpm(0)
    setAccuracy(0)
  }
  
  return (
    <div className="App">
      <h1>Test your typing speed</h1>
      <div className='controls-container'>
        <button className={`try-again ${minutes+seconds === 0 ? 'clickable' : null}`} onClick={() => reset()}>Try Again</button>
        <p className='timer'>
          {minutes}:{seconds < 10 ? 0 : null}{seconds}
        </p>
      </div>
      <div className='text-body'>
        <div className='substring1'>
          {substring1 === '' ? null : 
            substring1.split('').map((element, i) => (
            element === words[i] ? 
            <pre key={i} className='test'>{element}</pre>
            :
            <span key={i} className='mistake'>{element}</span>
          ))}
        </div>          
        <pre className={`substring2 ${substring2[0] === ' ' ? 'space-left' : null}`}>{substring1.length === 0 ? words : substring2}</pre>
        <input className='typing-input' readOnly={minutes+seconds === 0 ? true : false}
          onChange={handleChange}></input>
      </div>
      <p className='start-typing'>{paused === true && minutes === 3 ? 'Start typing to begin' : null}</p>
      <div className='results'>
        <div className='result-item'>
          <div className='stat'>
            <p>{minutes+seconds === 0 ? wpm : '--'}</p>
          </div>
          <p className='stat-type'>Words Per Minute</p>
        </div>
        <div className='result-item'>
          <div className='stat'>
            <p>{minutes+seconds === 0 ? `${accuracy}%` : '--'}</p>
          </div>
          <p className='stat-type'>Accuracy</p>
        </div>
        <div className='result-item'>
          <div className='stat'>
            <p>{minutes === 3 && seconds === 0 ? '--' : mistakeCount}</p>
          </div>
          <p className='stat-type'>Mistakes</p>
        </div>
      </div>
    </div>
  );
}

export default App;
