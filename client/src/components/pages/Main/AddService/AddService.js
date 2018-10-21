import React, { Component } from 'react';
import styles from './AddService.scss';
import { connect } from 'react-redux';

import { addDropbox, addGoogle } from '../../../../actions/userActions'

class AddService extends Component{
    render(){
        let names = {
            'dropbox': 'Dropbox',
            'google':'Google Drive'
        }
        let actions = {
            'dropbox': this.props.addDropbox,
            'google': this.props.addGoogle
        }
        let options = ['dropbox','google'].map(service => {
            return(
                <div
                    className="service"
                    onClick={actions[service]}
                >
                    <div className="title">
                        {names[service]}
                    </div>
                    <img src={`/img/${service}.png`} alt=""/>
                </div>
            )
        })

        return(
            <div className={styles.AddService}>
                {options}
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        info: state.user.info
    }
}

const actions = { addDropbox, addGoogle }

export default connect(mapStateToProps, actions)(AddService);
