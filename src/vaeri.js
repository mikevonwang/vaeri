class Vaeri {
  constructor() {
    this.state = {};
    this.dom = {};
    this.start();
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
                this.dom[c].addEventListener(l[0], (e) => {
                  l[1].call(this, e, this.dom[c], undefined);
                });
              });
            }
            else {
              this.dom[c].listen(listeners[c]);
              this.dom[c].forEach((d,i) => {
                listeners[c].forEach((l) => {
                  d.addEventListener(l[0], (e) => {
                    l[1].call(this, e, d, i)
                  });
                });
              });
            }
          }
        });
      }

      if (this.onMount) {
        this.onMount();
      }

    });
  }

  doAction(action_name, state_updates, action_parameters = []) {
    this.state = Object.assign({}, this.state, state_updates);
    if (this[action_name]) {
      this[action_name].call(this, ...action_parameters);
    }
  }

}

function VaeriElementArray(self, key, selector, elements) {
  elements.forEach((c) => {
    this.push(c);
  });
  this.key = key;
  this.selector = selector;
  this.listeners = null;
  this.bound_listeners = null;

  this.listen = (x) => {
    this.listeners = x;
    this.bound_listeners = this.listeners.map((c) => {
      return ([]);
    });
  };

  this.populate = () => {
    let cur_length = this.length;
    document.querySelectorAll(this.selector).forEach((c,i) => {
      if (i >= cur_length) {
        this.push(c);
        if (this.listeners) {
          this.bound_listeners[i] = [];
          this.listeners.forEach((l,j) => {
            this.bound_listeners[i][j] = (e) => {
              l[1].call(self, e, c, i);
            };
            c.addEventListener(l[0], this.bound_listeners[i][j]);
          });
        }
      }
    });
  };

  this.delete = (deleting_index) => {
    this.forEach((c,i) => {
      if (this.listeners) {
        this.listeners.forEach((l,j) => {
          c.removeEventListener(l[0], this.bound_listeners[i][j]);
        });
      }
    });
    this.splice(deleting_index, 1);
    if (this.listeners) {
      this.bound_listeners.splice(deleting_index, 1);
    }
    this.forEach((c,i) => {
      if (this.listeners) {
        this.listeners.forEach((l,j) => {
          this.bound_listeners[i][j] = (e) => {
            l[1].call(self, e, c, i);
          };
          c.addEventListener(l[0], this.bound_listeners[i][j]);
        });
      }
    });
  };
}
VaeriElementArray.prototype = Array.prototype;
