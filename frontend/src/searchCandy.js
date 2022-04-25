import {useState} from "react"

function SearchCandy(props){
    const [Id,setID]=useState(0)
    
    const searchCandyButtonClicked=() => {
        props.searchForCandy({
            Id:Id
        })
        setID(0)
    }



    return (
        <div className="container">
            <div className="row">
                <h2>Search for a candy</h2>
            </div>
            <div className="row">
                <label htmlFor="id-input">ID:</label>
                <input id="id-input" type="number" className="form-control" value={Id} onChange={(e) => setID(e.target.value) }/>
            </div>
            {!props.result ? <h5>Candy not found. Please try again.</h5> : ""}
            <div className="row mt-3">
                <div className="col-4"/>
                <button type="button" className="btn col-4 btn-primary" onClick={searchCandyButtonClicked}>Search</button>
            </div>
        </div>
    )

}

export default SearchCandy