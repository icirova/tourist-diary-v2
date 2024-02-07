import "./CardOpen.css";


const CardOpen = ({id, title, tags, perex, description, photo, alt}) => {

  

  return (
    <div className="card card--open">

        <h1 className="title">{title }</h1>
        <p className="tags">{tags}</p>
        <p className="perex"> {perex}</p>
        <p className="description"> {description}</p>
        <img className="image" src= {photo} alt= {alt} />

        <button className="btn">Zavřít</button>
        
    </div>
  );
};

export default CardOpen;