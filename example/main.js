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
      cards: ['div.card'],
      list: 'ul.list',
      list_items: ['ul.list > li'],
      list_share_buttons: ['ul.list > li button.share'],
    });
  }

  setListeners() {
    return ({
      list_share_buttons: [['click', this.lstrListShareButtons]],
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
      new_list_items += '<button class="share">SHARE</button>';
      new_list_items += '</li>';
    });
    this.dom.list.insertAdjacentHTML('beforeEnd', new_list_items);
    this.dom.list_share_buttons.populate();
  }

  lstrListShareButtons(item, index) {
    console.log(index);
  }

}

(new App()).start();
