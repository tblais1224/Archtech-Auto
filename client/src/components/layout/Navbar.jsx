import React, {
    Component
} from "react";
import {
    Link
} from "react-router-dom";
import PropTypes from "prop-types";
import {
    connect
} from "react-redux";
//actions for axios calls
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";


class Navbar extends Component {
    //clear the profile / auth token/ user info and logout the user 
    onLogoutClick(e) {
        e.preventDefault();
        this.props.clearCurrentProfile();
        this.props.logoutUser();
    }

    render() {

        const { isAuthenticated, user } = this.props.auth

        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
              <div className="container">
                <Link className="navbar-brand" to="/">
                  Arctech Auto
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#mobile-nav"
                >
                  <span className="navbar-toggler-icon" />
                </button>
      
                <div className="collapse navbar-collapse" id="mobile-nav">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/selling">
                        {" "}
                        For Sale
                      </Link>
                    </li>
                  </ul>
                  {/* if auth display auth links else display guest links */}
                  {/* {isAuthenticated ? authLinks : guestLinks} */}
                </div>
              </div>
            </nav>
          );
    }
}

//sets up props
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

//sets the auth in the state to the props
const mapStateToProps = state => ({
    auth: state.auth
})

//connect sets up redux with props
export default connect(mapStateToProps, {
    logoutUser,
    clearCurrentProfile
})(Navbar)