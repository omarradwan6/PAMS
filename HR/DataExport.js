import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ExportDetailedExcel from './ExportDetailedExcel'
import ExportStatusExcel from './ExportStatusExcel'


class DataExport extends React.Component {

    constructor(props) {
        super(props)
        this.state = { departments: [], yearList: [], detailedReportDepartment: "All Departments", detailedReportYear: "2021", statusReportDepartment: "All Departments", statusReportYear: "2021", buttonStatusDisabled: false, buttonDetailedDisabled: false}

        this.getDeptList = this.getDeptList.bind(this)
        this.changeStatusSelect = this.changeStatusSelect.bind(this)
        this.changeDetailedSelect = this.changeDetailedSelect.bind(this)
        this.changeStatusYear = this.changeStatusYear.bind(this)
        this.changeDetailedYear = this.changeDetailedYear.bind(this)
        this.toggleStatusButton = this.toggleStatusButton.bind(this)
        this.toggleDetailedButton = this.toggleDetailedButton.bind(this)


    }

    componentDidMount() {

        this.getDeptList()

    }

    getDeptList() {

        axios.get("./EMP_DATA/HrDeptList")
            .then((response) => {
                console.log(response.data)
                this.setState({ departments: response.data.DeptList, yearList:response.data.years })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    changeStatusSelect(e) {

        this.setState({ statusReportDepartment: e.target.value, buttonStatusDisabled: true }, this.toggleStatusButton)
    }

    changeDetailedSelect(e) {

        this.setState({ detailedReportDepartment: e.target.value, buttonDetailedDisabled: true }, this.toggleDetailedButton)
    }

    changeStatusYear(e) {

        this.setState({ statusReportYear: e.target.value, buttonStatusDisabled: true }, this.toggleStatusButton)
    }

    changeDetailedYear(e) {

        this.setState({ detailedReportYear: e.target.value, buttonDetailedDisabled: true },this.toggleDetailedButton)

    }

    toggleDetailedButton() {

        setTimeout(
            () => this.setState({ buttonDetailedDisabled: false }),
            2000
        );

    }

    toggleStatusButton() {

        setTimeout(
            () => this.setState({ buttonStatusDisabled: false }),
            2000
        );

    }


    render() {

        return (
            <div className="d-flex justify-content-between">
                <div class="card flex-grow-1 m-4">
                    <div class="card-body">
                        <h5 class="card-title">Export Detailed Report</h5>
                        <label className="my-2"  for="DetailedYears">Year</label>
                        <select id="DetailedYears" className="form-control" onChange={this.changeDetailedYear}>
                            {this.state.yearList.map((a) => {
                                return <option>{a}</option>
                            }
                            )}
                
                        </select>
                        <label className="my-2"  for="DetailedDepartments">Department</label>
                        <select id="DetailedDepartments" className="form-control" onChange={this.changeDetailedSelect}>
                            <option>All Departments</option>
                            {this.state.departments.map((a) => {
                                return <option>{a}</option>
                            }
                            )}

                        </select>
                        <ExportDetailedExcel disabled={ this.state.buttonDetailedDisabled} department={this.state.detailedReportDepartment} year={ this.state.detailedReportYear}/>
                    </div>
                </div>

                <div class="card flex-grow-1 m-4">
                    <div class="card-body">
                        <h5 class="card-title">Export PAMS Status Report</h5>
                        <label className="my-2" for="StatusYear">Year</label>
                        <select id="StatusYear" class="form-control" onChange={this.changeStatusYear}>
                            {this.state.yearList.map((a) => {
                                return <option>{a}</option>
                            }
                            )}
                     
                        </select>
                        <label className="my-2" for="StatusDepartments">Department</label>
                        <select id="StatusDepartments" class="form-control" onChange={this.changeStatusSelect}>
                            <option>All Departments</option>
                            {this.state.departments.map((a) => {
                                return <option>{a}</option>
                            }
                            )}
                        </select>
                        <ExportStatusExcel disabled={this.state.buttonStatusDisabled } department={this.state.statusReportDepartment} year={ this.state.statusReportYear}/>
                    </div>
                </div>

            </div>
        )
    }
}

export default DataExport