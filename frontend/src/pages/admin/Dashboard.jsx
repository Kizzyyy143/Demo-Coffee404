import React, { useCallback, useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Coffee, TrendingUp, RefreshCw, AlertCircle, Package } from 'lucide-react';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import OrderTable from '../../components/OrderTable';
import { reportsAPI, ordersAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { formatUSD, formatKHR } from '../../services/khmerUtils';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [dashData, topData] = await Promise.all([
        reportsAPI.getDashboard(),
        reportsAPI.getTopProducts(),
      ]);
      setMetrics(dashData);
      setTopProducts(Array.isArray(topData) ? topData : []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError('Could not load dashboard data. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update order status', err);
      setError('Could not update the order status. Please try again.');
    }
  };

  const statValue = (value) => loading && !metrics ? 'Loading…' : value ?? '—';

  return (
    <div className="admin-page-content">
      <Header title="Store overview" />
      <div className="admin-body dashboard-body">
        <div className="dashboard-welcome-row">
          <div>
            <p className="dashboard-kicker">COFFEE-404 ADMIN</p>
            <h2>Welcome to your dashboard</h2>
            <p>Monitor sales, orders, and daily operations.</p>
          </div>
          <button type="button" className="dashboard-refresh" onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing…' : 'Refresh data'}
          </button>
        </div>

        {error && <div className="dashboard-error" role="alert"><AlertCircle size={18} /><span>{error}</span></div>}

        <div className="stats-grid">
          <StatCard title="Total revenue" value={metrics ? `${formatUSD(metrics.total_sales)} · ${formatKHR(metrics.total_sales)}` : statValue(null)} icon={DollarSign} color="emerald" />
          <StatCard title="Total orders" value={statValue(metrics?.total_orders)} icon={ShoppingBag} color="amber" />
          <StatCard title="Customers" value={statValue(metrics?.total_customers)} icon={Users} color="blue" />
          <StatCard title="Low stock items" value={statValue(metrics?.low_stock_count)} icon={AlertTriangle} color="rose" />
          <StatCard title="Active products" value={statValue(metrics?.total_products)} icon={Package} color="purple" />
        </div>

        <div className="quick-actions-bar">
          <Link to="/admin/products" className="quick-action-pill"><Coffee size={16} /> Manage products</Link>
          <Link to="/admin/inventory" className="quick-action-pill"><AlertTriangle size={16} /> Check inventory</Link>
          <Link to="/admin/reports" className="quick-action-pill"><TrendingUp size={16} /> View reports</Link>
        </div>

        <div className="dashboard-grid-split">
          <section className="panel-box orders-panel">
            <div className="panel-header"><h2>Recent orders</h2><Link to="/admin/orders" className="view-all-link">View all</Link></div>
            {loading && !metrics ? <div className="dashboard-loading">Loading recent orders…</div> : <OrderTable orders={metrics?.recent_orders || []} onUpdateStatus={handleUpdateOrderStatus} />}
          </section>

          <section className="panel-box top-products-panel">
            <div className="panel-header"><h2>Top products</h2></div>
            <div className="top-products-list">
              {loading && !metrics ? <div className="dashboard-loading">Loading product data…</div> : topProducts.length ? topProducts.map((product, index) => (
                <div key={`${product.product_name}-${index}`} className="top-product-row">
                  <span className="rank-num">{String(index + 1).padStart(2, '0')}</span>
                  <div className="top-prod-info"><span className="prod-name">{product.product_name}</span><span className="prod-meta">{product.total_sold} sold</span></div>
                  <span className="prod-revenue">{formatUSD(Number(product.total_revenue || 0))}</span>
                </div>
              )) : <div className="no-data-msg">No product sales yet.</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
