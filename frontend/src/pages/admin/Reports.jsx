import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Award, Calendar } from 'lucide-react';
import Header from '../../components/Header';
import { reportsAPI } from '../../services/api';
import { formatUSD } from '../../services/khmerUtils';

const Reports = () => {
  const [period, setPeriod] = useState('month');
  const [dashboardData, setDashboardData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const [dash, top, sum] = await Promise.all([
          reportsAPI.getDashboard(period),
          reportsAPI.getTopProducts(period),
          reportsAPI.getSalesSummary(period),
        ]);
        if (!isCurrentRequest) return;
        setDashboardData(dash);
        setTopProducts(top);
        setStatusSummary(sum);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };

    fetchReports();
    return () => {
      isCurrentRequest = false;
    };
  }, [period]);

  const periodLabels = {
    day: '1 Day',
    week: '1 Week',
    month: '1 Month',
    year: '1 Year',
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Product,Units Sold,Revenue\n' +
      topProducts.map((p) => `"${p.product_name}",${p.total_sold},${p.total_revenue}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'coffee_shop_sales_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page-content">
      <Header title="Business Intelligence & Reports" />

      <div className="admin-body">
        <div className="reports-top-bar">
          <div className="report-period-selector">
            <Calendar size={18} />
            <label htmlFor="report-period">Performance period</label>
            <select
              id="report-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Report period"
            >
              {Object.entries(periodLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button className="btn-secondary" onClick={handleExportCSV} disabled={loading}>
            <Download size={16} /> Export Sales CSV
          </button>
        </div>

        <div className="reports-grid">
          {/* Revenue Breakdown */}
          <div className="report-card">
            <div className="card-header-row">
              <h3>Revenue Performance</h3>
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div className="revenue-large-display">
              <span className="big-amount">
                {formatUSD(dashboardData?.total_sales || 0)}
              </span>
              <span className="text-muted text-sm block">Order revenue excluding cancelled and refunded orders</span>
            </div>

            <div className="breakdown-stat-rows">
              <div className="stat-subrow">
                <span>Average Order Value:</span>
                <strong>
                  {dashboardData?.revenue_order_count
                    ? formatUSD(dashboardData.total_sales / dashboardData.revenue_order_count)
                    : formatUSD(0)}
                </strong>
              </div>
              <div className="stat-subrow">
                <span>Active Customer Accounts:</span>
                <strong>{dashboardData?.total_customers || 0}</strong>
              </div>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="report-card">
            <h3>Order Status Breakdown</h3>
            <div className="status-bars-list">
              {loading ? (
                <p className="text-muted text-sm">Loading report…</p>
              ) : Object.keys(statusSummary).length === 0 ? (
                <p className="text-muted text-sm">No orders yet.</p>
              ) : (
                Object.entries(statusSummary).map(([status, count]) => (
                  <div key={status} className="status-progress-item">
                    <div className="status-progress-labels">
                      <span>{status}</span>
                      <strong>{count} orders</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, (count / (dashboardData?.total_orders || 1)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="panel-box top-sellers-panel">
          <div className="panel-header">
            <h3>Best Selling Beverages & Food</h3>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Total Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">#{idx + 1}</td>
                    <td>{prod.product_name}</td>
                    <td>{prod.total_sold} cups</td>
                    <td className="font-semibold text-emerald-600">
                      {formatUSD(prod.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

