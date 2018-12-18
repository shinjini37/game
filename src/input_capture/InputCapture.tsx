import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface IInputCaptureProperties {
    onKeyPressed: (e: KeyboardEvent) => void;
}

class InputCapture extends Component<IInputCaptureProperties> {

    componentWillMount(){
        document.addEventListener("keydown", this.props.onKeyPressed);
    }
    
    
    componentWillUnmount() {
        document.removeEventListener("keydown", this.props.onKeyPressed);
    }

    render() {
        return (
            <></>
        );
    }

}

function mapStateToProps(state: any, ownProps: any) {
    return {};
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: any) {
    return {
        onKeyPressed: (e: KeyboardEvent) => {
            console.log("in mapDispatchToProps", e.code);
            dispatch({
                type: "KeysPressed",
                payload: {
                    keys: [e.code]
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputCapture);