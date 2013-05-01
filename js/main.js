(function() {
var soundc
      // a larger view class that manages transitions
      // and all the other subvies
      // this is an exposed instance of our app
      , app;
window.App = soundc = {
	Models: {},
	Collections: {},
	Views: {}
};
SC.initialize({      
		client_id: '955a528f998da6dd6a40b57db962ab06'
	});

window.template = function(id) {
	return _.template( $('#' + id).html() );
};



App.Models.Track = Backbone.Model.extend({
	validate: function(attrs) {
		if ( ! $.trim(attrs.title) ) {
			return 'A Track requires a valid title.';
		}
	},
	initialize: function(){
		var self = this;
		}
});

App.Collections.Tracks = Backbone.Collection.extend({
	model: App.Models.Track	
	
	// Homework #1
	// What if you wanted to sort the Tracks, according to
	// priority - from most to least (1-5 scale).
	// Use Backbone's comparator method to add this functionality
	// http://backbonejs.org/#Collection-comparator
});

App.Views.Tracks = Backbone.View.extend({
	tagName: 'ul',
	className: 'space-list',
	initialize: function(){
		_.bindAll(this, "render");
		var self = this;
		SC.get('/tracks', { genres: 'house', order: 'hotness' }, function(tracks, error) {
			if(error) console.log('ERROR: ', error);
			_.each(tracks, function(value, index){
                self.collection.add(new App.Models.Track(value));
               //console.log( self.collection);
            });
        	self.collection.on("sync", this.render, this);
        	self.render();
        }
      
	)},

	render: function() {		
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function(track) {
		var trackView = new App.Views.Track({ model: track });
		this.$el.append(trackView.render().el);
	}
});

App.Views.Track = Backbone.View.extend({
	tagName: 'li',
	className: 'space-list-item',
	template: template('trackTemplate'),

	initialize: function() {
		
                
	},

	throbber: function(){
            $(this.el).append('<div>LOADING ...</div>');
            return this;  
        },
      
	destroy: function() {
		this.model.destroy();
	},

	remove: function() {
		this.$el.remove();
	},

	render: function() {
		
		var template = this.template( this.model.toJSON() );
	console.log(template);

		this.$el.html(template);
		console.log(this.$el.html(template));

		return this;
	}
});

var trackCollection = new App.Collections.Tracks();
		//var model = new App.Models.Track();
		//console.log(model);
        soundc.app = app = new App.Views.Tracks({collection: trackCollection});
    $('.tracks').html(app.render().el);

})();