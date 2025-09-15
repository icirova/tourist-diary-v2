import "./CardOpen.scss";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import data from "../data";
// tag icons for editing
import bag from "/icons/bag.svg";
import bikini from "/icons/bikini.svg";
import bonfire from "/icons/bonfire.svg";
import cafe from "/icons/cafe.svg";
import family from "/icons/family.svg";
import stroller from "/icons/stroller.svg";
import tent from "/icons/tent.svg";

const CardOpen = () => {
  const { tripId } = useParams();

  const filteredCard = data.find((oneCard) => oneCard.id === parseInt(tripId));

  if (!filteredCard) {
    return <div>Sorry, the requested card was not found.</div>;
  }

  const tagOptions = useMemo(
    () => [
      { id: "check1", img: bag, name: "bag" },
      { id: "check2", img: bikini, name: "bikini" },
      { id: "check3", img: bonfire, name: "bonfire" },
      { id: "check4", img: cafe, name: "cafe" },
      { id: "check5", img: family, name: "family" },
      { id: "check6", img: stroller, name: "stroller" },
      { id: "check7", img: tent, name: "tent" },
    ],
    []
  );

  const iconToName = useMemo(() => {
    const map = new Map();
    tagOptions.forEach((t) => map.set(t.img, t.name));
    return map;
  }, [tagOptions]);

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
      .map((icon) => iconToName.get(icon))
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
    const nameToIcon = new Map(tagOptions.map((t) => [t.name, t.img]));
    filteredCard.tags = selectedTags.map((n) => nameToIcon.get(n)).filter(Boolean);
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
    setSelectedTags(
      (filteredCard.tags || [])
        .map((icon) => iconToName.get(icon))
        .filter(Boolean)
    );
    setIsEditing(false);
  };

  return (
    <div className="opened-card">
      {!isEditing ? (
        <>
          <button className="btn btn--edit opened-card__edit" onClick={() => setIsEditing(true)}>
            Upravit
          </button>
          <h1 className="title ">{filteredCard.title}</h1>

          <div className="tags">
            {(filteredCard.tags || []).map((tag, index) => (
              <img className="tag" key={index} src={tag} alt="tag" />
            ))}
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
            <Link to="/" className="btn btn--opened-card">
              Zpět
            </Link>
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
              <div key={tag.id} className="check-item">
                <label htmlFor={tag.id} className="field-label">
                  <img className="tag-img" src={tag.img} alt={tag.name} />
                </label>
                <input
                  id={tag.id}
                  className="field-input"
                  type="checkbox"
                  name={tag.name}
                  checked={selectedTags.includes(tag.name)}
                  value={tag.name}
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
            <button className="btn" onClick={save}>Uložit</button>
            <button className="btn" onClick={cancel}>Zrušit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardOpen;
