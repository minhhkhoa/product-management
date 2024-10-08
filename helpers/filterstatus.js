module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ''
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ''
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ''
    }
  ]

  if (query.status) {
    // req.query.status == "active" ? filterStatus[1].class = "active" : filterStatus[2].class = "active" 
    const index = filterStatus.findIndex(item => item.status == query.status)
    filterStatus[index].class = "active"
  } else {
    const index = filterStatus.findIndex(item => item.status == "")
    filterStatus[index].class = "active"
  }

  return filterStatus
}