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
        document.querySelectorAll('*[vaeri-template=true]').forEach((c) => {
          c.remove();
        });
      }
      if (this.setListeners) {
        this.processListeners(this.setListeners(), this.dom);
      }
      if (this.onMount) {
        this.onMount();
      }
    });
  }

  processDOM(element_list, parent, is_template) {
    let dom = {};
    Object.keys(element_list).forEach((key) => {
      const context = (parent.vaeri_ref) ? parent.vaeri_ref : document;
      const selector = element_list[key][0];
      const children = element_list[key][1];
      if (typeof selector === 'string') {
        const selector_full = ((parent.vaeri_selector) ? (parent.vaeri_selector + ' ') : '') + selector;
        dom[key] = new VaeriElement(this, context, selector_full, null, is_template);
        if (children) {
          Object.assign(dom[key], this.processDOM(children, dom[key]), {
            vaeri_children: Object.keys(children),
          });
        }
      }
      else {
        const selector_full = ((parent.vaeri_selector) ? (parent.vaeri_selector + ' ') : '') + selector[0];
        dom[key] = new VaeriElementArray(this, context, selector_full);
        if (children) {
          dom[key].forEach((c) => {
            Object.assign(c, this.processDOM(children, c), {
              vaeri_children: Object.keys(children),
            });
          });
          if (dom[key].template) {
            Object.assign(dom[key].template, this.processDOM(children, dom[key].template, true), {
              vaeri_children: Object.keys(children),
            });
          }
        }
      }
    });
    return dom;
  }

  processListeners(listener_list, parent, is_template) {
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
          if (is_template) {
            parent[key].listeners = listeners;
          }
        }
      }
      if (children) {
        this.processListeners(children, parent[key]);
        if (parent[key].template) {
          this.processListeners(children, parent[key].template, true);
        }
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

class VaeriElement {
  constructor(self, context, selector, ref, is_template) {
    this.vaeri_self = self;
    this.vaeri_ref = (ref) ? ref : context.querySelector(selector);
    this.vaeri_selector = selector;

    this.classList = this.vaeri_ref.classList;
    this.getAttribute = this.vaeri_ref.getAttribute;
    this.setAttribute = this.vaeri_ref.setAttribute;
    this.insertAdjacentHTML = this.vaeri_ref.insertAdjacentHTML.bind(this.vaeri_ref);

    if (is_template) {
      this.vaeri_ref.remove();
    }
  }

  listen(listeners, link) {
    listeners.forEach((l) => {
      this.vaeri_ref.addEventListener(l[0], (e) => {
        let i = (link !== undefined) ? link() : link;
        l[1].call(this.vaeri_self, e, this.vaeri_ref, i);
      });
    });
  }

  get value() {
    return this.vaeri_ref.value;
  }
  set value(val) {
    this.vaeri_ref.value = val;
  }
}

function VaeriElementArray(self, context, selector) {
  this.links = [];
  const elements = context.querySelectorAll(selector);
  elements.forEach((c) => {
    if (c.getAttribute('vaeri-template') === null) {
      this.links.push(this.length);
      this.push(new VaeriElement(self, null, selector, c));
    }
    else {
      this.template = new VaeriElement(self, null, selector, c);
      this.parent = c.parentNode;
    }
  });

  this.listen = function(listeners) {
    this.listeners = listeners;
    this.forEach((c, i) => {
      c.listen(listeners, this.link.bind(this, i));
    });
  };

  this.populate = function(data, maker) {
    if (data.length === undefined) {
      data = [data];
    }
    data.forEach((c) => {
      const i = this.length;
      this.links.push(i);
      let new_vaeri_element = this.clone(this.template,i);
      new_vaeri_element.listen(this.listeners, this.link.bind(this, i));
      this.parent.appendChild(new_vaeri_element.vaeri_ref);
      this.push(new_vaeri_element);
      maker.call(self, c, i);
    });
  };

  this.clone = function(source, index) {
    let target = new VaeriElement(self, null, source.vaeri_selector, source.vaeri_ref.cloneNode(true));
    if (source.vaeri_children) {
      source.vaeri_children.forEach((child_key) => {
        target[child_key] = this.clone(source[child_key], index);
        target.vaeri_ref.appendChild(target[child_key].vaeri_ref);
      });
    }
    if (source.listeners) {
      target.listen(source.listeners, this.link.bind(this, index));
    }
    return target;
  };

  this.remove = function(index) {
    this[index].vaeri_ref.remove();
    this.splice(index, 1);
    this.links.forEach((c,i) => {
      if (c === index) {
        this.links[i] = null;
      }
      else if (c > index) {
        this.links[i] -= 1;
      }
    });
  };

  this.link = function(index) {
    return this.links[index];
  };
}
VaeriElementArray.prototype = Array.prototype;
