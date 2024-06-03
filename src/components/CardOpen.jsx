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

      <div className="tags">
        {tags.map((tag, index) => (
          <img className="tag" key={index} src={tag} alt="tag" />
        ))}</div>



      <p className="perex">{description}</p>
      {notes.map((oneParagraph, index) => 
      <p key={index} className="description">{oneParagraph}</p>)}
    

      <Link to="/" className="btn btn--opened-card">
        Zpět
      </Link>
    </div>
  );
};

export default CardOpen;
