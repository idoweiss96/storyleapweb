import React, { useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/LanguageContext';

export default function FamilyPhotosInput({ value, onChange }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const ROLES = isEn ? ['Dad', 'Mom', 'Grandpa', 'Grandma', 'Other'] : ['אבא', 'אמא', 'סבא', 'סבתא', 'אחר'];
  const OTHER = isEn ? 'Other' : 'אחר';
  const whoLabel = isEn ? "Who's in the photo?" : 'מי בתמונה?';
  const inPhotoLabel = isEn ? 'In photo:' : 'בתמונה:';

  const entry = value && typeof value === 'object' ? value : { role: '', customLabel: '', photo: '' };

  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  const updateEntry = (patch) => {
    onChange({ ...entry, ...patch });
  };

  const handlePhoto = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateEntry({ photo: file_url });
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    onChange({ role: '', customLabel: '', photo: '' });
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ borderColor: '#F0E8F5', background: '#FAFAFE' }}>
      {/* Photo */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={isUploading}
        className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 transition-colors disabled:opacity-60 ph-no-capture"
        style={{ borderColor: '#FF6FB5' }}
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#4FC3E8' }} />
        ) : entry.photo ? (
          <img src={entry.photo} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl" style={{ color: '#4FC3E8' }}>📷</span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => handlePhoto(e.target.files[0])}
        className="hidden"
      />

      {/* Role selection */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((role) => {
            const selected = entry.role === role;
            return (
              <button
                key={role}
                onClick={() => updateEntry({ role: selected ? '' : role })}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={selected
                  ? { background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)', color: '#FFFFFF' }
                  : { background: '#FFFFFF', color: '#6b6b8a', border: '1px solid #F0E8F5' }
                }
              >
                {role}
              </button>
            );
          })}
        </div>

        {entry.role === OTHER && (
          <input
            type="text"
            value={entry.customLabel || ''}
            onChange={(e) => updateEntry({ customLabel: e.target.value })}
            className="w-full px-3 py-2 rounded-[8px] border bg-white text-sm focus:outline-none"
            style={{ borderColor: '#F0E8F5' }}
            placeholder={whoLabel}
          />
        )}

        {entry.role && entry.role !== OTHER && (
          <p className="text-xs" style={{ color: '#6b6b8a' }}>{inPhotoLabel} {entry.role}</p>
        )}
      </div>

      {/* Remove — clears the photo so a different one can be uploaded */}
      {entry.photo && (
        <button
          onClick={removePhoto}
          className="p-1 rounded-full hover:bg-pink-50 transition-colors shrink-0"
          style={{ color: '#C4407A' }}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}