'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('请先登录')
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setOrders(data)
      setLoading(false)
    }
    fetchOrders()
  }, [])

  async function handlePaid(orderId: number) {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'paid_pending_confirm' })
      .eq('id', orderId)

    if (error) {
      alert('操作失败：' + error.message)
    } else {
      alert('已通知商家，请等待确认收款！')
      window.location.reload()
    }
  }

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>我的订单</h1>
      
      {orders.length === 0 ? (
        <p>你还没有订单，<a href=" " style={{ color: '#0070f3' }}>去首页看看吧</a ></p >
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
              <p><strong>订单号：</strong>{order.order_no}</p >
              <p><strong>金额：</strong><span style={{ color: 'red' }}>¥{order.total}</span></p >
              <p><strong>购买积分：</strong><span style={{ color: '#0070f3' }}>{order.points} 积分</span></p >
              <p><strong>状态：</strong>
                {order.status === 'pending_payment' && '待付款'}
                {order.status === 'paid_pending_confirm' && '已付款，待商家确认'}
                {order.status === 'paid' && '商家已确认收款'}
              </p >

              {/* 如果是待付款，显示两个收款码 */}
              {order.status === 'pending_payment' && (
                <div style={{ marginTop: 15, borderTop: '1px dashed #ccc', paddingTop: 15 }}>
                  <p style={{ color: '#e4393c', fontWeight: 'bold' }}>请扫码付款，并在备注中填写订单号：{order.order_no}</p >
                  
                  <div style={{ display: 'flex', gap: '40px', marginTop: '15px', flexWrap: 'wrap' }}>
                    {/* 微信收款码 */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>微信支付</p >
                      < img src="/wechat.png" alt="微信收款码" style={{ width: 200, height: 200, objectFit: 'contain', border: '1px solid #eee' }} />
                    </div>

                    {/* 支付宝收款码 */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '5px 0', fontWeight: 'bold' }}>支付宝</p >
                      < img src="/alipay.png" alt="支付宝收款码" style={{ width: 200, height: 200, objectFit: 'contain', border: '1px solid #eee' }} />
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePaid(order.id)}
                    style={{ marginTop: 20, padding: '10px 20px', background: '#ff9800', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    我已付款
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <br />
      <a href="/" style={{ color: '#0070f3' }}>← 返回首页</a >
    </div>
  )
}