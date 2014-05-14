Orders = new Meteor.Collection('orders');
Meals = new Meteor.Collection('meals');//name, category, price
Categories = new Meteor.Collection('categories');//coincides with meals, keys are 'type' and 'priority', high priority comes first, e.g. 100 before 10
Cart = new Meteor.Collection(null);//name, category, price, count
Locations = new Meteor.Collection('locations');
Alerts = new Meteor.Collection(null);


Router.configure({
    layoutTemplate: "layout",
    loadingTemplate: "loading",
    notFoundTemplate: "notFound"
});

Router.map(function() {
  this.route('fullOrder', {path: '/'});
  this.route('acp');
  this.route('confirm');
  this.route('complete');
});


// if (Meteor.isClient) {

// }

// if (Meteor.isServer) {
// }
