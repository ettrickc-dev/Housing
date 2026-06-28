import { useEffect } from 'react';

const DEFAULT_TITLE = 'PlainRights Court — NY Housing Court Document Prep';

// Sets the document title + meta description for a page (basic client-side SEO).
export function useSeo(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute('name', 'description');
        document.head.appendChild(m);
      }
      m.setAttribute('content', description);
    }
    return () => { document.title = DEFAULT_TITLE; };
  }, [title, description]);
}
