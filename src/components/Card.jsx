import "./Card.scss";
import { Link } from "react-router-dom";


const Card = ({id, title, tags=[], description, notes}) => {

  

   return (
    <div className="card">
      <p className="card__id">{id}</p>
      <h1 className="title">{title}</h1>

      <div className="tags">
        {tags.map((tag, index) => (
          <img className="tag" key={index} src={tag} alt="tag" />
        ))}</div>

      <div className="perex">
        {description.map((paragraph, index) => (
          <p className="paragraph" key={index}>{paragraph}</p>
        ) )}
      </div>
      

      <div className="notes">
      {notes.map((paragraph, index) => (
        <p className="paragraph" key={index}>{paragraph}</p>
      ))}

      </div>
      

      <Link to={`/detail/${id}`} className="btn">Více</Link>
      
    </div>
  );
};

export default Card;
