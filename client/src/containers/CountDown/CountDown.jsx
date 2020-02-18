import React, {Component} from 'react';

class CountDown extends Component {
    constructor(props) {
        super(props);
        console.log("================");
        console.log(this.props.timeleft);
        this.state = {
            RemainingTime:this.props.timeleft.toString()
        }
    }

    componentDidMount() {
        if(parseInt(this.state.RemainingTime) >0){
            this.timeout = setInterval(() => {
                let currentIdx = parseInt(this.state.RemainingTime)-1;
                if(currentIdx <= 0){
                    currentIdx=0
                    //TODO add action to complete when the timer runs out.
                    // this.props.SessionEnd()
                }
                this.setState({ RemainingTime:currentIdx.toString() });
            }, 1000);
        }
    }

    componentDidUnmount() {
        clearInterval(this.timeout);
    }

    render() {
        return (
            <div>
                <h5>{this.state.RemainingTime}</h5>
            </div>
        );
    }
}

export default CountDown;