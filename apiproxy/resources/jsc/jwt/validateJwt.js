// validateJwt.js
// ------------------------------------------------------------------
//
// Verify / validate a JWT using the jws-3.2.js library from Kenji Urushima.
//
// created: Wed May 27 09:52:15 2015
// last saved: <2015-May-27 12:12:26>


// KJUR.jws.JWS is defined in jws-3.2.js
var jws = new KJUR.jws.JWS();

var isValid;
var jwt = context.getVariable('request.formparam.jwt');
var password = context.getVariable('organization.name') + '.' +
  context.getVariable('environment.name'),
    secretKey = rstrtohex(password);
var alg = 'HS256';
var payload, head;
var now = Math.floor(Date.now() / 1000);

context.setVariable('jwt-error', '');
context.setVariable('jwt-is-valid', false);
context.setVariable('jwt-payload', '{}');
context.setVariable('jwt-head', '{}');
context.setVariable("jwt-is-active", 'n/a');
context.setVariable("jwt-is-expired", 'n/a');
try {
  context.setVariable('jwt-password', hextorstr(secretKey));
  context.setVariable('jwt-alg', alg);

  jws.parseJWS(jwt);
  isValid = KJUR.jws.JWS.verify(jwt, secretKey, [alg]);

  context.setVariable('jwt-is-valid', isValid);
  context.setVariable('jwt-payload', jws.parsedJWS.payloadS);
  context.setVariable('jwt-head', jws.parsedJWS.headS);
  payload = JSON.parse(jws.parsedJWS.payloadS);

  context.setVariable("jwt-now", now.toFixed(0));
  context.setVariable("jwt-is-expired", (payload.exp <= now));

  // nbf is optional
  if (payload.nbf) {
    context.setVariable("jwt-is-active", (payload.nbf <= now));
  }
  else {
    context.setVariable("jwt-is-active", true);
  }
}
catch (ex) {
  // jwt-error is a json-fragment including trailing comma
  context.setVariable('jwt-error', '"error": "' + ex + '",\n  ');

  context.setVariable('jwt-generated-token', 'n/a');
}
