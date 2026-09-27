import React from 'react';
import { Link } from 'react-router-dom';
import { LEARNING_GAMES } from './registry';

/**
 * The learning-games block on /games. Its own card rather than
 * ActivityGameCard: these cards carry an age range and the skill each game
 * trains, which is what a parent choosing between them needs to see.
 */

export const GAME_CARD_STYLE = `
  .lgh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}
  .lgh-card{
    display:flex;flex-direction:column;gap:10px;padding:18px;
    background:#fff;border:2.4px solid #3A3357;border-radius:22px;
    box-shadow:0 5px 0 rgba(58,51,87,.16);transition:transform .14s, box-shadow .14s;color:inherit;text-decoration:none;
  }
  .lgh-card:hover{transform:translateY(-4px);box-shadow:0 9px 0 rgba(58,51,87,.16)}
  .lgh-card:focus-visible{outline:3px solid #1A1A6E;outline-offset:3px}
  .lgh-thumb{width:78px;height:78px;border-radius:20px;border:2.4px solid #3A3357;display:flex;align-items:center;justify-content:center}
  .lgh-card h3{font-size:17px;font-weight:800;color:#1A1A6E;margin:0}
  .lgh-card p{font-size:13.5px;line-height:1.5;color:#5B5578;margin:0;flex:1}
  .lgh-tags{display:flex;flex-wrap:wrap;gap:6px}
  .lgh-tag{font-size:12px;font-weight:800;border-radius:999px;padding:3px 10px}
  @media (prefers-reduced-motion:reduce){.lgh-card{transition:none}.lgh-card:hover{transform:none}}
`;

export default function LearningGamesSection({ isHe }) {
  const lang = isHe ? 'he' : 'en';
  return (
    <section className="mt-14">
      <style>{GAME_CARD_STYLE}</style>
      <header className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          {isHe ? 'משחקי חשיבה ולמידה' : 'Thinking & Learning Games'}
        </h2>
        <p className="text-base text-slate-500 max-w-xl mx-auto">
          {isHe
            ? 'עולמות תלת-ממדיים שבהם הילד זז, פוגש דמויות ועושה דברים — וכל משחק בנוי על מה שהמחקר מראה שעוזר לילדים בגילאי 3–11: ספירה, זיכרון, מספרים, חשיבה מרחבית, ויסות וקריאה. בלי טיימר ובלי הפסד.'
            : 'Little 3D worlds where your child walks around, meets characters and does things — each built on what research shows helps children aged 3–11: counting, memory, numbers, spatial thinking, self-control and early reading. No timers, no losing.'}
        </p>
      </header>
      <div className="lgh-grid">
        {LEARNING_GAMES.map((g) => (
          <GameCard key={g.slug} game={g} lang={lang} />
        ))}
      </div>
    </section>
  );
}

/** One game on /games: drawn thumbnail, title, a line, and optional tags. */
export function GameCard({ game, lang }) {
  const isHe = lang === 'he';
  return (
    <Link to={game.path} className="lgh-card">
      <span className="lgh-thumb" style={{ background: game.tint }}>{game.thumb}</span>
      <h3>{game.title[lang]}</h3>
      <p>{game.desc[lang]}</p>
      {(game.skill || game.ages) && (
        <span className="lgh-tags">
          {game.skill && <span className="lgh-tag" style={{ background: '#FFF0F7', color: '#B4336F' }}>{game.skill[lang]}</span>}
          {game.ages && (
            <span className="lgh-tag" style={{ background: '#EAF8FD', color: '#1F6F8E' }}>
              {isHe ? `גיל ${game.ages}` : `Age ${game.ages}`}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
