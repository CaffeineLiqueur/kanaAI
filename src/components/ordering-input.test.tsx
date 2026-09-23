import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrderingInput } from './ordering-input'

describe('ordering input', () => {
  it('lets keyboard users build and revise a sentence', () => {
    let value = ''
    const onChange = vi.fn((next: string) => {
      value = next
      view.rerender(<OrderingInput tokens={['学生', 'です', '私', 'は', '。']} value={value} onChange={onChange} />)
    })
    const view = render(<OrderingInput tokens={['学生', 'です', '私', 'は', '。']} value={value} onChange={onChange} />)
    for (const token of ['私', 'は', '学生', 'です', '。']) fireEvent.click(screen.getByRole('button', { name: token }))
    expect(value).toBe('私|は|学生|です|。')
    fireEvent.click(screen.getByRole('button', { name: '移除第 2 个词块 は' }))
    expect(value).toBe('私|学生|です|。')
    fireEvent.click(screen.getByRole('button', { name: '重新排列' }))
    expect(value).toBe('')
  })
})
