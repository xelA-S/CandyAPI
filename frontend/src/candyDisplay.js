function CandyDisplay({candies,addOneCandy,removeOneCandy, deleteCandy}){

    const showCandy = (candy) => {
        return (
            <tr>
                <th scope="row">{candy.Id}</th>
                <td>{candy.Name}</td>
                <td>{candy.Type}</td>
                <td>{candy.Quantity}</td>
                <td><button className="btn btn-success" onClick={() => addOneCandy(candy)}>Add One</button></td>
                <td><button className="btn btn-warning" onClick={() => removeOneCandy(candy)}>Remove One</button></td>
                <td><button className="btn btn-danger" onClick={() => deleteCandy(candy)}>Delete</button></td>
            </tr> 
        )
        
    }

    return (
        <div className="container">
            <div className="row">
                <h2>Candy List</h2>
            </div>
            <div className="row">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Increment</th>
                            <th scope="col">Decrement</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candies.map(showCandy)}    
                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default CandyDisplay