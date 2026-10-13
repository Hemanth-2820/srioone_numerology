import re

file_path = 'src/pages/Admin.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_table_pattern = re.compile(
    r'<div className="admin-table-container">.*?<table.*?>.*?<thead>.*?</tr>.*?</thead>.*?<tbody>.*?</tbody>.*?</table>\s*</div>',
    re.DOTALL
)

new_table = '''<div className="admin-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#2d3c50', color: '#ffffff' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Customer & Contact</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Items Ordered</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Delivery Address</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '16px', textAlign: 'center' }}>No orders found</td></tr>
              ) : orders.map(o => {
                let parsedItems = [];
                try {
                  if (o.items) parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
                } catch(e) {}

                const custName = o.customer_name || o.name;
                const custEmail = o.customer_email || o.email;
                const custPhone = o.customer_phone || '';
                const address = o.shipping_address || '—';

                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' }}>
                    <td style={{ padding: '12px', fontWeight: '800' }}>
                      #SRIONE{o.id}
                      <br/>
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</small>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700' }}>{custName}</div>
                      <small style={{ color: 'var(--text-secondary)' }}>{custEmail}</small>
                      {custPhone && <div style={{ fontSize: '0.82rem', color: 'var(--color-gold-highlight)', marginTop: '2px' }}>📞 {custPhone}</div>}
                    </td>
                    <td style={{ padding: '12px', maxWidth: '240px' }}>
                      {parsedItems && parsedItems.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {parsedItems.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                              <b>{it.name}</b> <span style={{ color: 'var(--color-gold-highlight)' }}>× {it.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sacred Products</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', maxWidth: '220px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {address}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '800', color: 'var(--color-gold-highlight)' }}>
                      ₹{o.total_amount}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', background: o.status === 'Order Placed' ? 'var(--color-pista)' : (o.status === 'Rejected' || o.status === 'Payment Failed' ? 'red' : 'orange'), color: (o.status === 'Rejected' || o.status === 'Payment Failed') ? 'white' : 'black' }}>
                          {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {o.status !== 'Shipped' && o.status !== 'Delivered' && (
                          <button onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')} style={{ background: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}>Mark Shipped</button>
                        )}
                        {o.status !== 'Delivered' && (
                          <button onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')} style={{ background: 'var(--color-pista)', color: 'var(--text-primary)', border: 'none', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}>Mark Delivered</button>
                        )}
                        {o.status === 'Pending' && (
                          <button onClick={() => handleUpdateOrderStatus(o.id, 'Rejected')} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem' }}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>'''

new_content = old_table_pattern.sub(new_table, content)
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Admin table updated successfully!")
