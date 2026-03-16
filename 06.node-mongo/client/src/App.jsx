import { useEffect, useMemo, useState } from 'react'
import AddProductForm from './components/AddProductForm'
import ProductList from './components/ProductList'
import './App.css'

const API_BASE_URL = 'http://localhost:8080/api'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [addingProduct, setAddingProduct] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [products],
  )

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingProducts(true)
        setErrorMessage('')

        const productsResponse = await fetch(`${API_BASE_URL}/products`)

        if (!productsResponse.ok) {
          throw new Error('Failed to load products')
        }

        const productsJson = await productsResponse.json()
        setProducts(productsJson)

        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`)

        if (categoriesResponse.ok) {
          const categoriesJson = await categoriesResponse.json()
          setCategories(categoriesJson)
        }
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong')
      } finally {
        setLoadingProducts(false)
      }
    }

    loadInitialData()
  }, [])

  const handleAddProduct = async (newProduct) => {
    try {
      setErrorMessage('')
      setAddingProduct(true)

      const formData = new FormData()
      formData.append('name', newProduct.name)
      formData.append('description', newProduct.description)
      formData.append('price', String(newProduct.price))
      formData.append('stock', String(newProduct.stock))
      formData.append('category', newProduct.category)

      ;(newProduct.images || []).forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Product could not be added')
      }

      const createdProduct = await response.json()
      setProducts((prev) => [createdProduct, ...prev])
      setShowAddForm(false)
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setAddingProduct(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      setErrorMessage('')
      setDeletingId(id)

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Product could not be deleted')
      }

      setProducts((prev) => prev.filter((product) => product._id !== id))
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="kicker">Inventory</p>
          <h1>Products</h1>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? 'Close Form' : 'Add New Product'}
        </button>
      </header>

      {showAddForm && (
        <AddProductForm
          categories={categories}
          onAdd={handleAddProduct}
          adding={addingProduct}
        />
      )}

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <ProductList
        products={sortedProducts}
        onDelete={handleDeleteProduct}
        deletingId={deletingId}
        loading={loadingProducts}
      />
    </main>
  )
}

export default App
