import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { staticPageBySlug } from '../lib/staticPages';
import Seo from '../components/Seo';

const StaticPage = ({ slug }) => {
  const page = staticPageBySlug(slug);

  if (!page) {
    return <div className="max-w-[900px] mx-auto px-4 py-20 text-center text-gray-500">Seite nicht gefunden.</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8" data-testid={`static-page-${slug}`}>
      <Seo title={page.metaTitle || page.title} description={page.metaDescription} path={`/${slug}`} />
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#E63946]">Startseite</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1a1a1a] font-semibold">{page.title}</span>
      </div>

      <h1 className="font-logo text-3xl md:text-4xl font-bold text-[#17191d] mb-8 uppercase">{page.title}</h1>

      {page.faq ? (
        <div className="space-y-4">
          {page.faq.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-5">
              <h2 className="font-bold text-[#17191d] text-lg mb-2">{item.q}</h2>
              <p className="text-[#3a4658] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {page.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="font-bold text-[#17191d] text-lg mb-2">{s.heading}</h2>}
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-[#3a4658] leading-relaxed mb-2">{p}</p>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaticPage;
