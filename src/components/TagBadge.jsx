import PropTypes from 'prop-types';
import './TagBadge.scss';
import { TAG_BY_KEY } from '../tags';

const TagBadge = ({ keyName, compact = false, className = '' }) => {
  const meta = TAG_BY_KEY[keyName];
  if (!meta) return null;
  const titleText = meta.tooltip || meta.label;
  return (
    <span
      className={`tag-badge ${compact ? 'compact' : ''} ${className}`.trim()}
      title={titleText}
      aria-label={titleText}
    >
      <img className="tag-badge__icon" src={meta.icon} alt={meta.label} />
      {!compact && <span className="tag-badge__label">{meta.label}</span>}
    </span>
  );
};

TagBadge.propTypes = {
  keyName: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default TagBadge;
