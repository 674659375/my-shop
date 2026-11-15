'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 注册功能
  async function signUp() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setMsg('注册失败：' + error.message)
    } else {
      setMsg('注册成功！请直接登录（因为我们之前关掉了邮箱验证）。')
    }
  }

  // 登录功能
  async function signIn() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMsg('登录失败：' + error.message)
    } else {
      setMsg('登录成功！即将跳转回首页...')
      setTimeout(() => {
        router.push('/') // 登录成功后跳转回首页
      }, 1000)
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>注册 / 登录</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="请输入邮箱" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input 
          type="password" 
          placeholder="请输入密码（至少6位）" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
          <button 
            onClick={signIn} 
            disabled={loading}
            style={{ flex: 1, padding: 10, background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            {loading ? '请稍候...' : '登 录'}
          </button>
          <button 
            onClick={signUp} 
            disabled={loading}
            style={{ flex: 1, padding: 10, background: '#fff', color: '#0070f3', border: '1px solid #0070f3', borderRadius: 4, cursor: 'pointer' }}
          >
            注 册
          </button>
        </div>
      </div>

      {/* 显示提示信息 */}
      {msg && <p style={{ marginTop: 20, color: msg.includes('失败') ? 'red' : 'green' }}>{msg}</p >}
      
      <br />
      <a href=" " style={{ color: '#0070f3' }}>← 返回首页</a >
    </div>
  )
}