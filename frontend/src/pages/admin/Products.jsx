import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Coffee, X, ImagePlus, Upload, LoaderCircle } from 'lucide-react';
import Header from '../../components/Header';
import { productsAPI, categoriesAPI } from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [pageError, setPageError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
  });

  const fetchData = async () => {
    setPageError('');
    try {
      const [prods, cats] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products', err);
      setPageError('Could not load products. Check the backend connection and try again.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: categories[0]?.id || 1,
      image_url: '',
      is_available: true,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      category_id: prod.category_id || (categories[0]?.id || 1),
      image_url: prod.image_url || '',
      is_available: prod.is_available ?? true,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Choose an image file.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setImageUploading(true);
    setFormError('');
    try {
      const uploaded = await productsAPI.uploadImage(file);
      setFormData((current) => ({ ...current, image_url: uploaded.image_url }));
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Could not upload the image. Please try again.');
    } finally {
      setImageUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    setFormError('');
    try {
      const parsedPrice = Number(formData.price);
      const parsedCategory = Number(formData.category_id);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        setFormError('Enter a price greater than zero.');
        return;
      }
      if (!Number.isInteger(parsedCategory) || parsedCategory <= 0) {
        setFormError('Choose a product category.');
        return;
      }
      const payload = {
        ...formData,
        name: formData.name.trim(),
        price: parsedPrice,
        category_id: parsedCategory,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, payload);
      } else {
        await productsAPI.create(payload);
      }
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save product', err);
      setFormError(err.response?.data?.detail || 'Could not save the product. Please try again.');
    } finally {
      setSavingProduct(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-content">
      <Header title="Product Management" />

      <div className="admin-body">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {pageError && <div className="product-page-error" role="alert">{pageError}<button type="button" onClick={fetchData}>Retry</button></div>}

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? <tr><td colSpan="6" className="product-table-message">Loading products…</td></tr> : filtered.length === 0 ? <tr><td colSpan="6" className="product-table-message">{search ? 'No products match your search.' : 'No products yet. Add your first product.'}</td></tr> : filtered.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id);
                return (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url || '/images/coffee-1.png'}
                        alt={product.name}
                        className="table-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/coffee-1.png';
                        }}
                      />
                    </td>
                    <td>
                      <strong className="block">{product.name}</strong>
                  <span className="text-muted text-sm">{product.description ? `${product.description.slice(0, 45)}${product.description.length > 45 ? '…' : ''}` : 'No description'}</span>
                    </td>
                    <td>{cat?.name || 'Uncategorized'}</td>
                    <td className="font-semibold">${Number(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`status-pill ${product.is_available ? 'active' : 'inactive'}`}>
                        {product.is_available ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="btn-icon-edit"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn-icon-del"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label htmlFor="product-name">Product name *</label>
                <input
                  id="product-name"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="product-price">Price (USD) *</label>
                  <input
                    id="product-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="product-category">Category *</label>
                  <select
                    id="product-category"
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-image-file">Product photo</label>
                <div className="product-image-upload-row">
                  <div className="product-image-preview">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Product preview" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/coffee-1.png'; }} />
                    ) : <ImagePlus size={28} aria-hidden="true" />}
                  </div>
                  <div className="product-image-controls">
                    <label htmlFor="product-image-file" className={`product-image-upload-button${imageUploading ? ' uploading' : ''}`}>
                      {imageUploading ? <LoaderCircle size={16} className="spin" /> : <Upload size={16} />}
                      {imageUploading ? 'Uploading photo…' : 'Upload a photo'}
                    </label>
                    <input id="product-image-file" className="visually-hidden-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} disabled={imageUploading} />
                    <span className="product-image-hint">JPG, PNG, WEBP, or GIF · max 5 MB</span>
                  </div>
                </div>
                <label htmlFor="product-image-url">Or paste an image URL</label>
                <input id="product-image-url" type="url" placeholder="https://example.com/product.jpg" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
              </div>

              {formError && <p className="product-form-error" role="alert">{formError}</p>}

              <div className="form-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <span>Product is active and in stock</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={savingProduct || imageUploading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={imageUploading || savingProduct}>
                  {savingProduct ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

