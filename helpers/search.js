module.exports = (query) => {
  let objSearch = {
    keyword: "",
  }
  if (query.keyword) {
    objSearch.keyword = query.keyword
    const regex = new RegExp(objSearch.keyword, "i") //i: ko phan biet hoa thg
    // console.log(regex): /iphone/i
    objSearch.regex = regex
  }

  return objSearch
}