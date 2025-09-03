# 🔐 Airtable Token İzin Sorunu Çözümü

## ✅ Token'ınız Yüklendi Ama 403 Hatası Alıyorsunuz

**Durum:**
- API Key: `patcHFbulF...` (82 karakter) ✅ 
- Base ID: `app2VkWVWD7VdX7Hb` ✅
- **HATA: 403 Forbidden - NOT_AUTHORIZED** ❌

## 🛠️ Çözüm: Token İzinlerini Güncelleme

### Adım 1: Mevcut Token'ı Düzenleme

1. [https://airtable.com/create/tokens](https://airtable.com/create/tokens) sayfasına gidin
2. Token listenizde `patcHFbulF...` ile başlayan token'ınızı bulun
3. Token'ın sağındaki **"..."** menüsünden **"Edit token"** seçin

### Adım 2: Scopes (İzinler) Kontrolü

**Bu scope'ların SEÇİLİ olduğundan emin olun:**

- ✅ `data.records:read` - Read records
- ✅ `data.records:write` - Write records  
- ✅ `schema.bases:read` - Read base schema and table metadata

### Adım 3: Base Access (Base Erişimi) Kontrolü

**ÖNEMLİ:** Token'ınızın Base'inize erişimi olmalı!

1. **Access** bölümünde **"Add a base"** butonuna tıklayın
2. Açılan listeden Base'inizi seçin:
   - Base ID ile arayın: `app2VkWVWD7VdX7Hb`
   - VEYA Base isminizle arayın
3. Base'i seçtikten sonra **"Add base"** tıklayın
4. Base'in token'a eklendiğini görmelisiniz

### Adım 4: Token'ı Güncelleme

1. **"Save changes"** butonuna tıklayın
2. Token otomatik olarak güncellenecek (yeni token almaya gerek yok)

## 🔄 Alternatif: Yeni Token Oluşturma

Eğer mevcut token'ı düzenleyemiyorsanız:

### 1. Yeni Token Oluştur
```
1. "Create new token" tıklayın
2. İsim: "Appointment App v2"
3. Scopes:
   ✅ data.records:read
   ✅ data.records:write
   ✅ schema.bases:read
4. Access:
   - Add base → app2VkWVWD7VdX7Hb
5. "Create token" tıklayın
6. Yeni token'ı kopyalayın
```

### 2. .env Dosyasını Güncelle
```env
VITE_AIRTABLE_API_KEY=yeni_token_buraya
VITE_AIRTABLE_BASE_ID=app2VkWVWD7VdX7Hb
VITE_AIRTABLE_APPOINTMENTS_TABLE=Appointments
VITE_AIRTABLE_AGENTS_TABLE=Agents
VITE_AIRTABLE_CONTACTS_TABLE=Contacts
```

### 3. Server'ı Yeniden Başlat
```bash
# Ctrl+C ile durdur
# Tekrar başlat
npm run dev
```

## 🔍 Kontrol Listesi

Token'ınızda şunlar olmalı:

| Özellik | Gerekli | Açıklama |
|---------|---------|----------|
| **Scopes** | | |
| data.records:read | ✅ | Verileri okumak için |
| data.records:write | ✅ | Veri yazmak için |
| schema.bases:read | ✅ | Tablo yapısını okumak için |
| **Access** | | |
| Base: app2VkWVWD7VdX7Hb | ✅ | Base'inize erişim |

## 🐛 Hata Ayıklama

Browser Console'da görmek istediğiniz:
```javascript
✅ Airtable SDK initialized successfully
// Hata yerine veri:
Successfully connected! Found X contacts.
```

## 📝 Not

- Token'ı güncelledikten sonra **hemen** çalışır
- Server'ı yeniden başlatmaya gerek yoktur (token server tarafında değil)
- Ancak browser'ı yenilemek gerekebilir (F5)

## ⚠️ Yaygın Hatalar

1. **Base Access eksik**: Token'a base eklemeyi unutmak
2. **Yanlış Base seçimi**: Farklı bir base seçmek
3. **Scope eksikliği**: Sadece read izni vermek (write de gerekli)
4. **Tablo isimleri**: Airtable'daki tablo isimleri farklı olabilir

## 🎯 Hızlı Test

Debug kartındaki **"Test Airtable Connection"** butonuna tıklayın.
- ✅ Başarılı: "Successfully connected! Found X contacts."
- ❌ Başarısız: Token/izin sorunu devam ediyor
