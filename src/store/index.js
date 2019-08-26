const KEY = 'hm-toutiao-79-user'
export default {
  setUser (user) {
    const json = JSON.stringify(user)
    windows.sessionStorage.setItem(KEY, jsonStr)
  },
  getUser () {
    const jsonStr = window.sessionStorage.getItem(KEY) || '{}'
    return JSON.parse(jsonStr)
  },
  delUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
