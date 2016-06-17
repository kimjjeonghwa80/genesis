'use strict';

describe('Canvas E2E Tests:', function () {
  describe('Test Canvas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/canvas');
      expect(element.all(by.repeater('canva in canvas')).count()).toEqual(0);
    });
  });
});
