import React, { Component } from 'react';

class Directory extends Component {
    render(){

        let path = [];
        let current = this.props.directory.current;
        let directory = this.props.directory;
        console.log(directory);
        let obj = directory[current]
        while(obj){
            console.log(obj)
            path.unshift(
                <div>
                    {" / " + obj.name}
                </div>
                
            )
            obj = directory[obj.parentID];
        }

        return(
            <div>
                {path}
            </div>
        )
    }
}

export default Directory;