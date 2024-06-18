
const initialState = {


};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'clearAllData':
      return initialState;

    default:
      return state;
  }


}

export default reducer;