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
            mapped_dom[c] = Array.prototype.slice.call(document.querySelectorAll(user_dom[c]));
          }
        });
        this.dom = mapped_dom;
      }

      if (this.setControllers) {
        this.controllers = Object.assign({}, this.setControllers());
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

  populate(parent, html) {
    parent.insertAdjacentHTML('beforeEnd', html);
  }

}
