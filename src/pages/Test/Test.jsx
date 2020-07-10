import React, {useState} from 'react';
// import './Home.scss';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { ReactSortable } from 'react-sortablejs';

import arrayMove from 'array-move';

const SortableItem = SortableElement(({value}) => <li>{value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  );
});

const Test = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);
  // const [list, setList] = useState([{value:'Item 1'}, {value:'Item 2'}]);
  const [list, setList] = useState(
    [{value:'aerawerawrawe'}, {value:'awrawrawr'}, {value:'xxxwaw'},{value:'jfgjkfty'}]
  )

  const onSortEnd = ({oldIndex, newIndex}) => {
    console.log(oldIndex, newIndex);
    setItems(arrayMove(items, oldIndex, newIndex));
  };
  const handler = (data)=>{
    console.log(data);
  }
  const handlers = [
    function(data){
      setList(data);
    }
  ]
  return (
    <div>
      <ReactSortable list={list} setList={handlers[0]} animation={200}>
        {list.map((value, i)=>{
          return <div>{value.value}</div>
        })}
      </ReactSortable>}
      <SortableList items={items} onSortEnd={onSortEnd} />
    </div>
  )
}
export default Test;