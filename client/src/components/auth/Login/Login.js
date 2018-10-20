import React, { Component } from 'react';
import styles from './Login.scss';
import { connect } from 'react-redux';

import { login } from '../../../actions/userActions';

class Login extends Component{
    render(){
        return(
            <div className={styles.Login}>
                { this.props.fbLoaded &&
                    <div
                        className="btn fb-login shadow"
                        onClick={this.props.login}
                    >
                        Login with Facebook
                    </div>
                }
            </div>
        )
    }
}

const actions = { login }

export default connect(null, actions)(Login)