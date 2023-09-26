const { Error } = require('sequelize');
const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment');
const { isError } = require('lodash');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd')
    },
    create: function (req, res) {
        // TODO
        const {title,rating,awards,release_date,length} = req.body
       //hacemos referencia al nombre de las columnas
        db.movie.create({
            title :title.trim(),
            rating,
            awards,
            release_date,
            length
        })
        return res.send(req.body)//viene por post
    },
    edit: function(req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                
                return res.render('moviesEdit',{
                    Movie : movie                   //la vista esperoa que se envie con mayuscula
                })
            }).catch(error => console.log(error))
    },
    update: function (req,res) {
        // TODO
        const {title,rating,awards,release_date,length} = req.body

        db.Movie.update(
            {
                title :title.trim(),
                rating,
                awards,
                release_date,
                length
            },
            {
               where:{
                id : req.params.id
               } 
            }
        ).then(response => {
            console.log(response);
            db.Movie.findByPk(req.params.id)
                .then(movie =>{
                    return res.render('moviesDetail',{
                        movie
                    })
                })
        }).catch(error=>console.log(error))

    },
    delete: function (req, res) {
        // TODO
        db.Movie.findByPk(req.params.id)
        .then(movuie =>{
            return res.render('moviesDelete',{
                movie
            })
        }).catch(error => console.log(error))
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where:{
                id:req.params.id
            }
        }).then(movie =>{
            return res.render('/movies',{
                movie
            })
        }).catch(error => console.log(Error))
    }

}

module.exports = moviesController;