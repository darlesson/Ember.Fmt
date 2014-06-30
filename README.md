# ember-fmt.js

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

##License

Dual licensed under the MIT and GPL licenses:
- http://www.opensource.org/licenses/mit-license.php
- http://www.gnu.org/licenses/gpl.html