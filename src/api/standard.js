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

export const Device = new Restlet('/apis/devices', '/apis/device')
export const Group = new Restlet('/apis/groups', '/apis/group')
export const Letter = new Restlet('/apis/letters', '/apis/letter')
export const Delivery = new Restlet('/apis/deliveries', '/apis/delivery')

export const Kind = new Restlet('/adm/kinds', '/adm/kind')
export const Customer = new Restlet('/adm/customers', '/adm/customer')

export const LetterTags = new Client('/apis/letters/tags')
export const DeviceTags = new Client('/apis/devices/tags')
export const DeviceKinds = new Client('/apis/devices/kinds')
export const GroupTags = new Client('/apis/groups/tags')

export const Statuses = [
  { value: -2, label: '拒绝', color: '#F56C6C' },
  { value: -1, label: '检测失败', color: '#E6A23C' },
  { value: 0, label: '未处理', color: '#DCDFE6' },
  { value: 1, label: '检测通过', color: '#303133' },
  { value: 2, label: '审核通过', color: '#409EFF' }
]
