
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var Raffle     = mongoose.model( 'Raffle' );

function sum( obj ) {
  var sum = 0;
  for( var el in obj ) {
      sum += parseFloat( obj[el].count );
  }
  return sum;
}

exports.index = function(req, res){
  var load_error = req.query.load_error;
  var get_error = req.query.get_error;
  Raffle.find( function ( err, raffles, count ){
    var total = sum(raffles);
    res.render( 'index', {
      title : 'Elaine\'s Reverse Raffle',
      raffles : raffles,
      total : total,
      get_error : get_error,
      load_error : load_error
    });
  });
};

exports.find = function(req, res){
  Raffle.find( {email : req.body.findemail}, function (err, docs) {
    if (!docs.length){
      var error = '?load_error=User does not exist. Sign up for a ticket.'
      res.redirect( '/#getone'+error );
    } else {
      res.redirect( '/show/'+docs[0]._id );
    }
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
          error = "?get_error=" + err
        res.redirect( '/'+error );
      });
    } else {
      console.log(docs);
      var error = '?get_error=User exists. Ticket count incremented.'
      res.redirect('/add/'+ docs[0]._id + error );
    }
  });

};

exports.show = function(req, res){
  var load_error = req.query.load_error;
  var get_error = req.query.get_error;
  var total = 0;
  Raffle.aggregate(
    { $group: {
        _id: null,
        total:       { $sum: "$count" }
    }}, function(err, result) { total = result[0].total;  });
  Raffle.findById( req.params.id, function ( err, r ){
    var userpct =  Number((100*r.count / total).toFixed(2));
    res.render( 'index', {
      title : 'Elaine\'s Reverse Raffle',
      usertotal : r.count,
      userpct: userpct,
      user_id: r._id,
      email: r.email,
      total: total,
      get_error : get_error,
      load_error : load_error
    })

  });
};

exports.destroy = function ( req, res ){
  Raffle.findById( req.params.id, function ( err, r ){
    r.remove( function ( err, r ){
      res.redirect( '/' );
    });
  });
};

exports.add = function ( req, res ){
  var total = 0;
  Raffle.aggregate(
    { $group: {
        _id: null,
        total:       { $sum: "$count" }
    }}, function(err, result) { total = result[0].total;  });

  Raffle.findById( req.params.id, function(err, r) {
    if (err)
      var error = "?load_error="+err
    else
      var error = ''
     // user cannot have more than 5%
     if (r.count+1 > 0.05*(total+1))
       error="?load_error=You are not allowed to have more than 5 of the total tickets."
     else {
       r.count++;
       r.save();
     }
     res.redirect( '/show/'+ req.params.id+error);
   });
};
