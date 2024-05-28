import { useState } from "react";
import "./CardForm.scss";



const CardForm = ({addCard}) => {

    const initialFormData = {
        title:"",
        bicycle:"",
        bag:"",
        photo:"",
        snack:"",
        climber:"",
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
        if (id === 'check1' || id === 'check2' || id === 'check3' || id === 'check4' || id === 'check5') {
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
            <label htmlFor="description" className="field-label">Popis: {errors.description && (
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
            <label htmlFor="notes" className="field-label">Poznámky: {errors.notes && (
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
