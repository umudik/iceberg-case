# 🔐 .env Dosyası Kurulum Kılavuzu

## ⚠️ ÖNEMLİ: 403 Forbidden Hatası Çözümü

Şu anda **403 Forbidden** hatası alıyorsunuz çünkü `.env` dosyanız yok veya API key'iniz eksik.

## 📝 Adım 1: .env Dosyası Oluşturma

**Windows (PowerShell):**
```powershell
# Proje kök dizininde çalıştırın
New-Item -Path ".env" -ItemType File
```

**Windows (Command Prompt):**
```cmd
# Proje kök dizininde çalıştırın
type nul > .env
```

**Mac/Linux:**
```bash
# Proje kök dizininde çalıştırın
touch .env
```

## 📝 Adım 2: .env Dosyasını Düzenleme

`.env` dosyasını bir text editörde açın ve aşağıdaki içeriği yapıştırın:

```env
VITE_AIRTABLE_API_KEY=YOUR_API_KEY_HERE
VITE_AIRTABLE_BASE_ID=app2VkWVWD7VdX7Hb
VITE_AIRTABLE_APPOINTMENTS_TABLE=Appointments
VITE_AIRTABLE_AGENTS_TABLE=Agents
VITE_AIRTABLE_CONTACTS_TABLE=Contacts
```

## 🔑 Adım 3: Airtable API Key Oluşturma

1. **[Airtable Personal Access Tokens](https://airtable.com/create/tokens)** sayfasına gidin
2. **"Create new token"** butonuna tıklayın
3. Token için bir isim girin: örn. "Appointment App"
4. **Scopes** bölümünde şunları seçin:
   - ✅ `data.records:read` - Read records
   - ✅ `data.records:write` - Write records
   - ✅ `schema.bases:read` - Read base schema

5. **Access** bölümünde:
   - "Add a base" butonuna tıklayın
   - Base'inizi seçin: `app2VkWVWD7VdX7Hb` 
   - Ya da base isminizle arayın

6. **"Create token"** butonuna tıklayın
7. **Token'ı kopyalayın** (⚠️ Sadece bir kez gösterilir!)
8. `.env` dosyasındaki `YOUR_API_KEY_HERE` yerine yapıştırın

Token şöyle görünmeli: `patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

## 🔄 Adım 4: Vite Server'ı Yeniden Başlatma

**ÖNEMLİ:** .env dosyasını ekledikten sonra Vite server'ı yeniden başlatmalısınız!

1. Terminal'de `Ctrl+C` ile server'ı durdurun
2. Tekrar başlatın:
```bash
npm run dev
```

## ✅ Adım 5: Kontrol

Browser'da uygulamanızı açın ve Console'u kontrol edin (F12):

**Başarılı ise görecekleriniz:**
- ✅ "Airtable SDK initialized successfully"
- API Key: patXXXXXXXXXX... (ilk 10 karakter görünür)
- Base ID: app2VkWVWD7VdX7Hb

**Hata varsa görecekleriniz:**
- ❌ "AIRTABLE_API_KEY is not set in .env file!"
- API Key: NOT SET

## 🐛 Sorun Giderme

### Hala 403 hatası alıyorsanız:

1. **Token'ınızın doğru scope'lara sahip olduğundan emin olun**
   - Airtable'da token sayfasına gidin
   - Token'ınızı bulun ve "Edit" tıklayın
   - Scopes ve Access bölümlerini kontrol edin

2. **Base ID'nin doğru olduğundan emin olun**
   - URL'nizde: `https://airtable.com/app2VkWVWD7VdX7Hb/...`
   - Base ID: `app2VkWVWD7VdX7Hb`

3. **.env dosyasının doğru konumda olduğundan emin olun**
   - Proje kök dizininde olmalı (package.json ile aynı seviyede)
   - `C:\Users\seyit\OneDrive\Desktop\CODE\iceberg-case\.env`

4. **Variable isimlerinin doğru olduğundan emin olun**
   - `VITE_` prefix'i olmalı
   - Büyük harf kullanın
   - Boşluk olmamalı

5. **Browser cache'ini temizleyin**
   - Hard refresh: `Ctrl+Shift+R` (Windows) veya `Cmd+Shift+R` (Mac)

### Test için örnek .env içeriği:

```env
VITE_AIRTABLE_API_KEY=patABCDEF12345678.abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQR
VITE_AIRTABLE_BASE_ID=app2VkWVWD7VdX7Hb
VITE_AIRTABLE_APPOINTMENTS_TABLE=Appointments
VITE_AIRTABLE_AGENTS_TABLE=Agents
VITE_AIRTABLE_CONTACTS_TABLE=Contacts
```

## 📞 Destek

Hala sorun yaşıyorsanız:
1. Browser Console'daki tüm hata mesajlarını kontrol edin
2. Network tab'ında failed request'leri inceleyin
3. Airtable API documentation'ı kontrol edin: https://airtable.com/developers/web/api/introduction
