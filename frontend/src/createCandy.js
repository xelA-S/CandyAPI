import {useState} from "react"


function CreateCandy(props){
    const [name,setName]=useState("")
    const [type,setType]=useState("")
    const [quantity,setQuantity]=useState(0)

    const AddCandyButtonPressed = () =>{
        props.addCandy({
            Name:name,
            Type:type,
            Quantity:quantity
        })
            setName("")
            setType("")
            setQuantity(0)
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <h2>Add a Candy</h2>
            </div>
            <div className="row">

                <label htmlFor="name-input">Name:</label>
                <input type="text" className="form-control" value={name} id="name-input" onChange={(e) => setName(e.target.value)}></input>
            
                <label htmlFor="type-input">Type:</label>
                <input type="text" className="form-control" value={type} id="type-input" onChange={(e) => setType(e.target.value)}></input>
        
                <label htmlFor="quantity-input">Quantity:</label>
                <input type="number" className="form-control" value={quantity} id="quantity-input" onChange={(e) => setQuantity(e.target.value)}></input>
            </div>    
            <div className="row mt-3">
            <div className="col-4"/>
                <button type="button" className="btn btn-primary col-4 mb-3" onClick={AddCandyButtonPressed} >Add Candy</button>
            </div>
        </div>
    )


}

export default CreateCandy