class App extends Vaeri {

  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  getDOM() {
    return ({
      main: 'main',
      list: 'ul.list',
      list_items: ['ul.list > li'],
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
      list_edit_buttons: [['click', this.lstrListEditButtons]],
      modal_close: [['click', this.lstrModalClose]],
      modal_save: [['click', this.lstrModalSave]],
    });
  }

  setControllers() {
    return ({
      data: this.ctlrData,
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
    this.setState({
      data: data,
    });
  }

  ctlrData(prev_state, new_state) {
    let new_list_items = '';
    new_state.data.forEach((c,i) => {
      new_list_items += '<li>';
      new_list_items += '<p class="name">' + c.name + '</p><p class="phone">' + c.phone + '</p>'
      new_list_items += '<button class="edit">EDIT</button>';
      new_list_items += '</li>';
    });
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_items);
    this.dom.list_edit_buttons.populate();
  }

  lstrListEditButtons(item, index) {
    this.dom.modal.classList.add('visible');
    this.dom.modal_input_name.value = this.state.data[index].name;
    this.dom.modal_input_phone.value = this.state.data[index].phone;
  }

  lstrModalClose(item) {
    this.dom.modal.classList.remove('visible');
  }

  lstrModalSave(item) {
    this.dom.modal.classList.remove('visible');
  }

}

(new App()).start();
