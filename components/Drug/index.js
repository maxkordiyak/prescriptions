import React from "react";
import {View} from "react-native";
import {HelveticaBoldText, HelveticaMediumText} from "../StyledText";
import Autocomplete from "../Autocomplete";
import styles from "./Drug.styles";
import {Button} from "../Button";
import {theme} from "../../constants/theme";
import locales from "../../constants/locales";
import {capitalizeFirstLetter} from "../../utils/string";

const Drug = ({
  drug,
  index,
  handleSelectItem,
  zipCode,
  zipErrorNotification,
  scrollToInput,
  onDropdownClose,
  onDropdownShow,
}) => {
  return (
    <View
      style={[
        styles.inputContainer,
        drug.placeholder ? {} : styles.addedItemContainer,
      ]}
    >
      <HelveticaBoldText style={styles.index} size={20}>
        {index + 1}
      </HelveticaBoldText>
      {drug.placeholder ? (
        <Autocomplete
          style={styles.input}
          index={index}
          handleSelectItem={handleSelectItem}
          zipCode={zipCode}
          zipErrorNotification={zipErrorNotification}
          scrollToInput={scrollToInput}
          onDropdownClose={onDropdownClose}
          onDropdownShow={onDropdownShow}
        />
      ) : (
        <View style={styles.itemRow}>
          <View>
            <HelveticaMediumText size={22}>
              {capitalizeFirstLetter(drug.displayDrug.toLowerCase())}
            </HelveticaMediumText>
            <HelveticaMediumText style={styles.quantity} size={17}>
              {drug.displayStrength}
              {drug.displayStrength && drug.displayQuantity && " — "}
              {drug.displayQuantity}
            </HelveticaMediumText>
          </View>
          <View>
            <Button
              type="transparent"
              iconSet="FontAwesome"
              buttonSize="medium"
              middle={locales.components.common.edit}
              left="edit"
              preserveInputCase
              color={theme.primary}
              style={styles.edit}
              textStyle={styles.primaryText}
              onClick={() => handleSelectItem(drug, index)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Drug;
