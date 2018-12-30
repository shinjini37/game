import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { KEY_DOWN_ACTION, KEY_UP_ACTION} from '../../game_logic/store/actions';
import { UP, DOWN, LEFT, RIGHT } from '../../game_logic/game/game_constants';

interface IInputCaptureProperties {
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
}

class InputCapture extends Component<IInputCaptureProperties> {

    componentWillMount(){
        document.addEventListener("keydown", this.props.onKeyDown);
        document.addEventListener("keyup", this.props.onKeyUp);
    }
    
    
    componentWillUnmount() {
        document.removeEventListener("keydown", this.props.onKeyDown);
        document.removeEventListener("keyup", this.props.onKeyUp);
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
        onKeyDown: (e: KeyboardEvent) => {
            const eventCode = e.code;
            if ([UP, DOWN, LEFT, RIGHT].indexOf(eventCode) >= 0) {
                e.preventDefault();
            }


            dispatch({
                type: KEY_DOWN_ACTION,
                payload: {
                    key: e.code
                }
            })
        },
        onKeyUp: (e: KeyboardEvent) => {
            const eventCode = e.code;
            if ([UP, DOWN, LEFT, RIGHT].indexOf(eventCode) >= 0) {
                e.preventDefault();
            }


            dispatch({
                type: KEY_UP_ACTION,
                payload: {
                    key: e.code
                }
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputCapture);