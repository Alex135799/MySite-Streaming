if(navigator.appName.indexOf("Internet Explorer")!=-1){     //yeah, he's using IE
  var badBrowser=(
    navigator.appVersion.indexOf("MSIE 9")==-1 &&   //v9 is ok
    navigator.appVersion.indexOf("MSIE 1")==-1  //v10, 11, 12, etc. is fine too
  );

  if(badBrowser){
    document.createElement('video');
    angular.element.('usingie').innerHTML = "USING IE < 9";
  }else{
    angular.element.('usingie').innerHTML = "USING IE >= 9";
  }
}
