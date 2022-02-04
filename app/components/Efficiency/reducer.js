/*
* @TODO: Possibly remove, unless redux seems necessary to accomplish tasks
*/
const INITIAL_STATE = {
  filters: {
    ors: [],
    specialties: []
  }
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ors: action.payload.ors,
          specialties: action.payload.specialties
        }
      };
    default:
      return state;
  }
};

export default reducer;
