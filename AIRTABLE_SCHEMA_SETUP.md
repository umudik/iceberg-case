# 📊 Airtable Tablo Oluşturma Kılavuzu

## 🎯 Base'inizde Tablo Oluşturma

Base URL: `https://airtable.com/app2VkWVWD7VdX7Hb`

### 📝 Adım 1: Contacts Tablosu

1. Base'inizi açın
2. Sol altta **"+ Add or import"** butonuna tıklayın
3. **"Create blank table"** seçin
4. Tablo adını **"Contacts"** olarak girin (TAM BU İSİMLE!)
5. Aşağıdaki alanları ekleyin:

| Alan Adı | Field Type | Notlar |
|----------|------------|--------|
| **firstName** | Single line text | İsim |
| **lastName** | Single line text | Soyisim |
| **email** | Email | E-posta adresi |
| **phone** | Phone number | Telefon numarası |

**Varsayılan "Name" alanını silin veya "firstName" olarak yeniden adlandırın**

### 👥 Adım 2: Agents Tablosu

1. Yeni tablo ekleyin (+ Add or import)
2. Tablo adını **"Agents"** olarak girin
3. Aşağıdaki alanları ekleyin:

| Alan Adı | Field Type | Notlar |
|----------|------------|--------|
| **name** | Single line text | Temsilci adı |
| **email** | Email | E-posta |
| **phone** | Phone number | Telefon |
| **themeColor** | Single line text | Renk kodu (örn: #FF5733) |

### 📅 Adım 3: Appointments Tablosu

1. Yeni tablo ekleyin (+ Add or import)
2. Tablo adını **"Appointments"** olarak girin
3. Aşağıdaki alanları ekleyin:

| Alan Adı | Field Type | Ayarlar |
|----------|------------|---------|
| **contactId** | Link to another record | → Contacts tablosuna bağla |
| **address** | Single line text | Adres bilgisi |
| **agentIds** | Link to another record | → Agents tablosuna bağla, **"Allow linking to multiple records"** seçeneğini AKTİF et |
| **appointmentDate** | Date | Include time: ON (Saati de dahil et) |
| **status** | Single select | Seçenekler: `upcoming`, `completed`, `cancelled` |
| **updatedAt** | Date | Include time: ON |

## 🔧 Önemli Ayarlar

### Link to Another Record Alanları İçin:

**contactId** alanı için:
1. Field type: "Link to another record"
2. Table to link to: "Contacts"
3. Allow linking to multiple records: KAPALI ❌

**agentIds** alanı için:
1. Field type: "Link to another record"
2. Table to link to: "Agents"
3. Allow linking to multiple records: AÇIK ✅

### Single Select (status) Alanı İçin:
1. Field type: "Single select"
2. Options ekleyin:
   - `upcoming` (Yaklaşan) - Yeşil
   - `completed` (Tamamlandı) - Mavi
   - `cancelled` (İptal edildi) - Kırmızı

## 📝 Örnek Veri Ekleme

### Contacts Tablosuna Örnek:
```
firstName: John
lastName: Doe
email: john@example.com
phone: +1234567890
```

### Agents Tablosuna Örnek:
```
name: Sarah Smith
email: sarah@company.com
phone: +1234567891
themeColor: #4CAF50
```

### Appointments Tablosuna Örnek:
```
contactId: [John Doe'yu seç]
address: 123 Main St, New York
agentIds: [Sarah Smith'i seç]
appointmentDate: 2024-01-15 14:30
status: upcoming
updatedAt: 2024-01-10 10:00
```

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Tablo İsimleri BÜYÜK/küçük harfe duyarlıdır!**
   - ✅ Doğru: `Contacts`, `Agents`, `Appointments`
   - ❌ Yanlış: `contacts`, `CONTACTS`, `Contact`

2. **Alan İsimleri tam olarak belirtildiği gibi olmalı**
   - ✅ Doğru: `firstName`, `contactId`, `agentIds`
   - ❌ Yanlış: `first_name`, `contact`, `agents`

3. **View İsimleri**
   - Her tabloda otomatik olarak "Grid view" oluşur
   - Bu view'i silmeyin veya yeniden adlandırmayın

## 🚀 Hızlı Kurulum Script'i

Eğer Airtable API ile tablo oluşturmak isterseniz (Advanced):

```javascript
// Bu kodu browser console'da çalıştıramazsınız
// Sadece referans amaçlıdır
// Tabloları manuel oluşturmanız gerekiyor

const schema = {
  tables: [
    {
      name: "Contacts",
      fields: [
        { name: "firstName", type: "singleLineText" },
        { name: "lastName", type: "singleLineText" },
        { name: "email", type: "email" },
        { name: "phone", type: "phoneNumber" }
      ]
    },
    {
      name: "Agents",
      fields: [
        { name: "name", type: "singleLineText" },
        { name: "email", type: "email" },
        { name: "phone", type: "phoneNumber" },
        { name: "themeColor", type: "singleLineText" }
      ]
    },
    {
      name: "Appointments",
      fields: [
        { name: "contactId", type: "multipleRecordLinks", options: { linkedTableId: "Contacts" } },
        { name: "address", type: "singleLineText" },
        { name: "agentIds", type: "multipleRecordLinks", options: { linkedTableId: "Agents" } },
        { name: "appointmentDate", type: "dateTime" },
        { name: "status", type: "singleSelect", options: { choices: ["upcoming", "completed", "cancelled"] } },
        { name: "updatedAt", type: "dateTime" }
      ]
    }
  ]
};
```

## ✅ Kontrol Listesi

Tabloları oluşturduktan sonra kontrol edin:

- [ ] **Contacts** tablosu var mı?
- [ ] **Agents** tablosu var mı?
- [ ] **Appointments** tablosu var mı?
- [ ] Tüm alan isimleri doğru mu? (firstName, not First Name)
- [ ] Link alanları doğru tablolara bağlı mı?
- [ ] agentIds alanı multiple records'a izin veriyor mu?
- [ ] status alanında 3 seçenek var mı?

## 🎉 Test

Tabloları oluşturduktan sonra:
1. Browser'ı yenileyin (F5)
2. "Test Airtable Connection" butonuna tıklayın
3. Başarılı mesajı görmelisiniz!

## 🆘 Sorun Giderme

Hala 403 hatası alıyorsanız:
1. Tablo isimlerini kontrol edin (büyük/küçük harf)
2. Token'ınızın bu base'e erişimi olduğundan emin olun
3. .env dosyasında tablo isimlerini kontrol edin:
   ```
   VITE_AIRTABLE_APPOINTMENTS_TABLE=Appointments
   VITE_AIRTABLE_AGENTS_TABLE=Agents
   VITE_AIRTABLE_CONTACTS_TABLE=Contacts
   ```
