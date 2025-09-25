import PropTypes from 'prop-types';
import { TAGS } from '../tags';

const TagKeyPropType = PropTypes.oneOf(TAGS.map((tag) => tag.key));

const PhotoPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string.isRequired,
  caption: PropTypes.string,
  name: PropTypes.string,
});

const CardPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  notes: PropTypes.arrayOf(PropTypes.string).isRequired,
  tags: PropTypes.arrayOf(TagKeyPropType).isRequired,
  lat: PropTypes.number,
  lng: PropTypes.number,
  photos: PropTypes.arrayOf(PhotoPropType),
});

export { TagKeyPropType, PhotoPropType, CardPropType };

