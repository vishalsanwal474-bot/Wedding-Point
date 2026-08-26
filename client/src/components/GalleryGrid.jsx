import { useMemo, useState } from 'react';
import GalleryModal from './GalleryModal';
import EmptyState from './EmptyState';
import { resolveMediaUrl } from '../utils/content';
import './GalleryGrid.css';

const CATEGORIES = [
  'All',
  'Weddings',
  'Decoration',
  'Mehndi',
  'Haldi',
  'Reception',
  'Engagement',
];

function GalleryGrid({ items = [], limit }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const list =
      activeCategory === 'All'
        ? items
        : items.filter((item) => item.category === activeCategory);

    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }, [items, activeCategory, limit]);

  if (!items.length) {
    return (
      <EmptyState
        title="Gallery coming soon"
        description="Beautiful wedding moments will appear here once images are added by the Wedding Point team."
      />
    );
  }

  return (
    <div className="gallery-grid-wrap">
      <div className="gallery-grid__filters" role="tablist" aria-label="Gallery categories">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            className={`gallery-grid__filter ${
              activeCategory === category ? 'gallery-grid__filter--active' : ''
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No images in this category"
          description="Try another category to explore more celebrations."
        />
      ) : (
        <ul className="gallery-grid">
          {filtered.map((item) => {
            const imageUrl = resolveMediaUrl(item.imageUrl);
            return (
              <li key={item._id}>
                <button
                  type="button"
                  className="gallery-grid__item"
                  onClick={() => setSelected(item)}
                  aria-label={`View ${item.title}`}
                >
                  <span
                    className={`gallery-grid__thumb ${
                      imageUrl ? '' : 'gallery-grid__thumb--placeholder'
                    }`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.altText || item.title}
                        loading="lazy"
                      />
                    ) : null}
                  </span>
                  <span className="gallery-grid__caption">
                    <span className="gallery-grid__category">{item.category}</span>
                    <span className="gallery-grid__title">{item.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <GalleryModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default GalleryGrid;
