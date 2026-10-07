import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle2, Clock, Search, Trash2 } from 'lucide-react';
import Header from '../../components/Header';
import { paymentsAPI } from '../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const data = await paymentsAPI.getAll();
      setPayments(data);
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalVolume = payments.reduce((sum, p) => sum + (p.status === 'Completed' ? p.amount : 0), 0);

  const filtered = payments.filter((p) => {
    const matchesMethod = methodFilter === 'All' || p.payment_method === methodFilter;
    const matchesSearch =
      (p.transaction_id && p.transaction_id.toLowerCase().includes(search.toLowerCase())) ||
      String(p.order_id).includes(search);
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="admin-page-content">
      <Header title="Payment Transactions" />

      <div className="admin-body">
        {/* Total stats */}
        <div className="payment-summary-banner">
          <div className="volume-metric">
            <DollarSign size={28} className="text-emerald-600" />
            <div>
              <span className="text-muted text-sm block">Total Settled Volume</span>
              <h2 className="text-2xl font-bold">${totalVolume.toFixed(2)}</h2>
            </div>
          </div>
          <div className="volume-count">
            <span className="text-muted text-sm block">Processed Transactions</span>
            <h2 className="text-2xl font-bold">{payments.length}</h2>
          </div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by transaction ID or Order #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-pill-group">
            {['All', 'Credit Card', 'Mobile Banking', 'Cash'].map((m) => (
              <button
                key={m}
                className={`filter-pill ${methodFilter === m ? 'active' : ''}`}
                onClick={() => setMethodFilter(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order ID</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-sm font-semibold">{item.transaction_id || `TXN-${item.id}`}</td>
                  <td>Order #{item.order_id}</td>
                  <td>
                    <span className="method-pill">{item.payment_method}</span>
                  </td>
                  <td className="font-semibold">${Number(item.amount).toFixed(2)}</td>
                  <td>
                    <span className="status-badge status-completed">
                      <CheckCircle2 size={13} /> {item.status}
                    </span>
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;

