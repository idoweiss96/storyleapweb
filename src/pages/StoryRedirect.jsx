import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

// Permanent link for parents (e.g. shared via WhatsApp). HeyZine issues a new
// flipbook URL on every re-publish, so this always redirects to the current one.
export default function StoryRedirect() {
  const { order_id } = useParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const go = async () => {
      if (!order_id) { setFailed(true); return; }
      try {
        const res = await base44.functions.invoke('resolveStoryRedirect', { order_id });
        if (res.data?.url) {
          window.location.replace(res.data.url);
        } else {
          setFailed(true);
        }
      } catch (e) {
        setFailed(true);
      }
    };
    go();
  }, [order_id]);

  if (failed) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <p className="text-slate-500">לא נמצא סיפור עבור הקישור הזה.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-violet-300 border-t-violet-600 rounded-full" />
    </div>
  );
}