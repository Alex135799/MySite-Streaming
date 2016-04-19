
//load home page
module.exports.home = function(req, res, next){
  var session = req.session;
  var YahooFantasy = require('yahoo-fantasy');
  var ClientID = "dj0yJmk9YUpzYmt2T0psZ2FBJmQ9WVdrOWFqTlZOalJSTjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kMg--";
  var ClientSecret = "fbd6d75ef69639bebfc846253f491fe9005a869f";
  console.log("Making yf instance");
  var yf = new YahooFantasy( ClientID, ClientSecret, "127.0.0.1/fan/home");
  console.log("after yf instance");
  var userToken = "";
  var userSecret = "";
  var strapline = "";
  //yf.setUserToken( userToken, userSecret);
  console.log("before if: "+JSON.stringify(session));
  if(!req.query.oauth_token){
    console.log("making Token");
    makeUserToken();
  }else{
    console.log("not making token");
    makeAccessToken();
  }
  function makeUserToken(){
    yf.oauth.getOAuthRequestToken(function(err, token, secret, results){
      if(err){
        strapline = JSON.stringify(err);
        res.render('home', {
          title: 'Fantasy',
          pageHeader: {
            title: 'Fantasy Football',
            strapline: strapline
          }
        });
      }else{
        strapline = token + " : " + secret + " : " + JSON.stringify(results);
        session.RequestToken = token;
        session.RequestSecret = secret;
        var url = results.xoauth_request_auth_url;
        res.redirect(url);
      }
    });
  }
  function makeAccessToken(){
    res.render('home', {
      title: 'Fantasy',
      pageHeader: {
        title: 'Fantasy Football',
        strapline: session.RequestToken + " : " + req.query.oauth_verifier
      }
    });
  }
  /*res.render('home', {
    title: 'Fantasy',
    pageHeader: {
      title: 'Fantasy Football',
      strapline: strapline
    }
  });*/
  //yf.league.meta("mlb.l.166717", function(err, data){
  //  var redir = "";
  //  if(err){
      /*
      //console.log("err: "+err);
      redir = err.toString().split(" ");
      //console.log("redir: "+redir);
      redir = redir[3];
      //console.log("redir: "+redir);
      res.redirect("http://"+redir);
      */
  /*    res.render('home', {
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
  });
  */
}
