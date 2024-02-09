import "./Card.css";
import { Link } from "react-router-dom";

const Card = ({id, title, tags, perex}) => {



   return (
    <div className="card">
      <h1 className="title">{title}</h1>
      <p className="tags">{tags}</p>
      <p className="perex">{perex}</p>

      <Link to={`/detail/${id}`} className="btn">Více</Link>
      
    </div>
  );
};

export default Card;
