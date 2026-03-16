function ProductCard({ product, onDelete, deleting }) {
  const imageUrl = product.images?.[0]

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {imageUrl ? (
          <img className="product-card__image" src={imageUrl} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">No image</div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__meta">
          <span>${Number(product.price).toFixed(2)}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <button
          type="button"
          className="danger-btn"
          onClick={() => onDelete(product._id)}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
