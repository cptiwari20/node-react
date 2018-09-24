var localtunnel = require('localtunnel');
localtunnel(5000, { subdomain: 'vikasddfszziziziz' }, function(err, tunnel) {
  if(err){
    console.log(err)
  }
  console.log('LT running:##########')
});