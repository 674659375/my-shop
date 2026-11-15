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
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: 36 }}>积分担保交易平台</h1>
      <p style={{ color: '#666', marginBottom: 40 }}>安全、快捷、官方担保</p >

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: 40 }}>
        {user ? (
          <>
            <Link href="/profile" style={{ padding: '15px 30px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: 8 }}>👤 个人中心</Link>
            <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ padding: '15px 30px', background: '#ccc', border: 'none', borderRadius: 8, cursor: 'pointer' }}>退出登录</button>
          </>
        ) : (
          <Link href="/login" style={{ padding: '15px 30px', background: '#333', color: 'white', textDecoration: 'none', borderRadius: 8 }}>去登录 / 注册</Link>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
        <Link href="/buy" style={{ display: 'block', padding: 40, background: '#e6f7ff', border: '2px solid #0070f3', borderRadius: 12, textDecoration: 'none', color: '#0070f3', width: 250 }}>
          <h2>🛒 求购积分</h2>
          <p style={{ fontSize: 14 }}>花 1 元得 1.15 积分</p >
        </Link>

        <Link href="/sell" style={{ display: 'block', padding: 40, background: '#fff1f0', border: '2px solid #e4393c', borderRadius: 12, textDecoration: 'none', color: '#e4393c', width: 250 }}>
          <h2>💰 出售积分</h2>
          <p style={{ fontSize: 14 }}>1 积分换 1 元</p >
        </Link>
      </div>
    </div>
  )
}