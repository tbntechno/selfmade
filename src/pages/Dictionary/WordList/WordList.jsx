import React, {useState,useEffect} from 'react';
import './WordList.scss';

import { ReactSortable } from 'react-sortablejs';
import TextareaAutosize  from 'react-textarea-autosize';


const WordList = ({words, setWords}) => {
  const [input, setInput] = useState("");
  const handleSelect = (e) => {
    // console.log(e.target)
  }
  const testOrder = () => {
    console.log(words);
  }
  const addWordHandler = () =>{
    let nWords = [...words, {id: -1, name: input}];
    setWords(nWords);
    setInput("");
  }
  return (
    <div className="word-list-wrapper">
      <div className="word-list">
        <ReactSortable list={words} setList={setWords}>
          {words.map(item => (
            <div key={item.id} onClick={handleSelect}>
              <TextareaAutosize defaultValue={item.name}/> 
            </div>
          ))}
        </ReactSortable>
      </div>

      <div className="word-list-add">
        <TextareaAutosize 
          useCacheForDOMMeasurements
          value={input}
          onChange={e => setInput(e.target.value)} />
        <button onClick={addWordHandler}>Add</button>
      </div>
      <button onClick={testOrder}>testt</button>
    </div>
  )
}
export default WordList;