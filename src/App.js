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
    //setSubstring1(fact.slice(0, event.target.value.length))
    setSubstring1(event.target.value)
    setSubstring2(fact.slice(event.target.value.length, fact.length))
  }

  //console.log(fact[substring1.length-1])

  const getLettersWithLoop = () =>{
    const itemsArr = [];
    for(let i = 0; i < substring1.length; i++){  
      console.log(fact[i], substring1[i])    
      if(substring1[i] !== fact[i]){
        console.log('test')        
      }else{
        if(itemsArr.length === 0){
          itemsArr.push(substring1[i])
        }else{
          itemsArr.splice(itemsArr.length-1, 1, itemsArr[itemsArr.length-1]+substring1[i])
        }
      }
    }
    console.log(itemsArr)
    {/*return(
      itemsArr
    )*/}
  }
  getLettersWithLoop()

  return (
    <div className="App">
      <button onClick={handleClick}>Fetch</button>
      <div>
        <p className='fact'>FACT: {fact}</p>
        <div className='text-body'>
          <p>
            {/*<span className='substring1'>{substring1}</span>*/}
            <span className='substring2'>{substring2}</span>
          </p>
        </div>
        <input className='typing-input' onChange={handleChange}></input>
      </div>
    </div>
  );
}

export default App;
