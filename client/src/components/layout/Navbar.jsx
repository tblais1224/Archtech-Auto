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
        return ( 
            <div >

            </div>
        )
    }
}

//sets up props
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

//sets the auth in the state to the props
const mapStateToProps = {
    auth: state.auth
}

//connect sets up redux with props
export default connect(mapStateToProps, {
    logoutUser,
    clearCurrentProfile
})(Navbar)