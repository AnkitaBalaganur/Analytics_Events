const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const logFile = 'cypress/logs/analytics.log';

      if (!fs.existsSync('cypress/logs')) {
        fs.mkdirSync('cypress/logs');
      }

      fs.writeFileSync(logFile, '');

      on('task', {
        log(message) {
          fs.appendFileSync(logFile, `${message}\n`);
          console.log(message);
          return null;
        }
      });
    },
    video: false,
    screenshotOnRunFailure: false,
    reporter: 'spec',
    // supportFile: false, // Add this line to disable the support file
  },
});
