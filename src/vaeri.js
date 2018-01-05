class Vaeri {
  constructor() {
    this.state = {};
    this.controllers = {};
    this.dom = {};
  }

  start() {
    document.addEventListener('DOMContentLoaded', () => {

      if (this.getDOM) {
        const user_dom = this.getDOM();
        const mapped_dom = {};
        Object.keys(user_dom).forEach((c) => {
          if (typeof user_dom[c] === 'string') {
            mapped_dom[c] = document.querySelector(user_dom[c]);
          }
          else {
            mapped_dom[c] = new VaeriElementArray(c, user_dom[c], document.querySelectorAll(user_dom[c]));
          }
        });
        this.dom = mapped_dom;
      }

      if (this.setListeners) {
        const listeners = this.setListeners();
        Object.keys(listeners).forEach((c) => {
          this.dom[c].listen(listeners[c]);
          this.dom[c].forEach((d,i) => {
            listeners[c].forEach((l) => {
              d.addEventListener(listeners[c][l][0], listeners[c][l][1].bind(this,d,i));
            });
          });
        });
      }

      if (this.setControllers) {
        this.controllers = this.setControllers();
      }

      if (this.onMount) {
        this.onMount();
      }

    });
  }

  setState(new_state_items) {
    const new_state = Object.assign({}, this.state, new_state_items);
    Object.keys(new_state_items).forEach((c) => {
      this.controllers[c].call(this, this.state, new_state);
    });
    this.state = new_state;
  }

}

function VaeriElementArray(key, selector, elements) {
  elements.forEach((c) => {
    this.push(c);
  });
  this.key = key;
  this.selector = selector;

  this.listen = (x) => {
    this.listeners = x;
  };

  this.populate = () => {
    this.length = 0;
    document.querySelectorAll(this.selector).forEach((c,i) => {
      this.push(c);
      this.listeners.forEach((l) => {
        c.addEventListener(l[0], l[1].bind(this,c,i));
      });
    });
  };
}
VaeriElementArray.prototype = Array.prototype;
