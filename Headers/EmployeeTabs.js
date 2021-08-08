import React from 'react';
import '../Styling/Common.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginPage from '../LoginPage';
import Objective from '../Employee/Objective'
import Competencies from '../Employee/Competencies'
import Development from '../Employee/Development'


class EmployeeTabs extends React.Component {

    constructor(props) {
        super(props)
    }





    render() {
        return (

            <div className="container-fluid p-0">
                <ul class="nav nav-tabs d-flex justify-content-start mb-2 pBackground">
                    <li class="nav-item text-center mt-2 flex-grow-1">
                        <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/' || this.props.match.path === '/Employee/MyObjectives' ? 'active' : 'text-white')} to="/Employee/MyObjectives">Objectives</Link>
                    </li>
                    <li class="nav-item text-center mt-2 flex-grow-1">
                        <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/Employee/MyCompetencies' ? 'active' : 'text-white')} to="/Employee/MyCompetencies">Competencies</Link>
                    </li>
                    <li class="nav-item text-center mt-2 flex-grow-1">
                        <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/Employee/MyGoals' ? 'active' : 'text-white')} to="/Employee/MyGoals">Training & Development</Link>
                    </li>
                </ul>


                <div >
                    <Switch>

                        <Route exact path="/Employee/MyObjectives" component={Objective}></Route>
                        <Route exact path="/Employee/MyCompetencies" component={Competencies}></Route>
                        <Route exact path="/Employee/MyGoals" component={Development}></Route>




                    </Switch>
                </div>
            </div>




        );
    }
}


export default EmployeeTabs;