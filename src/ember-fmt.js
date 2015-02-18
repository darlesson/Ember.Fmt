/*!
 * Ember Format for Handlebar
 *
 * http://www.darlesson.com/
 * https://github.com/darlesson/Ember.Fmt
 *
 * Copyright 2015, Darlesson Oliveira
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @requires Ember
 *
 * Reporting bugs, comments or suggestions: http://darlesson.com/contact/ or https://github.com/darlesson/Ember.Fmt
 * Documentation and more: http://darlesson.com/jquery/ or https://github.com/darlesson/
 * Donations are welcome: http://darlesson.com/donate/
 */

(function(Ember) {

    /**
     @module ember
     @submodule ember-handlebars
     */

    /**
     This is handlebar helper for Ember and it is based on Ember.String.fmt.
     This is a convenient way to use format in templates.
     ```javascript
     Ember.STRINGS = {
        "welcome": "Welcome %@ %@!",
        "udpatedValue": "Your total is $%@."
     };
     ```
     ```html
     <script type="text/x-handlebars" data-template-name="home">
     {{fmt "welcome" "John" lastName}}
     </script>
     ```
     Format can also auto update when the value comes from the context.
     ```handlebars
     {{fmt "udpatedValue" controllers.cart.total}}
     ```
     `"welcome"` is a property of Ember.STRINGS. `"John"` is just a string.
     lastName refers to a property within the context. It could also be `"lastName"`.
     Properties base on the context become observables.
     @method fmt
     @for Ember.Handlebars.helpers
     @param {String} key The string to format
     @param {String} argument[x] Format values
     @param {String} argument[x] A context path.
     @param {Object} argument[x] A context path.
     */

    var handlebarsGet = Ember.Handlebars.get,
        normalizePath = Ember.Handlebars.normalizePath,
        safeString = Ember.Handlebars.SafeString,
        counter = 0,
        observer = function (context, path, options, view, id) {

            return function () {
                view.$('#' + id).text(handlebarsGet(context, path, options));
            };

        };

    Ember.Handlebars.registerHelper('fmt', function (key) {

        var options = arguments[arguments.length - 1],
            types = options.types,
            data = options.data,
            view = data.view,
            pathsAndStrings = (function (args) {

                var array = Array.prototype.slice.call(args);

                // Remove last and first items.
                array.pop();
                array.shift();

                return array;

            })(arguments || []),
            formatValues = [],
            normalized,
            value,
            id,
            path,
            type;

        for (var x = 0, xLen = pathsAndStrings.length; x < xLen; x++) {

            path = pathsAndStrings[x];
            type = types[x + 1];
            value = handlebarsGet(this, path, options);

            // Resolve as a path under the context
            if (type === 'ID' || (type === 'STRING' && value !== undefined)) {

                normalized = normalizePath(this, path, data);
                value = handlebarsGet(this, path, options);

                if(value === undefined)
                    value = path;

                // Add an observer to the view for when the property changes.
                // When the observer fires, find the element using the
                // unique data id and update the attribute to the new value. This is based on
                // Ember bind-attr helper.
                if (path !== 'this' && !(normalized.isKeyword && normalized.path === '')) {

                    id = 'ember-fmt' + (counter++);
                    value = ('<span id="' + id + '">') + value + '</span>';

                    view.registerObserver(normalized.root, normalized.path, observer(this, path, options, view, id));
                }

            } else
                value = path;

            formatValues.push(value);

            value = null;
        }

        return new safeString(Ember.String.loc(key, formatValues));
    });

})(Ember);