import React, { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function FamilyPhotosInput({ value, onChange }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const ROLES = isEn ? ['Dad', 'Mom', 'Grandpa', 'Grandma', 'Other'] : ['אבא', 'אמא', 'סבא', 'סבתא', 'אחר'];
  const OTHER = isEn ? 'Other' : 'אחר';
  const addLabel = isEn ? 'Add photo' : 'הוספת תמונה';
  const maxLabel = isEn ? `Max ${2} photos` : `מקסימום ${2} תמונות`;
  const whoLabel = isEn ? "Who's in the photo?" : 'מי בתמונה?';
  const inPhotoLabel = isEn ? 'In photo:' : 'בתמונה:';

  const photos = Array.isArray(value) ? value : [];
  const MAX = 2;

  const updateEntry = (idx, patch) => {
    const next = photos.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChange(next);
  };

  const addEntry = () => {
    if (photos.length >= MAX) return;
    onChange([...photos, { role: '', customLabel: '', photo: '' }]);
  };

  const removeEntry = (idx) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

  const handlePhoto = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateEntry(idx, { photo: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {photos.map((entry, idx) => (
        <PhotoEntry
          key={idx}
          entry={entry}
          roles={ROLES}
          otherLabel={OTHER}
          whoLabel={whoLabel}
          inPhotoLabel={inPhotoLabel}
          onPhoto={(file) => handlePhoto(idx, file)}
          onRoleChange={(role) => updateEntry(idx, { role })}
          onCustomLabelChange={(label) => updateEntry(idx, { customLabel: label })}
          onRemove={() => removeEntry(idx)}
        />
      ))}

      <button
        onClick={addEntry}
        disabled={photos.length >= MAX}
        className="w-full py-3 rounded-[14px] border-2 border-dashed flex items-center justify-center gap-2 font-medium transition-colors hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#4FC3E8', color: '#4FC3E8', background: '#EAF8FD' }}
      >
        <Plus className="w-5 h-5" />
        {photos.length >= MAX ? maxLabel : addLabel}
      </button>
    </div>
  );
}

function PhotoEntry({ entry, roles, otherLabel, whoLabel, inPhotoLabel, onPhoto, onRoleChange, onCustomLabelChange, onRemove }) {
  const fileRef = useRef(null);

  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ borderColor: '#F0E8F5', background: '#FAFAFE' }}>
      {/* Photo */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 transition-colors"
        style={{ borderColor: '#FF6FB5' }}
      >
        {entry.photo ? (
          <img src={entry.photo} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl" style={{ color: '#4FC3E8' }}>📷</span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => onPhoto(e.target.files[0])}
        className="hidden"
      />

      {/* Role selection */}
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {roles.map((role) => {
            const selected = entry.role === role;
            return (
              <button
                key={role}
                onClick={() => onRoleChange(selected ? '' : role)}
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

        {entry.role === otherLabel && (
          <input
            type="text"
            value={entry.customLabel || ''}
            onChange={(e) => onCustomLabelChange(e.target.value)}
            className="w-full px-3 py-2 rounded-[8px] border bg-white text-sm focus:outline-none"
            style={{ borderColor: '#F0E8F5' }}
            placeholder={whoLabel}
          />
        )}

        {entry.role && entry.role !== otherLabel && (
          <p className="text-xs" style={{ color: '#6b6b8a' }}>{inPhotoLabel} {entry.role}</p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-pink-50 transition-colors shrink-0"
        style={{ color: '#C4407A' }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}