import React from 'react';
import '../Styling/Common.css'
import FirstHeader from './FirstHeader'
import SecondHeader from './SecondHeader'

class AllHeaders extends React.Component {

    constructor(props) {
        super(props)
    }



    render() {
        return (

            <div className="allHeaders">
                <FirstHeader />
                <SecondHeader/>
            </div>
  
        );
    }
}


export default AllHeaders;