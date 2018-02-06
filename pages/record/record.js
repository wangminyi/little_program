//record.js
const util = require('../../utils/util.js')

Page({
  data: {
    status: "initialing", // idle, recording
    record_info: {
      from: null,
      type: null // relax, a, b, c
    },
    record_text: ""
  },
  calc_record_info () {
    var original_second = Math.floor((new Date() - new Date(this.data.record_info.from)) / 1000)
    var hours = Math.floor(original_second / 3600)
    var minutes = Math.floor((original_second % 3600) / 60)
    var seconds = original_second % 60
    return [
      hours,
      minutes,
      seconds,
    ]
  },
  calc_record_text () {
    let info = this.calc_record_info()
    return `${info[0]}:${info[1]}:${info[2]}`
    // this.setData({
    //   record_text: `${hours}:${minutes}:${seconds}`
    // })
  },
  start_record () {
    // wx.request()
    this.setData({
      status: "recording",
      record_info: {
        from: (new Date()).toString(),
        type: "relax"
      }
    })
  },
  stop_record () {
    let info = this.calc_record_info()
    alert(`共计时${info[0]}小时${info[1]}分钟${info[2]}秒`)
  },
  onLoad () {
    setInterval(function () {
      if (this.data.status === 'recording') {
        this.setData({
          "record_text": this.calc_record_text()
        })
      }
    }.bind(this), 1000)

    // setTimeout(function () {
    //   this.setData({
    //     status: "recording",
    //     record_info: {
    //       from: "2018-1-18 20:00:00",
    //       type: "relax"
    //     }
    //   })
    // }.bind(this), 1000)
  }
})
