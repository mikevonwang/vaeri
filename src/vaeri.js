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
        this.processListeners(this.setListeners(), this.dom);
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

  processListeners(listener_list, parent) {
    Object.keys(listener_list).forEach((key) => {
      const listeners = listener_list[key][0];
      const children = listener_list[key][1];
      if (listeners !== null && listeners.length > 0) {
        if (parent.length > 0) {
          parent.forEach((c) => {
            c[key].listen(listeners);
          });
        }
        else if (parent[key]) {
          parent[key].listen(listeners);
        }
      }
      if (children) {
        this.processListeners(children, parent[key]);
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

function VaeriElement(self, context, selector, vaeri_ref) {
  if (vaeri_ref) {
    this.vaeri_ref = vaeri_ref;
  }
  else {
    this.vaeri_ref = context.querySelector(selector);
  }
  this.vaeri_selector = selector;

  this.listen = function(listeners, i) {
    listeners.forEach((l) => {
      this.vaeri_ref.addEventListener(l[0], (e) => {
        l[1].call(self, e, this.vaeri_ref, i);
      });
    });
  };

  this.classList = this.vaeri_ref.classList;
  this.getAttribute = this.vaeri_ref.getAttribute;
  this.setAttribute = this.vaeri_ref.setAttribute;
  this.insertAdjacentHTML = this.vaeri_ref.insertAdjacentHTML.bind(this.vaeri_ref);
}

function VaeriElementArray(self, context, selector) {
  const elements = context.querySelectorAll(selector);
  elements.forEach((c) => {
    if (c.getAttribute('vaeri-template') === null) {
      this.push(new VaeriElement(self, null, selector, c));
    }
    else {
      this.template = c;
      this.parent = c.parentNode;
      c.remove();
    }
  });

  this.listen = function(listeners) {
    this.listeners = listeners;
    this.forEach((c, i) => {
      c.listen(listeners, i);
    });
  };

  this.populate = function(data, maker) {
    data.forEach((c,i) => {
      let new_vaeri_ref = this.template.cloneNode(true);
      let new_vaeri_element = new VaeriElement(self, null, selector, new_vaeri_ref);
      this.parent.appendChild(new_vaeri_ref);
      this.push(new_vaeri_element);
      new_vaeri_element.listen(this.listeners, i);
      maker.call(self, c, i);
    });
  };
}
VaeriElementArray.prototype = Array.prototype;
