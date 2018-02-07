const HOST = "http://localhost:3001/weixin/" //"http://love-mango.com/weixin/"
Page({
  data: {
    logs: [],
    lastLogId: "",
    isInitialized: false,

    isRecording: false,
    recordingTime: "",
    currentSlot: null,
    selectedSlotType: "play",
    slotTypeOptions: [
      ["玩", "play"],
      ["学", "study"],
      ["睡", "rest"],
      ["杂", "others"],
    ],
    slotTypeText: {
      "play": "愉快玩耍",
      "study": "努力学习",
      "rest": "呼呼大睡",
      "others": "不知所云",
    }
  },
  onLoad: function () {
    this.sendRequest({
      url: "current_status",
      success: ({data}) => {
        this.setData({
          isInitialized: true,
          isRecording: data.is_recording,
          currentSlot: this.prepareTimeSlot(data.current_slot),
        })
        this.setRecordingSecond()
        // welcome
        let hour = (new Date()).getHours()
        let welcome = hour < 12 ? "早上好" : (hour < 18 ? "下午好" : "晚上好")
        let thing = data.is_recording ? "大魔王正在为你计时" : "大魔王已准备好为你计时"
        this.addLog(`小哼唧${welcome}, ${thing}`)
      }
    })
    setInterval(() => {
      this.setRecordingSecond()
    }, 1000)
  },
  setRecordingSecond () {
    if (this.data.isRecording) {
      let seconds = Math.ceil(Date.now() / 1000) - Math.ceil(this.data.currentSlot.localTime / 1000) + this.data.currentSlot.current_duration
      let hour = Math.floor(seconds / 3600)
      let minute = Math.floor(seconds % 3600 / 60)
      let second = seconds % 60
      this.setData({
        recordingTime: `${hour}:${minute}:${second}`
      })
    }
  },
  selectSlotType (e) {
    let type = e.currentTarget.dataset.slotType
    this.setData({
      selectedSlotType: type
    })
    this.addLog("选择类型: " + this.selectedSlotTypeText())
  },
  selectedSlotTypeText () {
    return this.data.slotTypeOptions.find(option => option[1] === this.data.selectedSlotType)[0]
  },
  startRecording () {
    this.sendRequest({
      url: "start_recording",
      method: "POST",
      data: {
        slot_type: this.data.selectedSlotType
      },
      success: ({data}) => {
        this.setData({
          isRecording: true,
          currentSlot: this.prepareTimeSlot(data.current_slot)
        })
        this.setRecordingSecond()
      }
    })
  },
  stopRecording () {
    this.sendRequest({
      url: "stop_recording",
      method: "POST",
      data: {
        id: this.data.currentSlot.id
      },
      success: ({data}) => {
        this.setData({
          isRecording: false,
          currentSlot: null,
        })
        this.addLog(`计时完毕，从${data.current_slot.started_at}到${data.current_slot.ended_at}`)
      }
    })
  },
  addLog (content) {
    let new_logs = [...this.data.logs, content]
    this.setData({
      logs: new_logs,
      lastLogId: "log-" + (new_logs.length - 1)
    })
  },
  prepareTimeSlot (timeslot) {
    return timeslot ? {
      localTime: Date.now(),
      ...timeslot
    } : null
  },
  sendRequest(options) {
    options.url = HOST + options.url
    wx.request({
      header: {
        'content-type': "application/json"
      },
      ...options,
    })
  }
})
