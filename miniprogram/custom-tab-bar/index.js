Component({
  data: {
    active: 0,
    list: [
      {
        icon: 'friends-o',
        text: 'Teams',
        pagePath: '/pages/team-tab/team-tab'
      },
      {
        icon: 'label-o',
        text: 'Events',
        pagePath: '/pages/event-tab/event-tab'
      },
      {
        icon: 'star-o',
        text: 'Favorites',
        pagePath: '/pages/favor/favor'
      },
      {
        icon: 'setting-o',
        text: 'Settings',
        pagePath: '/pages/settting-tab/setting-tab'
      }
    ]
  },

  methods: {
    onChange(event) {
      var active = event.detail;
      this.setData({ active: active });
      wx.switchTab({
        url: this.data.list[active].pagePath
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(
          item => item.pagePath === `/${page.route}`
        )
      });
    }
  }
});
