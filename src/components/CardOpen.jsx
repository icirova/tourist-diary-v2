import "./CardOpen.scss";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import data from "../data";
import TagBadge from './TagBadge';
import { TAGS, KEY_BY_ICON, TAG_BY_KEY } from '../tags';

const CardOpen = () => {
  const { tripId } = useParams();

  const filteredCard = data.find((oneCard) => oneCard.id === parseInt(tripId));

  if (!filteredCard) {
    return <div>Sorry, the requested card was not found.</div>;
  }

  const tagOptions = useMemo(() => TAGS, []);

  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(filteredCard.title);
  const [localDescription, setLocalDescription] = useState(
    Array.isArray(filteredCard.description)
      ? filteredCard.description.join("\n")
      : filteredCard.description || ""
  );
  const [localNotes, setLocalNotes] = useState(
    Array.isArray(filteredCard.notes)
      ? filteredCard.notes.join("\n")
      : filteredCard.notes || ""
  );
  const [selectedTags, setSelectedTags] = useState(
    (filteredCard.tags || [])
      .map((icon) => KEY_BY_ICON[icon])
      .filter(Boolean)
  );

  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string")
      return val
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  };

  const save = () => {
    // update source object (in-memory only)
    filteredCard.title = localTitle;
    filteredCard.description = toArray(localDescription);
    filteredCard.notes = toArray(localNotes);
    // map selected tag names back to icon paths
    filteredCard.tags = selectedTags
      .map((key) => (TAG_BY_KEY[key] ? TAG_BY_KEY[key].icon : undefined))
      .filter(Boolean);
    setIsEditing(false);
  };

  const cancel = () => {
    setLocalTitle(filteredCard.title);
    setLocalDescription(
      Array.isArray(filteredCard.description)
        ? filteredCard.description.join("\n")
        : filteredCard.description || ""
    );
    setLocalNotes(
      Array.isArray(filteredCard.notes)
        ? filteredCard.notes.join("\n")
        : filteredCard.notes || ""
    );
    setSelectedTags((filteredCard.tags || []).map((icon) => KEY_BY_ICON[icon]).filter(Boolean));
    setIsEditing(false);
  };

  return (
    <div className="opened-card">
      {!isEditing ? (
        <>
          <h1 className="title ">{filteredCard.title}</h1>

          <div className="tags">
            {(filteredCard.tags || []).map((icon, index) => {
              const keyName = KEY_BY_ICON[icon];
              return <TagBadge key={`${keyName || icon}-${index}`} keyName={keyName || ''} />;
            })}
          </div>

          <div className="perex">
            {(Array.isArray(filteredCard.description)
              ? filteredCard.description
              : [filteredCard.description]
            )
              .filter(Boolean)
              .map((oneParagraph, index) => (
                <p key={index} className="paragraph">
                  {oneParagraph}
                </p>
              ))}
          </div>

          <div className="notes">
            {(Array.isArray(filteredCard.notes)
              ? filteredCard.notes
              : [filteredCard.notes]
            )
              .filter(Boolean)
              .map((oneParagraph, index) => (
                <p key={index} className="paragraph">
                  {oneParagraph}
                </p>
              ))}
          </div>

          <div className="card__actions">
            <Link to="/" className="btn btn--primary btn--opened-card">Zpět</Link>
            <button className="btn btn--secondary" onClick={() => setIsEditing(true)}>Upravit</button>
          </div>
        </>
      ) : (
        <>
          <input
            className="field-input"
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
          />

          <div className="tags">
            {tagOptions.map((tag) => (
              <div key={tag.key} className="check-item">
                <label htmlFor={`tag-${tag.key}`} className="field-label">
                  <TagBadge keyName={tag.key} />
                </label>
                <input
                  id={`tag-${tag.key}`}
                  className="field-input"
                  type="checkbox"
                  name={tag.key}
                  checked={selectedTags.includes(tag.key)}
                  value={tag.key}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    setSelectedTags((prev) =>
                      checked ? [...prev, name] : prev.filter((t) => t !== name)
                    );
                  }}
                />
              </div>
            ))}
          </div>

          <label className="field-label">Popis:</label>
          <textarea
            className="notes"
            rows="8"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
          />

          <label className="field-label">Poznámky:</label>
          <textarea
            className="notes"
            rows="8"
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
          />

          <div className="card__actions">
            <button className="btn btn--primary btn--large" onClick={save}>Uložit změny</button>
            <button className="btn btn--secondary" onClick={cancel}>Zrušit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOpen;
