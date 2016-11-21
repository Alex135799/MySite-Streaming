
//load home page
module.exports.home = function(req, res, next){
  // Clear session for creation debuging
  //req.session.destroy(function(err){console.log("SESSION DESTROY ERROR")})
  var session = req.session;
  var YahooFantasy = require('yahoo-fantasy');
  var ClientID = "dj0yJmk9YUpzYmt2T0psZ2FBJmQ9WVdrOWFqTlZOalJSTjJjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1kMg--";
  var ClientSecret = "fbd6d75ef69639bebfc846253f491fe9005a869f";
  console.log("Making yf instance");
  var yf = new YahooFantasy( ClientID, ClientSecret, "127.0.0.1/fan/home");
  console.log("after yf instance");
  var userToken = "";
  var userSecret = "";
  var title = "";
  var teams = [];
  var strapline = "";
  var leagueId = "nfl.l.31863";
  //yf.setUserToken( userToken, userSecret);
  console.log("before if: "+JSON.stringify(session));
  if(!session.RequestToken){
    console.log("making user token");
    makeUserToken();
  }else if(!session.AccessToken){
    console.log("making access token");
    makeAccessToken();
  }else{
    yf.setUserToken(session.AccessToken, session.AccessSecret)
    yf.leagues.fetch(leagueId, "teams", function(err, leagues){
      if(err){
        req.session.destroy(function(err){})
        strapline = 'Error: '+JSON.stringify(err)
        title = "Too Bad"
        tryAgain = true
        teams = []
        res.render('home', {
          teams: teams,
          title: 'Fantasy',
          pageHeader: {
            title: title,
            strapline: strapline
          },
          tryAgain: tryAgain
        });
      }else{
        var team_keys = []
        for(teamNum = 0; teamNum < leagues[0].teams.length; teamNum++){
          team_keys.push(leagues[0].teams[teamNum].team_key)
        }
        //console.log("getting teams keys: "+team_keys)
        yf.players.teams(team_keys, function(err, players){
          if(err){
            res.render('home', {
              title: 'Fantasy',
              pageHeader: {
                title: "Error",
                strapline: JSON.stringify(err)
              }
            });
          }
          //console.log("getting teams callback")
          for(teamNum = 0; teamNum < leagues[0].teams.length; teamNum++){
            //console.log("players: "+JSON.stringify(players))
            leagues[0].teams[teamNum] = players[teamNum]
            //console.log("player: "+JSON.stringify(leagues[0].players[0]))
          }
          title = leagues[0].name
          teams = leagues[0].teams
          strapline = 'All Set'//:\n'+JSON.stringify(leagues[0], null, 2)
          res.render('home', {
            teams: teams,
            title: 'Fantasy',
            pageHeader: {
              title: title,
              strapline: strapline
            }
          });
        })
      }
    });
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
        //strapline = token + " : " + secret + " : " + JSON.stringify(results);
        session.RequestToken = token;
        session.RequestSecret = secret;
        var url = results.xoauth_request_auth_url;
        res.redirect(url);
      }
    });
  }
  function makeAccessToken(){
    if(req.query.oauth_verifier){
      session.oauth_verifier = req.query.oauth_verifier
    }
    var oauth_token = session.RequestToken
    var oauth_token_secret = session.RequestSecret
    var oauth_verifier = session.oauth_verifier
    yf.oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier,
      function(err, oauth_access_token, oauth_access_token_secret, results){
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
          session.AccessToken = oauth_access_token
          session.AccessSecret = oauth_access_token_secret
          //strapline = session.AccessToken + " :access: " + session.AccessSecret
          res.redirect('/fan/home')
        }
      }
    )
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
