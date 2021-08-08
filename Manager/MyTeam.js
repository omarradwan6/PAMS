import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


class MyTeam extends React.Component {

    constructor(props) {
        super(props)

        this.state = { empList: [], employees: [], selectedRow: null, selectedID: null, selectedStatus: null, selectedEmpName: null, selectedMail: null }

        this.getEmpList = this.getEmpList.bind(this)
        this.createEmployees = this.createEmployees.bind(this)
    }


    componentDidMount() {

        this.getEmpList()

    }

    selectRow(event, index, EmpID, Status, EmpName, EmpMail) {

        this.setState({ selectedRow: index, selectedID: EmpID, selectedStatus: Status, selectedEmpName: EmpName, selectedMail: EmpMail })

    }



    getEmpList() {
        axios.get(`./EMP_DATA/ManagerEmpList/${this.props.empID}`)
            .then((response) => {
                this.setState({ empList: response.data }, this.createEmployees)
            })
            .catch((error) => {
                console.log(error)
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

        employees = employees.filter((a) => {
            if (a.Status >= 2) {
                return a
            }
        })


        this.setState({ employees: employees })
    }

    render() {

        return (
            <div className='container-fluid'>

                <table class="table table-sm table-bordered table-hover table-striped text-center">
                    <thead className='pBackground'>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Title</th>
                            <th scope="col">PAMS status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.employees.map((emp, index) => {
                            return (

                                <tr style={this.state.selectedRow === index ? { backgroundColor: "#91AEC1", color: "white" } : {}} onClick={(event) => this.selectRow(event, index, emp.ID, emp.Status, emp.NAME, emp.NETWORKID)}>
                                    <th>{emp.ID}</th>
                                    <td>{emp.NAME}</td>
                                    <td>{emp.DESCRIPTION}</td>
                                    <td>{emp.StatusShortDESC === null ? "Not Created" : emp.StatusShortDESC}</td>
                                    </tr>
                          
                            )
                        }
                        )


                        }


                    </tbody>    
                </table>

                <div className='d-flex justify-content-center'>
                    <Link className={`btn btn-lg pBackground m-2 ${this.state.selectedStatus === null || this.state.selectedStatus === "Not Created" ? "disabled" : ""}`}
                        to={{
                            pathname: `/Manager/EmployeeObjectives/${this.state.selectedID}/`,
                            EmpData: { EmpName: this.state.selectedEmpName, EmpID: this.state.selectedID, EmpPmsStatus: this.state.selectedStatus, EmpMail: this.state.selectedMail },
                            action: "show"
                        }}>
                        Show PAMS</Link>
                </div>

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
        empSup2Name: state.newUser.sup2Name
    };
}


export default connect(mapStateToProps)(MyTeam)