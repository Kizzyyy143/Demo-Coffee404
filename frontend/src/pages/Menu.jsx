import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Coffee, X, RefreshCw } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [categoryData, productData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setProducts(Array.isArray(productData) ? productData.filter((product) => product.is_available !== false) : []);
    } catch (error) {
      console.error('Failed to load menu data', error);
      setProducts([]);
      setLoadError('We could not load the menu. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const category = categories.find((item) => Number(item.id) === Number(product.category_id));
      const matchesCategory = activeCategory === null || Number(product.category_id) === Number(activeCategory);
      const searchableText = [product.name, product.description, category?.name].filter(Boolean).join(' ').toLocaleLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [products, categories, activeCategory, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  return (
    <main className="menu-page">
      <header className="menu-header-banner-km">
        <div className="menu-banner-content">
          <p className="menu-eyebrow">COFFEE-404 · BKK1, PHNOM PENH</p>
          <h1>Our menu</h1>
          <p>Specialty coffee, handcrafted teas, and fresh pastries.</p>
        </div>
      </header>

      <div className="menu-container">
        <section className="menu-filter-bar" aria-label="Find a product">
          <label className="menu-search-box">
            <Search size={19} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search menu"
              placeholder="Search drinks, ingredients, or categories…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={17} /></button>}
          </label>

          <div className="category-chips" role="group" aria-label="Filter by category">
            <button type="button" className={`category-chip-km ${activeCategory === null ? 'active' : ''}`} onClick={() => setActiveCategory(null)} aria-pressed={activeCategory === null}>All items</button>
            {categories.map((category) => (
              <button key={category.id} type="button" className={`category-chip-km ${Number(activeCategory) === Number(category.id) ? 'active' : ''}`} onClick={() => setActiveCategory(category.id)} aria-pressed={Number(activeCategory) === Number(category.id)}>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="menu-state-message" role="status">Loading the menu…</div>
        ) : loadError ? (
          <div className="menu-state-message menu-load-error" role="alert"><span>{loadError}</span><button type="button" onClick={fetchData}><RefreshCw size={15} /> Retry</button></div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-results-view">
            <Coffee size={42} aria-hidden="true" />
            <h2>{searchQuery.trim() ? 'No matching products' : 'No products in this category yet'}</h2>
            <p>{searchQuery.trim() ? `No results for “${searchQuery.trim()}”. Try another search or category.` : 'Choose another category to see more of our menu.'}</p>
            {(searchQuery || activeCategory !== null) && <button type="button" className="menu-clear-filters" onClick={clearFilters}>Clear search and filters</button>}
          </div>
        ) : (
          <>
            {searchQuery.trim() && <p className="menu-result-count" role="status">{filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for “{searchQuery.trim()}”</p>}
            <div className="products-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />)}
            </div>
          </>
        )}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </main>
  );
};

export default Menu;
