import React, { Component } from 'react';
import ReactExport from 'react-data-export';
import axios from 'axios'
import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;



class ExportStatusExcel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            EmployeesData: null, columns: [], data: [], statusLifeCycle: []
        }

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


        axios.get('./EMP_DATA/ExcelEmpData', { params: { Year: this.props.year, Department: this.props.department } })
            .then((response) => {
                this.setState({ EmployeesData: response.data.EmpListData, statusLifeCycle: response.data.Status }, this.createDataSet)
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
            { title: "Status", width: { wch: 15 } },
            { title: "Year", width: { wch: 15 } }


        ]



        let Valuedata = this.state.EmployeesData.map((a) => {
            return Object.values(a).map((b) => {
                return { value: b, style: { font: { sz: "10" } } }
            })

        })

        let found=false

        Valuedata.forEach((a) => {
            found=false
            this.state.statusLifeCycle.forEach((b) => {

                if (a[0]["value"] === b.EmpID) {
                    a.push({ value: b.StatusShortDESC, style: { font: { sz: "10" } } })
                    a.push({ value: b.Year, style: { font: { sz: "10" } } })
                    found=true
                }


            })

            if (found === false) {
                a.push({ value: "Not Created", style: { font: { sz: "10" } } })
                a.push({ value: this.props.year, style: { font: { sz: "10" } } })


            }
        }

        )
        this.setState({ columns, data: Valuedata })
    }



    render() {
        return (
            <div className="d-flex justify-content-center m-3">
                <div className="flex-grow-1">
                    <ExcelFile filename={`${this.props.year} ${this.props.department} PAMS Status Report`} element={<button disabled={this.props.disabled ? "disabled" : "" } id="statusExport" className=" btn pBackground p-2 b-0" data-toggle="tooltip" data-placement="top" title="Export Status Report"><FontAwesomeIcon id="exportIcon" icon={faFileDownload} className="pBackground" width="25px" /></button>}>
                    <ExcelSheet dataSet={[{ columns: this.state.columns, data: this.state.data }]} name="PAMS Status report" />
                </ExcelFile>
                </div>
            </div>

        );
    }
}


export default ExportStatusExcel