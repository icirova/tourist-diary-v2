import "./CardOpen.scss";
import { Link, useParams } from "react-router-dom";
import data from "../data";

const CardOpen = () => {
  const { tripId } = useParams();

  

  const filteredCard = data.find((oneCard) => {
    return oneCard.id === parseInt(tripId);
  });

  if (!filteredCard) {
    return <div>Sorry, the requested card was not found.</div>;
  }


  const { title, tags, notes, description, photo, alt } = filteredCard;

  return (
    <div className="opened-card">

      <h1 className="title ">{title}</h1>
      <p className="tags">{tags}</p>
      <p className="perex">{description}</p>
      {notes.map((oneParagraph, index) => 
      <p key={index} className="description">{oneParagraph}</p>)}
    
      <img className="opened-card__image" src={photo} alt={alt} />

      <Link to="/" className="btn btn--opened-card">
        Zpět
      </Link>
    </div>
  );
};

export default CardOpen;
