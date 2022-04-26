import request from '@/utils/request'
import md5 from 'js-md5'

export function loginByUsername(username, password, token) {
  const data = {
    username,
    password,
    token
  }
  data.password = md5(username + ':' + token + md5(password))
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function loginToken() {
  return request({
    url: '/login_tk',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/profile',
    method: 'get'
    // params: { token }
  })
}

export function getUserCtx() {
  return request({
    url: '/apis/user',
    method: 'get'
  })
}
