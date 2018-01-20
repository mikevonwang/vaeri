class App extends Vaeri {

  constructor() {
    super();
    this.state = {
      data: [],
      editing_index: null,
    };
  }

  getDOM() {
    return ({
      main: 'main',
      list: 'ul.list',
      list_items: ['ul.list > li'],
      list_items_content: ['ul.list > li div.content'],
      list_edit_buttons: ['ul.list > li button.edit'],
      list_delete_buttons: ['ul.list > li button.delete'],
      modal: 'div.modal',
      modal_close: 'div.modal button.modal-close',
      modal_save: 'div.modal button.modal-save',
      modal_input_name: 'div.modal input#modal-name',
      modal_input_phone: 'div.modal input#modal-phone',
    });
  }

  setListeners() {
    return ({
      list_edit_buttons: [['click', this.onClickListEditButton]],
      list_delete_buttons: [['click', this.onClickListDeleteButton]],
      modal_close: [['click', this.onClickModalClose]],
      modal_save: [['click', this.onClickModalSave]],
    });
  }

  setActions() {
    return ({
      didReceiveData: this.didReceiveData,
      didClickListEditButton: this.didClickListEditButton,
      didClickListDeleteButton: this.didClickListDeleteButton,
      didClickModalClose: this.didClickModalClose,
      didClickModalSave: this.didClickModalSave,
    });
  }

  onMount() {
    let data = [];
    const C = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','y','x','z','','','','','','ch','th','sh','zh','br','dr','tr','str','sch','ng','tt','nn'];
    const V = ['a','e','i','o','u','ou','ae','ea','ie','ei','oo','ue','eu'];
    for (let i=0; i<1000; i++) {
      let name = '';
      let phone = '';
      name += C[Math.floor(Math.random() * C.length)];
      name += V[Math.floor(Math.random() * V.length)];
      name += C[Math.floor(Math.random() * C.length)];
      name += V[Math.floor(Math.random() * V.length)];
      name += ' ';
      name += V[Math.floor(Math.random() * V.length)];
      name += C[Math.floor(Math.random() * C.length)];
      name += V[Math.floor(Math.random() * V.length)];
      name = name.replace(/(^| )(\w)/g, function(x) {
        return x.toUpperCase();
      });
      phone += '(';
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += ') ';
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += '-';
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      phone += Math.floor(Math.random() * 10);
      data.push({
        id: i,
        name: name,
        phone: phone,
      });
    }
    this.doAction('didReceiveData', {
      data: data,
    });
  }

  didReceiveData(prev_state, new_state) {
    let new_list_items = '';
    new_state.data.forEach((c,i) => {
      new_list_items += '<li>';
      new_list_items += '<div class="content">';
      new_list_items += '<p class="name">' + c.name + '</p><p class="phone">' + c.phone + '</p>';
      new_list_items += '</div>'
      new_list_items += '<button class="edit">EDIT</button>';
      new_list_items += '<button class="delete">DELETE</button>';
      new_list_items += '</li>';
    });
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_items);
    this.dom.list_items.populate();
    this.dom.list_items_content.populate();
    this.dom.list_edit_buttons.populate();
    this.dom.list_delete_buttons.populate();
  }

  onClickListEditButton(item, index) {
    this.doAction('didClickListEditButton', {
      editing_index: index,
    });
  }

  didClickListEditButton(prev_state, new_state) {
    this.dom.modal_input_name.value  = new_state.data[new_state.editing_index].name;
    this.dom.modal_input_phone.value = new_state.data[new_state.editing_index].phone;
    this.dom.modal.classList.add('visible');
  }

  onClickListDeleteButton(item, index) {
    this.doAction('didClickListDeleteButton', {
      data: this.state.data.filter((c,i) => {
        return (i !== index);
      }),
    });
  }

  didClickListDeleteButton(prev_state, new_state) {
    let deleting_index = prev_state.data.findIndex((c) => {
      return (new_state.data.findIndex((d) => {
        return (d.id === c.id);
      }) === -1);
    });
    this.dom.list.removeChild(this.dom.list_items[deleting_index]);
    this.dom.list_items.delete(deleting_index);
    this.dom.list_items_content.delete(deleting_index);
    this.dom.list_edit_buttons.delete(deleting_index);
    this.dom.list_delete_buttons.delete(deleting_index);
  }

  onClickModalClose(item) {
    this.doAction('didClickModalClose', {
      editing_index: null,
    });
  }

  didClickModalClose(prev_state, new_state) {
    this.dom.modal.classList.remove('visible');
  }

  onClickModalSave(item) {
    let name = this.dom.modal_input_name.value;
    let phone = this.dom.modal_input_phone.value;
    this.doAction('didClickModalSave', {
      data: this.state.data.map((c,i) => {
        if (i === this.state.editing_index) {
          return Object.assign({}, c, {
            name: name,
            phone: phone,
          });
        }
        else {
          return c;
        }
      }),
      editing_index: null,
    });
  }

  didClickModalSave(prev_state, new_state) {
    let new_list_item_content = '<p class="name">' + new_state.data[prev_state.editing_index].name + '</p><p class="phone">' + new_state.data[prev_state.editing_index].phone + '</p>';
    this.dom.list_items_content[this.state.editing_index].innerHTML = new_list_item_content;
    this.dom.modal.classList.remove('visible');
  }

}

(new App()).start();
