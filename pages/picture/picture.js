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
    ]
  },
  onLoad: function () {
    this.sendRequest({
      url: "current_status",
      success: ({data}) => {
        this.addLog(JSON.stringify(data))
        this.setData({
          isInitialized: true,
          isRecording: data.is_recording,
          currentSlot: this.prepareTimeSlot(data.current_slot),
        })
        this.setRecordingSecond()
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
    this.addLog("选择类型: " + type)
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
