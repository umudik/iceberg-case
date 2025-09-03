component ui ve fonksiyonaliteyi ayır 
ddd clean arcitecture uy.
ekstra css yazma sadece vuetify kullan.
tasarımı adam ederim sonra fonksiyonaliteye odaklan.
şimdilik mock stateler kullan mock veriler sonra api bağlarız.
ui best practicelerini kullan.

Frontend Geliştirici Pozisyonu İlanı
Şirketimizdeki Frontend pozisyonu için başvurunuzun kabul edilmesi üzerine, size bir proje görevi vermek istiyoruz. Bu proje, yeteneklerinizi
ve becerilerinizi değerlendirmemiz ve birlikte çalışma potansiyelimizi ölçmemiz amacıyla tasarlanmıştır. Projeyi geliştirirken efektif ve çözüm
odaklı bir yaklaşım benimseyeceğinizi ön görüyoruz.	
PROJE TANIMI:
Projemizin temel amacı, emlakçı çalışanlarının sistemlerinde kayıtlı olan kişilere evleri gezdirmelerini sağlayan randevu işlemlerini yönetmek
için bir uygulama geliştirmektir.	
Beklentimiz, kullanıcıların randevularını yönetebilecekleri bir uygulama geliştirmemizdir.	
Kullanıcılar, uygulamayı kullanarak günlük olarak randevularını listeleyebilmeli, yeni randevular ekleyebilmeli ve mevcut randevularını
güncelleyebilmelidirler.	
BEKLENTILERIMIZ:
• Projenin Vue-2 veya Vue-3 kullanılarak geliştirilmesi ve Vue.js framework'ünün temel prensiplerine hakim olunması.	
• Kullanıcı deneyimini ön planda tutarak responsive (Masaüstü, Tablet, Mobil) tasarım yaklaşımının benimsenmesi ve uygulanması.
•
• Kodlama sürecinde güçlüve anlaşılır yorumlar eklenmesi, kod tekrarının önlenmesi ve kod kalitesinin sürekli olarak kontrol edilmesi.	
• Doğru şekilde validasyonlarının yapılması ve kullanıcıya bilgilendirici hata mesajları sunulması.	
• Frontend kodlarının modüler bir yapıda oluşturulması ve Component-Based Architecture pattern’i doğru şekilde benimsenmesi.	
• Projenin zamanında ve belirlenen standartlara uygun şekilde tamamlanması için disiplinli bir çalışma anlayışının benimsenmesi.	
• Projenin Airtable API'lerini kullanarak verilerin alınması ve güncellenmesi.	
• Proje, bir versiyon yönetim sisteminde (tercihen GitLab) tutulmalı ve kod değişimleri parçalı olarak commit’ler halinde, İngilizce dilinde
işlemler ile ilgili detay içerecek şekilde yapılmalı.	
API Erişimi ve Kullanılacak Endpointler
Bu proje için Airtable üzerinde barındırılan verilere erişim sağlamak için aşağıdaki adımları izleyin:	
1. Airtable API Key Oluşturma Sayfası üzerinden kendi API anahtarınızı oluşturun.	
2. Oluşturulan API anahtarınızı kullanarak API erişim hakkı almak için tıklayınız.	
3. Proje içinde kullanılacak API'ler hakkında bilgi için Airtable API Dokümantasyonunu inceleyin.	
Teknik Detaylar:
1. Listeleme Ekranı:
Listeleme
Kullanıcılara yukarıdaki sağlanmış olduğumuz listeleme ekranı sağlanmalıdır.
‘Create Appointment’ butonu:
Kullanıcı bu butona tıkladığında ‘Randevu’ oluşturma modası açılacak. Detaylar kendisine ait kısımda anlatılacak.	
Liste elemanı:
4 temel parçası vardır. Soldan sağa doğru:	
1. Contact (Kişi) bilgileri: İsim-Soyisim, email ve telefon numarasını gösterir.	
2. Evin adresi gösterilir.	
3. Randevunun tarihi ve durumu.	
4. Randevuya katılacak olan agent ’lar.	
Listeleme & Filtreleme:
Randevuların tamamını ilgili API'den çekip, aşağıdaki istenilen listeleme ve filtreleme işlemlerini Frontend tarafında API'leri kullanmadan
gerçekleştirmenizi istiyoruz. Böylece JavaScript becerilerinizi daha iyi sergileyebilirsiniz.	
Aşağıda anlatacağım filtrelemeler birbirleri ile bütünleşik çalışmalı yani kullanıcı dilerse birden fazla filtreyi aynı anda uygulayabilmeli.	
• Pagination: Çekilen randevular 10’ar olacak şekilde pagination ile listelenmeli.	
• Sıralama: Listelenen elementler, randevu tarihine göre yenide eskiye doğru olmalı.
• Durum Filtrelemesi:
Randevular içinde durumlarına göre filtreleme yapmalı. 4 adet seçenek olmalı:	
All Statuses: 	 Varsayılan bu olmalı ve duruma göre herhangi bir filtreleme yapmamalı	
Cancelled: İptal edilen randevuları listelemeli	
		 	 	 	 	 Upcoming: İptal edilmemiş randevular içinden, tarihi henüz geçmemiş olanları listeler.	
		 	 	 	 	 Completed: İptal edilmemiş randevular içinden, tarihi geçmiş olanları listeler.	
• Kullanıcı Filtrelemesi:	
Bütün ‘Agency’ bilgilerini ilgili API’den çektikten sonra yukarıdaki gibi bir yapı kurgulamanızı bekliyoruz. ‘Background’ renklendirmesi için her
Agent’ın kendi tema rengi ilgili API’den sağlanıyor olacak.	
Kullanıcını burada bir veya daha fazla Agent seçebilir ve seçtiği Agent (lar) ın randevuları listelenmeli.
İlk tıklama Agent seçer, ikinci kez aynı agent’a tıklanırsa o seçim kaldırılır.	
• Arama:
Adres, müşteri ismi, epostası yada telefon numarasına göre arama yapılabilmeli. Arama case insensitive
olmalı.	
• Randevu Tarihine Göre Filtreleme:
Kullanıcı dilerse belirli aralıktaki randevuları listeleyebilmeli.	
2. Randevunun Oluşturulması:
Kullanıcı randevu oluşturmak istediğinde sol taraftaki gibi bir modal ile bu işlemi yapabilmeli.	
• ‘Search’ kısmı ile sistemde daha önce ilgili API ile çekilen kişiler içinden ‘case insentive’ şekilde
arama yapabilmeli ve istediği kişiyi seçebilmeli.	
• ‘Address’ bu kısma istediği adresi yazabilmeli.	
• ‘Agent’ kısmında, agent’larımız listelenmeli ve kullanıcı istediği agent ya da agent’ları
seçebilmeli.	
• ‘Appointment Date’, randevu tarih ve saatini girebilmeli.	
Gerekli ‘Input Validasyonları’ yapılmalı	
Randevu Oluşturma
3. Randevu Düzenleme
Kullanıcı listeleme elemanına tıkladığında soldaki arayüz açılmalı ve kullanıcı dilerse aşağıdaki
işlemleri yapabilmeli.	
• Kişi kaldırılıp, yerine başka kişi eklenebilmeli.	
• Adres değiştirilebilmeli.	
• Agent bilgisi değiştilebilmeli.	
•Tarih - saat bilgisi değiştirilebilmeli.	
•‘Select Box’ ile istenirse durum ‘Cancelled’ olarak ayarlanabilmeli yada ‘Cancelled’ işlemi geri
alınabilmeli. Buradaki önemli nokta:	
Tarih geçmemiş ise, seçenekler ‘Upcoming’ ve ‘Cancelled’ olmalı.	
Tarih geçmiş ise, seçenekler ‘Completed’ ve ‘Cancelled’ olmalı.	
•Related Appoinments:	
Seçili olan kişinin varsa başka randevuları burada listelenmeli.
Randevu Düzenleme