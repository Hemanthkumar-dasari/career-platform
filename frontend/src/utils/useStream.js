/**
 * Consume a plain text stream (readable stream).
 * onChunk(accumulated) is called with the full text so far on each new token.
 * Returns the final accumulated string when stream finishes.
 */
export async function consumeStream(url, options, onChunk) {
  const token = localStorage.getItem('access_token')
  
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    },
  })

  if (!res.ok) {
    let errText = res.statusText
    try {
      const err = await res.json()
      errText = err.detail || errText
    } catch {}
    throw new Error(errText || 'Streaming request failed')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // Decode current chunk and append
    const chunkString = decoder.decode(value, { stream: true })
    accumulated += chunkString
    
    // Call the callback immediately with what we have
    if (onChunk) {
      onChunk(chunkString, accumulated)
    }
  }
  
  return accumulated
}
