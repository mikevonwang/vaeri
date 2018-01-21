# Vaeri

Vaeri is a lightweight Javascript framework for websites and simple web apps.

## Installation

Vaeri can be added to your project by downloading this repository, and adding a script tag referencing the `dist/vaeri.min.js` file to your HTML:

```HTML
<script src="vaeri.min.js"></script>
```

## Usage

### Basic setup

The first step in using Vaeri is declaring your app:

```javascript
class App extends Vaeri {};
```

You can name your app anything you want; here, we've just named it `App`.

Every app needs a `constructor()`:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

};
```

`super()` performs behind-the-scenes initializations for your app. You can also initialize your `state` object here.

Once you have your app declared and initialized, you can `start` it:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

};

(new App()).start();
```

### Selecting DOM elements

We need to let Vaeri know which DOM elements are important to us. We do this with `getDOM()`:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

  getDOM() {
    return ({
      list: 'ul.shopping_list',
      list_items: ['ul.shopping_list > li'],
    });
  }

};

(new App()).start();
```

Your `getDOM()` function must return an object. Each key/value pair in this object is a DOM element or an array of DOM elements that you wish to manipulate with Vaeri.

The values can be either any valid CSS selector `String`, or a one-element `Array` containing the same. DOM elements that are singletons (e.g. a list, a modal, a profile picture) must have `String` values. DOM elements that are arrays (e.g. list items, grid items) must have `Array` values.

In the example above, the `list` value is a `String`, so Vaeri will look for a single `<ul>` element with a class of `shopping_list`. If it finds multiple, only the first will be paid attention to. Conversely, the `list_items` value is an `Array`, so Vaeri will look for all `<li>` elements whose immediate parent is a `<ul>` with a class of `shopping_list`.


### Attaching listeners

Different DOM elements can have different event listeners attached to them:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

  getDOM() {
    return ({
      list: 'ul.shopping_list',
      list_items: ['ul.shopping_list > li'],
    });
  }

  setListeners() {
    return ({
      list_items: [['click', this.onClickListItem]],
    });
  }

  onClickListItem(item, index) {

  }

};

(new App()).start();
```

Your `setListeners()` function, like your `getDOM()` function, must return an object. Each key in this object must also be a key in the object returned by `getDOM()`; this tells Vaeri which listeners to attach to which DOM elements.

Each value in this object is an `Array` of **Listener Definition** `Array`s. Each **Listener Definition** `Array` corresponds to a single event listener, and has two elements. The first is the name of the event the listener should listen for. The second is the name of the function that should run when the event is heard, i.e. the **Listener** function.

In the example above, each `list_item` DOM element will receive a listener for the `click` event. Each time such an event is heard, the `onClickListItem()` event is called.

Each **Listener** function takes two arguments:

* `item` is the DOM element that heard the event
* `index` is the index of that DOM element in its parent `Array`. If the DOM element is a singleton, this will be `undefined`.

### Defining actions

**Listener** functions usually fire off certain **Actions**:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

  getDOM() {
    return ({
      list: 'ul.shopping_list',
      list_items: ['ul.shopping_list > li'],
    });
  }

  setListeners() {
    return ({
      list_items: [['click', this.onClickListItem]],
    });
  }

  setActions() {
    return ({
      didClickListItem: this.didClickListItem,
    });
  }

  onClickListItem(item, index) {
    this.doAction('didClickListItem', {
      items: this.state.items.map((c,i) => {
        if (i === index) {
          return Object.assign({}, c, {
            in_cart: !c.in_cart,
          });
        }
        else {
          return c;
        }
      });
    });
  }

  didClickListItem(prev_state, new_state) {

  }

};

(new App()).start();
```

### Defining startup

Some code should run whenever your webapp has finished loading:

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {};
  }

  getDOM() {
    return ({
      list: 'ul.shopping_list',
      list_items: ['ul.shopping_list > li'],
    });
  }

  setListeners() {
    return ({
      list_items: [['click', this.onClickListItem]],
    });
  }

  setActions() {
    return ({
      didReceiveData: this.didReceiveData,
      didClickListItem: this.didClickListItem,
    });
  }

  onMount() {
    // xhr() is an imaginary function to retrieve shopping list items from an API.
    xhr('/shopping_list_items', 'get', (result) => {
      this.doAction('didReceiveData', {
        items: result,
      });
    });
  }

  didReceiveData(prev_state, new_state) {
    let new_list_items = '';
    new_state.items.forEach((c,i) => {
      new_list_items += '<li>';
      new_list_items += c.name;
      new_list_items += '</li>';
    });
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_items);
    this.dom.list_items.populate();
  }

  onClickListItem(item, index) {
    this.doAction('didClickListItem', {
      items: this.state.items.map((c,i) => {
        if (i === index) {
          return Object.assign({}, c, {
            in_cart: !c.in_cart,
          });
        }
        else {
          return c;
        }
      });
    });
  }

  didClickListItem(prev_state, new_state) {

  }

};

(new App()).start();
```
