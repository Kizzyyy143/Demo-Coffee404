import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { formatUSD, formatKHR } from '../services/khmerUtils';

const OrderTable = ({ orders = [], onUpdateStatus, onViewDetails }) => {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <span className="status-badge status-completed"><CheckCircle2 size={14} /> រួចរាល់ (Completed)</span>;
      case 'preparing':
        return <span className="status-badge status-preparing"><Clock size={14} /> កំពុងឆុង (Preparing)</span>;
      case 'ready':
        return <span className="status-badge status-ready"><CheckCircle2 size={14} /> រង់ចាំទទួល (Ready)</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled"><XCircle size={14} /> បោះបង់ (Cancelled)</span>;
      default:
        return <span className="status-badge status-pending"><AlertCircle size={14} /> រង់ចាំ (Pending)</span>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case 'paid':
        return <span className="badge-payment paid">បង់រួច (Paid)</span>;
      case 'refunded':
        return <span className="badge-payment refunded">បានដកប្រាក់វិញ</span>;
      default:
        return <span className="badge-payment unpaid">មិនទាន់បង់ (Unpaid)</span>;
    }
  };

  if (!orders || orders.length === 0) {
    return <div className="no-data-msg">No orders recorded yet.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Date & Time</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            {onUpdateStatus && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="font-mono font-semibold">{order.order_number}</td>
              <td>{order.customer_name}</td>
              <td className="text-muted">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Today'}
              </td>
              <td>
                {order.items && order.items.length > 0 ? (
                  <span className="items-summary">
                    {order.items.map((it) => `${it.quantity}x ${it.product_name}`).join(', ')}
                  </span>
                ) : (
                  <span className="text-muted">1 item</span>
                )}
              </td>
              <td className="font-semibold">
                <div>
                  <span className="block">{formatUSD(order.total_amount)}</span>
                  <span className="text-xs text-amber-700 block font-normal">{formatKHR(order.total_amount)}</span>
                </div>
              </td>
              <td>{getPaymentBadge(order.payment_status)}</td>
              <td>{getStatusBadge(order.status)}</td>
              {onUpdateStatus && (
                <td>
                  <div className="table-actions">
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

