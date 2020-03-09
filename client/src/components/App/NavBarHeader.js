import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Toolbar from '../Partials/Toolbar';
import SideDrawer from '../Partials/SideDrawer/SideDrawer';
import Backdrop from '../Backdrop/Backdrop';
import "../Welcome/Welcome.css";
import * as actions from "../../actions";

class NavBarHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            sideDrawerOpen: false,
            auth:null

        };
    }



    mapUserInfoToState(props, prevState){
      console.log(`trying to map auth data to navbar header`);
      console.log(props.auth.data);
      console.log(prevState.auth);
      if(prevState.auth !== null && props.auth.data){
          console.log("maping auth to state");
          let currentState = this.state;
          currentState.auth = props.auth.data[0];
          this.setState(currentState);
      }

  }

drawerToggleClickHandler = (props) => {
    let currentState = this.state;
    //here we are checking for the auth prop from redux to try and show account info in the sideDrawer
    console.log(JSON.stringify(this.props.auth));
    if(this.props.auth !== undefined && this.props.auth !== null && this.props.auth.data !== undefined){
        currentState.auth = this.props.auth.data[0];
    }
    currentState.sideDrawerOpen = !this.state.sideDrawerOpen;
    this.setState(currentState);
};

backdropClickHandler =() => {
    this.setState({sideDrawerOpen: false});
};

render() {
    //Here we either render the sideDrawer with or without the backdrop
    return(
      <div style={{height: '100%'}} className={"bg-info"}>
          {this.state.sideDrawerOpen ? (
              <div>
              <Toolbar drawerClickHandler={this.drawerToggleClickHandler}/>
              <SideDrawer show={this.state.sideDrawerOpen} userData={this.state.auth}/>
              <Backdrop click={this.backdropClickHandler}/>
              </div>
          ):(
              <div>
                  <Toolbar drawerClickHandler={this.drawerToggleClickHandler}/>
                  <SideDrawer show={this.state.sideDrawerOpen} userData={this.state.auth}/>
              </div>
          )}
      </div>
        );
    }
}

function mapStateToProps(state){
    return { auth: state.auth.authenticated }
}

export default connect(mapStateToProps, actions)(NavBarHeader);
// export default NavBarHeader;
