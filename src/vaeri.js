class Vaeri {
  constructor() {
    this.state = {};
    this.actions = {};
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
            mapped_dom[c] = new VaeriElementArray(this, c, user_dom[c], document.querySelectorAll(user_dom[c]));
          }
        });
        this.dom = mapped_dom;
      }

      if (this.setListeners) {
        const listeners = this.setListeners();
        Object.keys(listeners).forEach((c) => {
          if (this.dom[c]) {
            if (this.dom[c].length === undefined) {
              listeners[c].forEach((l) => {
                this.dom[c].addEventListener(l[0], l[1].bind(this,this.dom[c],undefined));
              });
            }
            else {
              this.dom[c].listen(listeners[c]);
              this.dom[c].forEach((d,i) => {
                listeners[c].forEach((l) => {
                  d.addEventListener(l[0], l[1].bind(this,d,i));
                });
              });
            }
          }
        });
      }

      if (this.setActions) {
        this.actions = this.setActions();
      }

      if (this.onMount) {
        this.onMount();
      }

    });
  }

  doAction(action_name, new_state_items) {
    const new_state = Object.assign({}, this.state, new_state_items);
    if (this.actions[action_name]) {
      this.actions[action_name].call(this, this.state, new_state);
    }
    this.state = new_state;
  }

}

function VaeriElementArray(self, key, selector, elements) {
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
      if (this.listeners) {
        this.listeners.forEach((l) => {
          c.addEventListener(l[0], l[1].bind(self,c,i));
        });
      }
    });
  };
}
VaeriElementArray.prototype = Array.prototype;
