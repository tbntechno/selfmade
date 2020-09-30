import React, {useContext, useState, useEffect} from 'react';
import {db, auth} 								              from 'services/firebase';
import {Container, Row, Col} 					          from 'react-bootstrap';
import {Button} 					                      from 'react-bootstrap';
import {ToastContainer}                         from 'react-toastify';
import check 					                          from 'check-types';

// Components
import MealItem                                 from './MealItem';
import FormCreateMeal                           from './FormCreateMeal';
import FormEditMeal                             from './FormEditMeal';

export const MealContext = React.createContext();
const Meal = () => {
  const [meals, setMeals]                           = useState([]);
  const [ingredients, setIngredients]               = useState([]);
  const [showCreateMealForm, setShowCreateMealForm] = useState(false);
  const [editMealForm, setEditMealForm]             = useState([false,{}]);

  useEffect(()=>{
    const unsubMeals = db.collection('diet_meals').where("userID", "==", auth.currentUser.uid)
    .onSnapshot((snapshot)=>{
      const meals = snapshot.docs.map((doc)=> { 
        return {id:doc.id, ...doc.data()};
        // let {userID, ...noUserID} = {id:doc.id, ...doc.data()}
        // return noUserID;
      });
      // console.log(meals);
      setMeals(meals || []);
    })

    const unsubIngredients = db.collection('diet_ingredients')
    .onSnapshot((snapshot)=>{
      const ingredients = snapshot.docs.map((doc)=> ({id:doc.id, ...doc.data() }) );
      // console.log(ingredients);
      setIngredients(ingredients || []);
    })
    return () => {
      unsubIngredients();
      unsubMeals();
    }
  },[]);


  return (
		<MealContext.Provider value={{dbIngredients: ingredients}} >
      <Container style={{marginTop: "20px"}} fluid>
        {(check.emptyArray(ingredients)) ? 
          <div>There is no Ingredients</div> : 
          <>
            {meals.map((meal,i)=><MealItem meal={meal} key={i} setEditMealForm={setEditMealForm}/>)}
            <Button size="sm" svarient="secondary" onClick={()=>setShowCreateMealForm(true)}>Create Meal</Button>
          </>
        }
      </Container>
			<FormCreateMeal ingredients={ingredients} showCreateMealForm={showCreateMealForm} setShowCreateMealForm={setShowCreateMealForm}/>
      <FormEditMeal   ingredients={ingredients} editMealForm={editMealForm} setEditMealForm={setEditMealForm}/>
      <ToastContainer/>
		</MealContext.Provider>
  )
}
export default Meal;
