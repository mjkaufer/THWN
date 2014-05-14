
Meteor.startup(function () {
  // code to run on server at startup
});
if(Meals.find().count() == 0 || Categories.find().count() == 0)
{
  Meals.remove({});
  Categories.remove({});


  Categories.insert({type:"Soup", priority:10});    
  Categories.insert({type:"Granola Bar", priority:5});
  Categories.insert({type:"Sandwich", priority:12});
  Categories.insert({type:"Drink", priority:1});

  Meals.insert({name:"BLT", category:"Sandwich", price:15.00});
  Meals.insert({name:"Test Meal", category:"Granola Bar", price:10.00});
  Meals.insert({name:"Nature Crunch", category:"Granola Bar", price:8.00});    
  Meals.insert({name:"Peanut Butter", category:"Granola Bar", price:4.00});    
  Meals.insert({name:"Chocolate", category:"Granola Bar", price:7.00});    
  Meals.insert({name:"Chicken Noodle Soup", category:"Soup", price:12.50});
  Meals.insert({name:"Pea Soup", category:"Soup", price:10.00});    
  Meals.insert({name:"Dumpling Soup", category:"Soup", price:15.00});
  Meals.insert({name:"Vegetable Soup", category:"Soup", price:8.00});     
  Meals.insert({name:"Chocolate Shake", category:"Drink", price:5.75});
  Meals.insert({name:"Grape Juice", category:"Drink", price:3.50});

}

if(Locations.find().count() == 0)
{
  Locations.insert({name:"Fairfax"});
  Locations.insert({name:"Lansdowne"});
  Locations.insert({name:"Reston"});
}

Meteor.publish('mealDb', function(){
  return Meals.find();
});

Meteor.publish('locationsDb', function(){
  return Locations.find();
});

Meteor.publish('categoriesDb', function(){
  return Categories.find();
});    