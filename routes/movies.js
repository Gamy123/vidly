const {Movie, validate} = require('../models/movie');
const {Zanra, validateZanra, zanraSchema} = require('../models/zanra');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
 

router.get("/",async(req,res)=>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
})
router.get('/:id',async(req,res)=>{
    try{
    const movie = await Movie.findById(req.params.id)
    if(!movie){
        res.status(404).send("Indavlid ID")
    }}
    catch(err){
        res.send("Indavild ID")
        return
    }
    res.send(movie)
})

router.put("/:id",async(req,res)=>{
    try{
        const genre = await Zanra.findById(req.body.genreId);
        if (!genre) {
          return res.status(400).send('Invalid genre');
        }
        var movie = await Movie.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            genreId: genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        },{ new: true })
        res.send(movie)
    }
    catch(err){
        res.send(err.message)
    }
})

router.post('/', async (req, res) => {
    try {
      const { error } = validate(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const genre = await Zanra.findById(req.body.genreId);
      if (!genre) {
        return res.status(400).send('Invalid genre');
      }
  
      const movie = new Movie({
        title: req.body.title,
        genreId: {
            _Id:genre.id,
            name:genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      });
  
      await movie.save();
      res.send(movie);
      console.log("Created successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

module.exports= router;