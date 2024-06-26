import "./Home.scss"
import Card from "../components/Card"
import data from "../data"
import CardForm from "../components/CardForm"
import { useState } from "react"
import Map from "../components/Map"
import Sidebar from "../components/Sidebar"


const Home = () => {

    // const [cardsData, setCardsData] = useState(data);

    // const addCard = (newCard) => {

     

    //   const newLocation = {
        
    //     id: locations.length + 1,
    //     title: newCard.title,
    //     lat: parseFloat(newCard.lat),
    //     lng: parseFloat(newCard.lng),
    //     tags: newCard.tags,
    //     description: newCard.description,

        
    //   };

      


    //   // Zahrnutí tagů do nové karty
    //   const updatedCardData = {
    //     id: cardsData.length + 1,
    //     title: newCard.title,
    //     tags: newCard.tags,
    //     description: newCard.description,
    //   };

      
    //   setCardsData([updatedCardData, ...cardsData]);
    //   setLocations([...locations, newLocation]);
    // };

    const [locations, setLocations] = useState(data);


    return <div className="container">

      {/* mapa s piny */}
      <Map locations={locations}/>

      {/* formulář pro zadávání nových karet */}
      <CardForm />
        
      {/* Vypisování karet z dat z data.jsx */}
      <div className="cards">
        {
            data.map ( (oneCard) => {
                const {id, title, tags, description, notes} = oneCard

    
                return(    
                    <Card key={id} id={id} title={title} tags={tags} description={description} notes={notes}></Card> 
                        
                )
            })
        }
        </div>

        {/* Vysvětlivky */}
      <Sidebar />
        
    </div>
  }
  
  export default Home