import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } })
};

export default function Vision() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#fdfaf7', minHeight: '100vh', color: '#2a3a4a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        .vision-serif { font-family: 'DM Serif Display', Georgia, serif; }
      `}</style>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '72px 44px 96px' }}>

        {/* HEADER */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="vision-serif" style={{ fontSize: 48, color: '#2a3a4a', letterSpacing: '-0.02em', marginBottom: 10 }}>StoryLeap</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a867d' }}>Company Vision</div>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #f5e0f0, #dce8f5)', borderRadius: 999, margin: '18px auto' }} />
        </motion.div>

        {/* ORIGIN */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{ background: 'linear-gradient(160deg, #2a3a4a 0%, #3a4a66 60%, #5a7a9a 100%)', borderRadius: 28, padding: '52px 56px', marginBottom: 64, position: 'relative', overflow: 'hidden', boxShadow: '0 18px 40px rgba(42,58,74,0.10)' }}>
          <div style={{ position: 'absolute', top: -30, left: 16, fontSize: 220, color: 'rgba(255,255,255,0.04)', fontFamily: 'Georgia, serif', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>"</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f5e0f0', opacity: 0.8, marginBottom: 22 }}>Where It Started</div>
          <p className="vision-serif" style={{ fontSize: 23, fontStyle: 'italic', lineHeight: 1.72, color: 'rgba(253,250,247,0.92)' }}>
            In the early days of the war, we watched families navigate fear, separation, and uncertainty with their children, without the knowledge or tools to help them through it. We saw parents who loved their children deeply, but felt helpless. We knew technology could do better. So we started building.
          </p>
        </motion.div>

        {/* WHAT WE BELIEVE */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2} style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>What We Believe</div>
          <div className="vision-serif" style={{ fontSize: 34, color: '#2a3a4a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 22 }}>Every child's story is their own.</div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', marginBottom: 16, maxWidth: '66ch' }}>
            Children are not a category. Every child carries a unique emotional world, shaped by their family, their experiences, their fears, and their strengths. <strong style={{ fontWeight: 600, color: '#2a3a4a' }}>Generic support often fails them</strong>, not because the intention is not there, but because it does not speak to who they actually are.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', marginBottom: 16, maxWidth: '66ch' }}>
            We believe that <strong style={{ fontWeight: 600, color: '#2a3a4a' }}>parents are the most powerful force in a child's emotional life.</strong> Not therapists, not teachers — parents. The problem is not that parents do not care. It is that they often lack the tools, the language, or the guidance to translate that care into the right kind of support. And when they cannot help, they feel it deeply.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', maxWidth: '66ch' }}>
            We also believe that <strong style={{ fontWeight: 600, color: '#2a3a4a' }}>therapists and professionals deserve better tools.</strong> The methods they use are proven. What is missing is the technology to deliver those methods faster, more personally, and with greater reach. StoryLeap builds that technology.
          </p>
        </motion.div>

        {/* WHO WE SERVE */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>Who We Serve</div>
          <div className="vision-serif" style={{ fontSize: 34, color: '#2a3a4a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>Three partners. One journey.</div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 60 }}>
          {[
            { icon: '🩺', role: 'The Therapist', desc: 'We give professionals AI-powered tools to create personalized therapeutic content for each child they work with, extending their impact beyond the session.', tag: 'Primary Partner' },
            { icon: '👨‍👩‍👧', role: 'The Parent', desc: 'We give parents the tools, language, and guidance to continue the emotional work at home, turning good intentions into confident, effective support.', tag: 'Operator at Home' },
            { icon: '🌱', role: 'The Child', desc: 'Every story, video, and exercise is built around them. They see themselves as the hero, build real coping tools, and grow through challenges they once faced alone.', tag: 'Ultimate Beneficiary' },
          ].map((s) => (
            <div key={s.role} style={{ background: 'linear-gradient(135deg, #f5e0f0 0%, #f0e8f5 55%, #dce8f5 100%)', borderRadius: 20, padding: '28px 24px', boxShadow: '0 12px 40px rgba(245,224,240,0.55)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div className="vision-serif" style={{ fontSize: 18, color: '#2a3a4a', marginBottom: 8 }}>{s.role}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: '#5e5b54' }}>{s.desc}</div>
              <div style={{ display: 'inline-block', marginTop: 12, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a7a9a', background: 'rgba(255,255,255,0.6)', borderRadius: 999, padding: '3px 10px' }}>{s.tag}</div>
            </div>
          ))}
        </motion.div>

        {/* PARENT'S JOURNEY */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
          style={{ background: '#fff', borderRadius: 28, padding: '44px 48px', marginBottom: 60, boxShadow: '0 8px 20px rgba(42,58,74,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>The Parent's Journey</div>
          <div className="vision-serif" style={{ fontSize: 30, color: '#2a3a4a', marginBottom: 36, letterSpacing: '-0.02em' }}>From helpless to equipped.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { emoji: '😔', emotion: 'Frustrated', sub: 'My child is struggling and I do not know what to do' },
              { emoji: '💛', emotion: 'Relieved', sub: 'This is okay. We are not alone in this' },
              { emoji: '🤝', emotion: 'Connected', sub: 'I have tools. I can do this with my child' },
              { emoji: '🌿', emotion: 'Empowered', sub: 'We grew through this together' },
            ].map((step, i) => (
              <div key={step.emotion} style={{ textAlign: 'center', position: 'relative', padding: '0 8px' }}>
                {i < 3 && <div style={{ position: 'absolute', right: -4, top: 22, width: 8, height: 2, background: '#d8d5cf', borderRadius: 999 }} />}
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'linear-gradient(135deg, #f5e0f0 0%, #f0e8f5 55%, #dce8f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, margin: '0 auto 14px', boxShadow: '0 12px 40px rgba(245,224,240,0.55)' }}>{step.emoji}</div>
                <div className="vision-serif" style={{ fontSize: 16, color: '#2a3a4a', marginBottom: 6 }}>{step.emotion}</div>
                <div style={{ fontSize: 12, color: '#8a867d', lineHeight: 1.55, padding: '0 4px' }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VALUES */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={6} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>Our Values</div>
          <div className="vision-serif" style={{ fontSize: 34, color: '#2a3a4a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>What we will never compromise on.</div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
          {[
            { icon: '👨‍👩‍👧', name: 'Parents First', desc: 'Parents are the key to a child\'s emotional resilience. We build tools that give them knowledge, confidence, and a clear way in.', color: '#c4a0d0' },
            { icon: '🌀', name: 'Radical Personalization', desc: 'Every child has their own emotions and story. We will never offer a one-size-fits-all answer to something as personal as a child\'s inner world.', color: '#5a7a9a' },
            { icon: '🔍', name: 'Honest Transparency', desc: 'It is okay to make mistakes, as long as we show them, talk about them, and fix them. We hold ourselves to this as a company and model it for the families we serve.', color: '#9ab8d0' },
            { icon: '⚡', name: 'Technology With Purpose', desc: 'We harness what AI makes possible, not for its own sake, but to give therapists, parents, and children better tools than they have ever had before.', color: '#b0c9a0' },
          ].map((v) => (
            <div key={v.name} style={{ background: '#fff', borderRadius: 20, padding: '28px 30px', boxShadow: '0 2px 6px rgba(42,58,74,0.06)', borderTop: `3px solid ${v.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{v.icon}</div>
              <div className="vision-serif" style={{ fontSize: 20, color: '#2a3a4a', marginBottom: 10, letterSpacing: '-0.01em' }}>{v.name}</div>
              <div style={{ fontSize: 14, lineHeight: 1.72, color: '#8a867d' }}>{v.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* 10-YEAR VISION */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
          style={{ background: 'linear-gradient(160deg, #2a3a4a 0%, #3a4a66 60%, #5a7a9a 100%)', borderRadius: 28, padding: '52px 56px', margin: '60px 0', boxShadow: '0 18px 40px rgba(42,58,74,0.10)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f5e0f0', opacity: 0.8, marginBottom: 22 }}>10-Year Vision</div>
          <div className="vision-serif" style={{ fontSize: 27, fontStyle: 'italic', lineHeight: 1.68, color: 'rgba(253,250,247,0.92)' }}>
            StoryLeap will be the <span style={{ fontStyle: 'normal', color: '#dce8f5' }}>compass for children's emotional development</span> — a platform that helps parents navigate the challenges their children face, and gives therapists and professionals the tools to guide, track, and support their clients' journeys with clarity and confidence.
            <br /><br />
            A world where no parent feels helpless, and no child faces their challenges alone.
          </div>
        </motion.div>

        {/* HOW WE GET THERE */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>How We Get There</div>
          <div className="vision-serif" style={{ fontSize: 34, color: '#2a3a4a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 22 }}>Step by step, story by story.</div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', marginBottom: 16, maxWidth: '66ch' }}>
            We start where the need is most immediate: <strong style={{ fontWeight: 600, color: '#2a3a4a' }}>personalized therapeutic stories</strong> built around each child's real challenge, grounded in clinical methods therapists already use. We prove it works. We listen to families and professionals. We refine until the product earns trust.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', marginBottom: 16, maxWidth: '66ch' }}>
            From there, we expand. Stories become videos, art, and games — a full toolkit of therapeutic content that therapists can use with their patients, and parents can continue at home between sessions. The practitioner and the parent work together, with StoryLeap as the bridge between them.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#5e5b54', maxWidth: '66ch' }}>
            Over time, that bridge becomes a platform — one that connects the clinical world with the home, makes professional-grade emotional support accessible to every family, and turns the distance between "I do not know how to help" and "I know exactly what to do" into something we can close, together.
          </p>
        </motion.div>

        {/* ROADMAP */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={10} style={{ marginBottom: 20, marginTop: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a7a9a', marginBottom: 12 }}>The Journey Ahead</div>
          <div className="vision-serif" style={{ fontSize: 34, color: '#2a3a4a', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 24 }}>From stories to a full platform.</div>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={11}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 80 }}>
          {[
            { num: 'Now', title: 'Personalized Stories', desc: 'Therapeutic storybooks built around each child\'s real challenge, grounded in bibliotherapy and CBT. Proving the model works with real families and professionals.' },
            { num: 'Next', title: "A Therapist's Toolkit", desc: 'Stories expand into videos, art exercises, and games. Therapists get a platform to assign, track, and adapt personalized content for each patient they work with.' },
            { num: 'Vision', title: 'The Emotional Navigator', desc: "A platform that guides families through every stage of a child's emotional development, connecting therapists and parents around each child's unique journey." },
          ].map((r) => (
            <div key={r.num} style={{ background: '#fff', borderRadius: 14, padding: '24px 22px', boxShadow: '0 2px 6px rgba(42,58,74,0.06)', borderLeft: '3px solid #dce8f5' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a867d', marginBottom: 10 }}>{r.num}</div>
              <div className="vision-serif" style={{ fontSize: 18, color: '#2a3a4a', marginBottom: 8 }}>{r.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: '#8a867d' }}>{r.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* CLOSING */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={12}
          style={{ textAlign: 'center', paddingTop: 52, borderTop: '1px solid rgba(42,58,74,0.10)' }}>
          <p className="vision-serif" style={{ fontSize: 21, fontStyle: 'italic', color: '#8a867d', lineHeight: 1.72, maxWidth: '54ch', margin: '0 auto 20px' }}>
            We did not start this because it was a good market opportunity. We started it because we saw children who needed help, and parents who wanted to give it, and knew we could build the bridge between them.
          </p>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #f5e0f0, #dce8f5)', borderRadius: 999, margin: '0 auto 20px' }} />
          <div className="vision-serif" style={{ fontSize: 20, color: '#2a3a4a', letterSpacing: '-0.01em' }}>StoryLeap</div>
        </motion.div>

      </div>
    </div>
  );
}