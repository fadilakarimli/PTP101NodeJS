import { useState } from 'react'

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
}

function AddProductForm({ categories, onAdd, adding }) {
  const [formData, setFormData] = useState(initialForm)
  const [images, setImages] = useState([])
  const [fileInputKey, setFileInputKey] = useState(0)

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()

    onAdd({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      images,
    })

    setFormData((prev) => ({
      ...initialForm,
      category: prev.category,
    }))
    setImages([])
    setFileInputKey((prev) => prev + 1)
  }

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <h2>Add Product</h2>

      <div className="add-form__grid">
        <input
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={onChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={onChange}
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={onChange}
          min="0"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={onChange}
          required
          disabled={categories.length === 0}
        >
          <option value="">
            {categories.length === 0 ? 'No category found' : 'Select category'}
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          key={fileInputKey}
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={(event) => setImages(Array.from(event.target.files || []))}
          className="full-width"
        />
      </div>

      <button type="submit" className="primary-btn" disabled={adding || categories.length === 0}>
        {adding ? 'Adding...' : 'Add'}
      </button>
    </form>
  )
}

export default AddProductForm
