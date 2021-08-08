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


class Competencies extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            Competencies: [],
            pmsStatus: 0,
            emptyFields: false,
            blockPage: false,

        };

        this.getPmsStatus = this.getPmsStatus.bind(this)

    }

    componentDidMount() {

        this.setState({ blockPage: true })

        axios.get('./Objectives_/GetCompetencies', {
            params: {
                empID: this.props.empID,
            }
        })
            .then((response) => {
                if (response.data === "Can't get competencies") {

                    alert('Can not get your Competencies! \nPlease contact your system admin')

                    this.setState({ blockPage: false })

                } else {
                    console.log(response.data)
                    var cList = response.data
                    var newList = []
                    cList.map((j) => {

                        newList.push({ compID: j.Number, comp: j.Competency, desc: j.Behavioral, empScore: 0, supScore: 0, comments: '' })

                    })
                    this.setState({ Competencies: newList, blockPage: false })
                }
                                  
            })
            .catch((error) => {
                // handle error
                console.log("error", error);
                this.setState({ blockPage: false })
            })

        this.getPmsStatus()

    }

    getPmsStatus() {

        var currentYear = new Date().getFullYear();
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


    render() {

        return (

            <div className='container-fluid  mt-3'>

                <div class="alert alert-info mb-3">
                    <strong>Info!</strong> This section will be available for edit at the end of the year.
                </div>

                <table class="table table-bordered table-hover table-striped">
                    <thead className='pBackground text-center'>
                        <tr>
                            <th data-width="100" scope="col">#</th>
                            <th data-width="300" scope="col">Competency</th>
                            <th data-width="600" scope="col">Behavioral Indicators</th>
                            <th data-width="300" scope="col">Employee Score</th>
                            <th data-width="300" scope="col">Supervisor Score</th>
                            <th data-width="300" scope="col">Comments/Evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Competencies.map((comp, index) => {
                            return (
                                <tr>
                                    <td className='text-center'>{index + 1}</td>
                                    <th className='text-center'>{comp.comp}</th>
                                    <td>{comp.desc}</td>
                                    <td className='text-center'>{comp.empScore}</td>
                                    <td className='text-center'>{comp.supScore}</td>
                                    <td>{comp.comments}</td>
                                </tr>
                            )
                          })
                        }
                    </tbody>
                </table>

                {this.state.blockPage ?
                    <div class="fadingPage">
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
        createUserState: state.newUser
    };
}

export default connect(mapStateToProps, { createUser })(Competencies);
