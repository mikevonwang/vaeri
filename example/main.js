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
    this.setState({
      data: [
        {
          title: 'when the seas',
          text: 'blah blah blah',
        }, {
          title: 'and mountains fall',
          text: 'meow meow meow',
        }
      ],
    });
  }

  ctlrData(prev_state, new_state) {
    let new_list_items = '';
    new_state.data.forEach((c,i) => {
      new_list_items += '<li>';
      new_list_items += '<p class="title">' + c.title + '</p><p class="text">' + c.text + '</p>'
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
