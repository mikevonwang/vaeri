# Vaeri

Vaeri is a lightweight Javascript framework for websites and simple web apps. It's built on the hypothesis that imperative programming, while more difficult to organize, can also be more intuitive than declarative programming. Vaeri seeks to address that organization while leaving intuitiveness untouched.

## Installation

The simplest way to add Vaeri to your project is by downloading this repository, and adding a script tag referencing the `dist/vaeri.min.js` file to your HTML:

```HTML
<script src="vaeri.min.js"></script>
```

Vaeri can also be installed with npm:

```
npm install vaeri --save
```

## Usage

### Full example

This example Vaeri app is a shopping list, which allows users to:

* check off items they've already picked up,

* add new items, and

* delete items they don't need anymore.

Here are the full JS and HTML for the example app:

```HTML
<body>
  <main>
    <ul class="shopping_list">
      <li vaeri-template="true">
        <button class="delete">-</button>
      </li>
    </ul>
    <div class="new_item">
      <input type="text"/>
      <button class="add">+</button>
    </div>
  </main>
</body>
```

```javascript
class App extends Vaeri {

  constructor() {
    super();
    this.state = {
      items: [],
    };
  }

  getDOM() {
    return ({
      list: ['ul.shopping_list', {
        items: [['> li'], {
          button_delete: ['button.delete'],
        }]
      }],
      new_input: ['div.new_item input'],
      new_button: ['div.new_item button.add'],
    });
  }

  setListeners() {
    return ({
      list: [null, {
        items: [[['click', this.onClickListItem]], {
          button_delete: [[['click', this.onClickListItemDeleteButton]]],
        }],
      }],
      new_button: [[['click', this.onClickNewButton]]],
    });
  }

  onMount() {
    const new_items = [
      {name: 'Apples', in_cart: false},
      {name: 'Bacon', in_cart: false},
      {name: 'Olive oil', in_cart: false},
    ];
    this.doAction('didReceiveData', {
      items: new_items,
    }, [new_items]);
  }

  didReceiveData(new_items) {
    this.dom.list.items.populate(new_items, this.makeListItem);
  }

  onClickListItem(event, item, index) {
    const NSI = {
      items: this.state.items.map((c,i) => {
        if (i === index) {
          return Object.assign({}, c, {
            in_cart: !c.in_cart,
          });
        }
        else {
          return c;
        }
      }),
    };
    this.doAction('didClickListItem', NSI, [index]);
  }

  didClickListItem(index) {
    this.dom.list.items[index].classList.toggle('in_cart');
  }

  onClickNewButton() {
    const name = this.dom.new_input.value;
    if (name.length > 0) {
      const new_item = {
        name: name,
        in_cart: false,
      };
      const NSI = {
        items: [...this.state.items, new_item],
      };
      this.doAction('didClickNewButton', NSI, [new_item]);
    }
  }

  didClickNewButton(new_item) {
    this.dom.new_input.value = '';
    this.dom.list.items.populate(new_item, this.makeListItem);
  }

  onClickListItemDeleteButton(event, item, index) {
    event.stopPropagation();
    const NSI = {
      items: this.state.items.filter((c,i) => {
        if (i === index) {
          return false;
        }
        else {
          return true;
        }
      }),
    };
    this.doAction('didClickListItemDeleteButton', NSI, [index]);
  }

  didClickListItemDeleteButton(index) {
    this.dom.list.items.remove(index);
  }

  makeListItem(c,i) {
    this.dom.list.items[i].insertAdjacentHTML('afterbegin', c.name);
  }

};

var app = new App();
```

### Basic setup

Let's break this down. The first step in using Vaeri is declaring your app:

```javascript
class App extends Vaeri {};
```

You can name your app anything you want; here, we've just named it `App`.

Every app needs a `constructor()`:

```javascript
constructor() {
  super();
  this.state = {
    items: [],
  };
}
```

`super()` performs behind-the-scenes initializations for your app. You can also initialize your app's `state` object here.

Once you have your app declared and initialized, you can call it with `new`:

```javascript
var app = new App();
```

### Selecting DOM elements

We need to let Vaeri know which DOM elements are important to us. We do this with `getDOM()`:

```javascript
getDOM() {
  return ({
    list: ['ul.shopping_list', {
      items: [['> li'], {
        button_delete: ['button.delete'],
      }]
    }],
    new_input: ['div.new_item input'],
    new_button: ['div.new_item button.add'],
  });
}
```

Your `getDOM()` function must return an `Object`, called a **Vaeri Tree**. Each key/value pair in this `Object` corresponds to a DOM element or an array of DOM elements that you wish to manipulate with Vaeri.

Each value is always an `Array`:

* The first element can be either any valid CSS selector `String`, or a one-element `Array` containing the same.

  * DOM elements that are singletons (e.g. a list, a modal, a profile picture) must have `String` values.

  * DOM elements that are arrays (e.g. list items, grid items) must have `Array` values.

* The second element is optional, and must be an `Object` which is itself a **Vaeri Tree**. The key/value pairs in *this* **Vaeri Tree** correspond to children of the DOM elements corresponding to the original key/value pair.

In the example app, the `list[0]` value is a `String`, so Vaeri will look for a single `<ul>` element with a class of `shopping_list`. If it finds multiple, only the first will be paid attention to. `list` has children, called `items`. Because `items[0]` is an `Array`, Vaeri will look for all `<li>` elements whose immediate parent is a `<ul>` with a class of `shopping_list`.

The DOM elements matched by this function are available in the app under `this.dom`.

### Attaching listeners

Different DOM elements can have different event listeners attached to them:

```javascript
setListeners() {
  return ({
    list: [null, {
      items: [[['click', this.onClickListItem]], {
        button_delete: [[['click', this.onClickListItemDeleteButton]]],
      }],
    }],
    new_button: [[['click', this.onClickNewButton]]],
  });
}

onClickListItem(event, item, index) {
  const NSI = {
    items: this.state.items.map((c,i) => {
      if (i === index) {
        return Object.assign({}, c, {
          in_cart: !c.in_cart,
        });
      }
      else {
        return c;
      }
    }),
  };
  this.doAction('didClickListItem', NSI, [index]);
}

onClickNewButton() {
  const name = this.dom.new_input.value;
  if (name.length > 0) {
    const new_item = {
      name: name,
      in_cart: false,
    };
    const NSI = {
      items: [...this.state.items, new_item],
    };
    this.doAction('didClickNewButton', NSI, [new_item]);
  }
}

onClickListItemDeleteButton(event, item, index) {
  event.stopPropagation();
  const NSI = {
    items: this.state.items.filter((c,i) => {
      if (i === index) {
        return false;
      }
      else {
        return true;
      }
    }),
  };
  this.doAction('didClickListItemDeleteButton', NSI, [index]);
}
```

Listeners are declared with the `setListeners()` function. This function, like your `getDOM()` function, must return an `Object`. Each key in this `Object` must also be a key in the **Vaeri Tree** returned by `getDOM()`; this tells Vaeri which listeners to attach to which DOM elements.

Each value is always an `Array`:

* The first element is an `Array` of **Listener Definition** `Array`s. Each **Listener Definition** `Array` corresponds to a single event listener, and has two elements.

  * The first is the name of the event the listener should listen for.

  * The second is the name of the function that should run when the event is heard, i.e. the **Listener** function.

* The second element is optional, and must be an `Object` which is itself a `VaeriTree`.

Each **Listener** function takes three arguments:

* `event` is the Event that was heard.

* `item` is the DOM element that heard the event.

* `index` is the index of that DOM element in its parent `Array`. If the DOM element is a singleton, this will be `undefined`.

In the example app, each `dom.list.item` DOM element will receive a listener for the `click` event. Each time such an event is heard, the `onClickListItem()` event is called.

### Defining actions

**Listener** functions usually fire off certain **Actions**:

```javascript
didClickListItem(index) {
  this.dom.list.items[index].classList.toggle('in_cart');
}

didClickNewButton(new_item) {
  this.dom.new_input.value = '';
  this.dom.list.items.populate(new_item, this.makeListItem);
}

didClickListItemDeleteButton(index) {
  this.dom.list.items.remove(index);
}
```

**Action** functions are called from **Listener** functions with `doAction()`. This function takes three arguments:

* `action_name` is the name of the **Action** function you wish to call.

* `state_updates` is an `Object` containing any updated properties for your app's `state`. Do not mutate `state` properties directly; use functions like `Array.map()` and `Object.assign()`.

* `action_parameters` is an optional `Array` of any parameters you wish to pass to the **Action** function. They will be passed in sequence.

Each **Action** function then takes the arguments that are given to it by the `doAction()` that calls it.

In the example app, in `onClickListItem()`, the `didClickListItem()` **Action** function is called. The `state` is also updated so that the `state.item` whose corresponding `dom.list.item` was clicked has its `in_cart` (a Boolean value) set to the opposite of what it was. The `didClickListItem()` function then toggles the `in_cart` class on the corresponding `dom.list.item`.

### Running code upon mount

Most apps have XHR functions that run when the app first loads. The `onMount()` function is a good place to put these functions:

```javascript
onMount() {
  const new_items = [
    {name: 'Apples', in_cart: false},
    {name: 'Bacon', in_cart: false},
    {name: 'Olive oil', in_cart: false},
  ];
  this.doAction('didReceiveData', {
    items: new_items,
  }, [new_items]);
}

didReceiveData(new_items) {
  this.dom.list.items.populate(new_items, this.makeListItem);
}
```

In the example app, three default foodstuffs are added to `state.items`. In an actual app, this data would probably be retrieved with an XHR or fetch.

### Adding elements

Vaeri does not allow the dynamic creation of singleton DOM elements, because these elements should already exist in your HTML.

DOM elements that belong in an `Array`, however, can be created with `populate()`:

```javascript
didReceiveData(new_items) {
  this.dom.list.items.populate(new_items, this.makeListItem);
}

didClickNewButton(new_item) {
  this.dom.new_input.value = '';
  this.dom.list.items.populate(new_item, this.makeListItem);
}

makeListItem(c,i) {
  this.dom.list.items[i].insertAdjacentHTML('afterbegin', c.name);
}
```

```HTML
<ul class="shopping_list">
  <li vaeri-template="true">
    <button class="delete">-</button>
  </li>
</ul>
```

Each `Array` of DOM elements should have a template marked with the HTML attribute `vaeri-template="true"`. This template is removed from the DOM when the app mounts. Whenever `populate()` is called on the `Array`, new DOM elements will be cloned from the template.

`populate()` take two arguments:

* An `Object` or `Array` of `Objects` representing the new DOM element(s)

* A **Maker** function for that/those element(s)

**Maker** functions are used to "fill in" DOM elements with data. They take two parameters:

* An `Object` from which a DOM element will be filled,

* The index of that DOM element within its parent `Array`.

In the example app, `dom.list.items` has a template defined in the HTML. `populate()` is called two times on `dom.list.items`: once from the **Action** `didReceiveData()`, and once from the **Action** `didClickNewButton()`. In both cases, the **Maker** `makelistItem()` is called to add the name of the new foodstuff to the `<li/>` right before its child `<button/>`.

### Removing elements

Vaeri likewise does not allow the dynamic removal of singleton DOM elements, because these elements should already not exist in your HTML.

DOM elements that belong in an `Array`, again, can be removed with `remove()`:

```javascript
didClickListItemDeleteButton(index) {
  this.dom.list.items.remove(index);
}
```

`remove()` takes one argument:

* The index of the DOM element to be removed in its parent `Array`

In the example app, each `dom.list.items.button_delete` has a **Listener** function attached which calls the **Action** `didClickListItemDeleteButton()`. This **Action** calls `remove()` on `dom.list.items`, which removes the corresponding item from both the DOM and `state`.
