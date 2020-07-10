import React, {useState,useEffect} from 'react';
import './Dictionary.scss';

// Components:
import WordList from './WordList/WordList';
import ContentEditor from './ContentEditor/ContentEditor'

// Examples:
const wordDB = [
  { id: 1, name: "shrek" },
  { id: 2, name: "fiona" },
  // { id: 3, name: "fiona" },
  // { id: 4, name: "fiona" },
  // { id: 5, name: "fiona" },
  // { id: 6, name: "fiona" },
  // { id: 7, name: "fiona" },
  // { id: 8, name: "fiona" },
  // { id: 9, name: "fiona" },
  // { id: 10, name: "fiona" },
  // { id: 11, name: "fiona" },
  // { id: 12, name: "fiona" },
  // { id: 13, name: "fiona" },
  // { id: 14, name: "fiona" },
  // { id: 15, name: "fiona" },
  // { id: 16, name: "fiona" }
]

const Dictionary = () => {
  const [words, setWords] = useState(wordDB);
  const [text, setText]   = useState("");

  const handleChange = (value) => {
    // console.log(value)
  }
  
  return (
    <div className="dictionary">
      <div className="container-fluid">
        <div className="row">
          <div className="my-col col-sm-6 col-xs-12">
            <WordList words={words} setWords={setWords}/>
          </div>
          <div className="my-col col-sm-6 col-xs-12">
            <ContentEditor/>
            {/* <ReactQuill value={text} onChange={handleChange} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dictionary;