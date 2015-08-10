
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var Raffle     = mongoose.model( 'Raffle' );

exports.index = function(req, res){
  Raffle.find( function ( err, raffles, count ){
    res.render( 'index', {
      title : 'Elaine\'s Reverse Raffle',
      raffles : raffles
    });
  });
};

exports.create = function ( req, res ){
  new Raffle({
    content    : req.body.content,
    updated_at : Date.now()
  }).save( function( err, raffle, count ){
    res.redirect( '/' );
  });
};

exports.destroy = function ( req, res ){
  Raffle.findById( req.params.id, function ( err, r ){
    r.remove( function ( err, r ){
      res.redirect( '/' );
    });
  });
};
