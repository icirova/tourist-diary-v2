import "./CardOpen.css";
import { Link, useParams } from "react-router-dom";
import data from "../data";

const CardOpen = () => {
  const { tripId } = useParams();

  const filteredCard = data.find((oneCard) => {
    return oneCard.id === parseInt(tripId);
  });

  const { title, tags, perex, description, photo, alt } = filteredCard;

  return (
    <div className="opened-card">

      <h1 className="title ">{title}</h1>
      <p className="tags">{tags}</p>
      <p className="perex">{perex}</p>
      <p className="description">{description}</p>
      <img className="opened-card__image" src={photo} alt={alt} />

      <Link to="/" className="btn btn--opened-card">
        Zpět
      </Link>
    </div>
  );
};

export default CardOpen;
