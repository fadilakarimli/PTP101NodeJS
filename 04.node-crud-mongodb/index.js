const express = require('express')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const USERNAME = "fadokarim";
const PASSWORD = "Fado123";
const DB_URL = "mongodb+srv://fadokarim:Fado123@cluster0.7ge7nhr.mongodb.net/MovieApp";




const MovieSchema = new Schema({
    title: String,
    language: String,
    releaseDate: Date,
    Duration : Number,
}, { timestamps: true})


const MovieModel = mongoose.model('Movie', MovieSchema)


//get all data
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await MovieModel.find({})

        res.status(200).json({
            message: 'Success',
            data: movies
        })


    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})


app.get('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params
        const movie = await MovieModel.findById(id)

        if (!movie) {
            return res.status(404).json({
                message: 'Movie not found',
                success: false
            })
        }

        res.status(200).json({
            message: 'Success',
            data: movie
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

app.delete('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params 
        const deletedMovie = await MovieModel.findByIdAndDelete(id) 

        if(!deletedMovie){
            return res.status(404).json({
                message: 'Movie not found or already deleted',
                success: false
            }) 
        }

        res.status(200).json({
            message: 'Movie deleted successfully',
            data: deletedMovie
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
})

mongoose.connect(DB_URL)
    .then(() => console.log('Connected!'))
    .catch((err) => console.log(err))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}, link: http://localhost:8080`)
})