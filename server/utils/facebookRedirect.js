// which facebook redirect to go to if in production or not
export default () =>
  (process.env.NODE_ENV === 'production'
    ? {
      successRedirect: '/',
      failureRedirect: '/'
    }
    : {
      successRedirect: 'http://localhost:3000',
      failureRedirect: 'http://localhost:3000'
    });
