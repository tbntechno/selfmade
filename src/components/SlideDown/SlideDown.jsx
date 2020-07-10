import React from 'react'
 
import {SlideDown as RealSlideDown}from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import './SlideDown.scss'
const SlideDown = (props) => {
  return (
    <RealSlideDown className={'my-dropdown-slidedown'}>
      {props.onSlide ? props.children : null}
    </RealSlideDown>
  )
}
export default SlideDown;