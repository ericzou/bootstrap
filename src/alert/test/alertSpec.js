// describe("alert", function() {
//   var scope, element;

//   beforeEach(module('ui.bootstrap.alert'));
//   beforeEach(module('template/alert/alert.html'));

//   beforeEach(inject(function($rootScope, _$compile_) {
//     scope = $rootScope.$new();
//     $compile = _$compile_;

//     element = $('<div>');
//   }));

//   function createAlert(type) {
//     var tpl;

//     if (type) {
//       tpl = '<alert type="' + type + '">foobar</alert>';
//     } else {
//       tpl = '<alert>foobar</alert>';
//     }

//     alert = $compile(angular.element(tpl))(scope);
//     scope.$apply();
//     return alert;
//   }

//   function findDismissButton() {
//     return element.find('button.close');
//   }

//   describe('types', function() {

//     it("should have alert-error class", function() {
//       element.append(createAlert("error"));
//       expect(element.find('.alert')).toHaveClass("alert-error");
//     });

//     it("should have alert-success class", function() {
//       element.append(createAlert("success"));
//       expect(element.find('.alert')).toHaveClass("alert-success");
//     });  

//     it("should default to alert-info class", function() {
//       element.append(createAlert());
//       expect(element.find('.alert')).toHaveClass("alert-info");
//     });  

//   });

//   describe('close button', function() {

//     beforeEach(function() {
//       element.append(createAlert());
//     });

//     it("should have button for dismissing the alert", function() {
//       expect(findDismissButton().length).toEqual(1);
//     });

//     it("should dismiss alert when click on the button", function() {
//       expect(element.find('.alert').length).toEqual(1);

//       findDismissButton().click();
//       scope.$apply();

//       expect(element.find('.alert').length).toEqual(0);
//     });

//   });

// });