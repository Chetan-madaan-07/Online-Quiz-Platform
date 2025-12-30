function HeroSection() {
  return (
    <section className="hero">
 
      <div className="hero-badge">
        1,240 Players Online
      </div>
      <h1 className="hero-title">
        Trivia <span>Battle</span><br />
        Royale
      </h1>
      <p className="hero-desc">
        Challenge opponents worldwide in real-time quiz battles.
        Prove your knowledge and climb the ranks.
      </p>
      <div className="hero-actions">
        <button className="primary-btn">Find Match</button>
        <button className="secondary-btn">Global Rankings</button>
      </div>
    </section>
  );
}

export default HeroSection;
