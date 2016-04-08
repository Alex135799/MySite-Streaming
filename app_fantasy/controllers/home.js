
//load home page
module.exports.home = function(req, res, next){
  var YahooFantasy = require('yahoo-fantasy');
  var ClientID = "dj0yJmk9YUpzYmt2T0psZ2FBJmQ9WVdrOWFqTlZOalJSTjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kMg--";
  var ClientSecret = "fbd6d75ef69639bebfc846253f491fe9005a869f";
  var yf = new YahooFantasy( ClientID, ClientSecret );
  var userToken = "";
  var userSecret = "";
  console.log("making user token");
  yf.makeUserToken();
  //yf.setUserToken( userToken, userSecret);
  var strapline = "dummy data"
  var callback = function(err, data){
    var redir = "";
    if(err){
      /*
      //console.log("err: "+err);
      redir = err.toString().split(" ");
      //console.log("redir: "+redir);
      redir = redir[3];
      //console.log("redir: "+redir);
      res.redirect("http://"+redir);
      */
      res.render('home', {
        title: 'Fantasy',
        pageHeader: {
          title: 'Fantasy Football',
          strapline: JSON.stringify(err)
        }
      });
    } else { 
      console.log("data: "+data);
      strapline = data
      res.render('home', {
        title: 'Fantasy',
        pageHeader: {
          title: 'Fantasy Football',
          strapline: data
        }
      });
    }
  };
  //yf.league.meta("mlb.l.166717", callback);
  /*
  res.render('home', {
    title: 'Fantasy',
    pageHeader: {
      title: 'Fantasy Football',
      strapline: strapline
    }
  });
  */
}
