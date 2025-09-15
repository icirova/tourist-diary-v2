import PropTypes from 'prop-types';
import "./Card.scss";
import { Link } from "react-router-dom";
import TagBadge from './TagBadge';
import { KEY_BY_ICON } from '../tags';


const Card = ({id, title, tags=[], description, notes}) => {

  

   return (
    <div className="card">
      {/* <p className="card__id">{id}</p> */}
      <h1 className="title">{title}</h1>

      <div className="tags">
        {tags.map((icon, index) => {
          const keyName = KEY_BY_ICON[icon];
          if (keyName) {
            return <TagBadge key={`${keyName}-${index}`} keyName={keyName} compact />;
          }
          return <img className="tag" key={`${icon}-${index}`} src={icon} alt="tag" title="Tag"/>;
        })}
      </div>

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
      

      <Link to={`/detail/${id}`} className="btn btn--primary">Detail</Link>
      
    </div>
  );
};

// Přidání PropTypes pro validaci props
Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string), // pokud description je pole řetězců
    PropTypes.string // pokud přijde jako obyčejný řetězec
  ]),
  notes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ])
};

export default Card;
