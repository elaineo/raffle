var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Raffle = new Schema({
    name       : String,
    email      : String,
    address    : String,
    bitcoin    : String,
    count    : Number,
    created_at : Date,
    updated_at : Date
});


Raffle.methods.findByEmail = function (email) {
    return this.model('Raffle').find({email: this.email}, email)
}
Raffle.statics.addTicket = function (email) {
    console.log("email");
    return
}
Raffle.methods.addTicket2 = function (cb) {
    this.count++;
    this.save();
    return
}

var raffleDB = mongoose.model('Raffle', Raffle);
module.exports.Raffle = mongoose.model('Raffle');

Raffle.pre('save', function(next){
  now = new Date();
  if ( !this.created_at ) {
    this.created_at = now;
  }
  this.updated_at = now;

  if ( !this.count ) {
    this.count = 1;
  }
    next();
});


mongoose.connect( 'mongodb://localhost/express-raffle' );
