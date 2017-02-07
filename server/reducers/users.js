const { Map } = require('immutable');

const { createUser } = require('../utils.js');

/* --------------- ACTIONS --------------- */

const ADD_USER = 'ADD_USER';
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const REMOVE_USER = 'REMOVE_USER';
const READY_PLAYER = 'READY_PLAYER';

/* --------------- ACTION CREATORS --------------- */

const addUser = userId => {
  return {
    type: ADD_USER,
    userId
  };
};

const updateUserData = userData => {
  return {
    type: UPDATE_USER_DATA,
    userData
  };
};

const removeUser = userId => {
  return {
    type: REMOVE_USER,
    userId
  };
};

const readyPlayer = (playerId) => ({
  type: READY_PLAYER,
  playerId
});

/* --------------- THUNK ACTION CREATORS --------------- */
const createAndEmitUser = socket => {
  console.log("Create and emit user");
  return dispatch => {
    const userId = socket.id;
    dispatch(addUser(userId));
  };
};

const removeUserAndEmit = socket => {
  return dispatch => {
    const userId = socket.id;
    dispatch(removeUser(userId));
    socket.broadcast.emit('removeUser', userId);
  };
};

const startReady = (playerId) => {
  return dispatch => {
    dispatch(readyPlayer(playerId));
  };
};

/* --------------- REDUCER --------------- */
const initialState = [
  {id: ''},
  {id: ''},
  {id: ''},
  {id: ''},
  {id: ''},
  {id: ''}
];

function userReducer (state = initialState, action) {

  // const newUser = Object.assign({}, state);
  const newUser = [...state];


  switch (action.type) {

    case ADD_USER:
      for (let i = 0; i < state.length; i++) {
        const user = state[i];
        if (!user.id) {
          newUser[i].id = action.userId;
          break;
        }
      }
      return newUser;
      // for (let user in state) {
      //   if (!state[user]) {
      //     newUser[user] = action.userId
      //     break;
      //   }
      // }
      // return newUser;
      // return [...state, action.user];


    case UPDATE_USER_DATA:
    return state.map((user, index) => {
      console.log("IN UPDATE_USER_DATA");
      if (user.id === action.userData.id) {
        user.velocity = action.userData.velocity;
        // user.up = action.userData.up;
      }
      return user;
    });

    case READY_PLAYER:
    return state.map((user) => {
      if (user.id === action.playerId) {
        user.readyToPlay = true;
      }
      return user;
    });

    case REMOVE_USER:
      return newUser.map(user => {
        if (user.id === action.userId) {
          user.id = '';
        }
        return user;
      });

    default:
      return state;
  }
}

module.exports = {
  ADD_USER,
  UPDATE_USER_DATA,
  REMOVE_USER,
  createAndEmitUser,
  updateUserData,
  removeUserAndEmit,
  userReducer,
  startReady
};

// /*----------  INITIAL STATE  ----------*/
// const initialState = {};


// /*----------  ACTION TYPES  ----------*/

// const ADD_USER = 'ADD_USER';
// const ASSIGN_WORLD = 'ASSIGN_WORLD';
// const UNASSIGN_WORLD = 'UNASSIGN_WORLD';
// const REMOVE_USER = 'REMOVE_USER';

// /*--------
// --  ACTION CREATORS  ----------*/
// module.exports.addUser = id => ({
//   type: ADD_USER,
//   id
// });

// module.exports.assignWorld = (id, world) => ({
//   type: ASSIGN_WORLD,
//   id,
//   world
// });

// module.exports.unassignWorld = id => ({
//   type: UNASSIGN_WORLD,
//   id
// });

// module.exports.removeUser = id => ({
//   type: REMOVE_USER,
//   id
// });


// /*----------  THUNK CREATORS  ----------*/


// ----------  REDUCER  ----------
// module.exports.reducer = (state = initialState, action) => {
//   let user;
//   let newState = Object.assign({}, state);
//   switch (action.type) {
//     case ADD_USER:
//       newState[action.id] = {world: null};
//       return newState;
//     case ASSIGN_WORLD:
//       user = Object.assign({}, newState[action.id], {world: action.world});
//       newState[action.id] = user;
//       return newState;
//     case UNASSIGN_WORLD:
//       user = Object.assign({}, newState[action.id], {world: null});
//       newState[action.id] = user;
//       return newState;
//     case REMOVE_USER:
//       delete newState[action.id];
//       return newState;
//     default: return state;
//   }
// };
