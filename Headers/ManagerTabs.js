import React from 'react';
import '../Styling/Common.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MyTeam from '../Manager/MyTeam'
import Employee from '../Manager/Employee'

class ManagerTabs extends React.Component {

    constructor(props) {
        super(props)
    }





    render() {
        return (

            <div className="container-fluid p-0">
                <ul class="nav nav-tabs d-flex justify-content-start mb-2 pBackground">
                    <li class="nav-item text-center mt-2 flex-grow-1">
                        <Link className={'nav-link mx-4 secondaryTabs ' + (this.props.match.path === '/Manager/MyTeam' || this.props.match.path === '/Manager' ? 'active' : 'text-white')} to="/Manager/MyTeam">My Team</Link>
                    </li>

                </ul>


                <div >
                    <Switch>
                        <Route exact path="/Manager/MyTeam" component={MyTeam}></Route>
                        <Route exact path="/Manager/EmployeeObjectives/:EmpID" component={Employee}></Route>
                    </Switch>
                </div>
            </div>




        );
    }
}


export default ManagerTabs;