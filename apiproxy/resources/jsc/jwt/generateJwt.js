// generateJwt.js
// ------------------------------------------------------------------
//
// Generate a JWT using the jws-3.2.js library from Kenji Urushima.
//
// created: Wed May 27 09:52:15 2015
// last saved: <2015-May-27 12:15:28>


// KJUR.jws.JWS is defined in jws-3.2.js
var jws = new KJUR.jws.JWS();
var payload, jwt, key, alg = 'HS256';
var password = context.getVariable('private.jwt_password');
var head = {
    alg: alg,
    typ: 'JWT'
};
var iss = context.getVariable('environment.name') == 'test' ? 'https://api.topcoder-dev.com' : 'https://api.topcoder.com';
var payload = {
    nbf: ((new Date()).getTime() / 1000).toFixed(0),
    exp: ((new Date()).getTime() / 1000 + 86400).toFixed(0), // expires in one day
    iss: iss,
    userId: context.getVariable('oauthv2accesstoken.AccessTokenRequest.user_id'),
    sub: context.getVariable('oauthv2accesstoken.AccessTokenRequest.user_id'),
    roles: ["administrator","copilot"],
    aud: 'everyone'
};
context.setVariable('jwt-error', '');
try {
  key = rstrtohex(password);
  context.setVariable('jwt-key', key);
  head = JSON.stringify(head);
  payload = JSON.stringify(payload);
  jwt = KJUR.jws.JWS.sign(alg, head, payload, key);

  context.setVariable('jwt-generated-token', jwt);
}
catch (ex) {
  // jwt-error is a json-fragment including trailing comma
  context.setVariable('jwt-error', '"error": "' + ex + '",\n  ');
  context.setVariable('jwt-generated-token', 'n/a');
}