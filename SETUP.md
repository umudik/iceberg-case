# 🚀 Airtable Setup Guide

Bu uygulama artık Airtable'ın resmi SDK'sını kullanıyor, bu sayede daha güvenilir ve kolay veri yönetimi sağlanıyor.

## ⚠️ 403 Forbidden Hatası Çözümü

Eğer 403 Forbidden hatası alıyorsanız, aşağıdaki adımları takip edin:

## 1. API Key Oluşturma

1. [Airtable Account](https://airtable.com/create/tokens) sayfasına gidin
2. "Create new token" butonuna tıklayın
3. Token'a bir isim verin (örn: "Appointment App")
4. Scopes bölümünde şunları seçin:
   - `data.records:read` - Verileri okumak için
   - `data.records:write` - Veri yazmak için
   - `schema.bases:read` - Base yapısını okumak için
5. Access bölümünde Base'inizi seçin: `app2VkWVWD7VdX7Hb`
6. "Create token" butonuna tıklayın
7. Token'ı kopyalayın (sadece bir kez gösterilir!)

## 2. .env Dosyası Oluşturma

Proje kök dizininde `.env` dosyası oluşturun:

```bash
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=app2VkWVWD7VdX7Hb
VITE_AIRTABLE_APPOINTMENTS_TABLE=Appointments
VITE_AIRTABLE_AGENTS_TABLE=Agents
VITE_AIRTABLE_CONTACTS_TABLE=Contacts
```

⚠️ **Önemli**: `patXXXXXXXXXXXXXX` yerine kendi token'ınızı yapıştırın!

## 3. Airtable Tablo Yapısı

Base'inizde aşağıdaki tabloların olduğundan emin olun:

### Contacts Tablosu
| Alan Adı | Tip |
|----------|-----|
| firstName | Single line text |
| lastName | Single line text |
| email | Email |
| phone | Phone number |

### Agents Tablosu
| Alan Adı | Tip |
|----------|-----|
| name | Single line text |
| email | Email |
| phone | Phone number |
| themeColor | Single line text (hex color) |

### Appointments Tablosu
| Alan Adı | Tip |
|----------|-----|
| contactId | Link to Contacts |
| address | Single line text |
| agentIds | Link to Agents (multiple) |
| appointmentDate | Date and time |
| status | Single select (upcoming, completed, cancelled) |
| updatedAt | Date and time |

## 4. Uygulamayı Yeniden Başlatma

```bash
# Terminal'i kapatıp yeniden açın veya
# Ctrl+C ile durdurup tekrar başlatın
npm run dev
```

## 5. Browser Console'u Kontrol Etme

Browser'ın Developer Tools'unu açın (F12) ve Console'da şunları kontrol edin:
- "Airtable Configuration" log'unda `hasApiKey: true` olmalı
- API key uzunluğu 0'dan büyük olmalı
- Hata mesajlarını kontrol edin

## Yaygın Hatalar ve Çözümleri

### ❌ 403 Forbidden
- API key eksik veya yanlış
- Token'da gerekli scope'lar yok
- Base ID yanlış

### ❌ 404 Not Found
- Tablo isimleri yanlış
- Base ID yanlış

### ❌ 422 Invalid Request
- Tablo alan isimleri uyuşmuyor
- Veri formatı yanlış

## Destek

Hala sorun yaşıyorsanız:
1. Browser console'daki hata mesajlarını kontrol edin
2. Network sekmesinde failed request'leri inceleyin
3. `.env` dosyanızın doğru konumda olduğundan emin olun (proje kök dizini)
4. Vite sunucusunu yeniden başlatın
