var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Raffle = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date
});

mongoose.model( 'Raffle', Raffle );
mongoose.connect( 'mongodb://localhost/express-raffle' );
