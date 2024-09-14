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
    fetch('https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt')    
      .then(res => res.text())
      .then(result => {
        setWords(result.split('\n').sort(() => Math.random() - 0.5).join(' '));  
      })
  }
  const handleChange = (event) =>{
    let value = event.target.value;

    const lastIndex = value.length - 1;
    if(paused === true){
      setPaused(false)
      if(value !== ''){
        value = value[lastIndex]
      }
    }
    
    setSubstring1(value)
    setSubstring2(words.slice(value.length, words.length))
    
    if(value[lastIndex] !== words[lastIndex]){
      setMistakeCount(mistakeCount+1)
    }
  }

  const results = () => {
    //Total Number of Words = Total Keys Pressed / 5
    //wpm = Total Number of Words / Time Elapsed
    //round to nearest whole number
    const length = substring1.length;
    setWpm(Math.round((length/5)/3));
    setAccuracy(Math.round(((length - mistakeCount)/length)*100));
  }
  useEffect(() => {
    let interval
    if(!paused){
      interval = setInterval(() =>{
        setMinutes((minutes) => seconds === 0 && minutes > 0 ? minutes - 1 : minutes)
        setSeconds((seconds) => seconds > 0 ? seconds - 1 : 59)
      }, 1000)
    }
    if(minutes+seconds === 0){
      setPaused(true);
      results();
    }
    if(words === null){
      fetchRandomWords();
    }
    return function clear(){
      clearInterval(interval);
    }
    
  }, [paused, seconds, minutes]);

  const reset = () =>{
    setPaused(true);
    setSeconds(0);
    setMinutes(3);
    fetchRandomWords();
    setSubstring1('');
    setSubstring2('');
    setMistakeCount(0);
    setWpm(0);
    setAccuracy(0);
  }

  const getResultItems = () => {
    const resultItemInfo = [
      {
        statType: 'Words Per Minute',
        number: wpm
      },
      {
        statType: 'Accuracy',
        number: `${accuracy}%`
      },
      {
        statType: 'Mistakes',
        number: mistakeCount
      }
    ]
    let resultItems = [];

    for(let i = 0; i < resultItemInfo.length; i++){
      const number = resultItemInfo[i].number;
      let statString = `${minutes+seconds === 0 ? number : '--'}`;
      if(i === resultItemInfo.length - 1){
        statString = `${minutes === 3 && seconds === 0 ? '--' : number}`
      }
      resultItems.push(
        <div key={i} className='result-item'>
          <div className='stat'>
            <p>{statString}</p>
          </div>
          <p className='stat-type'>{resultItemInfo[i].number}</p>
        </div>
      )      
    }

    return(
      resultItems
    )
  }
  
  return (
    <div className='App'>
      <h1>Test your typing speed</h1>
      <div className='controls-container'>
        <button className='control-button clickable' onClick={() => reset()}>Reset</button>
        <button className={`control-button ${minutes+seconds === 0 ? 'clickable' : null}`} onClick={() => reset()}>Try Again</button>
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
        <input className='typing-input' readOnly={minutes+seconds === 0 ? true : false} value={substring1}
          onChange={handleChange}></input>
      </div>
      <p className='start-typing'>{paused === true && minutes === 3 ? 'Start typing to begin' : null}</p>
      <div className='results'>
        {getResultItems()}
      </div>
    </div>
  );
}

export default App;
