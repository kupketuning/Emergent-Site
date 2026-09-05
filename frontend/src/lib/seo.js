import { useEffect } from 'react';

const DEFAULT_TITLE = 'Kupke-Tuning – Trabant Ersatzteile & Tuning';

// Setzt Meta-Title und Meta-Description für SEO
export const useSeo = (title, description) => {
  useEffect(() => {
    if (title) document.title = `${title} | Kupke-Tuning`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
    return () => { document.title = DEFAULT_TITLE; };
  }, [title, description]);
};
