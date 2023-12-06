import './App.css';
import React, {useState} from 'react';

{/*
https://uselessfacts.jsph.pl/
*/}

function App() {
  const [fact, setfact] = useState(null);
  const [typeInput, setTypeInput] = useState('');
  const [substring1, setSubstring1] = useState('');
  const [substring2, setSubstring2] = useState('');
  const [mistakeCount, setMistakeCount] = useState(0);
  
  //https://github.com/c-w/gutenberg-http/

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
        itemsArr.push(<span key={i} className='mistake'>{substring1[i]}</span>)
      }else{//if character matches
        itemsArr.push(<span key={i}>{substring1[i]}</span>)
      }
    }
    return(
      itemsArr
    )
  }
  

  return (
    <div className="App">
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
