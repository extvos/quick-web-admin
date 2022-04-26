import axios from 'axios'
import crypto from 'crypto'
import events from 'events'

import { addQueryStringParams, uuidv4 } from '@/utils'

const evt = new events.EventEmitter()

const defaults = {
  simultaneousUploads: 1,
  chunkSize: 1 * 1024 * 1024,
  filepath: '',
  target: '',
  file: null
}

function uploadChunk(target, params) {
  // check
  if (params.chunkNumber === params.totalChunks) {
    evt.emit('success', true)
    return
  }

  const start = params.chunkNumber * params.chunkSize
  const end = Math.min(params.totalSize, start + params.chunkSize)

  const data = params.file.slice(start, end)
  const reader = new FileReader()
  reader.readAsBinaryString(data)
  reader.onload(ev => {
    const blob = ev.target.result
    const chunkMd5 = crypto.createHash('md5').update(blob, 'utf-8').digest('hex')

    const form = new FormData()
    form.append('file', data)

    params.chunkMd5 = chunkMd5
    params.currentChunkSize = data.size
    axios.get(addQueryStringParams(target, params))
      .then(resp => {
        if (resp.status !== 200) {
          return axios.post(addQueryStringParams(target, params), form)
        }
      })
      .then(resp => {
        evt.emit('process', params.chunkNumber / params.totalChunks)
        params.currentChunkSize++
        uploadChunk(params)
      })
      .catch(err => {
        evt.emit('error', err)
      })
  })
}

//  events: success, error, cancel, progress
export default function(params) {
  params = Object.assign({}, defaults, params)
  const reader = new FileReader()
  reader.readAsBinaryString(params.file)
  reader.onload((ev) => {
    const blob = ev.target.result
    const md5 = crypto.createHash('md5').update(blob, 'utf-8').digest('hex')
    const data = {
      md5,
      rFilename: params.file.name,
      rRelativePath: params.filepath
    }

    // check file is exists
    axios.post(addQueryStringParams(params.target, data), '')
      .then(resp => {
        if (resp.status !== 200) {
          evt.emit('success', true)
        } else {
          params.md5 = md5
          uploadChunk(params.target, {
            chunkNumber: 1,
            chunkSize: params.file.size,
            currentChunkSize: 0,
            filename: params.file.name,
            uuid: uuidv4(),
            relativePath: params.filepath,
            totalChunks: Math.ceil(params.file.size / params.chunkSize),
            totalSize: params.file.size,
            md5: md5,
            chunkMd5: ''
          })
        }
      })
      .catch(err => {
        evt.emit('error', err)
      })
  })
}
