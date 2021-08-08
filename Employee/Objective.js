import React from 'react';
import addIcon from './Icons/add.svg';
import saveIcon from './Icons/save.svg';
import proceedIcon from './Icons/next.svg';
import deleteIcon from './Icons/delete.svg';
import '../Styling/Common.css';
import '../Styling/step-bar.css';
import axios from 'axios';
import { connect } from 'react-redux'
import { createUser } from '../Redux/Actions'


class Objective extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            objectives: [{ objID: 1, obj: '', milestone: '', empQ1: '', empQ2: '', empQ3: '', empQ4: '', supQ1: '', supQ2: '', supQ3: '', supQ4: '', percentageW: 0, empScore: 0, empFinalW: 0, supScore: 0, supFinalW: 0 }],
            creationDate: '',
            lastModified: '',
            pmsStatus: 0,
            totalWeight: 0,
            emptyFields: false,
            blockPage: false,
            generalStatus: 0,

        };

        this.addObjective = this.addObjective.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
        this.getDates = this.getDates.bind(this)
        this.getPmsStatus = this.getPmsStatus.bind(this)
        this.getGeneralStatus = this.getGeneralStatus.bind(this)

    }

    addObjective() {

        var newObjectives = this.state.objectives

        if (newObjectives.length >= 8) {
            alert('You have reached the maximum number of objectives')
        } else if (newObjectives.length >= 5 && newObjectives.length < 8) {
            if (confirm('It is recommended to write no more than 5 objectives. \nDo you wish to continue?')) {
                // add objective!
                var objNum = newObjectives.length + 1
                newObjectives.push({ objID: objNum, obj: '', milestone: '', empQ1: '', empQ2: '', empQ3: '', empQ4: '', supQ1: '', supQ2: '', supQ3: '', supQ4: '', percentageW: 0, empScore: 0, empFinalW: 0, supScore: 0, supFinalW: 0 })
                this.setState({ objectives: newObjectives })
            } else {
                // Do nothing!
            }
        } else {
            var objNum = newObjectives.length + 1
            newObjectives.push({ objID: objNum, obj: '', milestone: '', empQ1: '', empQ2: '', empQ3: '', empQ4: '', supQ1: '', supQ2: '', supQ3: '', supQ4: '', percentageW: 0, empScore: 0, empFinalW: 0, supScore: 0, supFinalW: 0 })
            this.setState({ objectives: newObjectives })
        }
    }

    deleteObjective = (i) => {

        var newObjectives = this.state.objectives

        newObjectives.splice(i, 1);

        newObjectives.map((obj) => {

            obj.objID = newObjectives.indexOf(obj) + 1

        })

        this.setState({ objectives: newObjectives })

    }

    checkWeight = () => {

        var newObjectives = this.state.objectives

        var sum = 0;

        newObjectives.map((obj) => {

            sum = Number(sum) + Number(obj.percentageW)

        })

        console.log(sum)

        this.setState({ totalWeight: sum }, function () { this.proceedToSupervisor() })

    }

    checkEmpty = () => {

        this.setState({ blockPage: true })

        var newObjectives = this.state.objectives

        var check = false

        newObjectives.map((obj) => {

            if (this.state.pmsStatus == 0 || this.state.pmsStatus == 1) {

                if (obj.obj.trim() == '' || obj.milestone.trim() == '' || obj.percentageW == 0) {

                    check = true
                }

            }

            else if (this.state.pmsStatus == 3) {

                if (obj.milestone.trim() == '' || obj.empQ1.trim() == '') {

                    check = true
                }

            }

            else if (this.state.pmsStatus == 5) {

                if (obj.milestone.trim() == '' || obj.empQ2.trim() == '') {

                    check = true
                }

            }

            else if (this.state.pmsStatus == 7) {

                if (obj.milestone.trim() == '' || obj.empQ3.trim() == '') {

                    check = true
                }

            }
        })

        this.setState({ emptyFields: check }, function () { this.checkWeight() })

    }

    textChange = (e, obj) => {

        var index = this.state.objectives.indexOf(obj);
        var objectives = this.state.objectives
        objectives[index][e.target.id] = e.target.value

        this.setState({ objectives: objectives })
    }

    weightChange = (e, obj) => {

        var check = Number(e.target.value)
        if (check <= 100 && check >= 0) {
            var index = this.state.objectives.indexOf(obj);
            var objectives = this.state.objectives
            objectives[index][e.target.id] = e.target.value
            this.setState({ objectives: objectives })
        }
    }

    inputChange = (e, obj) => {

        var check = Number(e.target.value)
        if (check <= 5 && check >= 1) {
            var index = this.state.objectives.indexOf(obj);
            var objectives = this.state.objectives
            objectives[index][e.target.id] = e.target.value
            this.setState({ objectives: objectives })
        }
    }

    saveObjectives = () => {

        if (this.state.objectives.length === 0) {

                alert('There are no objectives to be saved')

        } else {
            this.setState({ blockPage: true })

            axios.get('./Objectives_/saveObjectives', {
                    params: {

                        empID: this.props.empID,
                        year: this.props.year,
                        objectives: this.state.objectives == null || this.state.objectives.length == 0 ? "empty" : this.state.objectives,
                        status: this.state.pmsStatus,
                        empName: this.props.empName

                    }
                }).then((response) => {
                    alert(response.data)
                    if (response.data === "Your PAMS has been saved successfully") {
                        if ((Number(this.state.pmsStatus) === 0)) {
                            this.props.createUser({
                                ...this.props.createUserState,
                                pmsStatus: 1
                            });

                            this.setState({ pmsStatus: 1 })
                        }
                    }
                    this.getDates()
                    this.setState({ blockPage: false })
                })
                    .catch((error) => {
                        console.log("error", error);
                        this.setState({ blockPage: false })
                    })
            }
    }

    proceedToSupervisor = () => {

        if (this.state.objectives.length === 0) {

            alert('There are no objectives to be submitted')
            this.setState({ blockPage: false })

        } else if (this.state.emptyFields == true) {

            alert('Please fill in all fields before you proceed')
            this.setState({ blockPage: false })


        } else if (this.state.totalWeight != 100) {

            alert('The total sum of objectives weight should be 100%')
            this.setState({ blockPage: false })

        } else {
            axios.get('./Objectives_/saveObjectives', {
                params: {

                    empID: this.props.empID,
                    year: this.props.year,
                    objectives: this.state.objectives == null || this.state.objectives.length == 0 ? "empty" : this.state.objectives,
                    status: this.state.pmsStatus,
                    empName: this.props.empName
                }
            }).then((response) => {

                if (response.data === "Your PAMS has been saved successfully") {
                    if ((Number(this.state.pmsStatus) === 0)) {
                        this.props.createUser({
                            ...this.props.createUserState,
                            pmsStatus: 1
                        });

                        this.setState({ pmsStatus: 1 })
                    }

                    this.proceedToSupervisor2()
                }
            })
                .catch((error) => {
                    console.log("error", error);
                    this.setState({ blockPage: false })
                })      
        }
    }

    proceedToSupervisor2 = () => {


        axios.get('./Objectives_/updateStatus', {
            params: {

                empID: this.props.empID,
                year: this.props.year,
                status: this.state.pmsStatus,
                empName: this.props.empName
            }
        }).then((response) => {
            alert(response.data)

            if (response.data === "Your PAMS is submitted to your supervisor successfully") {

                var newstate = Number(this.state.pmsStatus) + 1
                this.props.createUser({
                    ...this.props.createUserState,
                    pmsStatus: newstate
                });

                this.setState({ pmsStatus: newstate, blockPage: false }, function () {
                    this.sendEmail()
                })

                this.getDates()
            }
        })
            .catch((error) => {
                console.log("error", error);
                this.setState({ blockPage: false })
            })


    }

    componentDidMount() {


        axios.get('./Objectives_/GetSavedObjectives', {
            params: {
                empID: this.props.empID,
                year: this.props.year,
            }
        })
            .then((response) => {

                if (response.data === "No Saved Objectives") {

                    console.log(response)

                } else {
                    // handle success
                    var oList = response.data
                    var newList = []
                    oList.map((j) => {

                        newList.push({ objID: j.NumberObjective, obj: j.Objective1, milestone: j.Milestones, empQ1: j.CommentsEmployeeQ1, empQ2: j.CommentsEmployeeQ2, empQ3: j.CommentsEmployeeQ3, empQ4: j.CommentsEmployeeQ4, supQ1: j.CommentsSupervisorQ1, supQ2: j.CommentsSupervisorQ2, supQ3: j.CommentsSupervisorQ3, supQ4: j.CommentsSupervisorQ4, percentageW: j.Weight, empScore: j.EmpScore, empFinalW: j.EmpWeight, supScore: j.SupervisorScore, supFinalW: j.SupervisorWeight })

                    })
                    this.setState({ objectives: newList })
                }
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

        this.getPmsStatus()
        this.getDates()
        this.getGeneralStatus()

    }

    sendEmail() {

        axios.get('./Email/sendMailtoSupervisor', { params: { sup1ID: this.props.sup1ID, empName: this.props.empName, pmsStatus: this.state.pmsStatus, sup2ID: this.props.sup2ID} })
            .then((response) => {
                console.log(response, "Email sent")
            })
            .catch((error) => {
                console.log(error)
            })

    }

    getDates() {

        axios.get('./Objectives_/getDates', {
            params: {
                empID: this.props.empID,
                year: this.props.year,
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

    getPmsStatus() {

        var currentYear = this.props.year;
        var workflowID = this.props.empID + currentYear
        axios.get('./Objectives_/getPmsStatus', { params: { workflowID: workflowID } })
            .then((response) => {

                this.setState({ pmsStatus: response.data[0]})
             
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })
    }

    getGeneralStatus() {

        axios.get('./GeneralStatus/getStatus', { params: { year: this.props.year } })
            .then((response) => {

                this.setState({ generalStatus: response.data[0] }, function () {
                    this.props.createUser({
                        ...this.props.createUserState,
                        HrGeneralStatus: this.state.generalStatus
                    })})

            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })

    }


    render() {

        return (
            <div className="ml-2 mt-2 mr-2">

                <div class= "d-flex justify-content-center">
                    <div class="md-stepper-horizontal PG mt-3 ">
                        <div class={(Number(this.state.pmsStatus) === 0) ? "md-step active" : "md-step finished done"} style={(this.state.pmsStatus >= 9) ? { width: '20%' } : { width: '33%' }}>
                        <div class="md-step-circle"><span>0</span></div>
                        <div class="md-step-title">Creation</div>
                        <div class="md-step-optional">{this.state.creationDate}</div>
                        <div class="md-step-bar-left"></div>
                        <div class="md-step-bar-right"></div>
                    </div>
                    {(this.state.pmsStatus < 3 && this.state.generalStatus > 0) &&
                        <>
                            <div class={(Number(this.state.pmsStatus) === 1) ? "md-step active" : (Number(this.state.pmsStatus) < 1) ? "md-step" : "md-step finished done"} style={{ width: '33%'}}>
                        <div class="md-step-circle"><span>1</span></div>
                        <div class="md-step-title">Employee Objectives</div>
                        <div class="md-step-optional">{(Number(this.state.pmsStatus) === 1) ? this.state.lastModified : ""}</div>
                        <div class="md-step-bar-left"></div>
                        <div class="md-step-bar-right"></div>
                    </div>
                            <div class={(Number(this.state.pmsStatus) === 2) ? "md-step active" : (Number(this.state.pmsStatus) < 2) ? "md-step" : "md-step finished done"} style={{ width: '33%'}}>
                        <div class="md-step-circle"><span>2</span></div>
                        <div class="md-step-title">Supervisor Review</div>
                        <div class="md-step-optional">{(Number(this.state.pmsStatus) === 2) ? this.state.lastModified : ""}</div>
                        <div class="md-step-bar-left"></div>
                        <div class="md-step-bar-right"></div>
                    </div>
                        {/*<div class={(Number(this.state.pmsStatus) === 3) ? "md-step active" : (Number(this.state.pmsStatus) < 3) ? "md-step" : "md-step finished done"}>
                        <div class="md-step-circle"><span>3</span></div>
                        <div class="md-step-title">Objectives Completed</div>
                        <div class="md-step-optional">{(Number(this.state.pmsStatus) === 3) ? this.state.lastModified : ""}</div>
                        <div class="md-step-bar-left"></div>
                        <div class="md-step-bar-right"></div>
                        </div>*/}
                        </>
                    }
                    {(this.state.pmsStatus >= 3 && this.state.pmsStatus < 5 ) &&
                        <>
                            <div class={(Number(this.state.pmsStatus) === 3) ? "md-step active" : (Number(this.state.pmsStatus) < 3) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>3</span></div>
                            <div class="md-step-title">{(Number(this.state.pmsStatus) === 3 && this.state.generalStatus < 2) ? "Objectives Completed / Awaiting Q1" : "Employee Q1 comments"}</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 3) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 4) ? "md-step active" : (Number(this.state.pmsStatus) < 4) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>4</span></div>
                                <div class="md-step-title">Supervisor Q1 Comments</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 4) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                        {/*<div class={(Number(this.state.pmsStatus) === 5) ? "md-step active" : (Number(this.state.pmsStatus) < 5) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>5</span></div>
                                <div class="md-step-title">Q1 Completed</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 6) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>*/}
                        </>
                    }
                    {(this.state.pmsStatus >= 5 && this.state.pmsStatus < 7 ) &&
                        <>
                            <div class={(Number(this.state.pmsStatus) === 5) ? "md-step active" : (Number(this.state.pmsStatus) < 5) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>5</span></div>
                                <div class="md-step-title">{(Number(this.state.pmsStatus) === 5 && this.state.generalStatus < 3) ? "Q1 Completed / Awaiting Q2" : "Employee Q2 comments"}</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 5) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 6) ? "md-step active" : (Number(this.state.pmsStatus) < 6) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>6</span></div>
                                <div class="md-step-title">Supervisor Q2 Comments</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 6) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                        {/*<div class={(Number(this.state.pmsStatus) === 7) ? "md-step active" : (Number(this.state.pmsStatus) < 7) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>7</span></div>
                                <div class="md-step-title">Q2 Completed</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 7) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>*/}
                        </>
                    }
                    {(this.state.pmsStatus >= 7 && this.state.pmsStatus < 9 ) &&
                        <>
                            <div class={(Number(this.state.pmsStatus) === 7) ? "md-step active" : (Number(this.state.pmsStatus) < 7) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>7</span></div>
                                <div class="md-step-title">{(Number(this.state.pmsStatus) === 7 && this.state.generalStatus < 4) ? "Q2 Completed / Awaiting Q3" : "Employee Q3 comments"}</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 7) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 8) ? "md-step active" : (Number(this.state.pmsStatus) < 8) ? "md-step" : "md-step finished done"} style={{ width: '33%' }}>
                                <div class="md-step-circle"><span>8</span></div>
                                <div class="md-step-title">Supervisor Q3 Comments</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 8) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                        {/*<div class={(Number(this.state.pmsStatus) === 9) ? "md-step active" : (Number(this.state.pmsStatus) < 9) ? "md-step" : "md-step finished done"}>
                                <div class="md-step-circle"><span>9</span></div>
                                <div class="md-step-title">Q3 Completed</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 9) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>*/}
                        </>
                    }
                    {(this.state.pmsStatus >= 9) &&
                        <>
                            <div class={(Number(this.state.pmsStatus) === 9) ? "md-step active" : (Number(this.state.pmsStatus) < 9) ? "md-step" : "md-step finished done"} style={{ width: '20%' }}>
                                <div class="md-step-circle"><span>9</span></div>
                                <div class="md-step-title">{(Number(this.state.pmsStatus) === 9 && this.state.generalStatus < 5) ? "Q3 Completed / Awaiting Q4" : "Employee Q4 Input"}</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 9) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 10) ? "md-step active" : (Number(this.state.pmsStatus) < 10) ? "md-step" : "md-step finished done"} style={{ width: '20%' }}>
                                <div class="md-step-circle"><span>10</span></div>
                                <div class="md-step-title">Supervisor Q4 Input</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 10) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>
                            <div class={(Number(this.state.pmsStatus) === 11) ? "md-step active" : (Number(this.state.pmsStatus) < 11) ? "md-step" : "md-step finished done"} style={{ width: '20%' }}>
                                <div class="md-step-circle"><span>11</span></div>
                                <div class="md-step-title">Manager Review</div>
                                <div class="md-step-optional">{(Number(this.state.pmsStatus) === 11) ? this.state.lastModified : ""}</div>
                                <div class="md-step-bar-left"></div>
                                <div class="md-step-bar-right"></div>
                            </div>

                            <div class={(Number(this.state.pmsStatus) === 12) ? "md-step active" : (Number(this.state.pmsStatus) < 12) ? "md-step" : "md-step finished done"} style={{ width: '20%' }}>
                               <div class="md-step-circle"><span>12</span></div>
                               <div class="md-step-title">PAMS Completed</div>
                               <div class="md-step-optional">{(Number(this.state.pmsStatus) === 12) ? this.state.lastModified : ""}</div>
                               <div class="md-step-bar-left"></div>
                               <div class="md-step-bar-right"></div>
                            </div>
                        </>
                    }
                    </div>

                </div>


                {/* <div class="info bg-light d-flex justify-content-around mt-2">

                    <span class="bBadge badge pBackground mt-3">Created: {this.state.creationDate}</span>
                    <span class="bBadge badge pBackground mt-3">Last Modified: {this.state.lastModified}</span>

                </div>*/}


                <div class="d-flex justify-content-center mt-3">
                    <div class="multi-button">
                        {((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1)) &&
                            <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Add Objective" disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1)) ? "" : "disabled"} onClick={this.addObjective}><img src={addIcon} width='35px' height='35px' /></button>
                        }
                        {((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1) || (Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) || (Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) || (Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) || (Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4)) &&
                            <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Save" disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1) || (Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) || (Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) || (Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) || (Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4)) ? "" : "disabled"} onClick={this.saveObjectives}><img src={saveIcon} width='35px' height='35px' /></button>
                        }
                        {((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1) || (Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) || (Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) || (Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) || (Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4)) &&
                            <button type="button" class="btn" data-toggle="tooltip" data-placement="bottom" title="Proceed to Supervisor" disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1) || (Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) || (Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) || (Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) || (Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4)) ? "" : "disabled"} onClick={this.checkEmpty}><img src={proceedIcon} width='35px' height='35px' /></button>
                        }
                    </div>
                </div>


                {this.state.objectives.map((obj, index) => {
                    return (
                        <div className="sheetBorder ml-1 mt-3 mr-2 mb-2">
                            <form class="ml-2 mr-2 mt-2">
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label for="obj"><h6>Objective {obj.objID}:</h6></label>
                                        <textarea class="form-control mb-1" id="obj" rows="2" value={obj.obj} onChange={(e) => this.textChange(e, obj)} disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1)) ? "" : "disabled"} />
                                        <label for="milestone"><h6>Milestones:</h6></label>
                                        <textarea class="form-control mb-1" id="milestone" rows="6" value={obj.milestone} onChange={(e) => this.textChange(e, obj)} disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1) || (Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) || (Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) || (Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) || (Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4)) ? "" : "disabled"} />
                                        <div class="input-group">
                                            <span class="input-group-text">Objective Weight %</span>
                                            <input id="percentageW" type="text" class="form-control" value={obj.percentageW} onChange={(e) => this.weightChange(e, obj)} disabled={((Number(this.state.pmsStatus) === 0) || (Number(this.state.pmsStatus) === 1)) ? "" : "disabled"} />
                                        </div>
                                    </div>
                                    <div class="form-group col-md-4" id="input3">
                                        <label for="input3"><h6>Employee Comments:</h6></label>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q1</span>
                                            </div>
                                            <textarea id="empQ1" class="form-control" aria-label="Employee Q1" rows="2" value={obj.empQ1} onChange={(e) => this.textChange(e, obj)} disabled={(Number(this.state.pmsStatus) === 3 && this.state.generalStatus > 1) ? "" : "disabled"}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q2</span>
                                            </div>
                                            <textarea id="empQ2" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ2} onChange={(e) => this.textChange(e, obj)} disabled={(Number(this.state.pmsStatus) === 5 && this.state.generalStatus > 2) ? "" : "disabled"}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q3</span>
                                            </div>
                                            <textarea id="empQ3" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ3} onChange={(e) => this.textChange(e, obj)} disabled={(Number(this.state.pmsStatus) === 7 && this.state.generalStatus > 3) ? "" : "disabled"}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q4</span>
                                            </div>
                                            <textarea id="empQ4" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ4} onChange={(e) => this.textChange(e, obj)} disabled={(Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4) ? "" : "disabled"}></textarea>
                                        </div>

                                        <div class="input-group-prepend mb-1">
                                            <span class="input-group-text">Final Score</span>
                                            <input id="empScore" class="form-control" value={obj.empScore} onChange={(e) => this.inputChange(e, obj)} disabled={(Number(this.state.pmsStatus) === 9 && this.state.generalStatus > 4) ? "" : "disabled"}/>
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Final Weight</span>
                                            <input id="empFinalW" class="form-control" value={obj.percentageW * obj.empScore / 100} disabled = "disabled" />
                                        </div>

                                    </div>
                                    <div class="form-group col-md-4" id="input4">
                                        <label for="input4"><h6>Supervisor Comments:</h6></label>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q1</span>
                                            </div>
                                            <textarea id="supQ1" class="form-control" aria-label="Supervisor Q1" rows="2" value={obj.supQ1} onChange={(e) => this.textChange(e, obj)} disabled="disabled"></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q2</span>
                                            </div>
                                            <textarea id="supQ2" class="form-control" aria-label="Supervisor Q2" rows="2" value={obj.supQ2} onChange={(e) => this.textChange(e, obj)} disabled="disabled"></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q3</span>
                                            </div>
                                            <textarea id="supQ3" class="form-control" aria-label="Supervisor Q3" rows="2" value={obj.supQ3} onChange={(e) => this.textChange(e, obj)} disabled="disabled"></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q4</span>
                                            </div>
                                            <textarea id="supQ4" class="form-control" aria-label="Supervisor Q4" rows="2" value={obj.supQ4} onChange={(e) => this.textChange(e, obj)} disabled="disabled"></textarea>
                                        </div>

                                        <div class="input-group-prepend mb-1">
                                            <span class="input-group-text">Final Score</span>
                                            <input id="supScore" class="form-control" value={obj.supScore} onChange={(e) => this.inputChange(e, obj)} disabled="disabled"/>
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Final Weight</span>
                                            <input id="supFinalW" class="form-control" value={obj.percentageW * obj.supScore / 100} disabled="disabled"/>
                                        </div>

                                    </div>
                                </div>

                                {/* <div class="form-row mb-1 ">
                                    <div class="input-group mb-1 d-flex justify-content-around" >
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Objective Weight %</span>
                                            <input type="text" class="form-control" />
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Objective Score</span>
                                            <input class="form-control" />
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Objective Weight</span>
                                            <input class="form-control" />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-row mb-1 ">
                                    <div class="input-group mb-1 d-flex justify-content-around" >
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Objective Score</span>
                                            <input class="form-control" />
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Objective Weight</span>
                                            <input class="form-control" />
                                        </div>
                                    </div>
                                </div> */}

                                <div class="form-row mb-1 d-flex justify-content-end">
                                    {(this.state.pmsStatus === 0 || this.state.pmsStatus === 1) &&
                                        <button type="button" class="btn-sm pBackground tButton" data-toggle="tooltip" data-placement="bottom" title="Delete Objective" value={index} onClick={() => this.deleteObjective(index)} disabled={((Number(this.state.pmsStatus) !== 0) && (Number(this.state.pmsStatus) !== 1)) ? "disabled" : ""}><img src={deleteIcon} width='20px' height='20px' /></button>
                                    }
                                </div>

                            </form>
                        </div>
                    )
                })}



                {this.state.blockPage ?
                    <div class = "fadingPage">
                    <div class="d-flex justify-content-center align-items-center fadingSpinnerOut">
                        <div class="fadingSpinnerIn d-flex justify-content-center align-items-center" role="status">
                            <span class="spinner-border text-pBackground spinSize" role="status"></span>
                            <h5 className="spinFont">Please Wait... </h5>
                        </div>
                        </div>
                        </div>
                    : null}

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
        sup2ID: state.newUser.sup2ID,
        createUserState: state.newUser,
        year: state.newUser.year,
        HrGeneralStatus: state.newUser.HrGeneralStatus
    };
}

export default connect(mapStateToProps, { createUser })(Objective);
