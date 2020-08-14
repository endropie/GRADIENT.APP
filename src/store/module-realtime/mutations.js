
const compare = (a, b) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

export function CONTACT_PUSH (state, data) {
  if (!state.contacts.some(x => x.id === data.id)) {
    state.contacts.push(data)
    state.contacts.sort(compare)
  }
}

export function ADD_CONVERSATION (state, data) {
  if (!state.conversations.some(x => x.id === data.id)) {
    data = Object.assign({ ...data, messages: [] })
    state.conversations.push(data)
  }
}

export function SET_CONVERSATION (state, data) {
  state.directUserID = data
}
