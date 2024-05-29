import "./Card.scss";
import { Link } from "react-router-dom";

const Card = ({id, title, lat, tags, description}) => {

   return (
    <div className="card">
      <h1 className="title">{title}</h1>
      <p className="pin">{lat}</p>
      <p className="tags">{tags}</p>
      <p className="perex">{description}</p>

      <Link to={`/detail/${id}`} className="btn">Více</Link>
      
    </div>
  );
};

export default Card;
