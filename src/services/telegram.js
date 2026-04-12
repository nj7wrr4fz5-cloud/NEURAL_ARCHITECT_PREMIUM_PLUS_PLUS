export async function sendToTelegram(token, chatId, text, threadId = null) {
  const body = { chat_id: chatId, text: text, parse_mode: 'Markdown' }
  if (threadId) body.message_thread_id = parseInt(threadId)
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  })
  return await response.json()
}

export async function testBotToken(token) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`)
    return await response.json()
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export async function getChatInfo(token, chatId) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`)
    return await response.json()
  } catch (err) {
    return { ok: false, error: err.message }
  }
}