import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


class Home extends React.Component {

    constructor(props) {
        super(props)
    
       
    }



    render() {

        return (
            <div className={"homeDiv " + (this.props.match.path === "/" ? "" : "none")}> </div>
            

        )
    }






}


export default Home