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
      modal_close: [['click', this.onClickModalClose]],
      modal_save: [['click', this.onClickModalSave]],
    });
  }

  setActions() {
    return ({
      didReceiveData: this.didReceiveData,
      didClickListEditButton: this.didClickListEditButton,
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
      new_list_items += '</li>';
    });
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_items);
    this.dom.list_items_content.populate();
    this.dom.list_edit_buttons.populate();
  }

  didClickListEditButton(prev_state, new_state) {
    this.dom.modal_input_name.value  = new_state.data[new_state.editing_index].name;
    this.dom.modal_input_phone.value = new_state.data[new_state.editing_index].phone;
    this.dom.modal.classList.add('visible');
  }

  onClickListEditButton(item, index) {
    this.doAction('didClickListEditButton', {
      editing_index: index,
    });
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
          return ({
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
