import "./Card.css";
import data from "../data"
import { useState } from "react"

const Card = (props) => {

const [cardList, setCardList] = useState(data)

const openOneCard = (idecko) => {
  const filteredCards = cardList.filter( (oneCard) => {
    return oneCard.id === idecko
})

setCardList(filteredCards)
  console.log(filteredCards)
}

const {id, title, tags, perex} = props

   return (
    <div className="card">
      <h1 className="title">{title}</h1>
      <p className="tags">{tags}</p>
      <p className="perex">{perex}</p>

      <button className="btn" onClick={() => openOneCard(id)}>Detail</button>
      
    </div>
  );
};

export default Card;
