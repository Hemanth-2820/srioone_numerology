$content = Get-Content src\pages\Admin.jsx -Raw
$target = '<textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter customer-facing description..." style={{ width: ''100%'', minHeight: ''90px'', padding: ''10px'', borderRadius: ''6px'', border: ''1px solid var(--border-subtle)'', background: ''var(--bg-secondary)'', color: ''#ffffff'', boxSizing: ''border-box'' }} />'

$replacement = @"
<textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Enter customer-facing description..." style={{ width: '100%', minHeight: '90px', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff', boxSizing: 'border-box' }} />
            
            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Primary Material</label>
            <input type="text" value={formData.material || ''} onChange={e => setFormData({...formData, material: e.target.value})} placeholder="e.g. 7 Rough Raw Natural Gemstones..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff' }} />

            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Traditional Purpose</label>
            <input type="text" value={formData.purpose || ''} onChange={e => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Doorway & Meditation Corner Hanger..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff' }} />

            <label style={{ display: 'block', marginTop: '16px', marginBottom: '8px', fontWeight: '800' }}>Care & Cleansing</label>
            <input type="text" value={formData.care || ''} onChange={e => setFormData({...formData, care: e.target.value})} placeholder="e.g. Hang securely away from extreme dampness..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', color: '#ffffff' }} />
"@

$newContent = $content.Replace($target, $replacement)
Set-Content src\pages\Admin.jsx -Value $newContent -NoNewline
Write-Output "Successfully updated Admin.jsx form inputs"
