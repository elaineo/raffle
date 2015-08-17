
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var Raffle     = mongoose.model( 'Raffle' );

exports.index = function(req, res){
  var error = req.query.error;
  Raffle.find( function ( err, raffles, count ){
    var total = raffles.length;
    res.render( 'index', {
      title : 'Elaine\'s Reverse Raffle',
      raffles : raffles,
      total : total,
      error : error
    });
  });
};

exports.create = function ( req, res ){
  new Raffle({
    name       : req.body.username,
    email      : req.body.email,
    address    : req.body.address,
    bitcoin    : req.body.bitcoin
  }).save( function( err, raffle, count ){
    var error = '';
    if ( typeof err !== 'undefined' && err )
      error = "?error=" + err
    res.redirect( '/'+error );
  });
};

exports.destroy = function ( req, res ){
  Raffle.findById( req.params.id, function ( err, r ){
    r.remove( function ( err, r ){
      res.redirect( '/' );
    });
  });
};
