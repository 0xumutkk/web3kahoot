# World ID Integration Setup Guide

Bu rehber, Quiz Chain uygulamasında gerçek World ID entegrasyonunu nasıl kuracağınızı açıklar.

## 🎯 Genel Bakış

World ID entegrasyonu iki modda çalışır:
1. **World App İçinde**: Gerçek World ID verification
2. **Normal Tarayıcıda**: Demo mod (test için)

## 📋 Gereksinimler

### 1. World Developer Portal Hesabı
- [World Developer Portal](https://developer.worldcoin.org)'a kayıt olun
- Mini app'inizi oluşturun
- App ID'nizi alın

### 2. World App
- Gerçek verification için World App gerekli
- Test için demo mod kullanılabilir

## 🔧 Kurulum Adımları

### 1. Environment Variables Ayarlayın

`.env.local` dosyanızı oluşturun:

```env
# World ID Configuration
NEXT_PUBLIC_WORLD_ID_APP_ID=your_actual_app_id_here
NEXT_PUBLIC_WORLD_ID_ACTION=quiz_verification
NEXT_PUBLIC_WORLD_ID_SIGNAL=user_quiz_participation

# Socket.IO Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3002
SOCKET_PORT=3002
CLIENT_URL=http://localhost:3000
```

### 2. World Developer Portal Ayarları

1. [World Developer Portal](https://developer.worldcoin.org)'a gidin
2. Yeni bir mini app oluşturun
3. App ID'nizi kopyalayın
4. Redirect URI'ları ayarlayın:
   - `http://localhost:3000`
   - `https://your-ngrok-url.ngrok-free.app`

### 3. Mini App Konfigürasyonu

World Developer Portal'da mini app'inizi şu şekilde yapılandırın:

```json
{
  "name": "Quiz Chain",
  "description": "A Kahoot-like quiz game with World ID verification",
  "app_id": "your_app_id_here",
  "actions": [
    {
      "name": "quiz_verification",
      "description": "Verify user for quiz participation"
    }
  ],
  "signals": [
    {
      "name": "user_quiz_participation",
      "description": "User participating in quiz"
    }
  ]
}
```

## 🧪 Test Etme

### 1. Demo Mod Testi (Normal Tarayıcı)

```bash
# Uygulamayı başlatın
npm run dev
npm run socket-server

# Test sayfasını ziyaret edin
http://localhost:3000/world-id-test
```

**Beklenen Sonuç:**
- "World App not detected" mesajı
- Demo verification çalışır
- Mock data gösterilir

### 2. Gerçek World ID Testi (World App İçinde)

1. World App'i açın
2. Mini app'inizi bulun
3. Quiz Chain uygulamasını açın
4. World ID verification'ı test edin

**Beklenen Sonuç:**
- "MiniKit installed: true" console'da görünür
- Gerçek World ID verification çalışır
- Gerçek verification data gösterilir

## 🔍 Debug ve Sorun Giderme

### Console Logları

Browser console'da şu logları görmelisiniz:

```javascript
// World App içinde
"MiniKit installed: true"
"Running inside World App - real verification available"
"Subscribed to World ID verification events"

// Normal tarayıcıda
"MiniKit installed: false"
"Running outside World App - demo mode only"
```

### Yaygın Hatalar

#### 1. "MiniKit is not installed"
**Çözüm:** World App içinde çalıştığınızdan emin olun

#### 2. "Verification failed"
**Çözüm:** 
- App ID'nin doğru olduğunu kontrol edin
- World Developer Portal ayarlarını kontrol edin
- Network bağlantınızı kontrol edin

#### 3. "Action not found"
**Çözüm:** World Developer Portal'da action'ı tanımladığınızdan emin olun

## 📱 World App İçinde Test

### 1. Mini App'i World App'e Ekleme

1. World App'i açın
2. Mini Apps bölümüne gidin
3. Quiz Chain'i arayın ve ekleyin

### 2. Test Senaryoları

#### Senaryo 1: İlk Kez Verification
1. Quiz Chain'i açın
2. "Verify with World ID" butonuna tıklayın
3. World ID verification sürecini tamamlayın
4. Verification başarılı olmalı

#### Senaryo 2: Tekrar Verification
1. Daha önce verify olmuş kullanıcı
2. "Verify with World ID" butonuna tıklayın
3. Hızlı verification (cached)

## 🚀 Production Deployment

### 1. Environment Variables

Production'da şu environment variables'ları ayarlayın:

```env
NEXT_PUBLIC_WORLD_ID_APP_ID=your_production_app_id
NEXT_PUBLIC_WORLD_ID_ACTION=quiz_verification
NEXT_PUBLIC_WORLD_ID_SIGNAL=user_quiz_participation
```

### 2. World Developer Portal

Production URL'lerinizi World Developer Portal'a ekleyin:
- `https://your-domain.com`
- `https://your-domain.com/world-id-test`

### 3. Mini App Review

World App'e eklenmek için:
1. Mini app'inizi test edin
2. World Developer Portal'da review için submit edin
3. World ID team'den onay bekleyin

## 📊 Monitoring ve Analytics

### Verification Metrics

Şu metrikleri takip edin:
- Verification success rate
- Error rates
- User engagement
- World App vs Browser usage

### Log Monitoring

```javascript
// Console'da bu logları takip edin
console.log('World ID verification started')
console.log('World ID verification successful')
console.log('World ID verification failed:', error)
```

## 🔐 Güvenlik

### Best Practices

1. **App ID Güvenliği**: App ID'nizi public repository'de paylaşmayın
2. **Environment Variables**: Production'da environment variables kullanın
3. **Error Handling**: Kullanıcı dostu error mesajları gösterin
4. **Rate Limiting**: Verification isteklerini sınırlayın

### Verification Data

World ID verification'dan gelen data:
```typescript
interface WorldIdVerification {
  proof: string           // Zero-knowledge proof
  merkle_root: string     // Merkle tree root
  nullifier_hash: string  // Unique identifier
  credential_type: string // "orb" or other types
}
```

## 📞 Destek

### World ID Destek
- [World Documentation](https://docs.world.org)
- [World Discord](https://discord.gg/worldcoin)
- [World ID Examples](https://github.com/worldcoin/world-id-examples)

### Quiz Chain Destek
- GitHub Issues
- Documentation
- Community Discord

## ✅ Checklist

- [ ] World Developer Portal hesabı oluşturuldu
- [ ] Mini app oluşturuldu ve App ID alındı
- [ ] Environment variables ayarlandı
- [ ] Demo mod test edildi
- [ ] World App içinde test edildi
- [ ] Production environment hazırlandı
- [ ] Monitoring ve analytics kuruldu
- [ ] Security best practices uygulandı

## 🎉 Tamamlandı!

World ID entegrasyonunuz artık hazır! Kullanıcılarınız artık:
- World App içinde gerçek World ID verification yapabilir
- Normal tarayıcıda demo mod kullanabilir
- Quiz'lere güvenli şekilde katılabilir

Herhangi bir sorunla karşılaşırsanız, yukarıdaki destek kanallarından yardım alabilirsiniz.
