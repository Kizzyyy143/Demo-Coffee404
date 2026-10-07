import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, X } from 'lucide-react';
import Header from '../../components/Header';
import { categoriesAPI } from '../../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category', err);
    }
  };

  return (
    <div className="admin-page-content">
      <Header title="Category Management" />

      <div className="admin-body">
        <div className="admin-toolbar">
          <p className="text-muted">Group your beverages and pastries into organized categories</p>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-admin-card">
              <div className="cat-card-header">
                <div className="cat-icon-wrap">
                  <Layers size={22} />
                </div>
                <div className="cat-card-actions">
                  <button onClick={() => handleOpenEdit(cat)} className="btn-icon-edit"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="btn-icon-del"><Trash2 size={15} /></button>
                </div>
              </div>
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-desc">{cat.description || 'No description provided.'}</p>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

