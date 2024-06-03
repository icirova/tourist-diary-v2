import "./Sidebar.scss";
import bag from "/icons/bag.svg";
import bikini from "/icons/bikini.svg" ;
import bonfire from "/icons/bonfire.svg";
import cafe from "/icons/cafe.svg";
import family from "/icons/family.svg";
import stroller from "/icons/stroller.svg";
import tent from "/icons/tent.svg";
import glutenfree from "/icons/gluten-free.svg";



const SideBar = () => {
  return <div className="explanations">
    
    <h2 className="title">Vysvětlivky:</h2>
    
    <div className="explanations__content">

        <div className="explanations__item">
            <p className="explanations__text">Svačinu sebou</p>
            <img className="explanations__img" src={bag} alt="bag"  />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Koupání</p>
            <img src={bikini} alt="bikini" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Ohniště</p>
            <img src={bonfire} alt="bonfire" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Občerstvení</p>
            <img src={cafe} alt="cafe" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Pro rodiny</p>
            <img src={family} alt="family" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">S kočárkem</p>
            <img src={stroller} alt="stroller" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Přespání</p>
            <img src={tent} alt="tent" className="explanations__img" />
        </div>

        <div className="explanations__item">
            <p className="explanations__text">Bezlepková strava</p>
            <img src={glutenfree} alt="glutenfree" className="explanations__img" />
        </div>

    </div>

  
    
</div>
 
}

export default SideBar