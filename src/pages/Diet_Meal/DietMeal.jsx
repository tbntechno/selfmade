import React, {useContext, useState, useEffect} from 'react';
import {db, auth} 								              from 'services/firebase';
import {Container, Row, Col} 					          from 'react-bootstrap';
import {Button} 					                      from 'react-bootstrap';
import {ToastContainer}                         from 'react-toastify';

// Components
import Meal                                     from './Meal';
import DietMealCreateForm                       from './DietMealCreateForm';
import DietMealEditForm                         from './DietMealEditForm';

export const MealContext = React.createContext();
const DietMeal = () => {
  const [meals, setMeals]                           = useState([]);
  const [ingredients, setIngredients]               = useState([]);
  const [showCreateMealForm, setShowCreateMealForm] = useState(false);
  const [editMealForm, setEditMealForm]             = useState([false,{}]);

  useEffect(()=>{
    const unsubMeals = db.collection('diet_meals').where("userID", "==", auth.currentUser.uid)
    .onSnapshot((snapshot)=>{
      const meals = snapshot.docs.map((doc)=> { 
        let {userID, ...noUserID} = {id:doc.id, ...doc.data()}
        return noUserID;
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
		<MealContext.Provider value={{ingredientList: ingredients}} >
			<Container fluid>
				{meals.map((meal,i)=><Meal meal={meal} key={i} setEditMealForm={setEditMealForm}/>)}
				<Button size="sm" svarient="secondary" onClick={()=>setShowCreateMealForm(true)}>Create Meal</Button>
			</Container>
			<DietMealCreateForm ingredients={ingredients} showCreateMealForm={showCreateMealForm} setShowCreateMealForm={setShowCreateMealForm}/>
      <DietMealEditForm   ingredients={ingredients} editMealForm={editMealForm} setEditMealForm={setEditMealForm}/>
      <ToastContainer/>
		</MealContext.Provider>
  )
}
export default DietMeal;


const makeid = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}