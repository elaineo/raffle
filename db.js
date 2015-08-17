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


Raffle.pre('save', function (next) {
    raffleDB.find({email : this.email}, function (err, docs) {
        console.log(docs);
        if (!docs.length){
            next();
        }else{
            this.count++;
            console.log(this);
            console.log('user exists: ',docs[0].name);
            next(new Error("User exists. Ticket count incremented."));
        }
    });
}) ;

mongoose.connect( 'mongodb://localhost/express-raffle' );
