// cypress/plugins/index.js

module.exports = (on, config) => {
    on('task', {
      log(message) {
        console.log(message);
        return null;  // You can return anything, but null is fine here.
      }
    });
  };
  