import "./Sidebar.scss";
import { TAGS } from "../tags";



const Sidebar = () => {
  return <div className="explanations">
    
    <h2 className="title">Vysvětlivky:</h2>
    
    <div className="explanations__content">
      {TAGS.map((tag) => (
        <div key={tag.key} className="explanations__item">
          <p className="explanations__text">{tag.label}</p>
          <img className="explanations__img" src={tag.icon} alt={tag.key} />
        </div>
      ))}
    </div>

  
    
</div>
 
}

export default Sidebar
