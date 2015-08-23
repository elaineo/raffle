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
Raffle.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};
Raffle.statics.addTicket = function (email) {
    // should be able to pass in doc, i'm too lazy to care
    return this.findOneAndUpdate(
      {"email": email},
      { $inc: { count: 1 }},
      { new: false, upsert: false}, function(err, person) {
        if (err) {
          console.log('got an error');
         } console.log(person)}  );
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
