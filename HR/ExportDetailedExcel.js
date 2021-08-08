import React, { Component } from 'react';
import ReactExport from 'react-data-export';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;



class ExportDetailedExcel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            EmployeesData: null, columns: [], data: [], statusLifeCycle: [], EmployeeObjectives: {}, EmployeeMilestones: {},EmpScores:[] }

        this.getExcelData = this.getExcelData.bind(this)
        this.createDataSet = this.createDataSet.bind(this)
    }

    componentDidMount() {

        this.getExcelData()
    }


    componentDidUpdate(prevProps) {

        if (prevProps !== this.props) {
            this.getExcelData()
        }
    }

    getExcelData() {
    

        axios.get('./EMP_DATA/ExcelEmpData', { params: {Year:this.props.year, Department:this.props.department}})
            .then((response) => {
                this.setState({ EmployeesData: response.data.EmpListData, statusLifeCycle: response.data.Status, EmployeeObjectives:response.data.EmployeeObjectives,EmployeeMilestones:response.data.EmployeeMilestones, EmpScores:response.data.EmpScores }, this.createDataSet)
            })
            .catch((error) => {
                console.log(error)

            })
    }

    createDataSet() {

        let columns = [
            { title: "Employee ID", width: { wch: 15 } },
            { title: "Employee", width: { wch: 40 } },
            { title: "Supervisor", width: { wch: 40 } },
            { title: "Manager", width: { wch: 40 } },
            { title: "Department", width: { wch: 20 } },
            { title: "Year", width: { wch: 15 } },
            { title: "Status", width: { wch: 25 } },
            { title: "Objectives", width: { wch: 100 } },
            { title: "Milestones", width: { wch: 100 } },
            { title: "Development needs", width: { wch: 90 } },
            { title: "Training needs", width: { wch: 90 } },
            { title: "Objectives score", width: { wch: 20 } },
            { title: "Competencies score", width: { wch: 20 } },
            { title: "Overall score", width: { wch: 20 } }
        ]


        let Valuedata = this.state.EmployeesData.map((a) => {
            return Object.values(a).map((b) => {
                return { value: b, style: { font: { sz: "10" } } }
            })

        })

        let found = false


        Valuedata.forEach((a) => {
            found=false
            this.state.statusLifeCycle.forEach((b) => {

                if (a[0]["value"] === b.EmpID) {
                    a.push({ value: b.Year, style: { font: { sz: "10" } } })
                    a.push({ value: b.StatusShortDESC, style: { font: { sz: "10" } } })
                    found=true
                }


            })

            Object.keys(this.state.EmployeeObjectives).forEach((b) => {
                if (a[0]["value"] === b) {
                    let objectiveString = "-"+this.state.EmployeeObjectives[b].toString().replaceAll(",", "\n-")
                    a.push({ value: objectiveString, style: { font: { sz: "10" }, alignment: { wrapText: true }}  })
                }
            })

            Object.keys(this.state.EmployeeMilestones).forEach((b) => {
                if (a[0]["value"] === b) {
                    a.push({ value: this.state.EmployeeMilestones[b].toString(), style: { font: { sz: "10" } } })
                }
            })

            this.state.EmpScores.forEach((b) => {

                if (a[0]["value"] === b.EmpID) {
                    a.push({ value: "-", style: { font: { sz: "10" } } })
                    a.push({ value: "-", style: { font: { sz: "10" } } })
                    a.push({ value: b.ObectivesScore, style: { font: { sz: "10" } } })
                    a.push({ value: b.CompetenciesScore, style: { font: { sz: "10" } } })
                    a.push({ value: b.TotalScore, style: { font: { sz: "10" } } })
                }


            })

            if (found === false) {
                a.push({ value: this.props.year, style: { font: { sz: "10" } } })
                a.push({ value: "Not Created", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })
                a.push({ value: "N/A", style: { font: { sz: "10" } } })


            }
 
        }

        )

        this.setState({ columns, data: Valuedata })
    }



    render() {
        return (
            <div className="d-flex justify-content-center m-3">
                <div className="flex-grow-1">
                    <ExcelFile  filename={`${this.props.year} ${this.props.department} PAMS Detailed Report`} element={<button disabled={this.props.disabled ? "disabled" : ""} id="detailExport" className="btn pBackground p-2 b-0" data-toggle="tooltip" data-placement="top" title="Export Detailed Report"><FontAwesomeIcon id="exportIcon" icon={faFileDownload} className="pBackground" width="25px" /></button>}>
                    <ExcelSheet dataSet={[{ columns: this.state.columns, data: this.state.data }]} name="PAMS Detailed Report" />
                    </ExcelFile>
                    </div>
            </div>
        );
    }
}

export default ExportDetailedExcel