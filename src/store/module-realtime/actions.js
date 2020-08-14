
export function addConversation (context, data) {
  // console.warn('setcontact', typeof data, Array.isArray(data))
  if (typeof data === 'object') {
    context.commit('ADD_CONVERSATION', JSON.parse(JSON.stringify(data)))
    context.commit('SET_CONVERSATION', data.id)
  }
}

export function setConversation (context, data) {
  // console.warn('setcontact', typeof data, Array.isArray(data))
  if (data) {
    context.commit('SET_CONVERSATION', data)
  }
}
