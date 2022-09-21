import { Restlet } from '@/api/standard.js'
import request from '@/utils/request'

export class DeviceInterface extends Restlet {
  grantMqtt(id) {
    return request({
      url: '/data/terminal/device/' + id + '/grant-mqtt',
      method: 'post',
      data: ''
    })
  }
  getAuth(id) {
    return request({
      url: '/data/terminal/device/' + id + '/mqtt-auth',
      method: 'get'
    })
  }
}
export const Device = new DeviceInterface('/data/terminal/device', '/data/terminal/device')
export const Group = new Restlet('/data/terminal/group', '/data/terminal/group')
