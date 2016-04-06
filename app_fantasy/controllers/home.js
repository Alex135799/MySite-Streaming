
//load home page
module.exports.home = function(req,res,next){
  var YahooFantasy = require('yahoo-fantasy');
  var ClientID = "dj0yJmk9YUpzYmt2T0psZ2FBJmQ9WVdrOWFqTlZOalJSTjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kMg--";
  var ClientSecret = "fbd6d75ef69639bebfc846253f491fe9005a869f";
  var yf = new YahooFantasy( ClientID, ClientSecret );
  var strapline = "dummy data"
  var callback = function(err, data){
    if(err){ strapline = err}
    else { strapline = data}
    res.render('home', {
      title: 'Fantasy',
      pageHeader: {
        title: 'Fantasy Football',
        strapline: strapline
      }
    });
  };
  yf.leagues.fetch([751148], callback);
}
