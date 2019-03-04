import {StyleSheet} from "react-native";
import {theme} from "../../constants/theme";

export default StyleSheet.create({
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: theme.dividerColor,
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },
  input: {
    maxHeight: 40,
  },
  invalid: {
    color: theme.errorText,
    borderBottomColor: theme.errorColor,
    borderBottomWidth: 1,
  },
  index: {
    color: theme.tertiary,
    textAlign: "center",
    marginRight: 10,
    minWidth: 20,
  },
  active: {
    zIndex: 100,
  },
  primaryText: {
    color: theme.primary,
    fontSize: theme.sizes.size17,
    fontFamily: theme.defaultMediumFont,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: theme.textInvert,
  },
  quantity: {
    marginTop: 5,
    color: theme.listItemDarkColor,
  },
  itemRow: {
    flexGrow: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.bgPrimary,
  },
  edit: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  addedItemContainer: {
    paddingVertical: 0,
    paddingTop: 7.5,
    paddingBottom: 18.2,
  },
});
