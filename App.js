import React from 'react';
import LoginPage from './LoginPage'
import AllHeaders from './Headers/AllHeaders'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import EmployeeTabs from './Headers/EmployeeTabs'
import SupervisorTabs from './Headers/SupervisorTabs'
import ManagerTabs from './Headers/ManagerTabs'
import axios from 'axios'
import { connect } from 'react-redux'
import { createUser } from './Redux/Actions'
import Home from './Home';
import HrTabs from './Headers/HrTabs'
import Footer from './Headers/Footer'


class App extends React.Component {

    constructor(props) {
        super(props)

        this.onSignIn = this.onSignIn.bind(this)
    }








    onSignIn(e, username1, password1) {


        e.preventDefault()

        axios.get("./Auth/Login",
            { params: { UserName: username1, Password: password1, Check: this.props.Status } })
            .then((response11) => {
                if (response11.data == true) {
                    axios.get(`./EMP_DATA/details/${username1}`)

                        .then((response4) => {

                            axios.get("./Objectives_/getCurrentYear")
                                .then((responseYear) => {
                                    let workflowID = response4.data[0].ID + responseYear.data["Year"]
                                    axios.get('./Objectives_/getPmsStatus', { params: { workflowID: workflowID } })
                                        .then((response12) => {

                                            this.props.createUser({
                                                name: response4.data[0].NAME,
                                                id: response4.data[0].ID,
                                                department: response4.data[0].DEP_ID,
                                                description: response4.data[0].DESCRIPTION,
                                                sup1ID: response4.data[0].SUP1ID,
                                                sup2ID: response4.data[0].SUP2ID,
                                                networkID: response4.data[0].NETWORKID,
                                                sup1Name: response4.data[0].SUP1_NAME,
                                                sup2Name: response4.data[0].SUP2_NAME,
                                                departmentName: response4.data[0].DEPT,
                                                status: "logged-in",
                                                pmsStatus: response12.data[0],
                                                year: responseYear.data["Year"],
                                                HrGeneralStatus: responseYear.data["CurrentStatus"]

                                            }
                                            );



                                        })


                                })
                        })
                        .catch((error) => {
                            console.log(error)
                            alert("No PAMS initiated")
                        })

                }
                else {

                    alert("Wrong Username or Password !!!");

                }
            })
            .catch((error) => {
                // handle error
                console.log("errors", error);
            });

    }



    render() {
        return (

            <>

                {this.props.Status === 'logged-in' &&
                    <>
                        <div className="Content">
                            <AllHeaders />

                            <Switch>
                                <Route exact path="/" component={Home}></Route>

                                <Route exact path="/Employee/MyObjectives" component={EmployeeTabs}></Route>
                                <Route exact path="/Employee/MyCompetencies" component={EmployeeTabs}></Route>
                                <Route exact path="/Employee/MyGoals" component={EmployeeTabs}></Route>

                                <Route exact path="/Supervisor" component={SupervisorTabs}></Route>
                                <Route exact path="/Supervisor/MyTeam" component={SupervisorTabs}></Route>
                                <Route exact path="/Supervisor/EmployeeObjectives/:EmpID" component={SupervisorTabs}></Route>
                                <Route exact path="/Supervisor/EmployeeCompetencies" component={SupervisorTabs}></Route>
                                <Route exact path="/Supervisor/EmployeeObjectives" component={SupervisorTabs}></Route>

                                <Route exact path="/Manager" component={ManagerTabs}></Route>
                                <Route exact path="/Manager/MyTeam" component={ManagerTabs}></Route>
                                <Route exact path="/Manager/EmployeeObjectives/:EmpID" component={ManagerTabs}></Route>


                                <Route exact path="/Hr" component={HrTabs}></Route>
                                <Route exact path="/Hr/PamsStatusControl" component={HrTabs}></Route>
                                <Route exact path="/Hr/DataExport" component={HrTabs}></Route>
                                <Route exact path="/Hr/GeneralStatus" component={HrTabs}></Route>



                            </Switch>
                        </div>

                        <Footer />
                    </>
                }

                {this.props.Status != "logged-in" &&
                    <div className="d-flex justify-content-center align-items-center main-background" style={{ zIndex: '2' }}>
                        <LoginPage onSignIn={this.onSignIn} />
                    </div>
                }
            </>

        )

    }
}



const mapStateToProps = state => {
    return { Status: state.newUser.status };
}

export default connect(mapStateToProps, { createUser })(App);