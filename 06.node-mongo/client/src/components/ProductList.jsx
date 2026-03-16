import ProductCard from './ProductCard'

function ProductList({ products, onDelete, deletingId, loading }) {
  if (loading) {
    return <p className="status-text">Loading products...</p>
  }

  if (products.length === 0) {
    return <p className="status-text">No products yet. Add your first product.</p>
  }

  return (
    <section className="product-grid" aria-live="polite">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onDelete={onDelete}
          deleting={deletingId === product._id}
        />
      ))}
    </section>
  )
}

export default ProductList
