
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var Raffle     = mongoose.model( 'Raffle' );

function sum( obj ) {
  console.log(obj)
  var sum = 0;
  for( var el in obj ) {
      sum += parseFloat( obj[el].count );
  }
  return sum;
}

exports.index = function(req, res){
  var error = req.query.error;
  Raffle.find( function ( err, raffles, count ){
    var total = sum(raffles);
    res.render( 'index', {
      title : 'Elaine\'s Reverse Raffle',
      raffles : raffles,
      total : total,
      error : error
    });
  });
};

exports.find = function(req, res){
  var error = req.query.error;
  Raffle.find( {email : req.body.email}, function (err, docs) {
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
  // check if exists
  Raffle.aggregate(
    { $group: {
        _id: null,
        total:       { $sum: "$count" }
    }}, function(err, result) { console.log(result); });
  Raffle.find({email : req.body.email}, function (err, docs) {
    if (!docs.length){
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
    } else {
      console.log(docs);
      Raffle.findOneAndUpdate(
        {email: req.body.email},
        { $inc: { count: 1 }},
        { new: false, upsert: false}, function(err, person) {
          if (err) {
            console.log('got an error');
           } console.log}  );
      var error = '?error=User exists. Ticket count incremented.'
      res.redirect( '/'+error );
    }
  });

};

exports.destroy = function ( req, res ){
  Raffle.findById( req.params.id, function ( err, r ){
    r.remove( function ( err, r ){
      res.redirect( '/' );
    });
  });
};
