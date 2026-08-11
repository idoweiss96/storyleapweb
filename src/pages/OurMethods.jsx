import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const METHODS = [
  {
    slug: 'bibliotherapy',
    icon: '📖',
    title: 'Bibliotherapy',
    oneliner: 'Stories open a gentler path into feelings that are hard to talk about directly.',
    deeper: 'Children often find it easier to approach a difficult feeling through a character than through a direct question. The story creates a little emotional distance — enough room to look at something hard without feeling exposed by it.',
    take: 'We use story as a bridge: a shared thing a parent and child can enter together, and a starting point for conversation rather than an interrogation.',
    dontClaim: "We don't offer bibliotherapy as treatment, and a story on its own doesn't resolve a hard experience. It opens a door — the conversation that follows matters just as much.",
  },
  {
    slug: 'narrative-therapy',
    icon: '🧵',
    title: 'Narrative Therapy',
    oneliner: 'The child is never the problem — the problem is the problem.',
    deeper: "A worry, an anger, or a fear can start to feel like part of who a child is. Narrative thinking treats the difficulty as something separate from the child — something they have a relationship with, rather than something they are.",
    take: "Our stories often give a challenge its own shape — a 'worry voice,' a 'grump cloud' — so the child can notice it, name it, and see moments where they already have some say over it.",
    dontClaim: "We don't provide narrative therapy, and we're not a substitute for it. We draw on its central insight: separating a child from their struggle can be freeing on its own.",
  },
  {
    slug: 'cbt',
    icon: '🔄',
    title: 'CBT',
    oneliner: 'What we think shapes what we feel — and what we feel shapes what we do next.',
    deeper: "A situation, a thought, a feeling, a body sensation, and an action are all connected. The same event can look different depending on how a character makes sense of it — and that's not the same as 'thinking positive.'",
    take: 'Stories can show a character notice what happened, what they thought, how it felt in their body, and a next step they try — often landing on a more flexible way to see things, not a forced cheerful one.',
    dontClaim: "StoryLeap doesn't provide CBT, exposure work, or any clinical treatment. We use it as a structure for showing feelings clearly inside a story.",
  },
  {
    slug: 'developmental-psychology',
    icon: '🌱',
    title: 'Developmental Psychology',
    oneliner: 'A five-year-old and a seven-year-old understand feelings differently — so stories should too.',
    deeper: 'How a child understands a feeling, follows a story, or takes another person\'s perspective changes as they grow. Age is a useful starting point, but never the whole picture of a child.',
    take: 'We adjust language, story complexity, point of view, and the kind of coping tool offered — and think about what role a parent plays at each stage, not just what words a child can read.',
    dontClaim: "We don't diagnose or clinically assess a child's development. Age tells us where to start, not who a child is.",
  },
  {
    slug: 'storytelling',
    icon: '✒️',
    title: 'Storytelling',
    oneliner: 'A real story carries an emotional idea further than any lesson can.',
    deeper: 'A character wants something, meets an obstacle, acts, and changes. That shape is what makes a story worth entering — and what makes an emotional idea land, instead of being announced.',
    take: 'We write toward a real narrative arc — desire, obstacle, choice, change — instead of a moral tacked onto the end. Meaning should come from what happens, not a sentence that explains it.',
    dontClaim: "This is craft, not clinical technique — but it's the reason the other methods actually reach a child.",
  },
  {
    slug: 'positive-psychology',
    icon: '🌤️',
    title: 'Positive Psychology',
    oneliner: 'Strength, hope, and connection matter as much as struggle does.',
    deeper: "This isn't about replacing hard feelings with happy ones. It's about noticing a child's existing strengths, the people around them, and a believable next step — the ingredients of real hope, not forced positivity.",
    take: 'Alongside a difficulty, our stories look for a strength already present, a relationship the child can lean on, and one small, believable step forward.',
    dontClaim: "We don't promise resilience as a guaranteed outcome, and we're careful never to wave away a hard feeling with a cheerful one.",
  },
];

function Reveal({ children, className }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CtaButton({ children, to }) {
  return (
    <Link to={to}>
      <span className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-white font-semibold shadow-lg transition-transform hover:scale-[1.03] bg-[#FDB654]">
        <Sparkles className="w-4 h-4" />
        {children}
      </span>
    </Link>
  );
}

export default function OurMethods() {
  return (
    <div dir="ltr" className="pb-12">

      {/* HERO */}
      <section className="relative py-16 md:py-20 overflow-hidden rounded-[3rem] mb-16" style={{ background: 'rgba(255,255,255,0.55)' }}>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(22)].map((_, i) => (
            <Star key={i}
              className={`absolute w-3 h-3 text-blue-200 fill-blue-100 opacity-60 star-twinkle${i % 3 === 0 ? '' : i % 3 === 1 ? '-delay' : '-delay-2'}`}
              style={{ top: `${5 + (i * 13) % 90}%`, left: `${(i * 17) % 100}%` }} />
          ))}
        </div>
        <Reveal className="relative text-center max-w-2xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
            ✨ StoryLeap
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#1C2A48' }}>
            Every story is built on proven principles
          </h1>
          <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: '#63738A' }}>
            We don't start from a blank page. Every StoryLeap story draws on six methods that professionals already know and trust — brought together into a story shaped for your child, not a template.
          </p>
          <span className="inline-block px-5 py-2.5 rounded-full text-sm italic font-medium border-2" style={{ background: '#FDF6F8', borderColor: '#FDB654', color: '#1C2A48' }}>
            This isn't therapy — it's a thoughtful way of telling stories, built from ideas that already work.
          </span>
        </Reveal>
      </section>

      {/* METHODS GRID */}
      <Reveal className="text-center mb-3" >
        <h2 id="methods-grid" className="text-2xl md:text-3xl font-bold scroll-mt-24" style={{ color: '#1C2A48' }}>Six methods, one story</h2>
      </Reveal>
      <Reveal className="text-center mb-10">
        <p className="text-base md:text-lg" style={{ color: '#63738A' }}>Tap a method to see exactly how it shapes the way we write.</p>
      </Reveal>
      <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
        {METHODS.map((m) => (
          <a key={m.slug} href={`#${m.slug}`}
            className="block rounded-2xl p-7 bg-white/70 backdrop-blur-sm transition-transform hover:scale-[1.02]"
            style={{ boxShadow: '0 10px 40px rgba(28,42,72,0.06)' }}>
            <div className="text-3xl mb-3">{m.icon}</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1C2A48' }}>{m.title}</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#63738A' }}>{m.oneliner}</p>
            <span className="text-sm font-semibold" style={{ color: '#FDB654' }}>Read the full idea →</span>
          </a>
        ))}
      </Reveal>

      {/* DETAIL SECTIONS */}
      {METHODS.map((m, i) => {
        const isLast = i === METHODS.length - 1;
        const next = isLast ? null : METHODS[i + 1];
        return (
          <section key={m.slug} id={m.slug} className="scroll-mt-24 mb-16 md:mb-20">
            <Reveal className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: '#DCEEFA', color: '#1C2A48' }}>
                Method {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#1C2A48' }}>{m.title}</h3>
              </div>
              <p className="text-base md:text-lg font-medium mb-4" style={{ color: '#1C2A48' }}>{m.oneliner}</p>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#63738A' }}>{m.deeper}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: '#DCEEFA' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1C2A48' }}>What we take from this</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#1C2A48' }}>{m.take}</p>
                </div>
                <div className="rounded-2xl p-5 border-2" style={{ background: '#FDF6F8', borderColor: '#FDB654' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#1C2A48' }}>What we don't claim</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#1C2A48' }}>{m.dontClaim}</p>
                </div>
              </div>
              <a href={next ? `#${next.slug}` : '#closing-cta'} className="inline-flex items-center gap-1 mt-6 font-semibold" style={{ color: '#1C2A48' }}>
                Next: {next ? next.title : 'See it in a story'} →
              </a>
            </Reveal>
          </section>
        );
      })}

      {/* CLOSING CTA */}
      <section id="closing-cta" className="scroll-mt-24">
        <Reveal className="text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold mb-2" style={{ color: '#FDB654' }}>Little heroes, big stories</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1C2A48' }}>See the thinking in a story</h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: '#63738A' }}>
            The best way to understand these methods is to see them at work — inside a story made for your child.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CtaButton to="/">✨ Create your story now</CtaButton>
            <a href="#methods-grid" className="inline-flex items-center gap-2 h-12 px-7 rounded-xl font-semibold transition-colors" style={{ color: '#1C2A48' }}>
              ↑ Back to methods
            </a>
          </div>
        </Reveal>
      </section>

    </div>
  );
}