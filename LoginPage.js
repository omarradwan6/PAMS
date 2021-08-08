import React from 'react';
import './Styling/Common.css'

class LoginPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = { username: "", password: "" }

        this.onSignIn = this.onSignIn.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeUser = this.onChangeUser.bind(this)

    }


    onChangeUser(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }



    onSignIn(e, username1, password1) {
        this.props.onSignIn(e,username1,password1)
    }




    render() {
        return (
            <div className="d-flex align-items-center Login-background">
                <div class="container-fluid">
                    <div
                        className='d-flex justify-content-center'
                    >
                        <form>
                            <div class="text-center col-sm-12">
                                <h4 style={{ color: 'white' }}>Performance Appraisal & Management System</h4>
                            </div>

                            <div class="col-sm-12 mt-3">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Username"
                                    onChange={this.onChangeUser}

                                />
                            </div>

                            <div class="col-sm-12 mt-3">
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Password"
                                    onChange={this.onChangePassword}

                                />
                            </div>
                            <div class="d-flex justify-content-center col-sm-12 mt-3">
                                <button onClick={(e) => this.onSignIn(e, this.state.username, this.state.password)} type="submit" className="btn btn-light ">
                                    Sign-In
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default LoginPage;