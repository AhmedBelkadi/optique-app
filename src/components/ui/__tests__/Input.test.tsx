import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render input with label', () => {
    render(
      <div>
        <label htmlFor="test-input">Test Label</label>
        <Input id="test-input" />
      </div>
    )
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  it('should handle value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('should support different input types', () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    // Password inputs don't have textbox role
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('should be required when required prop is true', () => {
    render(<Input required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('should have default value', () => {
    render(<Input defaultValue="default text" />)
    expect(screen.getByRole('textbox')).toHaveValue('default text')
  })
})
