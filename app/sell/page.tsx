'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SellPage() {
  const [points, setPoints] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submitRequest() {
    if (!points || Number(points) <= 0) return alert('请输入正确的积分数量')
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('请先登录')
      router.push('/login')
      return
    }

    // 检查卖家有没有绑定收款码（从 profiles 表查）
    const { data: prof } = await supabase.from('profiles').select('wechat_qr, alipay_qr').eq('id', user.id).single()
    if (!prof || (!prof.wechat_qr && !prof.alipay_qr)) {
      alert('请先到“个人中心”填写您的收款码，否则买家无法给您付款！')
      router.push('/profile')
      return
    }

    const { error } = await supabase.from('sell_requests').insert({
      seller_id: user.id,
      points_to_sell: Number(points)
    })

    if (error) {
      alert('发布失败：' + error.message)
    } else {
      alert('出售挂单成功！请等待客服为您匹配买家。')
      router.push('/') 
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>出售积分</h1>
      <a href=" " style={{ color: '#0070f3' }}>← 返回首页</a >
      
      <div style={{ marginTop: 30, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <label style={{ display: 'block', marginBottom: 10 }}>我想卖多少积分？</label>
        <input 
          type="number" 
          value={points} 
          onChange={e => setPoints(e.target.value)} 
          placeholder="例如：1000"
          style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 20 }}
        />
        
        <div style={{ background: '#f9f9f9', padding: 15, borderRadius: 4, marginBottom: 20 }}>
          <p style={{ margin: 0 }}>您将按 1:1 的价格收到人民币。</p >
          <p style={{ margin: '10px 0 0 0', color: '#0070f3', fontSize: 20, fontWeight: 'bold' }}>
            预计可得：{points || 0} 元
          </p >
        </div>

        <button 
          onClick={submitRequest} 
          disabled={loading}
          style={{ width: '100%', padding: 12, background: '#e4393c', color: 'white', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}
        >
          {loading ? '提交中...' : '确认发布出售'}
        </button>
      </div>
    </div>
  )
}