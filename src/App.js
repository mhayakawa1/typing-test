import './App.css';
import React, {useEffect, useState} from 'react';

{/*
https://uselessfacts.jsph.pl/
*/}

function App() {
  const [paused, setPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(3);
  const [fact, setfact] = useState(null);
  const [typeInput, setTypeInput] = useState('');
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);

  //https://github.com/c-w/gutenberg-http/
  //change api to longer text instead of random fact

  function handleClick() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://uselessfacts.jsph.pl/api/v2/facts/random');
    request.onload = function() {
      if (request.status === 200) {
        setfact(JSON.parse(request.responseText).text);
        setSubstring2(JSON.parse(request.responseText).text);
      }
    };
    request.send();
  }

  const handleChange = (event) =>{
    setTypeInput(event.target.value)
    setSubstring1(event.target.value)
    setSubstring2(fact.slice(event.target.value.length, fact.length))
   
    if(event.target.value[event.target.value.length-1] !== fact[event.target.value.length-1]){
      setMistakeCount(mistakeCount+1)
    }
  }

  const getLettersWithLoop = () =>{
    let itemsArr = [];
    for(let i = 0; i < substring1.length; i++){
      if(substring1[i] !== fact[i]){//if character doesn't match
        itemsArr.push(<span key={i} className='mistake'>{fact[i]}</span>)
      }else{//if character matches
        itemsArr.push(<span key={i}>{substring1[i]}</span>)
      }
    }
    return(
      itemsArr
    )
  }
  
  useEffect(() => {
    let interval
    if(!paused){//if paused is false, update seconds
      interval = setInterval(() =>{
        if(minutes === 0 && seconds === 0){
          setPaused(false)
        }
        //if seconds is 0, subtract 1 from minutes and reset seconds to 59
        //else set minutes to minutes and subtract 1 from seconds
        setMinutes((minutes) => seconds === 0 ? minutes - 1 : minutes);        
        setSeconds((seconds) => seconds === 0 ? 59 : seconds - 1);
      }, 1000)
    }
    return function clear(){//clears interval if paused is true
      clearInterval(interval)
    }
  }, [paused])

  return (
    <div className="App">
      <div className='timer-container'>
        <div className='timer'>
          <p>
            {minutes}:{seconds < 10 ? 0 : null}{seconds}{/*if seconds is less than 10, add a 0*/}
          </p>
        </div>
        
        <div className='timer-buttons'>
          <button>🔄</button>
          <button onClick={() => setPaused(!paused)}>⏯</button>
        </div>
      </div>
      <button onClick={handleClick}>Fetch</button>
      <div>
        <div className='text-body'>
          <p>
            {getLettersWithLoop()}
            <span className='substring2'>{substring2}</span>
          </p>
        </div>
        <input className='typing-input' readOnly={paused === true ? true : false} onChange={handleChange}></input>
      </div>
    </div>
  );
}

export default App;
