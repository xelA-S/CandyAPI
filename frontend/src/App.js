import {useState, useEffect} from "react"
import CandyDisplay from "./candyDisplay";
import CreateCandy from "./createCandy";
import SearchCandy from "./searchCandy";
function App() {
  const [candies,setCandies] = useState({candies:[]})
  const [backup,setCandies2] = useState({candies:[]})
  const [resultFound,setResult]=useState(true) 

  useEffect(()=>{
    fetch("http://localhost:5000/candy")
    .then((response) => response.json())
    .then((data) =>{
      setCandies({candies:data})
      setCandies2({candies:data})
    } )

  },[])


  const searchCandy = (candy) =>{
    const foundCandy=[]
    const candyList=backup["candies"]
    fetch(`http://localhost:5000/candy/${candy.Id}`)
    .then((response) => {
      if(!response.ok){
        setResult(false)
        setCandies({candies:candyList})
      }
      else{
        response.json()
        .then((data) =>{
          foundCandy.push(data)
          setCandies({candies:foundCandy})
          setResult(true)
        })
      }
    })  
    
  }



  const addNewCandy = (candy) =>{
    let candyList=candies["candies"]
    
    const requestOptions={
      method:"POST"
    }
    fetch(`http://localhost:5000/createCandy?name=${candy.Name}&type=${candy.Type}&quantity=${candy.Quantity}`,requestOptions)
    .then((response) => response.json())
    .then((data) => {
      candyList.push(data)
      setCandies({candies:candyList})
    })
  }

  const incrementCandy = (candy) =>{
    const CandyList=candies["candies"]
    const requestOptions ={
      method:"PATCH"
    }
    fetch(`http://localhost:5000/editCandy?id=${candy.Id}&option=add`,requestOptions)
    const idx = CandyList.indexOf(candy)
    CandyList[idx].Quantity+=1
    setCandies({candies:CandyList})

    
  }


  const decrementCandy= (candy) =>{
    const CandyList=candies["candies"]
    const requestOptions ={
      method:"PATCH"
    }
    fetch(`http://localhost:5000/editCandy?id=${candy.Id}&option=remove`,requestOptions)
    const idx = CandyList.indexOf(candy)
    CandyList[idx].Quantity-=1
    setCandies({candies:CandyList})

    
  }





  const deleteCandy = (candy) => {
    const data=candies["candies"]
    const requestOptions={
      method:"DELETE",
    }

    fetch(`http://localhost:5000/deleteCandy?id=${candy.Id}`,requestOptions)
    .then((response) => {
      if(response.ok){
        const idx = data.indexOf(candy)
        data.splice(idx,1)
        setCandies({candies:data})
      }
    }) 

  }

  return (
    <div className="container">
        <div className="row mt-3">
          <CandyDisplay candies={candies["candies"]}
          removeOneCandy={decrementCandy}
          addOneCandy={incrementCandy}
          deleteCandy={deleteCandy}/>
        </div>
        <div className="row mt-3">
          <SearchCandy searchForCandy={searchCandy} result={resultFound} />
        </div>
        <div className="row mt-3">
          <CreateCandy addCandy={addNewCandy}/>
        </div>
    </div>
  );
}

export default App;
