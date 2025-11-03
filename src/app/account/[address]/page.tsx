import AccountDetailFeature from '@/components/account/account-detail-feature'
import { Suspense } from 'react'

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-white">Loading...</p>}>
      <AccountDetailFeature />
    </Suspense>
  )
}
