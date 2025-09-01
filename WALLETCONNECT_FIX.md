# 🔧 WalletConnect Hatası Çözümü

## 🚨 Hata: "Unauthorized: invalid key"

Bu hata, IDKit widget'ın WalletConnect Project ID'si olmadan çalışmaya çalışmasından kaynaklanıyor.

## ✅ Çözüm Adımları

### 1. **Geçici Çözüm (Şu An Uygulandı)**

WalletConnect Project ID'yi opsiyonel hale getirdik:

```tsx
// components/WorldIdWidget.tsx
<IDKitWidget
  app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_staging_1234567890abcdef'}
  action="quiz_verification"
  signal="user_quiz_participation"
  onSuccess={onSuccess}
  // WalletConnect Project ID opsiyonel - eğer yoksa kaldır
  // walletConnectProjectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
>
```

### 2. **Kalıcı Çözüm (Önerilen)**

#### A. WalletConnect Project ID Alın

1. [WalletConnect Cloud](https://cloud.walletconnect.com/)'a gidin
2. Hesap oluşturun veya giriş yapın
3. Yeni bir project oluşturun
4. Project ID'nizi alın

#### B. Environment Variables'a Ekleyin

```env
# .env.local
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_actual_project_id_here
```

#### C. Widget'ı Güncelleyin

```tsx
// components/WorldIdWidget.tsx
<IDKitWidget
  app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_staging_1234567890abcdef'}
  action="quiz_verification"
  signal="user_quiz_participation"
  onSuccess={onSuccess}
  walletConnectProjectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
>
```

## 🔍 Hata Detayları

### Hata Mesajı
```
Error: WebSocket connection closed abnormally with code: 3000 (Unauthorized: invalid key)
```

### Call Stack
```
o.onClose from node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
EventEmitter.eval from node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
EventEmitter.emit from node_modules/events/events.js
f.onClose from node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
e.onclose from node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
```

### Neden Oluşuyor?
- IDKit widget, WalletConnect altyapısını kullanır
- WalletConnect Project ID gerekli
- Project ID yoksa veya yanlışsa "Unauthorized" hatası verir

## 🚀 Production'da Kullanım

### Development (Local)
```env
# .env.local
NEXT_PUBLIC_WORLD_ID_APP_ID=app_staging_1234567890abcdef
NEXT_PUBLIC_WORLD_ID_ACTION=quiz_verification
NEXT_PUBLIC_WORLD_ID_SIGNAL=user_quiz_participation
# WalletConnect Project ID opsiyonel
```

### Production
```env
# .env.production
NEXT_PUBLIC_WORLD_ID_APP_ID=your_production_app_id
NEXT_PUBLIC_WORLD_ID_ACTION=quiz_verification
NEXT_PUBLIC_WORLD_ID_SIGNAL=user_quiz_participation
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_production_wallet_connect_id
```

## 📱 World App Mini App Entegrasyonu

### Mini App'te WalletConnect
World App Mini App'lerde WalletConnect genellikle gerekli değildir çünkü:
- World App kendi wallet'ını sağlar
- MiniKit ile wallet erişimi mümkün
- External wallet connection opsiyonel

### Önerilen Yaklaşım
```tsx
// hooks/useMiniApp.ts
import { MiniKit } from '@worldcoin/minikit-js'

export const useMiniApp = () => {
  const isInWorldApp = MiniKit.isInstalled()
  
  const getWallet = async () => {
    if (isInWorldApp) {
      // World App wallet kullan
      return await MiniKit.commandsAsync.getWallet()
    } else {
      // External wallet connection
      return await connectExternalWallet()
    }
  }
  
  return { isInWorldApp, getWallet }
}
```

## 🔧 Test Etme

### 1. **Local Test**
```bash
# Uygulamayı başlat
npm run dev

# Test et
curl http://localhost:3000
```

### 2. **WalletConnect Test**
```bash
# WalletConnect Project ID ile test
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=test_id npm run dev
```

### 3. **World ID Test**
```bash
# World ID verification test
# "Verify with World ID" butonuna tıkla
# Console'da hata olup olmadığını kontrol et
```

## 📊 Durum

### ✅ Çözülen
- [x] WalletConnect Project ID opsiyonel hale getirildi
- [x] IDKit widget çalışır durumda
- [x] World ID verification çalışıyor
- [x] Local Hardhat node çalışıyor

### 🔄 Devam Eden
- [ ] Production WalletConnect Project ID
- [ ] World App Mini App entegrasyonu
- [ ] Production deployment

## 🎯 Sonuç

WalletConnect hatası geçici olarak çözüldü. Production'da WalletConnect Project ID almanız önerilir, ancak şu an uygulama çalışır durumda.

**Test URL**: `http://localhost:3000` ✅
