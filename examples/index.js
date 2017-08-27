// This makes a handful of requests to passless.com
// jwt has verified that I the owner of the email address.
const { jwt } = await login({email})

// This is a call to the users endpoint. The endpoint should be verifying the
// jwt and return another JWT with any additional information.
const upgradedJWT = await fetch(
    'https://mysite.com/login',
    {method: 'POST', headers: {'Authorization': `Bearer ${jwt}`}}
).then(v => v.json())

// ...what if we want to do MFA? How would that look?
// The joy of the system so far is that passless does not need to retain any
// knowledge.
//
// If we add MFA, then either passless needs to retain knowledge, or it needs to
// receive some extra data.
//
// If all we need is to authenticate that Alice owns an email address, then the
// authentication can bypass the users api completely. But I would imagine that
// this is rarely the case...
//
// Perhaps the best way for this to work is for requests to be proxied through
// the users API.

// Let's look at some options of what a login handshake might look like.
//
// Alice -> POST 200 passless.com/auth { email: alice@example.com }
// Alice -> POST 401 passless.com/check
// Alice -> POST 401 passless.com/check
// Alice -> POST 401 passless.com/check
// Alice -> GET  200 passless.com/verify?email=alice@example.com&otp=...
// Alice -> POST 200 passless.com/check
// Alice -> POST 200 api.example.com/login
//
// For MFA:
//
// Alice -> POST 200 api.example.com/auth { email: alice@example.com, phone: xxx  }
// Alice -> POST 401 passless.com/check
// Alice -> POST 401 passless.com/check
// Alice -> POST 401 passless.com/check
// Alice -> GET  200 passless.com/verify?email=alice@example.com&otp=...
// Alice -> POST 401 passless.com/check
// Alice -> POST 200 passless.com/verify?email=alice@example.com&mfa=...
// Alice -> POST 401 passless.com/200
// Alice -> POST 200 api.example.com/login
