import React, {Component, Fragment} from "react";
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  StyleSheet,
  View,
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {connect} from "react-redux";
import shortid from "shortid";
import {NavigationActions, StackActions} from "react-navigation";
import Menu from "../components/Menu";
import AddLocation from "../components/AddLocation";
import {
  HelveticaBoldText,
  HelveticaMediumText,
  HelveticaRegularText,
} from "../components/StyledText";
import {Button} from "../components/Button";
import Drug from "../components/Drug";
import {errorNotification} from "../actions/notifications";
import {
  addPrescription,
  deletePrescription,
  savePrescription,
} from "../actions/prescription";
import {isEmpty} from "../utils/validators/common";
import {isIos, isX} from "../utils/common";
import {theme} from "../constants/theme";
import locales from "../constants/locales";
import withLoadingSpinner from "../components/withLoadingSpinner";

class SuperSavingsScreen extends Component {
  constructor(props) {
    super(props);
    this.scroll = React.createRef();
    this.keyboardHeight = new Animated.Value(0);

    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.scrollToInput = this.scrollToInput.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  _keyboardDidShow(event) {
    if (!isIos) {
      if (event && event.endCoordinates && event.endCoordinates.height) {
        const keyboardHeight = event.endCoordinates.height;
        Animated.timing(this.keyboardHeight, {
          toValue: keyboardHeight,
          duration: 200,
          easing: Easing.linear,
        }).start();
      }
    }
  }

  _keyboardDidHide() {
    if (!isIos) {
      Animated.timing(this.keyboardHeight, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
      }).start();
    }
  }

  handleSelectItem(item, index) {
    const {navigation} = this.props;
    this._keyboardDidHide();
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: "SuperSavings",
        }),
        NavigationActions.navigate({
          routeName: "PrescriptionList",
          params: {drug: item, index},
        }),
      ],
    });
    navigation.dispatch(resetAction);
  }

  handleFormSubmit() {
    const {
      navigation: {navigate},
    } = this.props;
    navigate("CouponList");
  }

  scrollToInput(node) {
    setTimeout(() => {
      this.scroll.props.scrollToFocusedInput(node);
    }, 300);
  }

  handleScroll() {
    if (!isIos) {
      if (this.keyboardHeight.__getValue() > 0) {
        Keyboard.dismiss();
        this._keyboardDidHide();
      }
    }
  }

  showConfirmationAlert = () => {
    const {remove, drugs} = this.props;
    const index = drugs.length - 1;
    if (drugs[index].displayDrug) {
      Alert.alert(
        locales.components.common.deletePrescription,
        locales.components.common.deletePrescriptionDialog,
        [
          {
            text: locales.components.common.cancel,
            style: "cancel",
          },
          {
            text: locales.components.common.delete,
            onPress: () => {
              remove(index);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      remove(index);
    }
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  render() {
    const {
      add,
      drugs,
      zipCode,
      zipErrorNotification,
      navigation,
      showSpinner,
      hideSpinner,
    } = this.props;
    const spinnerProps = {showSpinner, hideSpinner};

    return (
      <Fragment>
        <Menu navigation={navigation} />
        <KeyboardAwareScrollView
          innerRef={ref => {
            this.scroll = ref;
          }}
          style={styles.container}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          onMomentumScrollEnd={event => this.handleScroll(event)}
          scrollEventThrottle={16}
          enableResetScrollToCoords={false}
        >
          <Animated.View
            style={[styles.container, {paddingBottom: this.keyboardHeight}]}
          >
            <AddLocation {...spinnerProps} />
            <View style={styles.drugContainer}>
              <View style={styles.optionsRow}>
                <View style={styles.row}>
                  <HelveticaMediumText style={styles.prescriptions} size={17}>
                    {locales.screens.SuperSavings.numberOfPrescriptions}
                  </HelveticaMediumText>
                  <HelveticaBoldText
                    style={styles.prescriptionsNumber}
                    size={20}
                  >
                    {` ${drugs.length}`}
                  </HelveticaBoldText>
                </View>
                <View style={styles.quantityButtons}>
                  <View>
                    <Button
                      buttonSize="small"
                      disabled={drugs.length < 2}
                      type="secondary"
                      left="md-remove"
                      size={20}
                      style={styles.smallBtn}
                      iconSet="Ionicons"
                      onClick={() => this.showConfirmationAlert()}
                    />
                  </View>
                  <View style={styles.addButton}>
                    <Button
                      buttonSize="small"
                      disabled={drugs.length > 9}
                      type="secondary"
                      left="md-add"
                      size={20}
                      style={styles.smallBtn}
                      iconSet="Ionicons"
                      onClick={() => add(drugs.length)}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.promoTextContainer}>
                <HelveticaRegularText style={styles.promo} size={isX ? 17 : 18}>
                  {locales.screens.SuperSavings.promo}
                </HelveticaRegularText>
              </View>
              {drugs.map((drug, index) => (
                <Drug
                  zipCode={zipCode}
                  zipErrorNotification={zipErrorNotification}
                  drug={drug}
                  key={shortid.generate()}
                  index={index}
                  handleSelectItem={(item, idx) =>
                    this.handleSelectItem(item, idx)
                  }
                  scrollToInput={ev => this.scrollToInput(ev)}
                  onDropdownClose={() => this._keyboardDidHide()}
                  onDropdownShow={() => this._keyboardDidShow()}
                />
              ))}
              <Button
                disabled={isEmpty(drugs)}
                style={styles.submitBtn}
                onClick={() => this.handleFormSubmit()}
                type="secondary"
                right="md-arrow-dropright"
                size={20}
                middle={locales.screens.SuperSavings.finalize}
                iconSet="Ionicons"
              />
            </View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgPrimary,
    paddingBottom: isX ? 30 : 0,
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.tintColor,
  },
  textStyle: {
    color: theme.primary,
  },
  drugContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
  },
  optionsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.tintColor,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: "5%",
    paddingRight: "5%",
    borderBottomWidth: 1,
    borderBottomColor: theme.primary,
  },
  errorText: {
    color: theme.errorColor,
  },
  smallBtn: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  submitBtn: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: theme.sizes.size15,
    marginVertical: 25,
    padding: 5,
  },
  quantityButtons: {
    display: "flex",
    flexDirection: "row",
  },
  addButton: {
    marginLeft: 4,
  },
  prescriptions: {
    color: theme.primary,
  },
  prescriptionsNumber: {
    color: theme.primary,
  },
  promoTextContainer: {
    paddingTop: 11,
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderColor: theme.dividerColor,
  },
  promo: {
    color: theme.textBasic,
    textAlign: "center",
  },
  overlay: {
    zIndex: 2,
    backgroundColor: "red",
  },
});

const mapStateToProps = state => ({
  drugs: state.prescription.list,
  zipCode: state.location && state.location.zipCode,
});

const mapDispatchToProps = {
  add: addPrescription,
  remove: deletePrescription,
  save: savePrescription,
  zipErrorNotification: errorNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLoadingSpinner(SuperSavingsScreen));
