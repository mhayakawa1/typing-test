import './App.css';
import React, {useEffect, useState} from 'react';

{/*
https://uselessfacts.jsph.pl/
*/}

function App() {
  const [paused, setPaused] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [fact, setfact] = useState(null);
  const [typeInput, setTypeInput] = useState('');
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);

  //https://github.com/c-w/gutenberg-http/
  //change api to a book instead of random fact

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
    
  })

  return (
    <div className="App">
      <div className='timer-container'>
        <div className='timer'>
          <p>
            <span></span>
            :
            <span></span>
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
        <input className='typing-input' onChange={handleChange}></input>
      </div>
    </div>
  );
}

export default App;
