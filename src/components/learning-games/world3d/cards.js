import * as THREE from 'three';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * cards.js — put the site's 2D artwork into the 3D world.
 *
 * Any React SVG drawing (Critter, Icon, LearnArt) is rendered to markup,
 * drawn onto a canvas and used as a texture. So a card held by an NPC, the
 * cargo on a wagon or a sign on a house shows exactly the same art as the
 * rest of the site, with no image files.
 */

function svgImage(element) {
  let markup = renderToStaticMarkup(element);
  if (!markup.includes('xmlns=')) markup = markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  return img;
}

/**
 * A square canvas texture: rounded card background, optional border, and
 * either an SVG element, a text string, or both (art on top, text below).
 */
export function cardTexture({ art = null, text = null, bg = '#ffffff', border = '#3A3357', size = 256, textColor = '#1A1A6E', artScale = 0.72, font = 900 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const paint = (img) => {
    x.clearRect(0, 0, size, size);
    if (bg) {
      x.fillStyle = bg;
      x.strokeStyle = border || bg;
      x.lineWidth = size * 0.045;
      x.beginPath();
      x.roundRect(size * 0.04, size * 0.04, size * 0.92, size * 0.92, size * 0.16);
      x.fill();
      if (border) x.stroke();
    }
    const hasText = text !== null && text !== undefined && text !== '';
    if (img) {
      const s = size * (hasText ? artScale * 0.78 : artScale);
      const top = hasText ? size * 0.1 : (size - s) / 2;
      x.drawImage(img, (size - s) / 2, top, s, s);
    }
    if (hasText) {
      x.fillStyle = textColor;
      const str = String(text);
      const fs = size * (img ? 0.22 : str.length > 3 ? 0.34 : 0.5);
      x.font = `${font} ${fs}px Assistant, "Segoe UI", sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.lineWidth = size * 0.02;
      x.strokeStyle = '#ffffff';
      x.fillText(str, size / 2, img ? size * 0.8 : size / 2 + size * 0.02);
    }
    tex.needsUpdate = true;
  };

  if (art) {
    const img = svgImage(art);
    img.onload = () => paint(img);
    paint(null);
  } else paint(null);
  return tex;
}

/** A flat card facing +z (use for signs, cargo fronts, held cards). */
export function makeCard(opts = {}, w = 1, h = w) {
  const mat = new THREE.MeshBasicMaterial({ map: cardTexture(opts), transparent: true });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  return m;
}

/** A card that always faces the camera. */
export function makeBillboard(opts = {}, w = 1, h = w) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cardTexture(opts), transparent: true }));
  s.scale.set(w, h, 1);
  return s;
}

/** Swap what a card shows without making a new mesh. */
export function setCard(meshOrSprite, opts) {
  const old = meshOrSprite.material.map;
  meshOrSprite.material.map = cardTexture(opts);
  meshOrSprite.material.needsUpdate = true;
  old?.dispose();
}
