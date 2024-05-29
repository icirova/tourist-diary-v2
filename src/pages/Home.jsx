import "./Home.scss"
import Card from "../components/Card"
import data from "../data"
import CardForm from "../components/CardForm"
import MapComponent from "../components/MapComponent"
import { useState } from "react"
import MapWithForm from "../components/MapWithForm"


const Home = () => {

    const [cardsData, setCardsData] = useState(data);

    const addCard = (newCard) => {
      setCardsData([newCard, ...cardsData]);
    };

    const [locations, setLocations] = useState([
        { lat: 50.087, lng: 14.421, name: 'Praha' },
        { lat: 50.0755, lng: 14.4378, name: 'Karlův most' },
        // přidat další lokace zde
      ]);
    
      const handleAddLocation = () => {
        const newLocation = { lat: 50.088, lng: 14.420, name: 'Nová Lokace' };
        setLocations([...locations, newLocation]);
      };


    return <div className="container">

        <div>
          <MapWithForm />
           
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