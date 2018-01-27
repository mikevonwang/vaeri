class Vaeri {
  constructor() {
    this.state = {};
    this.dom = {};
    this.start();
  }

  start() {
    document.addEventListener('DOMContentLoaded', () => {

      if (this.getDOM) {
        this.dom = this.processDOM(this.getDOM(), document);
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

  processDOM(element_list, parent) {
    let dom = {};
    Object.keys(element_list).forEach((key) => {
      const context = (parent.vaeri_ref) ? parent.vaeri_ref : document;
      const selector = element_list[key][0];
      const children = element_list[key][1];

      if (typeof selector === 'string') {
        const selector_full = ((parent.vaeri_selector) ? (parent.vaeri_selector + ' ') : '') + selector;
        dom[key] = new VaeriElement(this, context, selector_full);
        if (children) {
          Object.assign(dom[key], this.processDOM(children, dom[key]));
        }
      }
      else {
        const selector_full = ((parent.vaeri_selector) ? (parent.vaeri_selector + ' ') : '') + selector[0];
        dom[key] = new VaeriElementArray(this, context, selector_full);
        if (children) {
          dom[key].forEach((c) => {
            Object.assign(c, this.processDOM(children, c));
          });
        }
      }

    });
    return dom;
  }

  doAction(action_name, state_updates, action_parameters = []) {
    this.state = Object.assign({}, this.state, state_updates);
    if (this[action_name]) {
      this[action_name].call(this, ...action_parameters);
    }
  }

}

function VaeriElement(self, context, selector, vaeri_ref) {
  if (vaeri_ref) {
    this.vaeri_ref = vaeri_ref;
  }
  else {
    this.vaeri_ref = context.querySelector(selector);
  }
  this.vaeri_selector = selector;

  this.addEventListener = this.vaeri_ref.addEventListener;
  this.classList = this.vaeri_ref.classList;
  this.getAttribute = this.vaeri_ref.getAttribute;
  this.setAttribute = this.vaeri_ref.setAttribute;
}

function VaeriElementArray(self, context, selector) {
  const elements = context.querySelectorAll(selector);
  elements.forEach((c) => {
    this.push(new VaeriElement(self, null, selector, c));
  });
}
VaeriElementArray.prototype = Array.prototype;
