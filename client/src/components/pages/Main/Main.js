import React, { Component } from 'react';
import styles from './Main.scss';
import { connect } from 'react-redux';

import { addDropbox, logout } from '../../../actions/userActions'
import { fileIcon } from '../../../util/data';

import AddService from './AddService/AddService';
import ModalContainer from '../../layout/ModalContainer/ModalContainer';

class Main extends Component{
    render(){

        let owned = this.props.owned.map(file => {
            return(
                <div key={file.name} className={"file col " + file.service}>
                    <div className={"preview " + file.service}>
                        <i className={`fas fa-file-${fileIcon[file.name.split('.')[1]]}`} />
                    </div>
                    <div className="info">
                        <div>{file.name}</div>
                    </div>
                </div>
            )
        })

        let shared = this.props.shared.map(file => {
            return(
                <div key={file.name} className={"file col " + file.service}>
                    <div className={"preview " + file.service}>
                        <i className={`fas fa-file-${fileIcon[file.name.split('.')[1]]}`} />
                    </div>
                    <div className="info">
                        <div>{file.name}</div>
                    </div>
                </div>
            )
        })

        return(
            <div className={styles.Main}>

                <div className="sidebar col">
                    <div className="logo">
                        CLOUD FILE
                    </div>
                    <div className="name">
                        {this.props.info.name || localStorage.getItem('name')}
                    </div>
                    <ModalContainer
                        content={
                            <AddService/>
                        }
                    >
                        <div className="add-service">
                            Add Service
                            <i className="fas fa-plus"></i>
                        </div>
                    </ModalContainer>
                    
                    <div className="list-item logout" onClick={this.props.logout}>
                        Logout
                    </div>
                </div>

                <div className="body col">
                    <div className="header">My files</div>
                    <div className="file-wrapper">
                        {owned}
                    </div>
                    <div className="header">Shared with me</div>
                    <div className="file-wrapper">
                        {shared}
                    </div>
                    
                </div>

            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        info: state.user.info,
        owned: state.files.owned,
        shared: state.files.shared
    }
}

const actions = { addDropbox, logout }

export default connect(mapStateToProps, actions)(Main)