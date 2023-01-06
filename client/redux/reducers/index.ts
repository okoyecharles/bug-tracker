import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from './user/loginReducer';
import registerReducer from './user/registerReducer';
import currentUserReducer from './user/currentUser';
import projectsReducer from './projects/projectsReducer';
import ticketsReducer from './tickets/ticketsReducer';
import projectReducer from './projects/projectReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  currentUser: currentUserReducer,
  projects: projectsReducer,
  project: projectReducer,
  tickets: ticketsReducer
});

export default rootReducer;
