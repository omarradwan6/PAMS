import React from 'react';
import '../Styling/Common.css'
import EmployeeTabs from './EmployeeTabs'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { connect } from 'react-redux'
import axios from 'axios'




class SecondHeader extends React.Component {

    constructor(props) {
        super(props)

        this.state = { selectedTab: '', isSupervisor: false, isManager: false, isAdmin: false }

        this.changeTab = this.changeTab.bind(this)
        this.shownTabs = this.shownTabs.bind(this)
        this.isAdmin = this.isAdmin.bind(this)
    }

    componentDidMount() {
        this.shownTabs()
        this.isAdmin()


    }

    isAdmin() {

        axios.get(`./Objectives_/getHrRole/${this.props.empID}`)
            .then((response) => {

                if (response.data["Role"] !== "Not Found") {
                    this.setState({ isAdmin: true })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    changeTab(tab) {
        this.setState({ selectedTab: tab })
    }

    shownTabs() {

        axios.get(`./EMP_DATA/Title/${this.props.empID}`)
            .then((response) => {

                if (response.data.isSupervisor[0] != 0) {
                    this.setState({ isSupervisor: true })
                }
                if (response.data.isManager[0] != 0) {
                    this.setState({ isManager: true })
                }


            })
            .catch((error) => {
                console.log(error)
            })

    }

    render() {
        return (
            <>
                <ul class="nav d-flex justify-content-around pBackground" id="myTab" role="tablist">
                    <div class="dropdown">
                        <li class="nav-item pBackground" id="dropdownEmployeeButton" data-toggle="dropdown" role="presentation">
                            <Link className={'nav-link dropdown-toggle ' + (this.state.selectedTab === '/Employee' ? 'selected' : 'nav-text')} role="tab" >Employee</Link>
                        </li>
                        {this.props.HrGeneralStatus !== 6 && this.props.year !== "Empty" &&
                            <div class="dropdown-menu " id="EmpDropDown" aria-labelledby="dropdownEmployeeButton">
                                <Link class="dropdown-item" onClick={() => this.changeTab("/Employee")} to="/Employee/MyObjectives">{this.props.empPmsStatus === 0 ? "Create New PAMS" : "Edit My PAMS"}</Link>
                            </div>
                        }
                    </div>

                    {this.state.isSupervisor &&
                        <div class="dropdown">

                            <li class="nav-item pBackground" id="dropdownSupervisorButton" data-toggle="dropdown" role="presentation">
                                <Link className={'nav-link dropdown-toggle ' + (this.state.selectedTab === '/Supervisor' ? 'selected' : 'nav-text')} role="tab" >Supervisor</Link>
                            </li>


                            <div class="dropdown-menu" aria-labelledby="dropdownSupervisorButton">
                                <Link class="dropdown-item" onClick={() => this.changeTab("/Supervisor")} to="/Supervisor/MyTeam">MyTeam</Link>
                            </div>
                        </div>
                    }
                    {this.state.isManager &&
                        <div class="dropdown">
                        <li class="nav-item pBackground" id="dropdownManagerButton" data-toggle="dropdown" role="presentation">
                                <Link  onClick={() => this.changeTab("/Manager")} className={'nav-link dropdown-toggle ' + (this.state.selectedTab === '/Manager' ? 'selected' : 'nav-text')} role="tab" >Manager</Link>
                            </li>

                            <div class="dropdown-menu" aria-labelledby="dropdownManagerButton">
                                <Link class="dropdown-item" onClick={() => this.changeTab("/Manager")} to="/Manager/MyTeam">MyTeam</Link>
                            </div>
                        </div>
                    }
                    {this.state.isAdmin &&
                        <div class="dropdown">
                            <li class="nav-item pBackground" data-toggle="dropdown" role="presentation" id="dropdownHRButton">
                                <Link onClick={() => this.changeTab("/HR")} className={'nav-link dropdown-toggle ' + (this.state.selectedTab === '/HR' ? 'selected' : 'nav-text')} role="tab" >HR</Link>
                            </li>

                            <div class="dropdown-menu" aria-labelledby="dropdownHRButton">
                                <Link class="dropdown-item" onClick={() => this.changeTab("/HR")} to="/Hr">HR Control Panel</Link>
                            </div>
                        </div>
                    }
                </ul>





            </>
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
        empSup2Name: state.newUser.sup2Name,
        empPmsStatus: state.newUser.pmsStatus,
        year: state.newUser.year,
        HrGeneralStatus: state.newUser.HrGeneralStatus
    };
}

export default connect(mapStateToProps)(SecondHeader);