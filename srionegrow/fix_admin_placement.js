const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// 1. Ensure passwordState is properly declared
if (!code.includes('const [passwordState, setPasswordState]')) {
  code = code.replace(
    "const [imageFile, setImageFile] = useState(null);",
    "const [imageFile, setImageFile] = useState(null);\r\n  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '', loading: false });"
  );
}

// 2. Remove misplaced activeTab === 'settings' block from inside if (!isAuthenticated) { ... }
const misplacedRegex = /\r?\n\s*\{activeTab === 'settings' && \([\s\S]*?\r?\n\s*\}\)/;
code = code.replace(misplacedRegex, '');

// 3. Now insert the activeTab === 'settings' block right before the final closing </section>
const correctSettingsBlock = `

      {activeTab === 'settings' && (
        <div style={{ maxWidth: '520px', background: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: '8px', color: '#ffffff' }}>Admin Security & Credentials</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Update your admin login password. The new password will be encrypted with bcrypt and stored securely in your MySQL <code style={{ color: 'var(--color-pista)' }}>admins</code> table.
          </p>

          <form onSubmit={handleChangePassword}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff' }}>Current Password</label>
            <input
              type="password"
              required
              value={passwordState.current}
              onChange={e => setPasswordState({ ...passwordState, current: e.target.value })}
              placeholder="Enter current password..."
              style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff' }}>New Password</label>
            <input
              type="password"
              required
              value={passwordState.next}
              onChange={e => setPasswordState({ ...passwordState, next: e.target.value })}
              placeholder="Enter new password (min 6 characters)..."
              style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '800', color: '#ffffff' }}>Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordState.confirm}
              onChange={e => setPasswordState({ ...passwordState, confirm: e.target.value })}
              placeholder="Confirm new password..."
              style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }}
            />

            <button
              type="submit"
              disabled={passwordState.loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: '800' }}
            >
              {passwordState.loading ? 'Updating in Database...' : 'Save New Password to Database'}
            </button>
          </form>
        </div>
      )}`;

// Insert right before the last closing </section>
const lastSectionIdx = code.lastIndexOf('</section>');
code = code.slice(0, lastSectionIdx) + correctSettingsBlock + '\r\n    ' + code.slice(lastSectionIdx);

fs.writeFileSync('src/pages/Admin.jsx', code, 'utf8');
console.log('Admin.jsx fixed successfully!');
