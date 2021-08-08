import React from 'react';
import backIcon from '../Employee/Icons/back.svg';
import saveIcon from '../Employee/Icons/save.svg';
import proceedIcon from '../Employee/Icons/next.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import '../Styling/Common.css';
import { connect } from 'react-redux'
import axios from 'axios';




class Employee extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            objectives: [],
            workFlowID: "",
            empID: "",
            year: "",
            empName: "",
            empPmsStatus: null,
            empMail: "",
            action: "",
            creationDate: null,
            lastModifiedDate: null,
            comments:null

        };

        this.getEmployeeObjectives = this.getEmployeeObjectives.bind(this)
        this.getDates = this.getDates.bind(this)

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

    getDates() {
        axios.get('./Objectives_/getDates', {
            params: {
                empID: this.state.empID,
                year: this.state.year
            }
        })
            .then((response) => {
                console.log(response.data)
                this.setState({ creationDate: response.data[0], lastModifiedDate: response.data[1] })
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })
    }




    componentDidMount() {

        let date = new Date();
        let currentYear = this.props.year
        let empID = this.props.location.EmpData["EmpID"]
        let empName = this.props.location.EmpData["EmpName"]
        let empPmsStatus = this.props.location.EmpData["EmpPmsStatus"]
        let empMail = this.props.location.EmpData["EmpMail"]
        let action = this.props.location.action


        this.setState({ empID, year: currentYear, empName, workFlowID: empID + currentYear, empPmsStatus, empMail, action }, this.getEmployeeObjectives)
    }



    getEmployeeObjectives() {

        axios.get('./Objectives_/GetSavedObjectives', {
            params: {
                empID: this.state.empID,
                year: this.state.year
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
                    this.setState({ objectives: newList }, this.getDates())
                }
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
            })


    }






    render() {

        return (
            <div className="ml-2 mt-3 mr-2">
                   
                <h3 className="mt-2">{this.state.empName}</h3>

                <div class="info bg-light d-flex justify-content-around">

                    <span class="bBadge badge pBackground mt-3">Created: {this.state.creationDate}</span>
                    <span class="bBadge badge pBackground mt-3">Last Modified: {this.state.lastModifiedDate}</span>

                </div>

                {this.state.objectives.map((obj) => {
                    return (
                        <div className="sheetBorder ml-1 mt-3 mr-2">
                            <form class="ml-2 mr-2 mt-2">
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label for="obj"><h6>Objective {obj.objID}:</h6></label>
                                        <textarea disabled={true} class="form-control mb-1" id="obj" rows="2" value={obj.obj} onChange={(e) => this.textChange(e, obj)} />
                                        <label for="milestone"><h6>Milestones:</h6></label>
                                        <textarea disabled={true} class="form-control mb-1" id="milestone" rows="6" value={obj.milestone} onChange={(e) => this.textChange(e, obj)} />
                                        <div class="input-group">
                                            <span class="input-group-text">Objective Weight %</span>
                                            <input disabled="disabled" id="percentageW" type="text" class="form-control" value={obj.percentageW} onChange={(e) => this.weightChange(e, obj)} />
                                        </div>
                                    </div>
                                    <div class="form-group col-md-4" id="input3">
                                        <label for="input3"><h6>Employee Comments:</h6></label>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q1</span>
                                            </div>
                                            <textarea disabled={true} id="empQ1" class="form-control" aria-label="Employee Q1" rows="2" value={obj.empQ1} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q2</span>
                                            </div>
                                            <textarea disabled={true} id="empQ2" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ2} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q3</span>
                                            </div>
                                            <textarea disabled={true} id="empQ3" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ3} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q4</span>
                                            </div>
                                            <textarea disabled={true} id="empQ4" class="form-control" aria-label="Employee Q2" rows="2" value={obj.empQ4} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>

                                        <div class="input-group-prepend mb-1">
                                            <span class="input-group-text">Final Score</span>
                                            <input disabled={true} id="empScore" class="form-control" value={obj.empScore} onChange={(e) => this.inputChange(e, obj)} />
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Final Weight</span>
                                            <input disabled={true} id="empFinalW" class="form-control" value={obj.percentageW * obj.empScore / 100} />
                                        </div>

                                    </div>
                                    <div class="form-group col-md-4" id="input4">
                                        <label for="input4"><h6>Supervisor Comments:</h6></label>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q1</span>
                                            </div>
                                            <textarea disabled={true} id="supQ1" class="form-control" aria-label="Supervisor Q1" rows="2" value={obj.supQ1} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q2</span>
                                            </div>
                                            <textarea disabled={true} id="supQ2" class="form-control" aria-label="Supervisor Q2" rows="2" value={obj.supQ2} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q3</span>
                                            </div>
                                            <textarea disabled={true} id="supQ3" class="form-control" aria-label="Supervisor Q3" rows="2" value={obj.supQ3} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>
                                        <div class="input-group mb-1" >
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">Q4</span>
                                            </div>
                                            <textarea disabled={true} id="supQ4" class="form-control" aria-label="Supervisor Q4" rows="2" value={obj.supQ4} onChange={(e) => this.textChange(e, obj)}></textarea>
                                        </div>

                                        <div class="input-group-prepend mb-1">
                                            <span class="input-group-text">Final Score</span>
                                            <input disabled={true} id="supScore" class="form-control" value={obj.supScore} onChange={(e) => this.inputChange(e, obj)} />
                                        </div>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">Final Weight</span>
                                            <input disabled={true} id="supFinalW" class="form-control" value={obj.percentageW * obj.supScore / 100} />
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                    )
                })}
            </div>

        );
    }
}



const mapStateToProps = state => {
    return {
        userName: state.newUser.name,
        ID: state.newUser.id,
        year: state.newUser.year,
        HrGeneralStatus:state.newUser.HrGeneralStatus

    };
}

export default connect(mapStateToProps)(Employee);