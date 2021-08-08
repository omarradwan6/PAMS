import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faFilter, faEdit } from '@fortawesome/free-solid-svg-icons'

class PmsStatusControl extends React.Component {

    constructor(props) {
        super(props)

        this.state = { filteredEmployees: [], empList: [], employees: [], selectedRow: null, selectedID: null, selectedStatus: null, newStatus: null, selectedEmpName: null, selectedMail: null, selectedWorkFlowID: null, departmentsList: [], statusList: [], filteredDepartment: "all", filteredStatus: "all", DropdownStatusValue: "", saveBtnDisabled: false }

        this.getEmpList = this.getEmpList.bind(this)
        this.createEmployees = this.createEmployees.bind(this)
        this.changePmsStatus = this.changePmsStatus.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
        this.filterDepartment = this.filterDepartment.bind(this)
        this.filterStatus = this.filterStatus.bind(this)
        this.getFilteredEmpList = this.getFilteredEmpList.bind(this)
        this.clearFilter = this.clearFilter.bind(this)
        this.changeDropDownPmsStatus = this.changeDropDownPmsStatus.bind(this)
        this.toggleSaveBtn = this.toggleSaveBtn.bind(this)
        this.closeStatusModal = this.closeStatusModal.bind(this)
    }


    componentDidMount() {

        this.getEmpList()
        this.getDeptList()

    }

    getDeptList() {

        axios.get("./EMP_DATA/HrDeptList")
            .then((response) => {
                this.setState({ departmentsList: response.data.DeptList, statusList: response.data.statusNames })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    selectRow(event, index, EmpID, Status, EmpName, EmpMail, statusShortDesc) {
        let currentYear = this.props.year

        this.setState({ selectedRow: index, selectedID: EmpID, selectedStatus: Status, selectedEmpName: EmpName, selectedMail: EmpMail, selectedWorkFlowID: EmpID + currentYear })

    }

    filterDepartment(department) {

        this.setState({ filteredDepartment: department }, this.getFilteredEmpList)
    }

    filterStatus(status) {

        this.setState({ filteredStatus: status }, this.getFilteredEmpList)
    }

    clearFilter(column) {
        if (column === "dept") {
            this.setState({ filteredDepartment: "all" })
        }
        else if (column === "status") {
            this.setState({ filteredStatus: "all" })
        }

        this.setState({ filteredEmployees: this.state.employees }, this.getFilteredEmpList)
    }

    getFilteredEmpList() {
        let newEmployees = []
        let filledArray = false

        if (this.state.filteredDepartment !== "all") {

            newEmployees = this.state.employees.filter((a) => {
                return a.DEPT === this.state.filteredDepartment

            })
            filledArray = true
        }

        if (this.state.filteredStatus !== "all") {
            if (filledArray === true) {
                newEmployees = newEmployees.filter((a) => {

                    if (a.StatusShortDESC === null) {

                        return "Not Created" === this.state.filteredStatus

                    }
                    return a.StatusShortDESC === this.state.filteredStatus
                })
            }

            else {

                newEmployees = this.state.employees.filter((a) => {
                    return a.StatusShortDESC === this.state.filteredStatus

                })
            }


        }

        if (this.state.filteredStatus === "all" && this.state.filteredDepartment === "all") {
            newEmployees = this.state.employees
        }


        this.setState({ filteredEmployees: newEmployees })


    }

    sendEmail(newPmsStatus) {


        axios.get('./Email/sendMailtoUser', { params: { newPmsStatus, empMail: this.state.selectedMail, actionBy: "Hr" } })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })

    }



    getEmpList() {
        axios.get('./EMP_DATA/HrList')
            .then((response) => {
                this.setState({ empList: response.data }, this.createEmployees)
            })
            .catch((error) => {
                console.log(error)
            })

    }

    toggleSaveBtn() {

        setTimeout(() => {
            this.setState({ saveBtnDisabled: false })
        }, 2000);

    }

    closeStatusModal() {
        this.setState({ selectedRow: null, selectedID: null, selectedStatus: null, selectedEmpName: null, selectedMail: null, selectedWorkFlowID: null })
    }

    changeDropDownPmsStatus(value, index) {


        this.setState({ newStatus: index, DropdownStatusValue: value, saveBtnDisabled: true }, this.toggleSaveBtn)


    }

    changePmsStatus(newPmsStatus) {
        let currentYear = this.props.year

        axios.get("./Objectives_/HrPmsStatus", { params: { workFlowID: this.state.selectedWorkFlowID, pmsStatus: newPmsStatus, EmpID: this.state.selectedID, ID: this.props.empID, Year: currentYear, HrName: this.props.userName } })
            .then((response) => {
                alert(response.data["result"])
                this.sendEmail(newPmsStatus)
                this.setState({ empPmsStatus: response.data["newPmsStatus"] }, this.getEmpList())

            })
            .catch((error) => {
                console.log(error)
                alert("Error encountered")
            })


    }

    createEmployees() {

        let employees = this.state.empList.EmpListData.map((a) => {

            return { ...a, EmpID: null, Status: 0, Year: null, StatusShortDESC: null }

        })

        employees.forEach((a) => {

            this.state.empList.PmsStatus.forEach((b) => {

                if (a.ID === b.EmpID) {

                    a.Status = b.Status
                    a.StatusShortDESC = b.StatusShortDESC
                    a.Year = b.Year
                    a.EmpID = b.EmpID

                }

            })

        })


        this.setState({ employees: employees, filteredEmployees: employees })

    }

    render() {

        return (
            <div className='container-fluid  my-3'>
                <table class="table table-sm table-bordered table-hover table-striped text-center">
                    <thead className='pBackground'>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Title</th>
                            <th scope="col">Department
                               <span class="dropdown">
                                    <button data-toggle="tooltip" data-placement="top" title="Filter Department" class="btn bpBackground" type="button" id="dropdownDeptButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <FontAwesomeIcon /*id="personIcon"*/ icon={faFilter} className="pBackground" width="25px" />
                                    </button>
                                    <div className="dropdown-menu" id="departmentListDropdown" aria-labelledby="dropdownDeptButton">
                                        {this.state.departmentsList.map((a) => {
                                            return <button onClick={() => this.filterDepartment(a)} className="dropdown-item">{a}</button>
                                        }
                                        )}
                                    </div>
                                </span>

                                <button data-toggle="tooltip" data-placement="top" title="Clear Filter" onClick={() => this.clearFilter("dept")} class="btn bpBackground Clear" type="button" >
                                    <span><FontAwesomeIcon /*id="personIcon"*/ icon={faMinus} className="pBackground" width="25px" /></span>
                                </button>

                            </th>
                            <th scope="col">Supervisor Name</th>
                            <th scope="col">Supervisor ID</th>
                            <th scope="col">PAMS status
                                <span class="dropdown">
                                    <button data-toggle="tooltip" data-placement="top" title="Filter PAMS Status" className="btn bpBackground" type="button" id="dropdownStatusButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <FontAwesomeIcon /*id="personIcon"*/ icon={faFilter} className="pBackground" width="25px" />
                                    </button>
                                    <div class="dropdown-menu" id="statusListDropdown" aria-labelledby="dropdownStatusButton">
                                        {this.state.statusList.map((a) => {
                                            return <button onClick={() => this.filterStatus(a)} className="dropdown-item">{a}</button>
                                        }
                                        )}
                                    </div>
                                </span>

                                <button data-toggle="tooltip" data-placement="top" title="Clear Filter" onClick={() => this.clearFilter("status")} class="btn bpBackground Clear" type="button" >
                                    <span><FontAwesomeIcon /*id="personIcon"*/ icon={faMinus} className="pBackground" width="25px" /></span>
                                </button>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filteredEmployees.map((emp, index) => {
                            return (


                                <tr className={this.state.selectedRow === index ? "selectedRow" : ""} style={this.state.selectedRow === index ? { backgroundColor: "#91AEC1", color: "white" } : {}} onClick={(event) => this.selectRow(event, index, emp.ID, emp.Status, emp.NAME, emp.NETWORKID, emp.StatusShortDESC)}>
                                    <th>{emp.ID}</th>
                                    <td>{emp.NAME}</td>
                                    <td>{emp.DESCRIPTION}</td>
                                    <td>{emp.DEPT}</td>
                                    <td>{emp.SUP1_NAME}</td>
                                    <td>{emp.SUP1ID}</td>

                                    <td>
                                        {emp.StatusShortDESC !== null ?

                                            < div class="dropdown">
                                                <li class="nav-item dropdown-toggle" data-toggle="dropdown" role="presentation" id="dropdownStatusButton">
                                                    <Link role="tab" >{emp.StatusShortDESC}</Link>
                                                </li>

                                                <div class="dropdown-menu" aria-labelledby="dropdownStatusButton">
                                                    <Link onClick={() => this.changePmsStatus(1)} className="dropdown-item hrList" >1- Employee PAMS created</Link>
                                                    <Link onClick={() => this.changePmsStatus(2)} className="dropdown-item hrList" >2- Objectives Awaiting Approval</Link>
                                                    <Link onClick={() => this.changePmsStatus(3)} className="dropdown-item hrList" >3- Objectives Approved / Employee Q1 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(4)} className="dropdown-item hrList" >4- Supervisor Q1 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(5)} className="dropdown-item hrList" >5- Q1 Completed / Employee Q2 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(6)} className="dropdown-item hrList" >6- Supervisor Q2 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(7)} className="dropdown-item hrList" >7- Q2 Completed / Employee Q3 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(8)} className="dropdown-item hrList" >8- Supervisor Q3 Comments</Link>
                                                    <Link onClick={() => this.changePmsStatus(9)} className="dropdown-item hrList" >9- Q3 Completed / Employee Q4 Input</Link>

                                                </div>
                                            </div>

                                            : "Not Created"
                                        }


                                    </td>

                                </tr>


                            )
                        }
                        )


                        }


                    </tbody>
                </table>

            </div>
        )
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
        year:state.newUser.year
    };
}


export default connect(mapStateToProps)(PmsStatusControl)