import React from 'react';
import '../Styling/Common.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PmsStatusControl from '../HR/PmsStatusControl'
import DataExport from '../HR/DataExport'
import GeneralStatus from '../HR/GeneralStatus'
import { connect } from 'react-redux'
import axios from 'axios'


class HrTabs extends React.Component {

    constructor(props) {
        super(props)

        this.state = { role: "" }
    }

    componentDidMount() {


        axios.get(`./Objectives_/getHrRole/${this.props.empID}`)
            .then((response) => {

                this.setState({ role: response.data["Role"] })

            })
            .catch((error) => {
                console.log(error)
            })


    }





    render() {
        return (

            <div className="container-fluid p-0">
                <ul class="nav nav-tabs d-flex justify-content-start mb-2 pBackground">
                    {this.state.role === 1 &&
                        <li class="nav-item text-center mt-2 flex-grow-1">
                            <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/Hr/PamsStatusControl'  ? 'active' : 'text-white')} to="/Hr/PamsStatusControl">Employees' PAMS Status Control</Link>
                        </li>
                    }
                    {(this.state.role === 1 || this.state.role === 2 ) &&
                    <li class="nav-item text-center mt-2 flex-grow-1">
                        <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/Hr/DataExport' || this.props.match.path === '/Hr' ? 'active' : 'text-white') +(this.state.role===2 ? " mx-4" :"")} to="/Hr/DataExport">Data Export</Link>
                    </li>
                    }
                    {this.state.role === 1 &&

                        <li class="nav-item text-center mt-2 flex-grow-1">
                            <Link className={'nav-link secondaryTabs ' + (this.props.match.path === '/Hr/GeneralStatus' ? 'active' : 'text-white')} to="/Hr/GeneralStatus">PAMS General Status Control</Link>
                        </li>
                    }
                </ul>


                <div >
                    {this.state.role !== "Not Found" &&
                    <Switch>
                        <Route exact path="/Hr" component={DataExport}></Route>
                        <Route exact path="/Hr/PamsStatusControl" component={PmsStatusControl}></Route>
                        <Route exact path="/Hr/DataExport" component={DataExport}></Route>
                        <Route exact path="/Hr/GeneralStatus" component={GeneralStatus}></Route>

                        </Switch>
                    }
                </div>
            </div>




        );
    }
}


const mapStateToProps = state => {
    return {

        empID: state.newUser.id
    };
}

export default connect(mapStateToProps)(HrTabs);