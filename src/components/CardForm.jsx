import { useState } from "react";
import "./CardForm.scss";
import bag from "../icons/bag.svg";
import bikini from "../icons/bikini.svg" ;
import bonfire from "../icons/bonfire.svg";
import cafe from "../icons/cafe.svg";
import family from "../icons/family.svg";
import stroller from "../icons/stroller.svg";
import tent from "../icons/tent.svg";
import pencil from "../icons/pencil.svg";
import notes from "../icons/notes.svg";
import description from "../icons/description.svg";
import pin from "../icons/pin.svg";



const CardForm = ({addCard}) => {

    const initialFormData = {
        title:"",
        lat:"",
        lng:"",
        bag:"",
        bikini:"",
        bonfire:"",
        cafe:"",
        family:"",
        stroller:"",
        tent:"",
        description:"",
        notes:""

    }

    const [isVisible, setIsVisible] = useState(false)
    const [btnText, setBtnText] = useState("+ vložit kartu")
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({ title: '', description: '', notes:'' })

   

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
        setBtnText(isVisible ? "+ vložit kartu" : "zpět")
    }

    const handleChange = (event) => {
        const { id, name, value, checked } = event.target
    
        // let newValue = value;
        // if (id === 'check1' || id === 'check2' || id === 'check3' || id === 'check4' || id === 'check5' || id === 'check6' || id === 'check7') {
        //   newValue = checked ? event.target.value : ''
        // }

        let newValue = value;
        if (id.startsWith('check')) {
          newValue = checked ? event.target.value : '';
        }
    
        setFormData({ ...formData, [name]: newValue })
      };

    const handleClick = (event) => {
        event.preventDefault()

        let newErrors = {}

        if (formData.title.trim() === '') {
            newErrors.title = 'Povinné pole.'
          }
          if (formData.lat.trim() === '') {
            newErrors.lat = 'Povinné pole.'
          } 
          if (formData.lng.trim() === '') {
            newErrors.lng = 'Povinné pole.'
          } 

          if (formData.description.trim() === '') {
            newErrors.description = 'Povinné pole.'
          } 
      
          if (formData.notes.trim() === '') {
            newErrors.notes = 'Povinné pole.'
          } 
      
          setErrors(newErrors);

          if (Object.keys(newErrors).length === 0) {
            const newCard = { ...formData };
           
            console.log(newCard)
            
            addCard(newCard);
            toggleVisibility();
            setFormData(initialFormData); // Resetuje formulář
            
          }

       
    }

  return <div className="form--container">

  <button className="btn--insert" onClick={toggleVisibility}>{btnText}</button>
  {isVisible && // Podmíněné zobrazení formuláře pouze pokud je isVisible true
  <form className="form" >
     
        
        <label htmlFor="title" className="field-label">
          <img className="label-icon" src={pencil} alt="pencil" />
          Název: 
          {errors.title && (
            <span className="error-message">{errors.title}</span>
            )}
        </label>
        <input
          id="title"
          className="field-input"
          type="text"
          name="title"
          onChange={handleChange}
        />

        <p className="pin-title"> <img className="label-icon" src={pin} alt="pin" /> Pin na mapě:</p>
        <div className="pins">

          <div className="pin">
            <label htmlFor="lat" className="field-label">
              Zeměpisná šířka: 
              {errors.lat && (
                <span className="error-message">{errors.lat}</span>
                )}
            </label>
            <input
              id="lat"
              className="field-input"
              type="text"
              name="lat"
              onChange={handleChange}
            />
          </div>

          <div className="pin">
            <label htmlFor="lng" className="field-label">
              Zeměpisná délka: 
              {errors.lng && (
                <span className="error-message">{errors.lng}</span>
                )}
            </label>
            <input
              id="lng"
              className="field-input"
              type="text"
              name="lng"
              onChange={handleChange}
            />
          </div>
        </div>

       

        <div className="tags">
            {[
              { id: "check1", img: bag, name: "bag" },
              { id: "check2", img: bikini, name: "bikini" },
              { id: "check3", img: bonfire, name: "bonfire" },
              { id: "check4", img: cafe, name: "cafe" },
              { id: "check5", img: family, name: "family" },
              { id: "check6", img: stroller, name: "stroller" },
              { id: "check7", img: tent, name: "tent" }
            ].map(tag => (
              <div key={tag.id} className="check-item">
                <label htmlFor={tag.id} className="field-label">
                  <img className="tag-img" src={tag.img} alt={tag.name} />
                </label>
                <input
                  id={tag.id}
                  className="field-input"
                  type="checkbox"
                  name={tag.name}
                  value={tag.name}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>








        <div>
            <label htmlFor="description" className="field-label"> <img src={description} alt="description" className="label-icon" /> Popis: {errors.description && (
                  <span className="error-message">{errors.description}</span>
                )}</label>
            <textarea 
            id="description" 
            name="description" 
            rows="10" 
            cols="50" 
            className="notes"  
            onChange={handleChange}
            ></textarea>
        </div>

        <div>
            <label htmlFor="notes" className="field-label"><img src={notes} alt="notes" className="label-icon" /> Poznámky: {errors.notes && (
                  <span className="error-message">{errors.notes}</span>
                )}</label>
            <textarea 
            id="notes" 
            name="notes" 
            rows="10" 
            cols="50" 
            className="notes"  
            onChange={handleChange}
            ></textarea>
        </div>
        

        

      <button className="btn" onClick={handleClick}>
        Vložit
      </button>
    </form>
}
    </div>
};

export default CardForm;
