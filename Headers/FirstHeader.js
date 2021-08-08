import React from 'react';
import '../Styling/Common.css'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import { createUser } from '../Redux/Actions'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";




class FirstHeader extends React.Component {

    constructor(props) {
        super(props)

        this.onSignOut = this.onSignOut.bind(this)
    }

    onSignOut() {
        this.props.createUser(
            {
                name: null,
                id: null,
                department: null,
                description: null,
                sup1ID: null,
                sup2ID: null,
                networkID: null,
                sup1Name: null,
                sup2Name: null,
                departmentName: null,
                status: "logged-out",
                pmsStatus: null
            }

        );
    }



    render() {
        return (
            <div class="container-fluid pBackground">
                <nav className="d-flex justify-content-between align-items-center" id='firstHeader'>
                    <div>
                        <Link className="navbar-brand pl-1" to="/" >
                            <img src={require('../Logos/logo2.png')} alt="Logo" width="60px" />
                        </Link>
                    </div>
                    <div className='navbar-brand pBackground' id='PMStitle'>
                        Performance Appraisal & Management System
                        <h5 className="text-center Slogan"><i>ENGAGE, ENABLE, EMPOWER</i></h5>
                    </div>
                    <div className="headerIcons">
                        <div class="dropdown btn-group dropleft">
                            <button className="btn pBackground p-2 b-0 dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <FontAwesomeIcon id="personIcon" icon={faUser} className="pBackground" width="25px" />
                            </button>



                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button class="dropdown-item" type="button"><b>Name:</b> {this.props.userName}</button>
                                <button class="dropdown-item" type="button"><b>Title:</b> {this.props.empTitle}</button>
                                <button class="dropdown-item" type="button"><b>ID:</b> {this.props.empID}</button>
                                <button class="dropdown-item" type="button"><b>Department:</b> {this.props.empDepartmentName}</button>

                            </div>

                        </div>
                        <Link onClick={this.onSignOut} to='/' id="signOutLink" className=" btn pBackground p-2 b-0" type="button" data-toggle="tooltip" data-placement="bottom" title="Sign Out" aria-haspopup="true" aria-expanded="false">
                            <FontAwesomeIcon id="SignOutIcon" icon={faSignOutAlt} className="pBackground" width="25px" />
                        </Link>
                    </div>
                </nav>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        status: state.newUser.status,
        userName: state.newUser.name,
        empID: state.newUser.id,
        empTitle: state.newUser.description,
        empDepartment: state.newUser.department,
        empDepartmentName: state.newUser.departmentName,
        empSup1Name: state.newUser.sup1Name,
        empSup2Name: state.newUser.sup2Name
    };
}

export default connect(mapStateToProps, { createUser })(FirstHeader);