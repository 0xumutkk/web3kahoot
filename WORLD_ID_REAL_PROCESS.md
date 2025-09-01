# 🔍 Gerçek World ID Verification Süreci

Bu rehber, [World Documentation](https://docs.world.org/)'a göre gerçek World ID verification sürecini açıklar.

## 🎯 Neden Artık "Tek Tıkla Verified" Değil?

Önceki implementasyonda World ID verification simüle ediliyordu. Şimdi gerçek World ID verification süreci var:

### ❌ Önceki (Yanlış) Yaklaşım:
```typescript
// Simüle ediliyordu
await new Promise(resolve => setTimeout(resolve, 2000))
setIsVerified(true) // Direkt verified yapıyordu
```

### ✅ Şimdi (Doğru) Yaklaşım:
```typescript
// Gerçek World ID verification süreci
const verificationResult = await verifyWorldIdProof(proof)
if (verificationResult.success) {
  setIsVerified(true) // Sadece gerçek verification sonrası
}
```

## 🔄 Gerçek World ID Verification Süreci

### 1. **Kullanıcı Butona Tıklar**
```tsx
<WorldIdWidget
  onSuccess={handleVerificationSuccess}
  onError={handleVerificationError}
/>
```

### 2. **IDKit Widget Açılır**
- IDKit widget popup olarak açılır
- Kullanıcı World App'e yönlendirilir

### 3. **World App'te Verification**
- Kullanıcı World App'te verification yapar
- Proof oluşturulur

### 4. **Proof Widget'a Döner**
- Proof IDKit widget'a geri gönderilir
- `onSuccess` callback'i tetiklenir

### 5. **Backend Verification**
```typescript
const verificationResult = await verifyWorldIdProof(proof)
```

### 6. **World ID Verify Endpoint**
```typescript
// https://developer.worldcoin.org/api/v1/verify
const response = await fetch('https://developer.worldcoin.org/api/v1/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    merkle_root: proof.merkle_root,
    nullifier_hash: proof.nullifier_hash,
    proof: proof.proof,
    credential_type: proof.credential_type,
    action: 'quiz_verification',
    signal: 'user_quiz_participation'
  })
})
```

### 7. **Sonuç**
- ✅ Başarılı: `isVerified = true`
- ❌ Başarısız: `error = "Verification failed"`

## 📋 Implementation Detayları

### IDKit Widget Component
```tsx
// components/WorldIdWidget.tsx
import { IDKitWidget } from '@worldcoin/idkit'

export const WorldIdWidget = ({ onSuccess, onError }: WorldIdWidgetProps) => {
  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}
      action="quiz_verification"
      signal="user_quiz_participation"
      onSuccess={onSuccess}
      onError={onError}
    >
      {({ open }) => (
        <button onClick={open}>
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  )
}
```

### Verification Service
```typescript
// lib/worldIdVerification.ts
export const verifyWorldIdProof = async (proof: WorldIdProof) => {
  const response = await fetch('https://developer.worldcoin.org/api/v1/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merkle_root: proof.merkle_root,
      nullifier_hash: proof.nullifier_hash,
      proof: proof.proof,
      credential_type: proof.credential_type,
      action: 'quiz_verification',
      signal: 'user_quiz_participation'
    })
  })
  
  return response.ok ? { success: true } : { success: false }
}
```

### useWorldId Hook
```typescript
// hooks/useWorldId.ts
const handleVerificationSuccess = useCallback(async (proof: WorldIdProof) => {
  const verificationResult = await verifyWorldIdProof(proof)
  
  if (verificationResult.success) {
    setIsVerified(true) // Sadece gerçek verification sonrası
  } else {
    setError('Verification failed')
  }
}, [])
```

## 🔍 Test Etme

### 1. **Development Test**
```bash
# Uygulamayı başlat
npm run dev

# Test sayfasını ziyaret et
http://localhost:3000/world-id-test
```

### 2. **Verification Süreci**
1. "Verify with World ID" butonuna tıkla
2. IDKit widget açılır
3. World App'e yönlendirilir
4. World App'te verification yap
5. Proof oluşturulur
6. Backend'de doğrulanır
7. Sonuç gösterilir

### 3. **Console Logları**
```javascript
// Başarılı verification
World ID proof received: { merkle_root: "...", nullifier_hash: "...", ... }
Verifying World ID proof...
World ID verification successful
World ID verification completed successfully

// Başarısız verification
World ID verification failed: Invalid proof
```

## 🚨 Hata Durumları

### 1. **Widget Açılmaz**
- App ID yanlış
- Network bağlantısı yok

### 2. **World App Açılmaz**
- World App yüklü değil
- Kullanıcı iptal etti

### 3. **Verification Başarısız**
- Proof geçersiz
- Action/signal yanlış
- Rate limit aşıldı

## 📊 Avantajlar

### ✅ Gerçek Verification:
- **Güvenli**: Gerçek World ID proof'ları
- **Doğrulanabilir**: Backend'de verify edilir
- **Güvenilir**: World ID altyapısı kullanır

### ❌ Simüle Edilen:
- **Güvensiz**: Sahte verification
- **Yanıltıcı**: Gerçek değil
- **Geçersiz**: Proof yok

## 🎯 Sonuç

Artık World ID verification gerçek bir süreç:

1. **Kullanıcı tıklar** → IDKit widget açılır
2. **World App'e yönlendirilir** → Verification yapılır
3. **Proof oluşturulur** → Widget'a döner
4. **Backend'de doğrulanır** → World ID verify endpoint
5. **Sonuç gösterilir** → Başarılı/Başarısız

Bu yaklaşım [World Documentation](https://docs.world.org/)'a tam uyumlu ve gerçek World ID verification sağlar.
