import { useState } from "react";
import "./CardForm.css";
import Card from "./Card";

const CardForm = () => {

    const initialFormData = {
        name:"",
        bicycle:"",
        bag:"",
        photo:"",
        snack:"",
        climber:"",
        notes:""

    }

    const [isVisible, setIsVisible] = useState(false)
    const [btnText, setBtnText] = useState("+ vložit kartu")
    const [formData, setFormData] = useState(initialFormData)
    const [errors, setErrors] = useState({ name: '', notes: '' });

   

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
        setBtnText(isVisible ? "+ vložit kartu" : "zpět")
    }

    const handleChange = (event) => {
        const { id, name, value, checked } = event.target;
    
        let newValue = value;
        if (id === 'check1' || id === 'check2' || id === 'check3' || id === 'check4' || id === 'check5') {
          newValue = checked ? event.target.value : '';
        }
    
        setFormData({ ...formData, [name]: newValue });
      };

    const handleClick = (event) => {
        event.preventDefault()

        let newErrors = {}

        if (formData.name.trim() === '') {
            newErrors.name = 'Povinné pole.'
          }
      
          if (formData.notes.trim() === '') {
            newErrors.notes = 'Povinné pole.';
          } 
      
          setErrors(newErrors);

          if (Object.keys(newErrors).length === 0) {
            console.log(formData)
            toggleVisibility()
          }

       
    }

  return <div className="form--container">

  <button className="btn--insert" onClick={toggleVisibility}>{btnText}</button>
  {isVisible && // Podmíněné zobrazení formuláře pouze pokud je isVisible true
  <form className="form" >
     
        
        <label htmlFor="name" className="field-label">
          Název: 
          {errors.name && (
            <span className="error-message">{errors.name}</span>
            )}
        </label>
        <input
          id="name"
          className="field-input"
          type="text"
          name="name"
          onChange={handleChange}
        />

        <div className="tags">

          <div className="check-item">
            <label htmlFor="check1" className="field-label">
              🚲
            </label>
            <input
              id="check1"
              className="field-input"
              type="checkbox"
              name="bicycle"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check2" className="field-label">
             🎒
            </label>
            <input
              id="check2"
              className="field-input"
              type="checkbox"
              name="bag"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check3" className="field-label">
             📷
            </label>
            <input
              id="check3"
              className="field-input"
              type="checkbox"
              name="photo"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check4" className="field-label">
             🥪
            </label>
            <input
              id="check4"
              className="field-input"
              type="checkbox"
              name="snack"
              onChange={handleChange}
            />
          </div>

          <div className="check-item">
            <label htmlFor="check5" className="field-label">
             🧗
            </label>
            <input
              id="check5"
              className="field-input"
              type="checkbox"
              name="climber"
              onChange={handleChange}
            />
          </div>
          
        </div>

        <div>
            <label htmlFor="notes" className="field-label">Poznámky: {errors.name && (
                  <span className="error-message">{errors.name}</span>
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
