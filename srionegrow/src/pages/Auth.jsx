export default function Auth() {
  return (
    <section className="auth-view" style={{display: 'block'}}>
      <div className="glass-card auth-panel">
        <div className="eyebrow">Welcome back</div>
        <h1>Sign in.</h1>
        <form className="auth-form">
          <label className="field">Email
            <input type="email" required placeholder="you@example.com" />
          </label>
          <label className="field">Password
            <input type="password" required placeholder="Your password" />
          </label>
          <button className="btn btn-primary" type="submit">Enter your space</button>
        </form>
      </div>
    </section>
  );
}
