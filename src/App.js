import './App.css';
import React, {useEffect, useState} from 'react';

{/*
https://uselessfacts.jsph.pl/
*/}

function App() {
  const [paused, setPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(3);
  const [fact, setFact] = useState(null);
  //const [typeInput, setTypeInput] = useState('');
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);

  //https://github.com/c-w/gutenberg-http/

  function handleClick() {
    const request = new XMLHttpRequest();
    //get random text from API
    //change api to longer text instead of random fact
    request.open('GET', 'https://uselessfacts.jsph.pl/api/v2/facts/random');
    request.onload = function() {
      if (request.status === 200) {
        setFact(JSON.parse(request.responseText).text);
        setSubstring2(JSON.parse(request.responseText).text);
      }
    };
    request.send();
  }

  const handleChange = (event) =>{
    //setTypeInput(event.target.value)
    setSubstring1(event.target.value)
    setSubstring2(fact.slice(event.target.value.length, fact.length))
   
    if(event.target.value[event.target.value.length-1] !== fact[event.target.value.length-1]){
      setMistakeCount(mistakeCount+1)
    }
  }

  const getLettersWithLoop = () => {
    let itemsArr = [];
    for(let i = 0; i < substring1.length; i++){
      if(substring1[i] !== fact[i]){//if character doesn't match, give it mistake className
        itemsArr.push(<span key={i} className='mistake'>{fact[i]}</span>)
      }else{//if character matches, it is not marked as a mistake
        itemsArr.push(<span key={i}>{substring1[i]}</span>)
      }
    }
    return(
      itemsArr
    )
  }

  const results = () => {
    console.log(substring1.length)
    //console.log(substring2)
    {/*
Total Number of Words = Total Keys Pressed / 5
WPM = Total Number of Words / Time Elapsed in Minutes (rounded down)

Example:
Total Keys Pressed = 200
Time Elapsed in Minutes = 1.5
WPM = ( (200 / 5) / 1.5 ) = 26

  */}
    const charCount = substring1.length //total keys pressed

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
    setMinutes(3)
    setFact(null)
    setSubstring1('')
    setSubstring2('')
    setMistakeCount(0)
  }

  return (
    <div className="App">
      <div className='timer-container'>
        <div className='timer'>
          <p>
            {minutes}:{seconds < 10 ? 0 : null}{seconds}{/*if seconds is less than 10, add a 0*/}
          </p>
        </div>
        
        <div className='timer-buttons'>
          <button onClick={() => reset()}>🔄</button>
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
        <p>Mistakes: {mistakeCount}</p>
        <button onClick={() => results()}>Results</button>
      </div>
    </div>
  );
}

export default App;
