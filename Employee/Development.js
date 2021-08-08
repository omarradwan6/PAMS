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


class Development extends React.Component {

    constructor(props) {
        super(props)

        this.state = {

            pmsStatus: 0,

        };

        this.getPmsStatus = this.getPmsStatus.bind(this)

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

                <table class="table table-bordered table-hover table-striped text-center">
                    <thead className='pBackground'>
                        <tr>
                            <th scope="col" style={{ width: 30 }}>#</th>
                            <th scope="col">Training Needs</th>
                        </tr>
                    </thead>
                    <tbody>
                                <tr>
                                    <th>1</th>
                                    <td></td>
                        </tr>
                        <tr>
                            <th>2</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>3</th>
                            <td></td>
                        </tr>
              
                    </tbody>
                </table>

                <table class="table table-bordered table-hover table-striped text-center mt-3">
                    <thead className='pBackground'>
                        <tr>
                            <th scope="col" style={{ width: 30 }}>#</th>
                            <th scope="col">Development Needs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>2</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>3</th>
                            <td></td>
                        </tr>

                    </tbody>
                </table>
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

export default connect(mapStateToProps, { createUser })(Development);
