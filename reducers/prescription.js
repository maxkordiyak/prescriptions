import {
  ADD_PRESCRIPTION,
  DELETE_PRESCRIPTION,
  SAVE_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
} from "../actions/types";

const initialState = {
  list: [{placeholder: true}, {placeholder: true}, {placeholder: true}],
};

export default (
  state = initialState,
  {type, prescription, index, firstEmptyAutocomplete},
) => {
  switch (type) {
    case ADD_PRESCRIPTION:
      return {
        ...state,
        list: [...state.list, {placeholder: true}],
      };
    case DELETE_PRESCRIPTION:
      return {
        ...state,
        list: [...state.list.slice(0, index), ...state.list.slice(index + 1)],
      };
    case SAVE_PRESCRIPTION:
      return {
        ...state,
        list: [
          ...state.list.map((item, itemIndex) => {
            if (itemIndex !== firstEmptyAutocomplete) {
              return item;
            }

            return {
              ...prescription,
            };
          }),
        ],
      };
    case UPDATE_PRESCRIPTION:
      return {
        ...state,
        list: state.list.map((drug, drugIndex) => {
          if (drugIndex !== index) {
            return drug;
          }

          return {
            ...prescription,
          };
        }),
      };
    default:
      return state;
  }
};
