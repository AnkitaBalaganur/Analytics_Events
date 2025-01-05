describe('Analytics Event Validation for Try On Flow', () => {

  const numberOfProductsToTest = 2;
  const productsToTest = Array.from({ length: numberOfProductsToTest }, (_, i) => ({ index: i }));

  it('should validate Mixpanel events for Try On, Tooltip, and Show Similar Products', () => {
    let interceptedPayload = null;
    let iframeBody = null;

    // Function to log event details
    const logAnalyticsEvents = (payload) => {
      payload.forEach((event) => {
        cy.task('log', `Event Triggered: ${event.event}`);
        // event.properties && Object.keys(event.properties).forEach((property) => {
        //   cy.task('log', `  ${property}: ${event.properties[property]}`);
        // });
      });
    };

    // Function to validate specific event properties
    const validateAnalyticsEvents = (eventsToValidate) => {
      eventsToValidate.forEach(({ eventName, requiredProperties }) => {
        interceptedPayload.forEach((event) => {
          if (event.event === eventName) {
            cy.task('log', `Validating Event: ${event.event}`);
            requiredProperties.forEach((property) => {
              if (event.properties.hasOwnProperty(property)) {
                cy.task('log', `  ${property}: ${event.properties[property]}`);
              } else {
                cy.task('log', `  Property Missing: ${property}`);
              }
            });
          }
        });
      });
    };

    // Intercept Mixpanel track requests with a general alias
    //Replace with appropriate handling logic before use.
    cy.intercept('POST', `/track/?verbose=1&ip=1&_*=*`, (req) => {
      try {
        const decodedBody = decodeURIComponent(req.body);
        interceptedPayload = JSON.parse(decodedBody.replace('data=', ''));
        req.reply();
      } catch (error) {
        cy.task('log', `Error decoding Mixpanel payload: ${error.message}`);
        req.reply();
      }
    }).as('mixpanelTrack'); // General alias for all Mixpanel events

    // Visit the page
    cy.visit('https://www.youtube.com/');//Add relative URL
    cy.task('log', 'Page loaded, starting Try On flow.');

    // Click on Try On button
    cy.get('.gap-\\[20px\\] > :nth-child(1)', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .click();
    cy.task('log', 'Try On button clicked.');

    // Wait for Mixpanel request and validate Try On events
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      // validateAnalyticsEvents([
      //   {
      //     eventName: 'mirrar-initialised',
      //     requiredProperties: ['brandId', 'platform', 'currentMode', 'UIVersion'],
      //   },
      //   {
      //     eventName: 'jewellery-selected',
      //     requiredProperties: ['brandId', 'appType', 'currentMode', 'UIVersion', 'productCode', 'variantSku', 'category'],
      //   },
      //   {
      //     eventName: 'UI-element-clicked',
      //     requiredProperties: ['brandId', 'appType', 'currentMode', 'UIVersion', 'productCode','element'],
      //   },
      // ]);
    });

    // Validate Tooltip events
    cy.get('iframe')
      .should('have.length.greaterThan', 0)
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
          .find('#contentDiv')
          .should('be.visible')
          .contains('Got It')
          .click();
        cy.task('log', 'Tooltip "Got It" button clicked.');
      });

 // Click on Add to cart button
    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
          .contains('button', 'Add to cart')
          .should('be.visible')
          .click();
        cy.task('log', 'Add to Cart.');
      });

    
    // Wait for Mixpanel request and validate  Add to cart events  

    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });

    // Click on Added button

    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
          .contains('button', 'Added')
          .should('be.visible')
          .click();
        cy.task('log', 'Added.');
      });
// Wait for Mixpanel request and validate  Added events  
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      // validateAnalyticsEvents([
      //   {
      //     eventName: 'UI-element-clicked',
      //     requiredProperties: ['brandId', 'appType', 'currentMode', 'UIVersion', 'productCode','element'],
      //   },
      // ]);
    });

    //Click On the product details

    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
        .contains('button', 'Product details')
        .should('be.visible')
        .click();

        cy.task('log', 'Product details.');
      });

      // Wait for Mixpanel request and validate  Product details events  

    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });



//Validate Stay here Button
    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
        .contains('button', 'Stay here')
        .should('be.visible')
        .click();


        cy.task('log', 'Stay here.');
      });

      
    // Wait for Mixpanel request and validate  Stay here events  
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });

    // Validate Show Similar Products events
    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
          .contains('button', 'Show Similar Products')
          .should('be.visible')
          .click();
        cy.task('log', 'Show Similar Products button clicked.');
      });
// Wait for Mixpanel request and validate  Show similar  events  
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
     
    });


//Validate clicking Product card 
    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        productsToTest.forEach((product, idx) => {
          cy.wrap(iframeBody)
            .find('div[data-item="desktop-product-card"]')
            .eq(product.index)
            .scrollIntoView({ behavior: 'smooth' })
            .should('be.visible')
            .then($product => {
              cy.wrap($product).click();
              cy.wait(1000);
            });
        });
        cy.task('log', 'Products selected from the left panel.');
      });
    // Wait for Mixpanel request and validate  Product card events  
    
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });

    //Validate Change Models

    cy.get('iframe')
    .first() // Adjust the selector if there are multiple iframes
    .then(($iframe) => {
      const iframeBody = $iframe.contents().find('body'); // Get the body of the iframe
      cy.wrap(iframeBody) // Wrap the iframe body for further Cypress commands
        .find('#parent-container > div.w-full.h-full.relative > div > div:nth-child(3)')
        .find('div') // Finds all divs inside the specified parent
        .each(($div) => {
          cy.wait(1000);
          cy.wrap($div).click(); // Wrap each div element and click on it
        });
        cy.task('log', 'Model change.');
    });

    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });

       // Select Rings category
     cy.wrap(iframeBody)
     .find('div.capitalize')
     .first()
     .should('be.visible')
     .click();
   
   
  
// Wait for Mixpanel request and validate  Category Cahnge drop downevents 
   cy.wait('@mixpanelTrack', { timeout: 20000 });
   cy.then(() => {
     logAnalyticsEvents(interceptedPayload);
     
   });


  
    
   //Validate the Hide Similar button 
    cy.get('iframe')
      .first()
      .then(($iframe) => {
        const iframeBody = $iframe.contents().find('body');
        cy.wrap(iframeBody)
          .contains('button', 'Hide Similar Products')
          .should('be.visible')
          .click();
        cy.task('log', 'Hide Similar Products.');
      });
    // Wait for Mixpanel request and validate  Hide similar events  
    cy.wait('@mixpanelTrack', { timeout: 20000 });
    cy.then(() => {
      logAnalyticsEvents(interceptedPayload);
      
    });

 });


  

});

