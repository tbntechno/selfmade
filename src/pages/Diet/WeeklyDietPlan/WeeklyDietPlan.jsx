import React, {useState} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import firebase, {db} from '../../../services/firebase';
import _ from 'lodash';
import check from 'check-types';
import clone from 'clone-deep';
import "./WeeklyDietPlan.scss"
import { useEffect } from 'react';

import SlideDown from '../../../components/SlideDown/SlideDown'
import 'react-slidedown/lib/slidedown.css'


const SortableItem = SortableElement(({meals, value, tableIndex}) => {
  const meal = _.find(meals, {'id': value}) || '';
  return (
    <React.Fragment>
      <div className="day-meal">
        <div className="row main-stats">
          <div className="col-8 meal-name">
            <img src="https://img.icons8.com/color/48/000000/resize-four-directions.png" style={{height:'11px'}}/>
            {meal.name}
          </div>
          <div className="col-4 Calories">{meal && meal.nutritionFacts[0].value}</div>
        </div>
        <div className="row main-stats">
          <div className="col-4 Protein">{meal && meal.nutritionFacts[1].value}</div>
          <div className="col-4 Carbohydrates">{meal && meal.nutritionFacts[2].value}</div>
          <div className="col-4 Fat">{meal && meal.nutritionFacts[5].value}</div>
        </div>
      </div>
    </React.Fragment>
  )
})

const SortableList = SortableContainer(({dietPlan, meals, items, dayName, tableIndex}) => {
  const [slide, setSlide]         = useState(false);
  const [dayNutrientTable, setDayNutrientTable] = useState([]);
  const onSlide                   = ()=>{setSlide(!slide)}

  useEffect(()=>{
    // Check if DietPlan && Meal is Empty 
    if( !check.emptyArray (meals) && 
        !check.emptyObject(dietPlan) && 
        !check.emptyObject(dietPlan.data) && 
        !check.undefined  (dietPlan.data[tableIndex])){
      const dayMealIDs        = dietPlan.data[tableIndex];
      const dayMealsNutrients = dayMealIDs.map((id, index)=>{ 
        const found = _.find(meals, {'id': id});
        return found ? found.nutritionFacts : [];
      });
      if ( !check.emptyArray(dayMealsNutrients) ) {
        // Copy and Turn first meal into a Template (0 macro meal)
        let copiedMealNutrients = clone(dayMealsNutrients[0]);        
        // Merging Nutrients of All Meal of the day into Big mactory
        let dayNutrients = copiedMealNutrients.map( stat=>{stat.value = 0;return stat;} ); 
        dayMealsNutrients.forEach(NF => { NF.forEach((stat,index)=>{ 
            if( !check.undefined( dayNutrients[index])) 
              dayNutrients[index].value += stat.value 
          })
        });
        // Converted to Merged Nutrients of the Day to Printable        
        var printableDayNutrients = arrayMove(dayNutrients.map((data,i)=>{
          const goal = dietPlan.nutritionGoal[i].value;
          const stat = data.value;
          const percentage =  stat < goal ? `-${100 - Math.round(stat/goal*100)}` : 
                              stat > goal ? `+${Math.round(stat/goal*100) - 100}` : `0`;
          data['printable'] = `${stat}/${goal} (${percentage}%)`
          return data;
        }), 5,3);
        setDayNutrientTable(printableDayNutrients);
      }
    }
  },[dietPlan, meals]);

  return (
    <div className="col mcol" >
      <div className="day-title">{dayName}</div>
      <div className="day-meal-list">
        {items.map((value, index) => (
          <SortableItem key={`item-${value}-${index}`} index={index} meals={meals} tableIndex={tableIndex} value={value} />
        ))}
      </div>
      <div className="row meal-stat">
        <div className="slide-button" onClick={onSlide}>Stats</div>
        <div className="stat-table">
          <SlideDown onSlide={slide}>
            {!check.emptyArray(dayNutrientTable) &&
              dayNutrientTable.map((nutrient, i)=>{
                return nutrient && <div key={i} className={`${nutrient.name} nutrient-div`}>{`> ${nutrient.name}: ${nutrient.printable}`}</div>
              })
            }
          </SlideDown>
        </div>
      </div>
    </div>
  );
});
const WeeklyDietPlan = ({meals, dietPlan, setDietPlan, DAYS_OF_WEEK}) => {
  const sortableHandler = (tableIndex, oldIndex, newIndex) => {
    let updatedDietPlan = clone(dietPlan);
    updatedDietPlan.data[tableIndex] = arrayMove(dietPlan.data[tableIndex], oldIndex, newIndex);
    
    // Update UI
    setDietPlan(updatedDietPlan);
    const { id, ...newDietPlan} = updatedDietPlan;
    // Update Databse
    // Note: update DB => cause update DB anyway However => animation is glitching cuz the server response
    // => we Update UI (above) too cuz even we already updated the UI => Firebase wont trigger update UI again cuz data already the same!
    db.collection('diet').doc(id)
      .update(newDietPlan);
  }
  return (
    <div className="daysofweek row">
      {DAYS_OF_WEEK.map((dayName, index)=>{
        return <SortableList 
          dietPlan    = {dietPlan}
          helperClass = "dragging-helper-class"
          items       = {dietPlan.data ? dietPlan.data[index] : []} 
          dayName     = {dayName} 
          tableIndex  = {index}
          meals       = {meals}
          onSortEnd   = {({oldIndex, newIndex}) => {sortableHandler(index, oldIndex, newIndex)}} />;
      })}
    </div>
  )
}
export default WeeklyDietPlan;