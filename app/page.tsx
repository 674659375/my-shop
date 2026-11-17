'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '20px 10px' }}>
      
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--bg-color)',
        minHeight: '80vh',
        padding: '40px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        borderRadius: '24px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        
        <h1 style={{ fontSize: 28, marginBottom: 10, fontWeight: 'bold' }}>积分担保交易平台</h1>
        <p style={{ color: '#666', marginBottom: 40 }}>安全、快捷、官方担保</p >

        <div style={{ marginBottom: 40 }}>
          {user ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Link href="/profile" style={{ padding: '10px 20px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: 20, fontSize: 14 }}>👤 个人中心</Link>
              <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ padding: '10px 20px', background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 20, cursor: 'pointer', fontSize: 14 }}>退出登录</button>
            </div>
          ) : (
            <Link href="/login" style={{ padding: '12px 30px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: 20, display: 'inline-block', fontWeight: 'bold' }}>去登录 / 注册</Link>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          
          <Link href="/buy" style={{ display: 'block', padding: '30px 20px', background: '#e6f7ff', border: '2px solid #0070f3', borderRadius: 16, textDecoration: 'none', color: '#0070f3', width: '100%', transition: '0.3s' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 'bold' }}>🛒 求购积分</h2>
            <p style={{ fontSize: 14, margin: '10px 0 0 0', color: '#555' }}>花 1 元得 1.15 积分</p >
          </Link>

          <Link href="/sell" style={{ display: 'block', padding: '30px 20px', background: '#fff1f0', border: '2px solid #e4393c', borderRadius: 16, textDecoration: 'none', color: '#e4393c', width: '100%', transition: '0.3s' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 'bold' }}>💰 出售积分</h2>
            <p style={{ fontSize: 14, margin: '10px 0 0 0', color: '#555' }}>1 积分换 1 元</p >
          </Link>

        </div>

      </div>
    </div>
  )
}
