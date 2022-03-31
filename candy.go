package main

import (
	"database/sql"
	"errors"
	"fmt"
	"io/ioutil"
	"strconv"
	"net/http"


	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)


type Candy struct{
	Id int `json:id`
	Name string `json:name`
	Type string	`json:type`
	Quantity int `json:quantity`
}


func data_info() (string) {

	data, err := ioutil.ReadFile("db.txt")
	if err !=nil{
		panic(err.Error())
	}
	result := string(data)
	
	return result
  }




func main() {
	router := gin.Default()

	router.GET("/candy",getCandy)
	router.GET("/candy/:id",candyById)
	router.POST("/createCandy",createCandy)
	router.PATCH("/editCandy",eatOrAddCandy)
	router.DELETE("/deleteCandy",deleteCandy)
	router.Run("localhost:5000")

	fmt.Println(findCandyById("1"))
	
}


func getCandy(c *gin.Context){



	db , err := sql.Open("mysql", data_info())

	if err != nil{
		panic(err.Error())
	}

	defer db.Close()


	results,err := db.Query("SELECT * FROM candy")
	if err != nil {
		panic(err.Error())
	}

	
	for results.Next(){
		var candy Candy

		err = results.Scan(&candy.Id,&candy.Name,&candy.Type,&candy.Quantity)
		if err != nil{
			panic(err.Error())
		}
		c.IndentedJSON(http.StatusOK,candy)
	}	
	
	

	
}

//finds candy by id from the browser via the findCandyById function 
func candyById (c *gin.Context){
	id:= c.Param("id")
	candy, err := findCandyById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound,gin.H{"message": "Candy not found"}) 
		return
	}

	c.IndentedJSON(http.StatusOK, candy)
}


//returns sql entry for candy related to given id
func findCandyById(id string) (*Candy,error){
	db , err := sql.Open("mysql", data_info())

	if err != nil{
		panic(err.Error())
	}

	defer db.Close()

	id_int, _ := strconv.ParseInt(id,10,64)

	query:=fmt.Sprintf("SELECT * FROM candy WHERE id=%v",id_int)

	results,err := db.Query(query)
	if err != nil {
		return nil,errors.New("Candy not found")

	}
	var candy Candy
	for results.Next(){

		err = results.Scan(&candy.Id,&candy.Name,&candy.Type,&candy.Quantity)
		if err == nil{
			return &candy, nil
		}
	}
	return nil,errors.New("Candy not found")
	
	

}


//creates a new candy entry on sql and returns the list of entries
func createCandy(c *gin.Context){
	candy_name,ok:=c.GetQuery("name")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing name query parameter"})
		return
	}
	candy_type,ok:=c.GetQuery("type")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing type query parameter"})
		return
	}
	candy_quantity,ok:=c.GetQuery("quantity")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing quantity query parameter"})
		return
	}
	// quantity,_:=strconv.ParseInt(candy_quantity,10,64)


	
	db , err := sql.Open("mysql", data_info())

	if err != nil{
		panic(err.Error())
	}

	defer db.Close()

	var query string = fmt.Sprintf("INSERT INTO candy(name,type,quantity) VALUES('%v','%v',%v)",candy_name,candy_type,candy_quantity)

	create, err := db.Query(query)

	if err != nil{
		panic(err.Error())
	}

	defer create.Close()

	getCandy(c)
	

}

//adds/removes one from the quantity of a candy with a specified id in the database
func eatOrAddCandy(c *gin.Context){
	id,ok := c.GetQuery("id")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing id query parameter"})
		return
	}
	candy,err:=findCandyById(id)
	if err != nil {
		c.IndentedJSON(http.StatusNotFound,gin.H{"message": "Candy not found"}) 
		return
	}

	if candy.Quantity <=0{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message": "Candy not available"}) 
		return 

	}

	current_quantity:=candy.Quantity


	option,ok := c.GetQuery("option")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing option query parameter, Options: ['add','remove']"})
		return
	}



	db , err := sql.Open("mysql", data_info())

	if err != nil{
		panic(err.Error())
	}

	defer db.Close()

	var query string
	if option == "add"{
		query = fmt.Sprintf("UPDATE candy SET quantity=%v WHERE id=%v",current_quantity+1,id )
	}
	if option == "remove"{
		query = fmt.Sprintf("UPDATE candy SET quantity=%v WHERE id=%v",current_quantity-1,id )
	}

	eat, err := db.Query(query)

	if err != nil{
		panic(err.Error())
	}

	defer eat.Close()
	
	newcandy,_:=findCandyById(id)
	
	c.IndentedJSON(http.StatusOK,newcandy)

}


//this deletes a candy element from the database
func deleteCandy(c *gin.Context){
	id,ok:=c.GetQuery("id")
	if !ok{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Missing id query parameter"})
		return
	}
	

	db , err := sql.Open("mysql", data_info())

	if err != nil{
		panic(err.Error())
	}

	defer db.Close()


	id_int,_ := strconv.ParseInt(id,10,64)

	query := fmt.Sprintf("DELETE FROM candy where id=%v",id_int)

	_ = query

	// delete, err := db.Query(query)
	delete,_ := db.Query(query)


	if err != nil{
		c.IndentedJSON(http.StatusBadRequest,gin.H{"message":"Candy with given id does not exist"})
	}
	defer delete.Close()


	c.IndentedJSON(http.StatusOK,gin.H{"message":"Candy deleted"})
	c.String(200,"\nthis is a test")
	

}






