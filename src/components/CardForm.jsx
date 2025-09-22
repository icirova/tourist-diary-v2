import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./CardForm.scss";
import TagBadge from './TagBadge';
import { TAGS } from '../tags';
import pencilIcon from "/icons/pencil.svg";
import notesIcon from "/icons/notes.svg";
import descriptionIcon from "/icons/description.svg";
import pinFormIcon from "/icons/pin-form.svg";

const initialFormData = {
  title: "",
  lat: "",
  lng: "",
  tags: [],
  description: "",
  notes: "",
};

function validate(data) {
  const nextErrors = {};
  if (!data.title || data.title.trim() === '') {
    nextErrors.title = 'Povinné pole.';
  }
  const lat = parseFloat(data.lat);
  if (data.lat === '' || Number.isNaN(lat)) {
    nextErrors.lat = 'Povinné pole.';
  } else if (lat < -90 || lat > 90) {
    nextErrors.lat = 'Mimo rozsah (−90 až 90).';
  }
  const lng = parseFloat(data.lng);
  if (data.lng === '' || Number.isNaN(lng)) {
    nextErrors.lng = 'Povinné pole.';
  } else if (lng < -180 || lng > 180) {
    nextErrors.lng = 'Mimo rozsah (−180 až 180).';
  }
  return nextErrors;
}

const CardForm = ({ onAddCard, pickedCoords }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [btnText, setBtnText] = useState('+ vložit kartu');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(() => validate(initialFormData));

  const isValid = Object.keys(errors).length === 0;

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const next = !prev;
      setBtnText(next ? 'zpět' : '+ vložit kartu');
      if (!next) {
        setFormData(initialFormData);
        setErrors(validate(initialFormData));
      }
      return next;
    });
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    if (type === 'checkbox') {
      let nextTags = formData.tags;
      if (checked) {
        if (!nextTags.includes(name)) {
          nextTags = [...nextTags, name];
        }
      } else {
        nextTags = nextTags.filter((tag) => tag !== name);
      }
      const nextFormData = { ...formData, tags: nextTags };
      setFormData(nextFormData);
      setErrors(validate(nextFormData));
      return;
    }

    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setErrors(validate(nextFormData));
  };

  useEffect(() => {
    if (!pickedCoords || !isVisible) return;
    const latStr = String(pickedCoords.lat);
    const lngStr = String(pickedCoords.lng);
    const needsUpdate = formData.lat !== latStr || formData.lng !== lngStr;
    if (needsUpdate) {
      const nextFormData = { ...formData, lat: latStr, lng: lngStr };
      setFormData(nextFormData);
      setErrors(validate(nextFormData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedCoords, isVisible]);

  const handleClick = (event) => {
    event.preventDefault();

    const submissionErrors = validate(formData);
    setErrors(submissionErrors);

    if (Object.keys(submissionErrors).length === 0) {
      if (typeof onAddCard === 'function') {
        onAddCard(formData);
      }
      setFormData(initialFormData);
      setErrors(validate(initialFormData));
      setIsVisible(false);
      setBtnText('+ vložit kartu');
    }
  };

  return (
    <div className="form--container">
      <button type="button" className="btn btn--insert" onClick={toggleVisibility}>
        {btnText}
      </button>
      {isVisible && (
        <form className="form">
          <div className="form__section">
            <h3 className="form__section-title">Základní informace</h3>
            <p className="help-text">
              Pole označená <span className="required-star">*</span> jsou povinná.
            </p>
            <label htmlFor="title" className="field-label">
              <img className="label-icon" src={pencilIcon} alt="pencil" />
              Název <span className="required-star">*</span>
              {errors.title && <span className="error-message">{errors.title}</span>}
            </label>
            <input
              id="title"
              className="field-input"
              type="text"
              name="title"
              placeholder="Např. Prachovské skály"
              required
              aria-required="true"
              value={formData.title}
              onChange={handleChange}
            />
            <p className="help-text">Krátký, výstižný název místa (doporučeno 3–80 znaků).</p>

            <div className="field-label">
              <img className="label-icon" src={pinFormIcon} alt="pin" /> Pin na mapě
            </div>
            <p className="help-text">
              Kliknutím do mapy vyberete souřadnice. Případně zadejte ručně (rozsah: šířka −90 až 90,
              délka −180 až 180).
            </p>
            <div className="pins">
              <div className="pin">
                <label htmlFor="lat" className="field-label">
                  Zeměpisná šířka <span className="required-star">*</span>
                  {errors.lat && <span className="error-message">{errors.lat}</span>}
                </label>
                <input
                  id="lat"
                  className="field-input"
                  type="number"
                  name="lat"
                  step="any"
                  placeholder="50.4673551"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.lat)}
                  value={formData.lat}
                  onChange={handleChange}
                />
              </div>

              <div className="pin">
                <label htmlFor="lng" className="field-label">
                  Zeměpisná délka <span className="required-star">*</span>
                  {errors.lng && <span className="error-message">{errors.lng}</span>}
                </label>
                <input
                  id="lng"
                  className="field-input"
                  type="number"
                  name="lng"
                  step="any"
                  placeholder="15.2932227"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.lng)}
                  value={formData.lng}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form__section">
            <h3 className="form__section-title">Tagy</h3>
            <p className="help-text">Vyberte vše, co sedí. Ikona i text jsou informativní.</p>
            <div className="tags">
              {TAGS.map((tag) => (
                <div key={tag.key} className="check-item">
                  <label htmlFor={`tag-${tag.key}`} className="field-label">
                    <TagBadge keyName={tag.key} />
                  </label>
                  <input
                    id={`tag-${tag.key}`}
                    className="field-input"
                    type="checkbox"
                    name={tag.key}
                    checked={formData.tags.includes(tag.key)}
                    value={tag.key}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form__section">
            <h3 className="form__section-title">Popis a poznámky</h3>
            <label htmlFor="description" className="field-label">
              <img src={descriptionIcon} alt="description" className="label-icon" /> Popis
              {errors.description && <span className="error-message">{errors.description}</span>}
            </label>
            <textarea
              id="description"
              name="description"
              rows="10"
              cols="50"
              className="notes"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <p className="help-text">Krátké představení místa. Odstavce oddělte Enterem.</p>
          </div>

          <div className="form__section">
            <label htmlFor="notes" className="field-label">
              <img src={notesIcon} alt="notes" className="label-icon" /> Poznámky
              {errors.notes && <span className="error-message">{errors.notes}</span>}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="10"
              cols="50"
              className="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
            <p className="help-text">Praktické tipy a zkušenosti (parkování, občerstvení, sezóna…).</p>
          </div>

          <button
            type="button"
            className="btn btn--primary btn--large"
            onClick={handleClick}
            disabled={!isValid}
          >
            Přidat kartu
          </button>
        </form>
      )}
    </div>
  );
};

CardForm.propTypes = {
  onAddCard: PropTypes.func,
  pickedCoords: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default CardForm;
