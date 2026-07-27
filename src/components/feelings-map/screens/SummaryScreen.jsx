import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, RotateCcw, BookOpen } from 'lucide-react';

function labelsFor(list, ids) {
  return list.filter((i) => ids.includes(i.id));
}

export default function SummaryScreen({ text, content, state, onRestart, onReturn }) {
  const { emotions, body, storyCards, supports, powerSentences } = content;

  const chosenEmotions = labelsFor(emotions, state.emotions);
  if (state.emotions.includes('other')) {
    chosenEmotions.push({ emoji: '✏️', label: state.emotionCustom.trim() || text.emotionOther.label });
  }
  const chosenBody = labelsFor(body, state.bodyFeelings);
  const chosenStoryCards = labelsFor(storyCards, state.storyCards);
  const chosenSupports = labelsFor(supports, state.supports);
  if (state.supports.includes('other')) {
    chosenSupports.push({ emoji: '➕', label: state.supportCustom.trim() || text.supportOther.label });
  }
  const chosenAction = content.actions.find((a) => a.id === state.actionChoice);
  const powerText = state.powerSentence === '__custom__' ? state.powerCustom : state.powerSentence;

  const storyMemoryParts = [...chosenStoryCards.map((c) => c.label)];
  if (state.storyText?.trim()) storyMemoryParts.push(`"${state.storyText.trim()}"`);

  return (
    <div>
      <p className="text-center text-xl mb-1 print:hidden">✨</p>
      <h2 className="text-xl font-bold text-center mb-4" style={{ color: '#1A1A6E' }}>{text.summaryHeading}</h2>

      <div className="bg-white rounded-3xl shadow-lg border border-[#ede9f8] p-6 print:shadow-none">
        <div className="pb-3.5">
          <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelEmotions}</p>
          <div className="flex flex-wrap gap-2">
            {chosenEmotions.length ? chosenEmotions.map((e, i) => (
              <span key={i} className="bg-[#f0eef8] rounded-full px-3.5 py-1.5 text-sm inline-flex items-center gap-1.5">{e.emoji} {e.label}</span>
            )) : <span className="text-sm text-[#1a1a2e]">—</span>}
          </div>
        </div>

        {chosenBody.length > 0 && (
          <div className="pt-3.5 border-t border-[#2D2F33]/[0.08]">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelBody}</p>
            <div className="flex flex-wrap gap-2">
              {chosenBody.map((b, i) => (
                <span key={i} className="bg-[#f0eef8] rounded-full px-3.5 py-1.5 text-sm inline-flex items-center gap-1.5">{b.emoji} {b.label}</span>
              ))}
            </div>
          </div>
        )}

        {storyMemoryParts.length > 0 && (
          <div className="pt-3.5 border-t border-[#2D2F33]/[0.08]">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelStory}</p>
            <p className="text-sm text-[#1a1a2e] leading-relaxed">{storyMemoryParts.join(' · ')}</p>
          </div>
        )}

        {chosenSupports.length > 0 && (
          <div className="pt-3.5 border-t border-[#2D2F33]/[0.08]">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelSupports}</p>
            <div className="flex flex-wrap gap-2">
              {chosenSupports.map((s, i) => (
                <span key={i} className="bg-[#f0eef8] rounded-full px-3.5 py-1.5 text-sm inline-flex items-center gap-1.5">{s.emoji} {s.label}</span>
              ))}
            </div>
          </div>
        )}

        {powerText && (
          <div className="pt-3.5 border-t border-[#2D2F33]/[0.08]">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelPower}</p>
            <p className="italic text-lg rounded-2xl px-4 py-3" style={{ color: '#1A1A6E', background: '#DADCF8' }}>"{powerText}"</p>
          </div>
        )}

        {chosenAction && (
          <div className="pt-3.5 border-t border-[#2D2F33]/[0.08]">
            <p className="text-xs font-semibold mb-2" style={{ color: '#1A1A6E' }}>{text.labelAction}</p>
            <p className="text-sm text-[#1a1a2e]">{chosenAction.emoji} {chosenAction.label}</p>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-[#1a1a2e]/60 mt-5 mb-1 print:hidden">{text.closingText}</p>

      <div className="flex flex-col gap-2.5 mt-5 print:hidden">
        <Button onClick={() => window.print()} className="w-full h-12 rounded-full text-white font-semibold" style={{ background: '#1A1A6E' }}>
          <Printer className="w-4 h-4 me-2" />{text.printBtn}
        </Button>
        <Button onClick={onRestart} variant="ghost" className="w-full h-11 rounded-full text-[#1a1a2e]/65">
          <RotateCcw className="w-4 h-4 me-2" />{text.restartBtn}
        </Button>
        <Button onClick={onReturn} className="w-full h-12 rounded-full text-white font-semibold" style={{ background: 'linear-gradient(135deg, #FF6FB5, #4FC3E8)' }}>
          <BookOpen className="w-4 h-4 me-2" />{text.returnBtn}
        </Button>
      </div>
    </div>
  );
}