/**
 * Created by crazycooler on 2017/2/14.
 */
import React, {Component, PropTypes} from 'react'
import './StEllipsis.css'

import {Tooltip} from 'antd'

export default class StEllipsis extends Component {
    static propTypes = {
        text: PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
        width: PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired

    };

    constructor(props) {
        super(props);
        this.state = {
            isOverflow: false,
        };
    }

    componentDidMount() {
        if (this.container.offsetWidth < this.container.scrollWidth) {
            this.setState({isOverflow: true});
        }
    }

    render() {
        const {text} = this.props;
        let width = this.props.width;
        if(typeof(width) === 'string'){
            width = parseInt(width,10);
        }
        if (this.state.isOverflow) {
            return (
                <Tooltip title={text}>
                    <div className="custom-ellipsis"
                         ref={(container) => {this.container = container;}}
                         style={{width:width}}>
                        {text}
                    </div>
                </Tooltip>
            );
        } else {
            return (
                <div className="custom-ellipsis"
                     ref={(container) => {this.container = container;}}
                     style={{width:width}}>
                    {text}
                </div>
            );
        }
    }

}