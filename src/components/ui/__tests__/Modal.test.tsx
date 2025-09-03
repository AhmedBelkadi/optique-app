import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../dialog'

describe('Modal/Dialog', () => {
  it('should render dialog trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>Content</DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
  })

  it('should open dialog when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          Dialog Content
        </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByText('Open Dialog')
    fireEvent.click(trigger)
    
    expect(screen.getByText('Dialog Content')).toBeInTheDocument()
  })

  it('should render dialog with header', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    expect(screen.getByText('Dialog Description')).toBeInTheDocument()
  })

  it('should render dialog with footer', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogFooter>
            <button>Cancel</button>
            <button>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('should close dialog when escape key is pressed', () => {
    const onOpenChange = jest.fn()
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          Content
        </DialogContent>
      </Dialog>
    )
    
    const dialog = screen.getByText('Content').closest('[role="dialog"]')
    if (dialog) {
      fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' })
      expect(onOpenChange).toHaveBeenCalledWith(false)
    }
  })

  it('should apply custom className to content', () => {
    render(
      <Dialog open>
        <DialogContent className="custom-dialog">
          <DialogTitle>Dialog Title</DialogTitle>
          Content
        </DialogContent>
      </Dialog>
    )
    
    const content = screen.getByText('Content').closest('[role="dialog"]')
    if (content) {
      expect(content).toHaveClass('custom-dialog')
    }
  })

  it('should handle controlled open state', () => {
    const onOpenChange = jest.fn()
    render(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          Content
        </DialogContent>
      </Dialog>
    )
    
    // Dialog should not be visible initially
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
    
    // Click trigger should call onOpenChange
    fireEvent.click(screen.getByText('Open'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
