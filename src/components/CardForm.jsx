import { useState } from "react";
import "./CardForm.scss";
import bag from "../icons/bag.svg";
import bikini from "../icons/bikini.svg" ;
import bonfire from "../icons/bonfire.svg";
import cafe from "../icons/cafe.svg";
import family from "../icons/family.svg";
import stroller from "../icons/stroller.svg";
import tent from "../icons/tent.svg";
import globe from "../icons/globe.svg";
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
    const [errors, setErrors] = useState({ title: '', description: '' })

   

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
        setBtnText(isVisible ? "+ vložit kartu" : "zpět")
    }

    const handleChange = (event) => {
        const { id, name, value, checked } = event.target
    
        let newValue = value;
        if (id === 'check1' || id === 'check2' || id === 'check3' || id === 'check4' || id === 'check5' || id === 'check6' || id === 'check7') {
          newValue = checked ? event.target.value : ''
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

          <div className="check-item">
            <label htmlFor="check1" className="field-label">
              <img className="tag-img" src={bag} alt="bag" />
            </label>
            <input
              id="check1"
              className="field-input"
              type="checkbox"
              name="bag"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check2" className="field-label">
              <img className="tag-img" src={bikini} alt="bikini" />
            </label>
            <input
              id="check2"
              className="field-input"
              type="checkbox"
              name="bikini"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check3" className="field-label">
              <img className="tag-img" src={bonfire} alt="bonfire" /> 
            </label>
            <input
              id="check3"
              className="field-input"
              type="checkbox"
              name="bonfire"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check4" className="field-label">
              <img className="tag-img" src={cafe} alt="cafe" />
            </label>
            <input
              id="check4"
              className="field-input"
              type="checkbox"
              name="cafe"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check5" className="field-label">
              <img className="tag-img" src={family} alt="family" />
            </label>
            <input
              id="check5"
              className="field-input"
              type="checkbox"
              name="family"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check5" className="field-label">
              <img className="tag-img" src={stroller} alt="stroller" />
            </label>
            <input
              id="check5"
              className="field-input"
              type="checkbox"
              name="stroller"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check5" className="field-label">
              <img className="tag-img" src={tent} alt="tent" />
            </label>
            <input
              id="check5"
              className="field-input"
              type="checkbox"
              name="tent"
              onChange={handleChange}
            />
          </div>
          
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
