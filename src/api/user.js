import request from '@/utils/request'
import md5 from 'js-md5'

export function login(username, password, captcha) {
  const salt = Date.now() / 1000
  const data = {
    username,
    password,
    captcha,
    salt
  }
  data.password = md5(salt + md5(password))
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/profile',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
