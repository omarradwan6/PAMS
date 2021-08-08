import React from 'react';
import nextIcon from '../Employee/Icons/next1.svg';
import previousIcon from '../Employee/Icons/previous1.svg';
import '../Styling/Common.css';
import '../Styling/step-bar.css';
import axios from 'axios';
import { connect } from 'react-redux'
import { createUser } from '../Redux/Actions'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


class GeneralStatus extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            currentYear: new Date().getFullYear(),
            previousYear: new Date().getFullYear() - 1,
            currentYearStatus: - 1,
            previousYearStatus: -1,
            year: 0,
            pmsStatus: -1,
            creationDate: '',
            lastModified: ''

        };

        this.getPmsStatus = this.getPmsStatus.bind(this)
        this.getDates = this.getDates.bind(this)
        this.nextState = this.nextState.bind(this)
        this.prevState = this.prevState.bind(this)

    }

    getPmsStatus() {

        axios.get('./GeneralStatus/getStatus', { params: { year: this.state.year } })
            .then((response) => {

                this.setState({ pmsStatus: response.data[0] })

            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

        this.getDates();
        
    }

    getDates() {

        axios.get('./GeneralStatus/getDates', {
            params: {
                year: this.state.year
            }
        })
            .then((response) => {
                console.log(response.data)
                this.setState({ creationDate: response.data[0], lastModified: response.data[1] })
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

    }

    componentDidMount() {

        axios.get('./GeneralStatus/getStatus', { params: { year: this.state.currentYear } })
            .then((response) => {

                this.setState({ currentYearStatus: response.data[0] })

            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

        axios.get('./GeneralStatus/getStatus', { params: { year: this.state.previousYear } })
            .then((response) => {

                this.setState({ previousYearStatus: response.data[0] })

            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

    }

    handleYearChange = event => {
        this.setState({
            year: event.target.value
        }, function () { this.getPmsStatus() })
    }

    nextState() {

        axios.get('./GeneralStatus/nextState', {
            params: {
                year: this.state.year,
                state: this.state.pmsStatus +1,
                user: this.props.empName,
                userID: this.props.empID
            }
        })
            .then((response) => {
                if (response.data === "success") {
                    this.setState({ pmsStatus: this.state.pmsStatus + 1 }, function () { this.getDates() })
                }
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

    }

    prevState() {

        axios.get('./GeneralStatus/prevState', {
            params: {
                year: this.state.year,
                state: this.state.pmsStatus - 1,
                user: this.props.empName,
                userID: this.props.empID
            }
        })
            .then((response) => {
                if (response.data === "success") {
                    this.setState({ pmsStatus: this.state.pmsStatus - 1 }, function () { this.getDates() })
                }
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

    }


    render() {

        return (

            <div className='container-fluid  mt-3'>


                <div class="d-flex justify-content-center mb-2">
                    <div class=" form-group">
                        <label class="mr-2">Year: </label>

                        <select onChange={this.handleYearChange}>
                            <option></option>
                            {(this.state.previousYearStatus > 0) &&
                                <option value={this.state.previousYear} title={this.state.previousYear}>{this.state.previousYear}</option>
                            }
                            <option value={this.state.currentYear} title={this.state.currentYear}>{this.state.currentYear}</option>
                        </select>
                    </div>
                </div>
           
                {(this.state.pmsStatus !== -1) &&

                    <>
                    <div class="d-flex justify-content-center mb-2">
                        <h3>{this.state.year} PAMS Status</h3>
                        </div>
                        <div class="md-stepper-horizontal PG mt-1">
                            <div class={(Number(this.state.pmsStatus) === 0) ? "md-step active" : "md-step finished done"}>
                                <div class="md-step-circle"><span>0</span></div>
                                <div class="md-step-title">PAMS Initiation</div>
                                <div class="md-step-optional">{this.state.creationDate}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 1) ? "md-step active" : (Number(this.state.pmsStatus) < 1) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>1</span></div>
                                <div class="md-step-title">Objectives Phase</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 1) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 2) ? "md-step active" : (Number(this.state.pmsStatus) < 2) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>2</span></div>
                                <div class="md-step-title">Q1 Phase</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 2) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 3) ? "md-step active" : (Number(this.state.pmsStatus) < 3) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>3</span></div>
                                <div class="md-step-title">Q2 Phase</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 3) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 4) ? "md-step active" : (Number(this.state.pmsStatus) < 4) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>4</span></div>
                                <div class="md-step-title">Q3 Phase</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 4) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 5) ? "md-step active" : (Number(this.state.pmsStatus) < 5) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>5</span></div>
                                <div class="md-step-title">Q4 Phase</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 5) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 6) ? "md-step finished done" : "md-step"}>
                                <div class="md-step-circle"><span>6</span></div>
                                <div class="md-step-title">PAMS Completed</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 6) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                        </div>
                    </div>
                    <div class="multi-button d-flex justify-content-center mt-4">
                        <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Previous" onClick={this.prevState} disabled={((Number(this.state.pmsStatus) < 1)) ? "disabled" : ""}><img src={previousIcon} width='35px' height='35px' /></button>
                        <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Next" onClick={this.nextState} disabled={((Number(this.state.pmsStatus) > 5)) ? "disabled" : ""}><img src={nextIcon} width='35px' height='35px' /></button>
                    </div>
                    </>

                    }
                
                
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {

        empID: state.newUser.id,
        pmsStatus: state.newUser.pmsStatus,
        empName: state.newUser.name,
        sup1ID: state.newUser.sup1ID,
        createUserState: state.newUser
    };
}

export default connect(mapStateToProps, { createUser })(GeneralStatus);
