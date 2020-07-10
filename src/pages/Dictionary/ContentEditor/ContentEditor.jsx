import React, {useState,useEffect} from 'react';
import './ContentEditor.scss';
// Quill
import ReactQuill, {Quil} from 'react-quill';

// Customized Quill
const modules = {
  // toolbar: ['bold', 'italic', 'underline', 'strike']
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline','strike'],
    [{ 'color': [] }, 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}]
  ]
}

const ContentEditor = () => {
  return (
    <div className="content-editor">
      {/* <Quill/> */}
      <ReactQuill
        modules={modules}
      />
    </div>
  )
}
export default ContentEditor;