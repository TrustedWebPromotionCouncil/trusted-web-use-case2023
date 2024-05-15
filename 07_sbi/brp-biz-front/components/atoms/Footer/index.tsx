import { useState } from 'react'

interface Props {
  color?: string;
}

const Footer = ({ color = '#ff6347' }: Props) => {
  const [isLoading, setLoading] = useState(false)

  const reset = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reset', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error('Error resetting:', error)
    } finally {
      setLoading(false)
    }
  }

  const spinnerStyle = {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  }

  return (
    <footer className="flex h-10 items-center justify-center" style={{ backgroundColor: color }}>
      <div className="flex items-center justify-center">
        {isLoading && <div style={spinnerStyle}></div>}
        <span className="text-white cursor-pointer" onClick={reset}>
          DeTC - Decentralized Trust Chain
          {isLoading && " 現在データベースリセット中"}
        </span>
      </div>
    </footer>
  )
}

export default Footer;
