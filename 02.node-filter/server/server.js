const express = require('express')
const { nanoid } = require('nanoid')
const app = express()
const port = 8080


// middleware
app.use(express.json())
const blogs = require('./data')



app.get('/', (req, res) => {
  res.send(`<h1>Hello World!</h1>`)
})


app.get('/message', (req, res) => {
  //   res.send({
  //     message: 'Hello World!',
  //     status: 'success',
  //     error: null
  //   })

  res.json({
    message: 'Hello World!',
    status: 'success',
    error: null
  })
})


app.get('/api/blogs', (req, res) => {
  try {
    console.log('query', req.query);

    const { search = '', sort, order = 'asc', page = 1, limit = 10 } = req.query

    let filteredBlogs = blogs.filter((blog) => blog.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      || blog.category.toLocaleLowerCase().includes(search.toLocaleLowerCase()))


    if (sort) {
      filteredBlogs = filteredBlogs.sort((a, b) => {
        if (typeof a[sort] === 'string') {
          return order === 'asc' ? a[sort].toLocaleLowerCase().localeCompare(b[sort].toLocaleLowerCase()) : b[sort].toLocaleLowerCase().localeCompare(a[sort].toLocaleLowerCase())
        } else {
          return order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
        }
      })
    }


    // console.log(filteredBlogs.length, 'filteredBlogs length');
 
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + Number(limit)

   const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

  //  console.log(filteredBlogs.length);
   
    

    res.status(200).json({
      data: paginatedBlogs,
      message: 'Blogs retrieved successfully',
      success: true,
      error: null,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredBlogs.length,
        totalPages: Math.ceil(filteredBlogs.length / limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})



//get by id blog
app.get('/api/blogs/:id', (req, res) => {
  try {
    const { id } = req.params
    const blog = blogs.find((blog) => blog.id === id)

    if (!blog) {
      return res.status(404).json({
        data: null,
        message: 'Blog not found',
      })
    }

    res.status(200).json({
      data: blog,
      message: 'Blog retrieved successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }

})


// delete blog by id
app.delete('/api/blogs/:id', (req, res) => {
  try {
    const { id } = req.params

    const idx = blogs.findIndex((blog) => blog.id === id)


    if (idx === -1) {
      return res.status(404).json({
        message: 'Blog not found',
      })
    }

    const deletedBlog = blogs.splice(idx, 1)

    res.status(200).json({
      message: 'Blog deleted successfully',
      deletedBlog: deletedBlog[0],
      updatedBlogs: blogs
    })


  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})



app.post('/api/blogs', (req, res) => {
  try {
    const { title, category, desc,image,tags } = req.body

    if (!title || !category || !desc || !image || !tags) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }
    const newBlog = {
      id: nanoid(8),
      ...req.body
    }

    // const updatedBlogs = [...blogs, newBlog]
    blogs.push(newBlog)

    res.status(201).json({
      message: 'Blog created successfully',
      blog: newBlog,
      updatedBlogs: blogs
    })

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      status: 'error',
      error: error.message
    })
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}, url: http://localhost:${port}`);
})
