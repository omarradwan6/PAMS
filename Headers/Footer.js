import React from 'react';
import '../Styling/Common.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";



class Footer extends React.Component {

    constructor(props) {
        super(props)
    }





    render() {
        return (


            <div className="p-0 Footer text-center d-flex flex-column align-content-center justify-content-center">

                <p className="footerText">PARTNERS in SUCCESS</p>
                <p className="m-0 copyright">© PGESCo Human Resources Department</p>
            </div>




        );
    }
}


export default Footer;