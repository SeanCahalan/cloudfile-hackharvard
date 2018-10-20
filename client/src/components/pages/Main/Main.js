import React, { Component } from 'react';
import styles from './Main.scss';
import { connect } from 'react-redux';

class Main extends Component{
    render(){
        return(
            <div className={styles.Main}>

                <div className="sidebar col">
                    <div className="logo">
                        CLOUD FILE
                    </div>
                    <div className="name">
                        {this.props.info.name}
                    </div>
                </div>

                <div className="body col">
                
                </div>

            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        info: state.user.info
    }
}

const actions = {  }

export default connect(mapStateToProps, actions)(Main)