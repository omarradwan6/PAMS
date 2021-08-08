import { combineReducers } from 'redux';
import newUserReducer from './newUserReducer';


export default combineReducers({
	newUser: newUserReducer
})