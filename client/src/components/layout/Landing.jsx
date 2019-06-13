import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  
  //redirect user if logged in when mounting the component
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center" >
                <h1 className="display-3 mb-4"style={{padding:"25px"}}>Arctech Auto</h1>
                <div className="container"><p className="lead" style={{backgroundColor:"black"}}>
                  {" "}
                  Create a profile, sell or buy electric vehicles, parts, tools, etc. and interact with our friendly community of electric vehicle enthusiasts within our forum board. 
                </p></div>
                <hr />
                <Link to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
        <br/><br/><br/>
        <div className="text-light">add carousal of items for sale using picture and price overlay</div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
