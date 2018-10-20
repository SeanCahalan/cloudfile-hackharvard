import React, { Component } from 'react';
import styles from './Dropdown.scss';

import classnames from 'classnames';
import onClickOutside from "react-onclickoutside";

class Dropdown extends Component{
    constructor(){
        super();
        this.state = {
            open: false
        }
    }

    handleClickOutside = () => {
        this.setState({open: false});
    }

    render(){
        const menuClasses = classnames(
            "dropdown", {"open": this.state.open}
        )
        const iconClass = classnames(
            {"fas fa-chevron-up": this.state.open},
            {"fas fa-chevron-down": !this.state.open}
        )
        const iconWrapper = classnames(
            'icon',
            {'hidden': this.props.hideIcon}
        )
        const btnClass = classnames(
            {"open": this.state.open},
            "btn"
        )
        const mainClass = classnames(
            [styles.Dropdown],
            this.props.classes
        )
        return(
            <div className={mainClass}>
                <div className={btnClass} onClick={() => this.setState({open: !this.state.open})}>
                    <div className="btn_content" >
                        {this.props.btn_content}
                    </div>
                    <div className={iconWrapper}>
                        <i className={iconClass} />
                    </div>
                </div>
                <div className={menuClasses} onClick={() => this.setState({open:false})}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default onClickOutside(Dropdown);