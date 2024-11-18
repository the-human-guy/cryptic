const { useEffect, useState } = React

export const PasswordInput = (props) => {
  const [revealing, setRevealing] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <input {...props} type={revealing ? 'text' : 'password'} />
      <div
        onClick={() => setRevealing(!revealing)}
        style={{ 
          position: 'absolute',
          top: '0.3rem',
          right: '0.5rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}>
          {revealing ? "🔓️" : "🔒️"}
        </div>
    </div>
  )
}
