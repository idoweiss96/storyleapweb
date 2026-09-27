import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Critter from '@/components/games/shared/art/Critter';
import ComingSoonDialog from './ComingSoonDialog';
import LoginRequiredDialog from './LoginRequiredDialog';
import ActivityBackdrop from './shared/ActivityBackdrop';
import { themeFor } from './shared/activityThemes';

/**
 * ActivityTile — one activity on the hub, drawn: a little scene with the
 * activity's host character, then the title and one line.
 *
 * Access tiers are the same as ActivityGameCard:
 *   'free'         open to everyone
 *   'coming_soon'  shown with a badge; admins still get through
 *   'auth'         (default) guests see a padlock and a login prompt
 */

export const TILE_STYLE = `
  .at-card{display:flex;flex-direction:column;height:100%;background:#fff;border:2.4px solid #3A3357;border-radius:24px;overflow:hidden;
    box-shadow:0 6px 0 rgba(58,51,87,.14);transition:transform .15s, box-shadow .15s;color:inherit;text-decoration:none;position:relative}
  .at-card:hover{transform:translateY(-4px);box-shadow:0 10px 0 rgba(58,51,87,.14)}
  .at-card:focus-visible{outline:3px solid #1A1A6E;outline-offset:3px}
  .at-scene{position:relative;height:104px;border-bottom:2.4px solid #3A3357;overflow:hidden}
  .at-scene > svg{position:absolute;inset:0;width:100%;height:100%}
  .at-host{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);filter:drop-shadow(0 4px 5px rgba(26,26,110,.25))}
  .at-card:hover .at-host{animation:at-hop .5s ease}
  .at-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:5px;flex:1}
  .at-title{margin:0;font-size:16px;font-weight:900;color:#1A1A6E;line-height:1.25}
  .at-desc{margin:0;font-size:13.5px;line-height:1.45;color:#5B5578}
  .at-band{height:6px;background:var(--at-color)}
  .at-badge{position:absolute;top:10px;inset-inline-end:10px;z-index:2;font-size:12px;font-weight:800;color:#fff;background:#3A3357;
    border-radius:999px;padding:3px 10px}
  .at-lock{position:absolute;top:10px;inset-inline-end:10px;z-index:2;width:28px;height:28px;border-radius:999px;background:#3A3357;
    display:grid;place-items:center}
  @keyframes at-hop{50%{transform:translate(-50%,-8px)}}
  @media (prefers-reduced-motion:reduce){.at-card{transition:none}.at-card:hover{transform:none}.at-card:hover .at-host{animation:none}}
`;

export default function ActivityTile({ game, isHe }) {
  const { isAuthenticated, navigateToLogin, user } = useAuth();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const slug = game.path.split('/').filter(Boolean).pop();
  const theme = themeFor(slug);
  const access = game.access || 'auth';
  const isAdmin = user?.role === 'admin';
  const locked = access === 'auth' && !isAuthenticated;

  const body = (
    <>
      {access === 'coming_soon' && <span className="at-badge">{isHe ? 'בקרוב' : 'Coming soon'}</span>}
      {locked && <span className="at-lock"><Lock className="w-3.5 h-3.5 text-white" /></span>}
      <div className="at-scene">
        <ActivityBackdrop scene={theme.scene} id={`at-${slug}`} />
        <span className="at-host"><Critter species={theme.host} expression="happy" size={78} /></span>
      </div>
      <div className="at-band" />
      <div className="at-body">
        <h3 className="at-title">{isHe ? game.title.he : game.title.en}</h3>
        <p className="at-desc">{isHe ? game.desc.he : game.desc.en}</p>
      </div>
    </>
  );
  const style = { '--at-color': theme.color };

  if (access === 'coming_soon' && !isAdmin) {
    return (
      <>
        <div className="at-card" style={{ ...style, cursor: 'not-allowed', opacity: 0.75 }} onClick={() => setShowComingSoon(true)}>{body}</div>
        <ComingSoonDialog open={showComingSoon} onClose={() => setShowComingSoon(false)} isHe={isHe} />
      </>
    );
  }
  if (locked) {
    return (
      <>
        <div className="at-card" style={{ ...style, cursor: 'pointer' }} onClick={() => setShowLoginPrompt(true)}>{body}</div>
        <LoginRequiredDialog open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} onLogin={navigateToLogin} isHe={isHe} />
      </>
    );
  }
  return <Link to={game.path} className="at-card" style={style}>{body}</Link>;
}
