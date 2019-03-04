import {sortBy} from "underscore";
import {
  ADD_PRESCRIPTION,
  DELETE_PRESCRIPTION,
  SAVE_PRESCRIPTION,
  UPDATE_PRESCRIPTION,
} from "./types";
import {removeDuplicates} from "../utils/common";
import {fetchDrugsList} from "./addPrescription";
import {getPharmaciesList} from "./pharmacies";

export const addPrescription = index => ({
  type: ADD_PRESCRIPTION,
  index,
});

export const deletePrescription = index => ({
  type: DELETE_PRESCRIPTION,
  index,
});

export const savePrescription = (prescription, index) => {
  return (dispatch, getState) => {
    const firstEmptyAutocomplete = getState().prescription.list.findIndex(
      item => item.displayDrug == null,
    );
    dispatch(
      save(
        {
          ...prescription,
          pharmacyPrices: sortBy(
            removeDuplicates(prescription.pharmacyPrices),
            "price",
          ),
        },
        index,
        firstEmptyAutocomplete,
      ),
    );
  };
};

const save = (prescription, index, firstEmptyAutocomplete) => ({
  type: SAVE_PRESCRIPTION,
  prescription,
  index,
  firstEmptyAutocomplete,
});

export const resetField = index => async dispatch => {
  await dispatch(deletePrescription(index));
  await dispatch(addPrescription(index));
};

export const updatePrescription = (prescription, index) => dispatch => {
  dispatch(
    update(
      {
        ...prescription,
        pharmacyPrices: sortBy(
          removeDuplicates(prescription.pharmacyPrices),
          "price",
        ),
      },
      index,
    ),
  );
};

const update = (prescription, index) => ({
  type: UPDATE_PRESCRIPTION,
  prescription,
  index,
});
