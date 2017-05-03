// getRandomValues.js
// ------------------------------------------------------------------
//
// provide a plain JS version of getRandomValues.
//
// created: Wed May 27 10:25:48 2015
// last saved: <2015-May-27 10:43:02>

// isaac is provided by isaac.js
isaac.seed('getRandomValues.js' + (new Date().getTime()) + '.' + Math.random());

function getRandomValues(buf) {
  if (buf.length > 65536) {
    var e = new Error();
    e.code = 22;
    e.message = 'Failed to execute \'getRandomValues\' on \'Crypto\': The ' +
      'ArrayBufferView\'s byte length (' + buf.length + ') exceeds the ' +
      'number of bytes of entropy available via this API (65536).';
    e.name = 'QuotaExceededError';
    throw e;
  }

   // Last resort - we'll use isaac.js to get a random number. It's
   // seeded from Math.random(), so this isn't ideal, but it'll still
   // greatly increase the space of guesses a hacker would have to make
   // to crack the password.

  var randomBytes = [];
  for (var i = 0; i < buf.length; i++) {
    randomBytes.push(isaac.rand());
  }

  buf.set(randomBytes);
}
