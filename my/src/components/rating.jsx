

import axios from 'axios'
import { useEffect, useState } from "react";




const Rating = ()=>{
    const [title , setTitle] =useState("")
const [appRating , setAppRating] =useState([])
const [yourRating , setYourRating] =useState(0)
const [movie , setMovie] = useState([])
const [toggleRefresh, setToggleRefresh] = useState(true)

const [editRating , setEditRating] = useState(null)

useEffect(()=>{
  setAppRating((appRating + yourRating)/2)
},[yourRating])
    const submitHandler =(e)=>{

      e.preventDefault()
        axios.post('http://localhost:5000/rating', {
            title : title,
            yourRating : yourRating,
            appRating : appRating,
          })
          .then(function (response) {
            console.log(response.data.message);
            setToggleRefresh(!toggleRefresh)
          })
          .catch(function (error) {
            console.log(error.data.message);
          });
    }

    const deleteHandler =(id)=>{
      axios({
        url: `http://localhost:5000/rating/${id}`,
        // url: `https://storage-bucket-production.up.railway.app/product/${eachProduct._id}`,
        method: "delete",

      })
        .then(function (response) {
          console.log(response.data.message)
          setToggleRefresh(!toggleRefresh)
        
       
        })
        .catch(function (error) {
          console.log('error', error)
        })
    }

    useEffect(() => {

      let getAllUsers = async () => {
        //  let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
        let response = await axios.get('http://localhost:5000/ratings');
  
        setMovie(response.data.data)

        console.log(response.data.data)
      }
      getAllUsers();
  
    }, [toggleRefresh])


   const editHandler=()=>{
    axios.put(`http://localhost:5000/rating/${editRating?._id}`,

    // axios.put(`https://storage-bucket-production.up.railway.app/product/${editProduct?._id}`,
    {
      title: editRating.title,
      appRating: editRating.appRating,
      yourRating: editRating.yourRating,

    }
  )
    .then(function (response) {
      console.log("updated: ", response.data);

      setToggleRefresh(!toggleRefresh);
      setEditRating(null);

    })


    .catch(function (e) {
      console.log("Error in api call: ", e);

    })
   }
     
    return(
   <div>
   
   <form onSubmit={submitHandler}>
   title : <input type="text"  onChange={(e)=>{
    setTitle(e.target.value )
   }}/> <br />
   App rating : <input type="number" min={1} max={10}
   onChange={(e)=>{
    setAppRating((e.target.value + yourRating) / 2)
   }}
   /> <br />
   rate here : <input type="number" min={1} max={10}
   onChange={(e)=>{
    setYourRating(e.target.value)
   }}
   ></input> 
   <button>rate</button>
   </form>

   <hr />

   {(editRating !== null)? 
   <form onSubmit={editHandler}>
    title <input type="text" value={editRating.title} onChange={(e)=>{
      setEditRating({...editRating , title :e.target.value})
    }} />

    appRating  <input type="number" value={editRating.appRating} onChange={(e)=>{
      setEditRating({...editRating , appRating :e.target.value})
    }} />

    yourRating :  <input type="number" value={editRating.yourRating} onChange={(e)=>{
      setEditRating({...editRating , yourRating :e.target.value})
    }} />

    <button>edit</button>
   </form> : null


   }
    {
          movie.map((item,index)=>
        <div   key = {index}  >
         <h2>{item.title}</h2>
          <p>{item.appRating}</p>
          <p>{item.yourRating}</p>
         <button onClick={()=>deleteHandler(item._id)}>X</button>
        <button onClick={()=>{
          setEditRating({
            _id : item._id,
            title : item.title,
            appRating : item.appRating,
            yourRating : item.yourRating
        })
        }}>edit</button>
        </div>
              ) 
    }
 
   </div>
    )
}


export default Rating;