import { ReactNode, RefObject, createRef, useEffect } from 'react'

interface Props {
  open?: boolean;
  onBackdropClick?: () => void;
  children?: ReactNode;
}

const Overlay = ({ open, onBackdropClick, children }: Props) => {
  const backdropRef: RefObject<HTMLDivElement> = createRef()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (backdropRef.current && backdropRef.current == event.target) {
        onBackdropClick && onBackdropClick()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [backdropRef, onBackdropClick])

  return (
    <div className={`relative z-10 ease-in duration-300 ${!open && 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-30 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" ref={backdropRef}>
        {children}        
        </div>
      </div>
    </div>
  )
}

export default Overlay