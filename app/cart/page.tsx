'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  async function submitOrder() {
    if (cart.length === 0) return alert('请先选择积分档位！')
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('请先登录才能充值哦！')
      router.push('/login')
      return
    }

    // 🚨 核心逻辑：检查今天是否已经买过
    // 获取今天的 00:00:00 的 ISO 时间
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { data: todayOrders, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString()) // 大于等于今天零点

    if (checkError) {
      alert('检查限购失败：' + checkError.message)
      setLoading(false)
      return
    }

    if (todayOrders && todayOrders.length > 0) {
      alert('抱歉，每人每天只能购买一次积分！请明天再来。')
      setLoading(false)
      return
    }

    // 生成订单号和金额
    const orderNo = new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,8).toUpperCase()
    const total = cart[0].price
    const points = cart[0].points

    // 创建订单（把 points 存进去）
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ 
        order_no: orderNo, 
        user_id: user.id, 
        total: total,
        points: points,
        status: 'pending_payment'
      })
      .select()
      .single()

    if (orderError) {
      alert('创建订单失败：' + orderError.message)
      setLoading(false)
      return
    }

    // 存入明细（虽然只有一个商品，但为了记录保留）
    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: cart[0].id,
      qty: 1,
      price: total
    })

    alert('下单成功！请去我的订单页面扫码付款。')
    localStorage.removeItem('cart')
    router.push('/orders')
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>确认充值</h1>
      
      {cart.length === 0 ? (
        <p>没有选择积分，<a href=" " style={{ color: '#0070f3' }}>去首页选择</a ></p >
      ) : (
        <>
          <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
            <p>购买项目：<strong>{cart[0].name}</strong></p >
            <p>需支付金额：<strong style={{ color: 'red', fontSize: 20 }}>¥{cart[0].price}</strong></p >
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button 
              onClick={submitOrder} 
              disabled={loading}
              style={{ padding: '10px 20px', background: '#e4393c', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              {loading ? '提交中...' : '确认并提交订单'}
            </button>
          </div>
        </>
      )}
      <br />
      <a href="/" style={{ color: '#0070f3' }}>← 返回首页</a >
    </div>
  )
}