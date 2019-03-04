import React, {Component, Fragment} from "react";
import Spinner from "../Spinner";

export const withLoadingSpinner = WrappedComponent => {
  return class extends Component {
    state = {
      spinnerVisible: false,
    };

    showSpinner = () => {
      this.setState({
        spinnerVisible: true,
      });
    };

    hideSpinner = () => {
      this.setState({
        spinnerVisible: false,
      });
    };

    render() {
      const {spinnerVisible} = this.state;

      return (
        <Fragment>
          <WrappedComponent
            {...this.props}
            showSpinner={this.showSpinner}
            hideSpinner={this.hideSpinner}
            isLoading={spinnerVisible}
          />
          <Spinner visible={spinnerVisible} />
        </Fragment>
      );
    }
  };
};

export default withLoadingSpinner;
