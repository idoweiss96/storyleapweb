import React from 'react';

export default function DSSection({ id, title, description, children }) {
  return (
    <section id={id} className="py-10 border-b border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {description && <p className="text-slate-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {children}
    </section>
  );
}