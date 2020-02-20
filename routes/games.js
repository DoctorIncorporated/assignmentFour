var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var {ensureAuthenticated} = require("../helper/auth");

//load game model
require('../models/Game');
require('../models/User')
var Game = mongoose.model('games');
var User = mongoose.model('users')

//Game Entry CRUD route

router.get('/allgames', function(req, res){
    var usersGames = []

    //Add every other users' games
    User.find().then(function(users){
        Game.find().then(function(games){
            users.forEach(user => {
                games.forEach(game => {
                    if(user._id == game.user){
                        try{
                            if(user._id == req.user.id){
                                game.user = ""
                                usersGames.unshift({
                                    name:"(You) "+user.name,
                                    title:game.title,
                                    price:game.price,
                                    description:game.description
                                })
                            } else {
                                throw ""
                            }
                        }catch{
                            game.user = ""
                            usersGames.push({
                                name:user.name,
                                title:game.title,
                                price:game.price,
                                description:game.description
                            })
                        }
                    }
                })
            })

            //Add games from users who no longer exist
            games.forEach(game => {
                if(game.user != ""){
                    usersGames.push({
                        name:"[DELETED USER]",
                        title:game.title,
                        price:game.price,
                        description:game.description
                    })
                }
            })

            res.render('gameentry/displayall', {
                usersGames:usersGames
            })
        })
    })
})

router.get('/games', ensureAuthenticated, function(req, res){
    Game.find({user:req.user.id}).then(function(games){
        console.log("fetch Route ");
        console.log(games);
        res.render('gameentry/index',{
            games:games
        });
    });
});

router.get('/gameentry/gameentryadd', ensureAuthenticated, function(req, res){
    res.render('gameentry/gameentryadd');
});

router.get('/gameentry/gameentryedit/:id', ensureAuthenticated, function(req, res){
    Game.findOne({
        _id:req.params.id
    }).then(function(game){
        if(game.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/game/games');
        }
        else{
            res.render('gameentry/gameentryedit',{
                game:game
            });
        }
    });
});

//Post Request
router.post('/gameentry', ensureAuthenticated, function(req, res){
    console.log(req.body);
    var errors = [];

    if(!req.body.title){
        errors.push({text:'please add a title'});
    }
    if(!req.body.price){
        errors.push({text:'please add a price'});
    }
    if(!req.body.description){
        errors.push({test:'please add a description'});
    }

    if(errors.length > 0){
        res.render('gameentry/gameentryadd',{
            errors:errors,
            title:req.body.title,
            price:req.body.price,
            description:req.body.description
        });
    }
    else{
        //Send info to database
        // res.send(req.body);
        var newUser = {
            title:req.body.title,
            price:req.body.price,
            description:req.body.description,
            user:req.user.id
        }
        new Game(newUser).save().then(function(){
            //Save game and redirects to game page
            req.flash('success_msg', 'Game Added Successfully');
            res.redirect('games');
        });
    }

    //res.send(req.body);
});

router.put('/gameedit/:id', ensureAuthenticated, function(req,res){
    Game.findOne({
        _id:req.params.id
    }).then(function(game){
        game.title = req.body.title
        game.price = req.body.price
        game.description = req.body.description

        game.save().then(function(game){
            req.flash('success_msg', 'Game Edited Successfully');
            res.redirect('/game/games');
        });
    });
});

router.delete('/gamedelete/:id', ensureAuthenticated, function(req,res){
    Game.deleteOne({
        _id:req.params.id
    }).then(function(){
        req.flash('success_msg', 'Game Deleted Successfully');
        res.redirect('/game/games');
    });
});

module.exports = router;