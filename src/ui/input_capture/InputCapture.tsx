import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { KEY_PRESSED_ACTION} from '../../store/Actions';
import { UP, DOWN, LEFT, RIGHT } from '../../game/GameConstants';

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
            const eventCode = e.code;
            if ([UP, DOWN, LEFT, RIGHT].indexOf(eventCode) >= 0) {
                e.preventDefault();
            }


            dispatch({
                type: KEY_PRESSED_ACTION,
                payload: {
                    keyPressed: e.code
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputCapture);