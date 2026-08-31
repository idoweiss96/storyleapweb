import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';

// In-site story reader. The book is a self-contained HTML file served from our
// own /public folder, so it is same-origin and the parent never leaves the site —
// the address bar keeps saying storyleap.
//
// Deliberately separate from StoryRedirect (/story/:order_id), which still sends
// existing customers to their HeyZine link and is untouched.
//
// ?src= lets this page show any story file without a code change:
//   /story-viewer                       → the Maya demo
//   /story-viewer?src=/stories/dan.html → a different book
const DEFAULT_SRC = '/stories/maya.html';

// Only same-origin paths are accepted. A full URL in the query string would let
// anyone frame arbitrary content under our domain, which is a phishing surface.
function safeSrc(raw) {
  if (!raw) return DEFAULT_SRC;
  if (!raw.startsWith('/') || raw.startsWith('//')) return DEFAULT_SRC;
  return raw;
}

export default function StoryViewer() {
  const [params] = useSearchParams();
  const src = safeSrc(params.get('src'));
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100">
      <NoIndexMeta />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full" />
        </div>
      )}

      <iframe
        src={src}
        title="הסיפור"
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen"
      />

      <Link
        to="/"
        className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/85 hover:bg-white
                   px-3 py-1.5 text-xs text-slate-600 shadow-sm backdrop-blur transition-colors"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        חזרה לאתר
      </Link>
    </div>
  );
}
