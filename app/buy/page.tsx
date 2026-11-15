'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function BuyPage() {
  const [money, setMoney] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 核心公式：金额 * 1.15
  const points = money ? (Number(money) * 1.15).toFixed(2) : '0.00'

  async function submitRequest() {
    if (!money || Number(money) <= 0) return alert('请输入正确的金额')
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('请先登录')
      router.push('/login')
      return
    }

    const { error } = await supabase.from('buy_requests').insert({
      buyer_id: user.id,
      amount_money: Number(money),
      points_to_get: Number(points)
    })

    if (error) {
      alert('发布失败：' + error.message)
    } else {
      alert('求购发布成功！请等待客服为您匹配卖家。')
      router.push('/profile') // 跳到个人中心或者订单页
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>求购积分</h1>
      <a href=" " style={{ color: '#0070f3' }}>← 返回首页</a >
      
      <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <label style={{ display: 'block', marginBottom: 10 }}>我想花多少钱？ (元)</label>
        <input 
          type="number" 
          value={money} 
          onChange={e => setMoney(e.target.value)} 
          placeholder="例如：100"
          style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 20 }}
        />
        
        <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 4, marginBottom: 20 }}>
          <p style={{ margin: 0 }}>平台福利比例：1 元 = 1.15 积分</p >
          <p style={{ margin: '10px 0 0 0', color: '#e4393c', fontSize: 20, fontWeight: 'bold' }}>
            预计可得：{points} 积分
          </p >
        </div>

        <button 
          onClick={submitRequest} 
          disabled={loading}
          style={{ width: '100%', padding: 12, background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}
        >
          {loading ? '提交中...' : '确认发布求购'}
        </button>
      </div>
    </div>
  )
}