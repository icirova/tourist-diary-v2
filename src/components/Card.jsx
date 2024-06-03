import "./Card.scss";
import { Link } from "react-router-dom";


const Card = ({id, title, tags, description, notes}) => {

   return (
    <div className="card">
      <p className="card__id">{id}</p>
      <h1 className="title">{title}</h1>

      <div className="tags">
        {tags.map((tag, index) => (
          <img className="tag" key={index} src={tag} alt="tag" />
        ))}</div>

      <p className="perex">{description}</p>

      <div className="notes">
      {notes.map((paragraf, index) => (
        <p className="notes__paragraf" key={index}>{paragraf}</p>
      ))}

      </div>
      

      <Link to={`/detail/${id}`} className="btn">Více</Link>
      
    </div>
  );
};

export default Card;
