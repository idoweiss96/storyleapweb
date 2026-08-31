﻿import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import NoIndexMeta from '@/components/SEO/NoIndexMeta';

// Permanent link for parents (e.g. shared via WhatsApp). The story is embedded
// in an iframe instead of redirecting away, so the parent stays on storyleap and
// the URL keeps saying /story/{order_id}.
//
// This is URL-agnostic on purpose: whatever sits in story_link gets framed. Old
// HeyZine links work as-is (verified: HeyZine sends no X-Frame-Options and no
// CSP frame-ancestors, and does not frame-bust), and stories that later point at
// our own reader work through the exact same path — no migration needed.
export default function StoryRedirect() {
  const { order_id } = useParams();
  const [url, setUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const go = async () => {
      if (!order_id) { setFailed(true); return; }
      try {
        const res = await base44.functions.invoke('resolveStoryRedirect', { order_id });
        if (res.data?.url) setUrl(res.data.url);
        else setFailed(true);
      } catch (e) {
        setFailed(true);
      }
    };
    go();
  }, [order_id]);

  if (failed) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <NoIndexMeta />
        <p className="text-slate-500">לא נמצא סיפור עבור הקישור הזה.</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center py-20">
        <NoIndexMeta />
        <div className="animate-spin w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100">
      <NoIndexMeta />
      <iframe
        src={url}
        title="הסיפור"
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen"
      />
      {/* Escape hatch: if a future story host refuses to be framed, the parent
          still has a way through instead of staring at a blank rectangle. */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 text-[11px] text-slate-400 hover:text-slate-600 bg-white/70 rounded px-2 py-1"
      >
        פתח בחלון נפרד
      </a>
    </div>
  );
}

