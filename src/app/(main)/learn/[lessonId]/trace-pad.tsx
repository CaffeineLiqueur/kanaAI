'use client'

import Image from 'next/image'
import { useRef } from 'react'

export function TracePad({ character, onDraw }: { character: string; onDraw: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  function position(event: React.PointerEvent<HTMLCanvasElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - box.left) * 240 / box.width, y: (event.clientY - box.top) * 240 / box.height }
  }
  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    const { x, y } = position(event)
    context.beginPath()
    context.moveTo(x, y)
    context.lineWidth = 5
    context.strokeStyle = '#e85f55'
    context.lineCap = 'round'
    context.lineJoin = 'round'
    onDraw()
  }
  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const { x, y } = position(event)
    context.lineTo(x, y)
    context.stroke()
  }
  return <div className="relative mt-5 aspect-square w-full max-w-60 overflow-hidden rounded-xl border border-[var(--border)] bg-white">
    <Image unoptimized src={`/kana-strokes/${character.codePointAt(0)}.svg`} width={240} height={240} alt={`${character} 的笔顺动画`} className="absolute inset-0 h-full w-full opacity-70" />
    <canvas ref={canvasRef} width={240} height={240} className="absolute inset-0 h-full w-full touch-none" aria-label={`描摹 ${character}`} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drawing.current = false }} onPointerCancel={() => { drawing.current = false }} />
  </div>
}
