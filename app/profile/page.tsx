'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [wechat, setWechat] = useState('')
  const [alipay, setAlipay] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 获取/创建个人资料
      let { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      
      if (!prof) {
        // 如果是新用户，自动生成一个随机邀请码并创建资料
        const newCode = Math.random().toString(36).slice(2, 8).toUpperCase()
        const { data: newProf } = await supabase.from('profiles').insert({ 
          id: user.id, 
          invite_code: newCode 
        }).select().single()
        prof = newProf
      }

      if (prof) {
        setProfile(prof)
        setWechat(prof.wechat_qr || '')
        setAlipay(prof.alipay_qr || '')
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // 保存收款码（这里为了新手先简化为填写文本，后面教图片上传）
  async function saveQRs() {
    const { error } = await supabase.from('profiles').update({
      wechat_qr: wechat,
      alipay_qr: alipay
    }).eq('id', user.id)

    if (error) alert('保存失败：' + error.message)
    else alert('收款码保存成功！')
  }

  if (loading) return <div style={{ padding: 40 }}>加载中...</div>

  // 生成邀请链接
  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/login?ref=${profile?.invite_code}` : ''

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>个人中心</h1>
      <a href=" " style={{ color: '#0070f3' }}>← 返回首页</a >
      
      <div style={{ marginTop: 20, padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
        <h3>我的资产</h3>
        <p>当前积分余额：<strong style={{ fontSize: 24, color: '#e4393c' }}>{profile?.balance || 0}</strong> 积分</p >
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>我的收款码</h3>
        <p style={{ color: '#666', fontSize: 14 }}>作为卖家卖积分时，买家会看到这个收款码</p >
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <input placeholder="微信收款码图片链接（暂填文字）" value={wechat} onChange={e => setWechat(e.target.value)} style={{ padding: 8, flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <input placeholder="支付宝收款码图片链接（暂填文字）" value={alipay} onChange={e => setAlipay(e.target.value)} style={{ padding: 8, flex: 1 }} />
        </div>
        <button onClick={saveQRs} style={{ marginTop: 10, padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 4 }}>保存收款码</button>
      </div>

      <div style={{ marginTop: 30, padding: 20, border: '1px dashed #0070f3', borderRadius: 8 }}>
        <h3>邀请好友</h3>
        <p>你的专属邀请码：<strong style={{ color: '#0070f3', fontSize: 20 }}>{profile?.invite_code}</strong></p >
        <p>邀请链接（复制发给朋友）：</p >
        <input readOnly value={inviteLink} style={{ width: '100%', padding: 8, marginTop: 5 }} />
      </div>

    </div>
  )
}