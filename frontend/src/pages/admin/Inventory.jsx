import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, Package, X } from 'lucide-react';
import Header from '../../components/Header';
import { inventoryAPI } from '../../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    category: 'Beans',
    quantity: 10,
    unit: 'kg',
    min_threshold: 5,
    cost_per_unit: 10,
  });

  const fetchInventory = async () => {
    try {
      const data = await inventoryAPI.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Failed to load inventory', err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      item_name: '',
      category: 'Beans',
      quantity: 10,
      unit: 'kg',
      min_threshold: 5,
      cost_per_unit: 10,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      item_name: item.item_name,
      category: item.category || 'Beans',
      quantity: item.quantity,
      unit: item.unit || 'kg',
      min_threshold: item.min_threshold,
      cost_per_unit: item.cost_per_unit || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete inventory item?')) {
      try {
        await inventoryAPI.delete(id);
        fetchInventory();
      } catch (err) {
        console.error('Failed to delete item', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        min_threshold: parseFloat(formData.min_threshold),
        cost_per_unit: parseFloat(formData.cost_per_unit),
      };

      if (editingItem) {
        await inventoryAPI.update(editingItem.id, payload);
      } else {
        await inventoryAPI.create(payload);
      }
      setShowModal(false);
      fetchInventory();
    } catch (err) {
      console.error('Failed to save inventory item', err);
    }
  };

  const filtered = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-content">
      <Header title="Raw Ingredients & Inventory" />

      <div className="admin-body">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search coffee beans, milks, syrups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Stock Item
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Unit Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isLow = item.quantity <= item.min_threshold;
                return (
                  <tr key={item.id} className={isLow ? 'row-alert' : ''}>
                    <td>
                      <div className="stock-title-cell">
                        <Package size={16} />
                        <strong>{item.item_name}</strong>
                      </div>
                    </td>
                    <td><span className="badge-category">{item.category}</span></td>
                    <td>
                      <strong>{item.quantity} {item.unit}</strong>
                      <span className="text-muted text-xs block">Min: {item.min_threshold} {item.unit}</span>
                    </td>
                    <td>${Number(item.cost_per_unit).toFixed(2)} / {item.unit}</td>
                    <td>
                      {isLow ? (
                        <span className="stock-warning-badge">
                          <AlertTriangle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="stock-ok-badge">
                          <CheckCircle size={14} /> Optimal
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => handleOpenEdit(item)} className="btn-icon-edit"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(item.id)} className="btn-icon-del"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Inventory Item' : 'New Inventory Item'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Beans">Beans & Roast</option>
                    <option value="Dairy">Dairy & Plant Milk</option>
                    <option value="Tea">Matcha & Tea</option>
                    <option value="Syrups">Flavor Syrups</option>
                    <option value="Packaging">Takeout & Cups</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit of Measure</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Current Quantity *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Threshold *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.min_threshold}
                    onChange={(e) => setFormData({ ...formData, min_threshold: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Cost Per Unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost_per_unit}
                  onChange={(e) => setFormData({ ...formData, cost_per_unit: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

