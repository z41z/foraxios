# foraxios
Easy Axios to use.
## Install

``` node
  npm i foraxios //or yarn add foraxios
```

### Usage

``` js
import foraxios from 'foraxios';
// Message is unnecessary
import { Message } from 'element-ui';
const $foraxios = new foraxios({
  // Request handler
  request(config) {
    // config content is api request content.
    if (config.isOpenApi === undefined) {
      config.headers = {
        'token': `Bearer ${localStorage.access_token}`
      }
    }
  },
  // Request success handler
  success(res) {
    // res is api data returned
    if (res.code !== 0) {
      Message.error(res.msg)
    }
    return {
      ...res,
      isSuccess: true
    }
  },
  // Request error handler
  error(err) {
    Message.error(err)
    return err
  }
})

// Common request
const login = (data) => {
  return $foraxios.$api(
    {
      url: `/api/login`,
      method: 'post',
      data,
      name: '用户登录'
    }
  )
}
// Donwload binary file
const exportFile = (data) => {
  return $foraxios.$api(
    {
      url: `/api/export`,
      data: {
        ...data,
        fileName: 'export.xlsx'
      },
      name: 'export file',
      type: 'file'
    }
  )
}
```


### Base Config `Object`
  - {Function} request = (config) => { } :`Request handler.`
  - {Function} success = (res) => { } :`Request success handler.`
  - {Function} error = (err) => { } :`Request error handler.`
  - {Number} timeout = 10e3 :`Request timeout.`
  - {Object} headers  :`Request.`
  - {Boolean} isShowConsole = true :`Is show message on console.`

### Request API Config `Object`
  - {String} url  :`Request url.`
  - {*} data  :`Request data.`
  - {String} name  :`API name.`
  - {String} method = 'get' :`Request method.`
  - {String} type  :`Set value 'file' then download binary file.`
  - {*} mockData  :`Mock Data`