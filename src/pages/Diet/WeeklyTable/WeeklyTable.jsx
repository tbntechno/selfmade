import React, {useState, useEffect, useContext} from 'react';
import {DietContext} from '../Diet';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {db} from 'services/firebase';
import check from 'check-types';
import clone from 'clone-deep';
import "./WeeklyTable.scss"
import {Row, Col} from 'react-bootstrap';
import SlideDown from 'components/SlideDown/SlideDown'
import 'react-slidedown/lib/slidedown.css'



const SortableItem = SortableElement(({mealData}) => {
  return (
    <React.Fragment>
      <div className="meal">
        <Row className="meal-main-stats">
          <Col xs={8} className="meal-name">
            <img src="https://img.icons8.com/color/48/000000/resize-four-directions.png" style={{height:'11px'}}/>
            {mealData.name}
          </Col>
          <Col xs={4} className="Calories">{mealData.mealNutritionFacts[0].value}</Col>
        </Row>
        <Row className="meal-main-stats">
          <Col xs={4} className="Protein">{mealData.mealNutritionFacts[1].value}</Col>
          <Col xs={4} className="Carbohydrates">{mealData.mealNutritionFacts[2].value}</Col>
          <Col xs={4} className="Fat">{mealData.mealNutritionFacts[5].value}</Col>
        </Row>
      </div>
    </React.Fragment>
  )
})

const SortableList = SortableContainer(({dayData}) => {
  const [slide, setSlide]   = useState(false);
  const [dayNutrientTable, setDayNutrientTable] = useState([]);

  useEffect(()=>{ 
    var {dayNutritionFacts, nutritionGoal} = dayData
    var printableDayNutrients = arrayMove(dayNutritionFacts.map((data,i)=>{
      const goal = nutritionGoal[i].value;
      const stat = data.value;
      const percentage =  goal === 0  ? `0` :
                          stat < goal ? `-${100 - Math.round(stat/goal*100)}` : 
                          stat > goal ? `+${Math.round(stat/goal*100) - 100}` : `100`;
      data['printable'] = `${stat}/${goal} (${percentage}%)`
      return data;
    }), 5,3);   // Swiching nutritionFact => look
    setDayNutrientTable(printableDayNutrients);
  },[dayData])

  return (
    <Col xs={12} sm={6} md className="weekly-table-column" >
      <div className="day-name">{dayData.dayName}</div>
      <div className="day-data">
        {dayData.mealData.map((mealData, i) => (
          <SortableItem key={i} index={i} mealData={mealData} />
        ))}
      </div>
      <Row className="day-stats">
        <div className="day-stats-slide-button" onClick={()=>{ setSlide(!slide) }}>Stats</div>
        <div className="day-stats-table">
          <SlideDown onSlide={slide}>
            {!check.emptyArray(dayNutrientTable) &&
              dayNutrientTable.map((nutrient, i)=>{
                return nutrient && <div key={i} className={`${nutrient.name}`}>{`> ${nutrient.name}: ${nutrient.printable}`}</div>
              })
            }
          </SlideDown>
        </div>
      </Row>
    </Col>
  );
});

const WeeklyTable = () => {
  const { mappedDietPlanData, setMappedDietPlanData, dietPlan } = useContext(DietContext)

  const sortableHandler = (columnIndex, oldIndex, newIndex) => {
    // console.log({columnIndex, oldIndex, newIndex})

    var temp = clone(mappedDietPlanData);
    temp[columnIndex].mealData = arrayMove(temp[columnIndex].mealData, oldIndex, newIndex);
    // // Update UI
    setMappedDietPlanData(temp);

    // Update Databse
    // Note: update DB => cause update DB anyway However => animation is glitching cuz the server response
    // => we Update UI (above) too cuz even we already updated the UI => Firebase wont trigger update UI again cuz data already the same!
    var temp = clone(dietPlan)
    temp.data[columnIndex] = arrayMove(temp.data[columnIndex], oldIndex, newIndex);
    const {id, ...newDietPlan} = temp;
    db.collection('diet_plans').doc(id)
      .update(newDietPlan);
  }
  return (
    <Row className="weekly-table">
      {mappedDietPlanData.map((dayData, i)=>{
        return <SortableList 
          key         = {i}
          helperClass = "dragging-helper-class"
          dayData     = {dayData}
          onSortEnd   = {({oldIndex, newIndex}) => {sortableHandler(i, oldIndex, newIndex)}} 
        />;
      })}
    </Row>
  )
}
export default WeeklyTable;