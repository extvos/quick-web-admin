import request from '@/utils/request'

export function userList(query) {
  return request({
    url: '/adm/user/list',
    method: 'get',
    params: query
  })
}

export function userCreate(data) {
  return request({
    url: '/adm/user/add',
    method: 'post',
    data
  })
}

export function userDelete(id) {
  return request({
    url: '/adm/user/delete/' + id,
    method: 'delete'
  })
}

export function userUpdate(id, data) {
  return request({
    url: '/adm/user/update/' + id,
    method: 'put',
    data
  })
}

export function userCheck(username) {
  return request({
    url: '/adm/user/check/' + username,
    method: 'post'
  })
}

export function groupList() {
  return request({
    url: '/adm/group/list',
    method: 'get'
  })
}
