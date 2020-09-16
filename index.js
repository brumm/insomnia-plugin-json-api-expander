const { default: normalizeJSONApiResponse } = require('json-api-normalizer')
const { default: expandJSONApiResponse } = require('redux-object')

module.exports.responseHooks = [
  (context) => {
    if (context.request.hasHeader('x-expand-jsonapi')) {
      context.request.removeHeader('x-expand-jsonapi')

      const body = context.response.getBody()
      const data = JSON.parse(Buffer.from(body).toString())

      const normalized = normalizeJSONApiResponse(data)
      const type = Object.keys(normalized)[0]
      const expanded = expandJSONApiResponse(normalized, type, null, {
        eager: true,
      })

      const newBody = Buffer.from(JSON.stringify(expanded))
      context.response.setBody(newBody)
    }
  },
]
