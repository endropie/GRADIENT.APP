export function Contacts (state) {
  return state.contacts.sort(x => x.name)
}

export function Conversations (state) {
  return state.conversations
}

export function Conversation (state) {
  return state.conversations.find(x => x.id === state.directUserID) || null
}

export function DirectMessage (state) {
  return state.directMessage || []
}
