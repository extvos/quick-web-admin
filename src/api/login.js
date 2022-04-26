import request from '@/utils/request'
import md5 from 'js-md5'

export function loginByUsername(username, password, rememberMe) {
  const data = {
    username,
    password,
    rememberMe
  }
  data.salt = 'abc'
  data.password = md5(username + ':' + data.salt + md5(password))
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/auth/profile',
    method: 'get'
    // params: { token }
  })
}

