'use client'

import { useState, useRef } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [script, setScript] = useState('me: Hey! How are you?\nhim: I\'m doing great!\nme: What\'s up?\nhim: Just chilling')
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [person1Name, setPerson1Name] = useState('You')
  const [person2Name, setPerson2Name] = useState('Dad')
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

  const drawRoundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
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
    const width = 1080
    const height = 1920

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

      let visibleMessages = []

      const animate = (startTime) => {
        const elapsed = Date.now() - startTime

        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, width, 60)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 18px -apple-system'
        ctx.textAlign = 'center'
        ctx.fillText('9:41', width / 2, 40)

        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 60, width, 90)
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 24px -apple-system'
        ctx.textAlign = 'center'
        ctx.fillText(person2Name, width / 2, 120)

        const keyboardHeight = 400
        const chatAreaHeight = height - 60 - 90 - keyboardHeight - 100

        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, height - keyboardHeight - 100, width, keyboardHeight + 100)

        ctx.fillStyle = '#252525'
        ctx.fillRect(30, height - keyboardHeight - 80, width - 60, 60)
        ctx.strokeStyle = '#444'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = '#666'
        ctx.font = '16px -apple-system'
        ctx.textAlign = 'left'
        ctx.fillText('+', 50, height - keyboardHeight - 50)

        let timeOffset = 0

        messages.forEach((msg, idx) => {
          const typingDuration = msg.text.length * 30
          const messageShowStart = timeOffset
          const messageShowEnd = messageShowStart + typingDuration + 500

          if (elapsed >= messageShowStart && elapsed < messageShowEnd + 1500) {
            if (!visibleMessages.find(m => m.idx === idx)) {
              visibleMessages.push({ ...msg, idx, startTime: messageShowStart })
            }
          }

          timeOffset = messageShowEnd + 800
        })

        let yOffset = 150
        const padding = 30
        const maxMessageWidth = width - 100

        visibleMessages.forEach((msg, displayIdx) => {
          const isMine = msg.sender === 'me'
          const bgColor = isMine ? '#007AFF' : '#333333'
          const textColor = '#ffffff'

          ctx.font = '18px -apple-system'
          ctx.fillStyle = textColor

          const messageLines = msg.text.match(/.{1,35}/g) || []
          const bubbleHeight = Math.max(50, messageLines.length * 30 + 20)

          const bubbleX = isMine ? width - padding - maxMessageWidth : padding
          const bubbleWidth = Math.min(maxMessageWidth - 50, msg.text.length * 8 + 40)

          ctx.fillStyle = bgColor
          this.drawRoundRect = drawRoundRect
          drawRoundRect(ctx, bubbleX, yOffset, bubbleWidth, bubbleHeight, 20)
          ctx.fill()

          ctx.fillStyle = textColor
          ctx.font = '18px -apple-system'
          ctx.textAlign = isMine ? 'right' : 'left'

          let textY = yOffset + 30
          messageLines.forEach(line => {
            ctx.fillText(line.trim(), isMine ? bubbleX + bubbleWidth - 20 : bubbleX + 20, textY)
            textY += 30
          })

          yOffset += bubbleHeight + 30
        })

        const totalDuration = timeOffset + 2000

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
      alert('Error generating video: ' + error.message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Chat Video Generator</h1>
        <p>Create realistic iPhone screen recordings for TikTok (9:16)</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Your Script</h2>
            <p>Format: me: and him: (or her:, them:)</p>
          </div>

          <div className={styles.inputGroup}>
            <label>Your Name</label>
            <input
              type="text"
              value={person1Name}
              onChange={(e) => setPerson1Name(e.target.value)}
              placeholder="Your name"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Contact Name</label>
            <input
              type="text"
              value={person2Name}
              onChange={(e) => setPerson2Name(e.target.value)}
              placeholder="Contact name"
              className={styles.input}
            />
          </div>

          <textarea
            value={script}
            onChange={handleScriptChange}
            placeholder="me: Hello!&#10;him: Hi there!&#10;me: How are you?&#10;him: Doing great!"
            className={styles.textarea}
          />

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
              'Generate Video (9:16 TikTok)'
            )}
          </button>

          <p className={styles.infoText}>
            💡 Tip: Each message will appear naturally with typing animation
          </p>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Live Preview (9:16)</h2>
          </div>

          <div className={styles.previewContainer}>
            <div className={styles.previewPhone916}>
              <div className={styles.statusBar}>
                <span>9:41</span>
              </div>

              <div className={styles.chatHeader}>
                <h3>{person2Name}</h3>
              </div>

              <div className={styles.messagesArea}>
                {messages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>Messages will appear here</p>
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

              <div className={styles.keyboard}>
                <div className={styles.inputArea}>
                  <span>+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
