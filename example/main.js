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
        }, {
          title: 'and mountains fall',
        }
      ],
    });
  }

  ctlrData(prev_state, new_state) {
    var new_list_items = '';
    new_state.data.forEach((c) => {
      new_list_items += '<li>' + c.title + '</li>'
    });
    this.populate(this.dom.list, new_list_items);
  }

}

(new App()).start();
