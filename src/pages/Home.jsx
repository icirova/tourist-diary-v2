import "./Home.scss"
import Card from "../components/Card"
import data from "../data"
import CardForm from "../components/CardForm"
import { useState } from "react"
import MapWithForm from "../components/MapWithForm"


const Home = () => {

    const [cardsData, setCardsData] = useState(data);

    const addCard = (newCard) => {
      const newLocation = {
        id: locations.length + 1,
        title: newCard.title,
        lat: parseFloat(newCard.lat),
        lng: parseFloat(newCard.lng),
        description: newCard.description,
      };
      setCardsData([newCard, ...cardsData]);
      setLocations([...locations, newLocation]);
    };

    const [locations, setLocations] = useState(data);


    return <div className="container">

        <div>
          <MapWithForm locations={locations}/>
           
        </div>

        <CardForm addCard={addCard} />
        
        <div className="cards">
        {
            cardsData.map ( (oneCard) => {
                const {id, title, tags, description} = oneCard
    
                return(    
                    <Card key={id} id={id} title={title} tags={tags} description={description}></Card>     
                )
            })
        }
        </div>
        
        </div>
  }
  
  export default Home