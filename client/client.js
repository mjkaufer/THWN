Session.set('rendArr', [false,false,false]);//meals, categories, locations

Meteor.subscribe('mealDb', function(){
  var x = Session.get('rendArr');
  Session.set('rendArr', [true, x[1], x[2]]);
});

Meteor.subscribe('locationsDb', function(){
  var x = Session.get('rendArr');
  Session.set('rendArr', [x[0], x[1], true]);
});

Meteor.subscribe('categoriesDb', function(){
  var x = Session.get('rendArr');
  Session.set('rendArr', [x[0], true, x[2]])
});    


function alertFlash(m, t, time, fo, callback){
  var x = Alerts.insert({message:m, type:t});
  setTimeout(function(){
    $('#' + x).fadeOut(fo, function(){
      Alerts.remove({_id:x});
      if(typeof callback == "function")
        callback();
    });
    
  }, time);

}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}   


Template.order.meals = function(cat){
  return Meals.find({category:cat},{sort:{name:1}});
};

UI.registerHelper('listMeals', function(){
  return Meals.find({}, {sort:{category:1, name:1}})
});

UI.registerHelper('alerts', function(){
  return Alerts.find();
});

UI.registerHelper('categories', function(){
  return Categories.find({},{sort:{priority:-1}});
});

UI.registerHelper('mf', function(money){
  return money.toFixed(2);
});

UI.registerHelper('locations',function(){
  return Locations.find({},{sort:{name:1}});
});

Template.test1.test = function(){
  return Session.get('d');
}

UI.registerHelper('loaded', function(){
  return Session.get('rendArr').indexOf(false) == -1;
});

UI.registerHelper('getCart', function(){
  return Cart.find({});
});

UI.registerHelper('mm', function(price, count){
  return "$" + (parseFloat(price) * parseInt(count)).toFixed(2);

});

Template.confirm.events({
  'click #fin': function(){
      Orders.insert(Cart.findOne({}));
      Cart.remove({});
  }

});

Template.order.events({
  'click #checkout': function () {
      Cart.remove({});
      var orderArray = new Array();
      var sum = 0;
      var its = 0;
      for(var x in document.getElementsByTagName('input')){
        if(isNaN(parseInt(x)))
          continue;
        var e = document.getElementsByTagName('input')[x];
        if(parseInt(e.value) > 0){
          var q = Meals.findOne({_id:e.id});
          if(q == null)
            continue;

          orderArray.push({name:q.name, category:q.category, price:q.price, count:parseInt(e.value), mealId:e.id});
          sum+=parseInt(e.value) * q.price;
          its+=parseInt(e.value);

        }
      }

      Alerts.remove({});
      if(!$('#orderer').val())
        alertFlash('Please enter your name.', 'danger', 3000, 500);        
      else if(!$('#email').val() || !validateEmail($('#email').val()))
        alertFlash('Please enter a valid email.', 'danger', 3000, 500);
      else if(!$('#loc').val() || $('#loc').val() == "Select a location")
        alertFlash('Please select a location.', 'danger', 3000, 500);
      else if(orderArray.length == 0)
        alertFlash('You haven\t selected any items!', 'danger', 3000, 500);          
      else{
        Cart.insert({order: orderArray, location: $('#loc').val(), email: $('#email').val(), customer: $('#orderer').val(),total: sum,items:its});
        alertFlash('Order placed in cart.', 'success', 1000, 100, function(){Router.go('confirm');})
        //Router.go('checkout') or somethin
      }


  }
});  

Template.acp.events({//regex = /[^0-9.]+/

  'click #addMeal': function(){
      //mealName, mealCategory, mealPrice
      var fm = parseFloat($('#mealPrice').val().replace(/[^0-9.]+/g,""))//formatted money
      $('#mealPrice').val()
      if(!$('#mealName').val())
        alertFlash('Please enter a meal name.', 'danger', 3000, 500);        
      else if(!$('#mealCategory').val() || $('#mealCategory').val() == "Category" || $("#mealCategory").prop('selectedIndex') <= 0)
        alertFlash('Please select a category.', 'danger', 3000, 500);
      else if(!$('#mealPrice').val() || isNaN(fm))
        alertFlash('Please enter a valid meal price.', 'danger', 3000, 500);          
      else{

        alertFlash('\'' + $('#mealName').val() + '\' successfully added to \'' + $('#mealCategory').val() + '\'.', 'success', 3000, 100);
        Meals.insert({name:$('#mealName').val(), category:$('#mealCategory').val(), price:fm});
        $('#mealPrice').val("");
        $('#mealName').val("");
        $("#mealCategory").prop('selectedIndex', 0);
      }


  },

  'click #addCategory': function(){
      //categoryType ,categoryPriority

      if(!$('#categoryType').val())
        alertFlash('Please enter a category name.', 'danger', 3000, 500);        
      else if(!$('#categoryPriority').val() || isNaN($('#categoryPriority').val()))
        alertFlash('Please enter a valid category priority.', 'danger', 3000, 500);          
      else{
        alertFlash('\'' + $('#categoryType').val() + '\' successfully added to categories.', 'success', 3000, 100);
        Categories.insert({type:$('#categoryType').val(), priority:parseInt($('#categoryPriority').val())});
        $('#categoryType').val("");
        $('#categoryPriority').val("");
      }

  },

  'click .removeMeal': function(){
    alertFlash('\'' + this.name + '\' has been removed from meals.', 'success', 3000, 100);      
    Meals.remove({_id:this._id});
  },

  'click .removeCategory': function(){
    alertFlash('\'' + this.type + '\' has been removed from categories.', 'success', 3000, 100);      
    Categories.remove({_id:this._id});
  }    

});