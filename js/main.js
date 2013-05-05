(function() {
var soundc
    , app;
window.App = soundc = {
	Models: {},
	Collections: {},
	Views: {}
};
SC.initialize({      
		client_id: 'ee8e164717cb8a3495919a9ee68e91fc'
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

	render: function() {
		
		var template = this.template( this.model.toJSON() );
		this.$el.html(template);
		return this;
	}
});

var trackCollection = new App.Collections.Tracks();
        soundc.app = app = new App.Views.Tracks({collection: trackCollection});
    $('.tracks').html(app.render().el);

})();