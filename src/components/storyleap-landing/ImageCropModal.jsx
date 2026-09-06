import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X } from 'lucide-react';
import getCroppedImageBlob from '@/lib/cropImage';

export default function ImageCropModal({ imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,18,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fafdff', borderRadius: 24, padding: 24, maxWidth: 460, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Center the photo on your child</h3>
          <button type="button" onClick={onCancel} style={{ border: 0, background: 'transparent', color: '#93979f', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ position: 'relative', width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', background: '#000' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: '100%', marginTop: 16 }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, border: 0, fontFamily: 'inherit', fontWeight: 400, fontSize: 16, background: '#ebf5ff', color: '#535862', padding: '12px 0', borderRadius: 9999, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            style={{ flex: 1, border: 0, fontFamily: 'inherit', fontWeight: 500, fontSize: 16, background: '#181d27', color: '#fff', padding: '12px 0', borderRadius: 9999, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Use this photo'}
          </button>
        </div>
      </div>
    </div>
  );
}