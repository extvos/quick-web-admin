import request from '@/utils/request'

export class Restlet {
  constructor(list, single) {
    this.listUrl = list
    if (single) {
      this.singleUrl = single
    } else {
      this.singleUrl = this.listUrl
    }
  }

  joinId(id) {
    return this.singleUrl + '/' + id
  }

  one(id) {
    return request({
      url: this.joinId(id),
      method: 'get'
    })
  }

  list(params) {
    return request({
      url: this.listUrl,
      method: 'get',
      params: params
    })
  }

  create(data) {
    return request({
      url: this.listUrl,
      method: 'post',
      data: data
    })
  }

  update(id, data) {
    return request({
      url: this.joinId(id),
      method: 'put',
      data: data
    })
  }

  delete(id) {
    return request({
      url: this.joinId(id),
      method: 'delete'
    })
  }
}

class Client {
  constructor(l) {
    this.url = l
  }
  get(params) {
    return request({ url: this.url, method: 'get', params: params })
  }
  delete(params) {
    return request({ url: this.url, method: 'delete', params: params })
  }
  put(data) {
    return request({ url: this.url, method: 'put', data: data })
  }
  post(data) {
    return request({ url: this.url, method: 'post', data: data })
  }
}

export function Request(url) {
  return new Client(url)
}
