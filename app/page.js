'use client'

import { useState, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [script, setScript] = useState('me: Hey! How are you?\nhim: I\'m doing great! What\'s up?\nme: Just wanted to chat\nhim: That\'s awesome!')
  const [messages, setMessages] = useState([])
  const [chatStyle, setChatStyle] = useState('instagram')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

  const parseScript = (text) => {
    const lines = text.split('\n').filter(l => l.trim())
    const parsed = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().startsWith('me:')) {
        return { sender: 'me', text: trimmed.substring(3).trim() }
      } else if (trimmed.toLowerCase().startsWith('him:') || trimmed.toLowerCase().startsWith('her:') || trimmed.toLowerCase().startsWith('them:')) {
        return { sender: 'other', text: trimmed.substring(trimmed.indexOf(':') + 1).trim() }
      }
      return null
    }).filter(Boolean)
    setMessages(parsed)
  }

  const handleScriptChange = (e) => {
    setScript(e.target.value)
    parseScript(e.target.value)
  }

  const generateVideo = async () => {
    if (messages.length === 0) return
    setIsGenerating(true)

    const canvas = canvasRef.current
    if (!canvas) {
      setIsGenerating(false)
      return
    }

    const ctx = canvas.getContext('2d')
    const width = 360
    const height = 640
    canvas.width = width
    canvas.height = height

    try {
      const stream = canvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
      const chunks = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `chat-video-${new Date().getTime()}.webm`
        a.click()
        URL.revokeObjectURL(url)
        setIsGenerating(false)
      }

      mediaRecorder.start()

      const bgColor = chatStyle === 'imessage' ? '#f5f5f5' : '#fff'
      const animate = (startTime) => {
        const elapsed = Date.now() - startTime

        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, width, height)

        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif'
        ctx.fillStyle = '#666'
        ctx.textAlign = 'center'
        ctx.fillText('Chat Preview', width / 2, 30)

        let yOffset = 60
        const padding = 12

        messages.forEach((msg, idx) => {
          const messageDelay = idx * 1000
          const messageDuration = 1500

          if (elapsed >= messageDelay && elapsed < messageDelay + messageDuration) {
            const progress = Math.min((elapsed - messageDelay) / 500, 1)

            ctx.save()
            ctx.globalAlpha = progress

            const isMine = msg.sender === 'me'
            const bgBubbleColor = isMine ? '#007AFF' : '#E5E5EA'
            const textColor = isMine ? '#fff' : '#000'

            ctx.fillStyle = bgBubbleColor
            ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif'

            const textWidth = 140
            const bubbleX = isMine ? width - padding - textWidth - 8 : padding + 8
            const bubbleWidth = textWidth
            const bubbleHeight = 36

            ctx.fillRect(bubbleX, yOffset, bubbleWidth, bubbleHeight)

            ctx.fillStyle = textColor
            ctx.textAlign = isMine ? 'right' : 'left'
            ctx.fillText(msg.text.substring(0, 28), isMine ? width - padding - 12 : padding + 12, yOffset + 24)

            yOffset += bubbleHeight + 8

            ctx.restore()
          }
        })

        const totalDuration = messages.length * 1000 + 1500

        if (elapsed < totalDuration) {
          requestAnimationFrame(() => animate(startTime))
        } else {
          mediaRecorder.stop()
        }
      }

      animate(Date.now())
    } catch (error) {
      console.error('Video generation error:', error)
      setIsGenerating(false)
      alert('Error generating video. Try a different browser.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Chat Video Generator</h1>
        <p>Turn your chat scripts into realistic video recordings</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Your Script</h2>
            <p>Format: me: and him: (or her:, them:)</p>
          </div>

          <textarea
            value={script}
            onChange={handleScriptChange}
            placeholder="me: Hello!&#10;him: Hi there!"
            className={styles.textarea}
          />

          <div className={styles.formGroup}>
            <label>Chat Style</label>
            <select value={chatStyle} onChange={(e) => setChatStyle(e.target.value)} className={styles.select}>
              <option value="instagram">Instagram DM</option>
              <option value="imessage">iMessage</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          <button
            onClick={generateVideo}
            disabled={isGenerating || messages.length === 0}
            className={styles.generateBtn}
          >
            {isGenerating ? (
              <>
                <span className={styles.spinner}></span>
                Generating video...
              </>
            ) : (
              'Generate Video'
            )}
          </button>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Live Preview</h2>
          </div>

          <div className={styles.previewPhone}>
            <div className={styles.previewChat} style={{ backgroundColor: chatStyle === 'imessage' ? '#f5f5f5' : '#fff' }}>
              {messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Your chat will appear here</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`${styles.messageBubble} ${msg.sender === 'me' ? styles.myMessage : styles.theirMessage}`}>
                    <div className={styles.bubbleText}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
