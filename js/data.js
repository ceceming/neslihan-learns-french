// İçerik dosyası. Yeni kelime/cümle eklerken listelerin SONUNA ekle
// (ilerleme kayıtları sıra numarasına bağlı).
// Kelime formatı: [fransızca, türkçe, örnek cümle, örnek çevirisi, cinsiyet ('m' eril / 'f' dişil / ''), not]

const THEMES = [
  { id: 'bases', emoji: '👋', name: 'Tanışma & Temel', words: [
    ['bonjour', 'merhaba / günaydın', "Bonjour, je m'appelle Neslihan.", 'Merhaba, benim adım Neslihan.'],
    ['bonsoir', 'iyi akşamlar', 'Bonsoir madame !', 'İyi akşamlar hanımefendi!'],
    ['au revoir', 'hoşça kalın / güle güle', 'Au revoir, à demain !', 'Hoşça kalın, yarın görüşürüz!'],
    ['merci', 'teşekkürler', 'Merci beaucoup !', 'Çok teşekkürler!'],
    ["s'il vous plaît", 'lütfen', "Un café, s'il vous plaît.", 'Bir kahve, lütfen.'],
    ['excusez-moi', 'affedersiniz', 'Excusez-moi, où est la gare ?', 'Affedersiniz, gar nerede?'],
    ["je m'appelle", 'benim adım …', "Je m'appelle Neslihan.", 'Benim adım Neslihan.'],
    ["j'habite à", '…de yaşıyorum', "J'habite à Istanbul.", "İstanbul'da yaşıyorum."],
    ['turc', 'Türk', 'Je suis turque.', 'Ben Türküm.', '', 'kadın için: turque'],
    ["l'âge", 'yaş', 'Quel âge avez-vous ?', 'Kaç yaşındasınız?', 'm'],
    ['le travail', 'iş', 'Je vais au travail en bus.', 'İşe otobüsle giderim.', 'm'],
    ['parler', 'konuşmak', 'Je parle turc et un peu français.', 'Türkçe ve biraz Fransızca konuşuyorum.'],
    ['comprendre', 'anlamak', 'Je ne comprends pas.', 'Anlamıyorum.'],
    ['répéter', 'tekrar etmek', "Vous pouvez répéter, s'il vous plaît ?", 'Tekrar edebilir misiniz, lütfen?'],
    ["d'accord", 'tamam / anlaştık', "D'accord, à samedi !", 'Tamam, cumartesi görüşürüz!'],
  ]},
  { id: 'famille', emoji: '👨‍👩‍👧', name: 'Aile', words: [
    ['la famille', 'aile', "J'ai une grande famille.", 'Büyük bir ailem var.', 'f'],
    ['la mère', 'anne', 'Ma mère habite à Ankara.', "Annem Ankara'da yaşıyor.", 'f'],
    ['le père', 'baba', 'Mon père est à la retraite.', 'Babam emekli.', 'm'],
    ['le mari', 'koca / eş (erkek)', 'Le mari de Claire est médecin.', "Claire'in kocası doktor.", 'm'],
    ['la femme', 'kadın / eş (kadın)', 'Sa femme travaille à la banque.', 'Karısı bankada çalışıyor.', 'f'],
    ['le fils', 'oğul', 'Son fils a vingt ans.', 'Oğlu yirmi yaşında.', 'm'],
    ['la fille', 'kız / kız evlat', 'Ma fille habite à Londres.', "Kızım Londra'da yaşıyor.", 'f'],
    ['les enfants', 'çocuklar', 'Les enfants jouent dans le jardin.', 'Çocuklar bahçede oynuyor.'],
    ['les parents', 'anne baba', 'Mes parents sont gentils.', 'Annemle babam çok iyi.'],
    ['le frère', 'erkek kardeş', "J'ai un frère.", 'Bir erkek kardeşim var.', 'm'],
    ['la sœur', 'kız kardeş', 'Ma sœur a deux enfants.', 'Kız kardeşimin iki çocuğu var.', 'f'],
    ['les grands-parents', 'büyükanne ve büyükbaba', 'Mes grands-parents habitent à la campagne.', 'Büyükannemle büyükbabam köyde yaşıyor.'],
    ['le petit-fils', 'erkek torun', 'Mon petit-fils a cinq ans.', 'Erkek torunum beş yaşında.', 'm'],
    ['la petite-fille', 'kız torun', 'Ma petite-fille aime chanter.', 'Kız torunum şarkı söylemeyi sever.', 'f'],
    ['marié', 'evli', 'Elle est mariée.', 'O evli.', '', 'kadın için: mariée'],
    ["l'ami", 'arkadaş', 'Je dîne avec une amie.', 'Bir arkadaşımla akşam yemeği yiyorum.', 'm', 'kadın arkadaş: une amie'],
  ]},
  { id: 'courses', emoji: '🥖', name: 'Yemek & Alışveriş', words: [
    ['le pain', 'ekmek', "J'achète du pain à la boulangerie.", 'Fırından ekmek alıyorum.', 'm'],
    ["l'eau", 'su', "Une bouteille d'eau, s'il vous plaît.", 'Bir şişe su, lütfen.', 'f'],
    ['le fromage', 'peynir', "J'aime le fromage.", 'Peyniri severim.', 'm'],
    ['la viande', 'et', 'Je ne mange pas de viande.', 'Et yemem.', 'f'],
    ['le poisson', 'balık', 'Le vendredi, on mange du poisson.', 'Cumaları balık yeriz.', 'm'],
    ['les légumes', 'sebzeler', 'Je mange des légumes tous les jours.', 'Her gün sebze yerim.'],
    ['les fruits', 'meyveler', 'Les fruits sont frais.', 'Meyveler taze.'],
    ['la pomme', 'elma', 'Je voudrais un kilo de pommes.', 'Bir kilo elma istiyorum.', 'f'],
    ['le café', 'kahve', 'Je bois un café le matin.', 'Sabahları bir kahve içerim.', 'm'],
    ['le marché', 'pazar', 'Le samedi, je vais au marché.', 'Cumartesileri pazara giderim.', 'm'],
    ['combien', 'ne kadar / kaç', "C'est combien ?", 'Ne kadar?'],
    ['cher', 'pahalı', "C'est trop cher !", 'Çok pahalı!', '', 'dişil: chère'],
    ['je voudrais', '… istiyorum (kibar)', 'Je voudrais un kilo de tomates.', 'Bir kilo domates istiyorum.'],
    ['le petit-déjeuner', 'kahvaltı', 'Je prends le petit-déjeuner à huit heures.', 'Saat sekizde kahvaltı yaparım.', 'm'],
    ['le déjeuner', 'öğle yemeği', 'Le déjeuner est à midi.', 'Öğle yemeği saat on ikide.', 'm'],
    ['le dîner', 'akşam yemeği', 'Le dîner est prêt !', 'Akşam yemeği hazır!', 'm'],
  ]},
  { id: 'ville', emoji: '🏠', name: 'Ev & Şehir', words: [
    ['la maison', 'ev', 'Ma maison est petite.', 'Evim küçük.', 'f'],
    ["l'appartement", 'daire', "J'habite dans un appartement.", 'Bir dairede oturuyorum.', 'm'],
    ['la cuisine', 'mutfak', 'Je suis dans la cuisine.', 'Mutfaktayım.', 'f'],
    ['la chambre', 'yatak odası / oda', 'La chambre est grande.', 'Yatak odası büyük.', 'f'],
    ['la salle de bains', 'banyo', 'La salle de bains est à gauche.', 'Banyo solda.', 'f'],
    ['la rue', 'sokak / cadde', "J'habite rue Victor Hugo.", 'Victor Hugo Caddesi’nde oturuyorum.', 'f'],
    ['la gare', 'tren garı', 'La gare est loin.', 'Gar uzak.', 'f'],
    ['la pharmacie', 'eczane', 'Où est la pharmacie ?', 'Eczane nerede?', 'f'],
    ['la banque', 'banka', 'La banque est fermée le dimanche.', 'Banka pazar günü kapalı.', 'f'],
    ['la poste', 'postane', 'Je vais à la poste.', 'Postaneye gidiyorum.', 'f'],
    ['à gauche', 'sola / solda', 'Tournez à gauche.', 'Sola dönün.'],
    ['à droite', 'sağa / sağda', 'La boulangerie est à droite.', 'Fırın sağda.'],
    ['tout droit', 'dümdüz', 'Allez tout droit.', 'Dümdüz gidin.'],
    ['près de', 'yakınında', 'La pharmacie est près de la gare.', 'Eczane garın yakınında.'],
    ['loin', 'uzak', "C'est loin d'ici ?", 'Buraya uzak mı?'],
  ]},
  { id: 'temps', emoji: '📅', name: 'Zaman & Günler', words: [
    ['lundi', 'pazartesi', 'Lundi, je travaille.', 'Pazartesi çalışıyorum.'],
    ['mardi', 'salı', 'Mardi, je vais au cours de français.', 'Salı Fransızca kursuna gidiyorum.'],
    ['mercredi', 'çarşamba', 'Mercredi, il fait beau.', 'Çarşamba hava güzel.'],
    ['jeudi', 'perşembe', 'Jeudi, je vais chez le médecin.', 'Perşembe doktora gidiyorum.'],
    ['vendredi', 'cuma', 'Vendredi soir, on va au cinéma.', 'Cuma akşamı sinemaya gidiyoruz.'],
    ['samedi', 'cumartesi', 'Samedi, je vais au marché.', 'Cumartesi pazara gidiyorum.'],
    ['dimanche', 'pazar (gün)', 'Le dimanche, je me repose.', 'Pazarları dinlenirim.'],
    ["aujourd'hui", 'bugün', "Aujourd'hui, il fait chaud.", 'Bugün hava sıcak.'],
    ['demain', 'yarın', 'À demain !', 'Yarın görüşürüz!'],
    ['hier', 'dün', 'Hier, je suis allée au cinéma.', 'Dün sinemaya gittim.'],
    ['la semaine', 'hafta', 'La semaine prochaine, je pars.', 'Gelecek hafta gidiyorum.', 'f'],
    ['le mois', 'ay', 'En juillet, il fait chaud.', 'Temmuzda hava sıcak.', 'm'],
    ["l'heure", 'saat', 'Quelle heure est-il ?', 'Saat kaç?', 'f'],
    ['le matin', 'sabah', 'Le matin, je bois un café.', 'Sabahları kahve içerim.', 'm'],
    ['le soir', 'akşam', 'Le soir, je regarde la télé.', 'Akşamları televizyon izlerim.', 'm'],
  ]},
  { id: 'voyage', emoji: '✈️', name: 'Ulaşım & Yolculuk', words: [
    ['le train', 'tren', 'Le train arrive à dix heures.', 'Tren saat onda varıyor.', 'm'],
    ['le bus', 'otobüs', 'Je prends le bus.', 'Otobüse biniyorum.', 'm'],
    ['le métro', 'metro', 'Le métro est rapide.', 'Metro hızlı.', 'm'],
    ["l'avion", 'uçak', "Je voyage en avion.", 'Uçakla seyahat ediyorum.', 'm'],
    ['la voiture', 'araba', "Ma voiture est rouge.", 'Arabam kırmızı.', 'f'],
    ['le billet', 'bilet', "Un billet pour Paris, s'il vous plaît.", "Paris'e bir bilet, lütfen.", 'm'],
    ["l'hôtel", 'otel', "L'hôtel est près de la mer.", 'Otel denize yakın.', 'm'],
    ['la valise', 'bavul', 'Ma valise est lourde.', 'Bavulum ağır.', 'f'],
    ['le passeport', 'pasaport', 'Votre passeport, s\'il vous plaît.', 'Pasaportunuz, lütfen.', 'm'],
    ['les vacances', 'tatil', 'Je pars en vacances en juillet.', 'Temmuzda tatile gidiyorum.'],
    ['partir', 'gitmek / yola çıkmak', 'Le train part à huit heures.', 'Tren saat sekizde kalkıyor.'],
    ['arriver', 'varmak / gelmek', "J'arrive demain.", 'Yarın varıyorum.'],
    ['réserver', 'rezervasyon yapmak', 'Je voudrais réserver une chambre.', 'Bir oda ayırtmak istiyorum.'],
    ['la mer', 'deniz', "J'adore la mer.", 'Denizi çok severim.', 'f'],
    ['visiter', 'gezmek / ziyaret etmek', 'Nous avons visité le musée.', 'Müzeyi gezdik.'],
  ]},
  { id: 'sante', emoji: '🩺', name: 'Sağlık & Vücut', words: [
    ['la tête', 'baş', "J'ai mal à la tête.", 'Başım ağrıyor.', 'f'],
    ['le ventre', 'karın', "J'ai mal au ventre.", 'Karnım ağrıyor.', 'm'],
    ['le dos', 'sırt', "J'ai mal au dos.", 'Sırtım ağrıyor.', 'm'],
    ['la main', 'el', 'Lavez-vous les mains.', 'Ellerinizi yıkayın.', 'f'],
    ['le pied', 'ayak', "J'ai mal au pied.", 'Ayağım ağrıyor.', 'm'],
    ['les yeux', 'gözler', 'Elle a les yeux bleus.', 'Onun gözleri mavi.'],
    ['malade', 'hasta', 'Je suis malade.', 'Hastayım.'],
    ['le médecin', 'doktor', 'Je vais chez le médecin.', 'Doktora gidiyorum.', 'm'],
    ['le médicament', 'ilaç', 'Prenez ce médicament le soir.', 'Bu ilacı akşamları alın.', 'm'],
    ['la fièvre', 'ateş (hastalık)', "J'ai de la fièvre.", 'Ateşim var.', 'f'],
    ['fatigué', 'yorgun', 'Je suis fatiguée.', 'Yorgunum.', '', 'kadın için: fatiguée'],
    ['le rendez-vous', 'randevu', "J'ai rendez-vous chez le dentiste.", 'Dişçide randevum var.', 'm'],
    ['avoir mal', 'ağrımak', "J'ai mal aux dents.", 'Dişlerim ağrıyor.'],
    ["l'hôpital", 'hastane', "L'hôpital est en face de la gare.", 'Hastane garın karşısında.', 'm'],
    ['la santé', 'sağlık', 'À votre santé !', 'Sağlığınıza!', 'f'],
  ]},
  { id: 'loisirs', emoji: '☀️', name: 'Boş Zaman & Hava', words: [
    ['il fait beau', 'hava güzel', "Aujourd'hui, il fait beau.", 'Bugün hava güzel.'],
    ['il pleut', 'yağmur yağıyor', 'Il pleut, prends ton parapluie !', 'Yağmur yağıyor, şemsiyeni al!'],
    ['il fait froid', 'hava soğuk', 'En hiver, il fait froid.', 'Kışın hava soğuk.'],
    ['il fait chaud', 'hava sıcak', 'En été, il fait chaud.', 'Yazın hava sıcak.'],
    ['le soleil', 'güneş', "Il y a du soleil.", 'Güneş var.', 'm'],
    ['la neige', 'kar', 'Les enfants aiment la neige.', 'Çocuklar karı sever.', 'f'],
    ['le cinéma', 'sinema', 'On va au cinéma ce soir ?', 'Bu akşam sinemaya gidelim mi?', 'm'],
    ['la musique', 'müzik', "J'écoute de la musique.", 'Müzik dinliyorum.', 'f'],
    ['lire', 'okumak', "J'aime lire le soir.", 'Akşamları okumayı severim.'],
    ['la promenade', 'yürüyüş / gezinti', 'On fait une promenade ?', 'Yürüyüşe çıkalım mı?', 'f'],
    ['cuisiner', 'yemek pişirmek', "J'adore cuisiner.", 'Yemek pişirmeye bayılırım.'],
    ['le sport', 'spor', 'Je fais du sport le matin.', 'Sabahları spor yaparım.', 'm'],
    ['la fête', 'parti / kutlama', 'Tu viens à ma fête samedi ?', 'Cumartesi partime gelir misin?', 'f'],
    ['inviter', 'davet etmek', "Je t'invite au restaurant.", 'Seni restorana davet ediyorum.'],
    ['le week-end', 'hafta sonu', 'Bon week-end !', 'İyi hafta sonları!', 'm'],
  ]},
];

// Dinle-yaz, sesli tekrar ve cümle kurma için A2 cümleleri: [fransızca, türkçe]
const SENTENCES = [
  ["Je m'appelle Neslihan et j'habite à Istanbul.", "Benim adım Neslihan ve İstanbul'da yaşıyorum."],
  ["Je voudrais un café, s'il vous plaît.", 'Bir kahve istiyorum, lütfen.'],
  ["Où est la gare, s'il vous plaît ?", 'Gar nerede, lütfen?'],
  ['Je ne comprends pas.', 'Anlamıyorum.'],
  ['Vous pouvez parler plus lentement ?', 'Daha yavaş konuşabilir misiniz?'],
  ["J'ai mal à la tête.", 'Başım ağrıyor.'],
  ["Il fait beau aujourd'hui.", 'Bugün hava güzel.'],
  ['Le samedi, je vais au marché.', 'Cumartesileri pazara giderim.'],
  ['Je prends le bus pour aller au travail.', 'İşe gitmek için otobüse binerim.'],
  ["C'est combien, ce fromage ?", 'Bu peynir ne kadar?'],
  ["J'aime cuisiner pour ma famille.", 'Ailem için yemek pişirmeyi severim.'],
  ['Hier, je suis allée au cinéma avec une amie.', 'Dün bir arkadaşımla sinemaya gittim.'],
  ['Le week-end dernier, nous avons visité un musée.', 'Geçen hafta sonu bir müze gezdik.'],
  ['Je voudrais réserver une chambre pour deux nuits.', 'İki gecelik bir oda ayırtmak istiyorum.'],
  ['Tu viens à ma fête samedi soir ?', 'Cumartesi akşamı partime gelir misin?'],
  ['Merci pour ton invitation !', 'Davetin için teşekkürler!'],
  ['Désolée, je ne peux pas venir.', 'Üzgünüm, gelemiyorum.'],
  ['Le train part à huit heures.', 'Tren saat sekizde kalkıyor.'],
  ['Ma sœur a deux enfants.', 'Kız kardeşimin iki çocuğu var.'],
  ['Je suis fatiguée, je vais dormir.', 'Yorgunum, uyumaya gidiyorum.'],
  ["Qu'est-ce que tu fais le week-end ?", 'Hafta sonu ne yapıyorsun?'],
  ['Je fais du sport deux fois par semaine.', 'Haftada iki kez spor yaparım.'],
  ['La pharmacie est à côté de la banque.', 'Eczane bankanın yanında.'],
  ['Quel temps fait-il à Paris ?', "Paris'te hava nasıl?"],
  ["J'apprends le français depuis trois mois.", 'Üç aydır Fransızca öğreniyorum.'],
];

// DELF A2 "Production écrite" tarzı yazma görevleri (60–80 kelime)
const WRITING = [
  {
    id: 'invite', emoji: '🎉', title: 'Doğum günü daveti',
    tr: 'Arkadaşın Claire’i doğum günü partine davet et. Tarihi, saati, yeri ve ne getirebileceğini yaz. Cevap vermesini iste.',
    fr: "Vous invitez votre amie Claire à votre fête d'anniversaire. Vous donnez la date, l'heure, le lieu et vous lui demandez de répondre. (60 à 80 mots)",
    checks: [
      ['Selamla (Salut / Chère …)', /(salut|bonjour|cher|chère|coucou)/i],
      ['Gün / tarih yaz', /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|\d)/i],
      ['Saat yaz (à 19 heures)', /(heure|\d\s?h)/i],
      ['Yeri söyle (chez moi, au restaurant…)', /(chez|au |à la |à l')/i],
      ['Soru sor (Tu viens ?)', /\?/],
      ['Vedalaş (Bisous / À bientôt)', /(bisous|bises|à bientôt|à samedi|amitiés|à plus)/i],
    ],
    phrases: [
      ['Salut Claire,', 'Selam Claire,'],
      ["C'est mon anniversaire !", 'Benim doğum günüm!'],
      ['Je fais une petite fête chez moi.', 'Evimde küçük bir parti veriyorum.'],
      ['le samedi 14 juin à 19 heures', '14 Haziran Cumartesi saat 19:00’da'],
      ['Tu peux apporter une boisson ?', 'Bir içecek getirebilir misin?'],
      ['Tu viens ?', 'Geliyor musun?'],
      ['Réponds-moi avant jeudi.', 'Perşembeden önce cevap ver.'],
      ['Bisous,', 'Öpücükler,'],
    ],
    model: "Salut Claire,\nSamedi prochain, c'est mon anniversaire ! Je fais une petite fête chez moi, le 14 juin à 19 heures. Il y a de la musique, un gâteau et mes amis du cours de français. Mon adresse : 12 rue Victor Hugo, au troisième étage. Tu peux apporter une boisson si tu veux. Tu viens ? Réponds-moi avant jeudi, s'il te plaît.\nBisous,\nNeslihan",
  },
  {
    id: 'refuse', emoji: '💌', title: 'Daveti kibarca reddet',
    tr: 'Arkadaşın Sophie seni doğum gününe çağırdı ama gidemiyorsun. Teşekkür et, neden gelemediğini açıkla ve başka bir gün buluşmayı öner.',
    fr: "Votre amie Sophie vous invite à son anniversaire. Vous ne pouvez pas y aller. Vous la remerciez, vous expliquez pourquoi et vous proposez une autre date. (60 à 80 mots)",
    checks: [
      ['Selamla (Chère Sophie,)', /(salut|bonjour|cher|chère|coucou)/i],
      ['Teşekkür et (merci)', /merci/i],
      ['Üzgün olduğunu söyle (désolée)', /(désolé|dommage|malheureusement)/i],
      ['Nedenini söyle (parce que…)', /(parce que|parce qu'|car )/i],
      ['Başka bir gün öner', /(on peut|une autre fois|prochain|prochaine|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i],
      ['Vedalaş (Bises / À bientôt)', /(bisous|bises|à bientôt|amitiés|à plus)/i],
    ],
    phrases: [
      ['Chère Sophie,', 'Sevgili Sophie,'],
      ['Merci beaucoup pour ton invitation !', 'Davetin için çok teşekkürler!'],
      ['Malheureusement, je ne peux pas venir', 'Maalesef gelemiyorum'],
      ['parce que ma sœur arrive ce week-end.', 'çünkü kız kardeşim bu hafta sonu geliyor.'],
      ['Je suis vraiment désolée.', 'Gerçekten çok üzgünüm.'],
      ["Est-ce qu'on peut se voir la semaine prochaine ?", 'Gelecek hafta görüşebilir miyiz?'],
      ['Bon anniversaire !', 'İyi ki doğdun!'],
      ['Bises,', 'Öpücükler,'],
    ],
    model: "Chère Sophie,\nMerci beaucoup pour ton invitation ! Malheureusement, je ne peux pas venir samedi parce que ma sœur arrive d'Ankara ce week-end et je vais la chercher à l'aéroport. Je suis vraiment désolée. Est-ce qu'on peut se voir la semaine prochaine ? Je t'invite au restaurant mardi ou mercredi soir, d'accord ?\nBon anniversaire et bonne fête !\nBises,\nNeslihan",
  },
  {
    id: 'weekend', emoji: '🏖️', title: 'Geçen hafta sonunu anlat',
    tr: 'Bir arkadaşına geçen hafta sonu ne yaptığını anlat: nereye gittin, kiminle, ne yaptınız ve nasıldı? (Geçmiş zaman: j’ai…, je suis allée…)',
    fr: "Vous racontez votre week-end dernier à un ami : où vous êtes allé(e), avec qui, ce que vous avez fait et vos impressions. (60 à 80 mots)",
    checks: [
      ['Ne zaman olduğunu söyle (Le week-end dernier…)', /(dernier|dernière|hier|samedi|dimanche)/i],
      ['Geçmiş zaman kullan (j’ai… / je suis…)', /(j'ai |je suis |nous avons |on a |nous sommes )/i],
      ['Kiminle olduğunu söyle (avec…)', /avec/i],
      ['Sıralama kelimeleri (puis, après, ensuite)', /(puis|après|ensuite|le soir|le matin)/i],
      ['Duygunu söyle (C’était super !)', /(c'était|j'ai aimé|super|génial|content)/i],
    ],
    phrases: [
      ['Le week-end dernier,', 'Geçen hafta sonu,'],
      ['je suis allée à la mer', 'denize gittim'],
      ['avec mon amie', 'arkadaşımla'],
      ['nous avons mangé du poisson', 'balık yedik'],
      ['puis nous avons fait une promenade.', 'sonra yürüyüş yaptık.'],
      ['Il faisait beau.', 'Hava güzeldi.'],
      ["C'était un super week-end !", 'Harika bir hafta sonuydu!'],
    ],
    model: "Le week-end dernier, je suis allée à la mer avec mon amie Ayşe. Samedi matin, nous avons pris le train à neuf heures. Il faisait beau et chaud. Nous avons mangé du poisson dans un petit restaurant, puis nous avons fait une longue promenade sur la plage. Le soir, nous sommes rentrées à la maison. J'étais fatiguée mais très contente. C'était un super week-end !",
  },
  {
    id: 'present', emoji: '🙋‍♀️', title: 'Kendini tanıt',
    tr: 'Fransız bir mektup arkadaşına (Julie) kendini tanıt: adın, nerede yaşadığın, ailen, sevdiğin şeyler. Ona da soru sor.',
    fr: "Vous écrivez à votre nouvelle correspondante française, Julie. Vous vous présentez (nom, ville, famille, goûts) et vous lui posez des questions. (60 à 80 mots)",
    checks: [
      ['Selamla (Bonjour Julie,)', /(salut|bonjour|cher|chère|coucou)/i],
      ['Adını söyle (Je m’appelle…)', /(je m'appelle|mon nom)/i],
      ['Nerede yaşadığını söyle (J’habite à…)', /j'habite/i],
      ['Aileni anlat', /(mari|enfant|fils|fille|famille|sœur|soeur|frère|petit)/i],
      ['Sevdiğin şeyler (J’aime…)', /(j'aime|j'adore|je fais)/i],
      ['Soru sor (Et toi ?)', /\?/],
      ['Vedalaş (À bientôt)', /(bisous|bises|à bientôt|amitiés|à plus)/i],
    ],
    phrases: [
      ['Bonjour Julie,', 'Merhaba Julie,'],
      ["Je m'appelle Neslihan.", 'Benim adım Neslihan.'],
      ["Je suis turque et j'habite à Istanbul.", "Türküm ve İstanbul'da yaşıyorum."],
      ["J'apprends le français.", 'Fransızca öğreniyorum.'],
      ["J'aime cuisiner et lire.", 'Yemek yapmayı ve okumayı severim.'],
      ["Et toi, qu'est-ce que tu aimes faire ?", 'Ya sen, ne yapmayı seversin?'],
      ['Écris-moi vite !', 'Bana hemen yaz!'],
      ['À bientôt,', 'Görüşmek üzere,'],
    ],
    model: "Bonjour Julie,\nJe m'appelle Neslihan, je suis turque et j'habite à Istanbul. J'apprends le français parce que j'aime beaucoup la France. J'ai une grande famille et j'adore passer du temps avec mes enfants. Le week-end, j'aime cuisiner, lire et faire des promenades au bord de la mer. Et toi, qu'est-ce que tu aimes faire ? Tu as des enfants ? Écris-moi vite !\nÀ bientôt,\nNeslihan",
  },
];

// ---------- Ders kitabı s.161: İş dünyası ----------
THEMES.push({ id: 'travail', emoji: '💼', name: 'İş Dünyası', words: [
  ["l'entreprise", 'şirket', 'Elle travaille dans une grande entreprise.', 'Büyük bir şirkette çalışıyor.', 'f', 'eş anlamlı: la société'],
  ["l'employé", 'çalışan', 'Il y a vingt employés dans la société.', 'Şirkette yirmi çalışan var.', 'm', 'kadın: l’employée = la salariée'],
  ['le poste', 'pozisyon / iş', "Ce poste m'intéresse.", 'Bu pozisyon ilgimi çekiyor.', 'm', 'eş anlamlı: l’emploi, le travail, le job'],
  ['les horaires', 'çalışma saatleri', 'Quels sont les horaires de travail ?', 'Çalışma saatleri nedir?'],
  ['le CV', 'özgeçmiş', "J'envoie mon CV à l'entreprise.", 'Özgeçmişimi şirkete gönderiyorum.', 'm', 'le curriculum vitae'],
  ["l'offre d'emploi", 'iş ilanı', "Je lis les offres d'emploi sur Internet.", 'İnternette iş ilanlarını okuyorum.', 'f', 'eş anlamlı: l’annonce'],
  ["l'entretien d'embauche", 'iş görüşmesi', "J'ai un entretien d'embauche demain.", 'Yarın bir iş görüşmem var.', 'm'],
  ['le candidat', 'aday', 'Il y a trois candidats pour ce poste.', 'Bu pozisyon için üç aday var.', 'm', 'kadın: la candidate'],
  ["l'expérience", 'deneyim', "J'ai dix ans d'expérience.", 'On yıllık deneyimim var.', 'f'],
  ['la compétence', 'yetkinlik / beceri', "L'anglais est une compétence importante.", 'İngilizce önemli bir beceri.', 'f'],
  ['le travail à distance', 'uzaktan çalışma', 'Je préfère le travail à distance.', 'Uzaktan çalışmayı tercih ederim.', 'm', 'zıttı: en présentiel (yerinde)'],
  ['le travail en équipe', 'ekip çalışması', "J'aime le travail en équipe.", 'Ekip çalışmasını severim.', 'm'],
  ["l'ambiance de travail", 'iş ortamı', "L'ambiance de travail est très agréable.", 'İş ortamı çok hoş.', 'f'],
  ['le coiffeur', 'kuaför', 'Je vais chez le coiffeur samedi.', 'Cumartesi kuaföre gidiyorum.', 'm', 'kadın: la coiffeuse'],
  ["l'ingénieur", 'mühendis', 'Mon fils est ingénieur.', 'Oğlum mühendis.', 'm', 'kadın: l’ingénieure'],
  ['la secrétaire', 'sekreter', 'Avant, je travaillais comme secrétaire.', 'Eskiden sekreter olarak çalışıyordum.', 'f', 'erkek: le secrétaire'],
  ["les centres d'intérêt", 'ilgi alanları / hobiler', "Mes centres d'intérêt : la cuisine et la lecture.", 'İlgi alanlarım: yemek yapmak ve okumak.'],
  ['la formation', 'eğitim (mesleki)', 'Je suis une formation en informatique.', 'Bilişim alanında bir eğitim alıyorum.', 'f'],
]});

// ---------- Sözlü sınav konuları: medya, konut, teknoloji ----------
THEMES.push({ id: 'medias', emoji: '📺', name: 'Medya, Konut & Teknoloji', words: [
  ["l'émission", 'TV/radyo programı', 'Mon émission préférée passe le samedi.', 'En sevdiğim program cumartesi yayınlanıyor.', 'f'],
  ['la série', 'dizi', 'Je regarde une série turque.', 'Bir Türk dizisi izliyorum.', 'f'],
  ['le film', 'film', "C'est un film très drôle.", 'Çok komik bir film.', 'm'],
  ['les informations', 'haberler', 'Je regarde les informations le soir.', 'Akşamları haberleri izlerim.', '', 'kısaca: les infos'],
  ['le journal', 'gazete / haber bülteni', 'Je lis le journal sur mon téléphone.', 'Gazeteyi telefonumdan okurum.', 'm'],
  ['la chaîne', 'TV kanalı', "Ça passe sur quelle chaîne ?", 'Hangi kanalda yayınlanıyor?', 'f'],
  ['le livre', 'kitap', "J'aime lire des livres le soir.", 'Akşamları kitap okumayı severim.', 'm', 'roman: le roman'],
  ['la chanson', 'şarkı', "J'adore cette chanson française.", 'Bu Fransızca şarkıya bayılıyorum.', 'f'],
  ['le téléphone portable', 'cep telefonu', "J'utilise mon portable tous les jours.", 'Cep telefonumu her gün kullanırım.', 'm'],
  ["l'ordinateur", 'bilgisayar', "Mon ordinateur est vieux.", 'Bilgisayarım eski.', 'm'],
  ['le logement', 'konut / ev', 'Je cherche un logement.', 'Ev arıyorum.', 'm'],
  ['le loyer', 'kira', 'Le loyer est cher à Istanbul.', "İstanbul'da kira pahalı.", 'm'],
  ['le quartier', 'mahalle / semt', "J'aime mon quartier, il est calme.", 'Mahallemi seviyorum, sakin.', 'm'],
  ['le voisin', 'komşu', 'Mon voisin est très gentil.', 'Komşum çok nazik.', 'm', 'kadın: la voisine'],
  ['la campagne', 'kırsal / köy', 'Je préfère la ville à la campagne.', 'Şehri kırsala tercih ederim.', 'f'],
  ['le souvenir', 'anı', "C'est un beau souvenir d'enfance.", 'Güzel bir çocukluk anısı.', 'm'],
  ['la bibliothèque', 'kütüphane', 'Je vais à la bibliothèque le samedi.', 'Cumartesileri kütüphaneye giderim.', 'f'],
  ['le pharmacien', 'eczacı', 'Je demande un conseil au pharmacien.', 'Eczacıya tavsiye soruyorum.', 'm', 'kadın: la pharmacienne'],
]});

SENTENCES.push(
  ["J'apprends le français à l'Institut français.", 'Fransızcayı Fransız Kültür Merkezi’nde öğreniyorum.'],
  ['Avant, je travaillais comme secrétaire.', 'Eskiden sekreter olarak çalışıyordum.'],
  ["Quand j'étais petite, j'habitais en Turquie.", "Küçükken Türkiye'de yaşıyordum."],
  ['Il faisait beau, alors je suis sortie.', 'Hava güzeldi, ben de dışarı çıktım.'],
  ['Je vais partir en vacances en France.', "Fransa'ya tatile gideceğim."],
  ["L'année prochaine, je parlerai mieux français.", 'Seneye daha iyi Fransızca konuşacağım.'],
  ["Je voudrais prendre un rendez-vous, s'il vous plaît.", 'Bir randevu almak istiyorum, lütfen.'],
  ["Pourriez-vous m'aider, s'il vous plaît ?", 'Bana yardım edebilir misiniz, lütfen?'],
  ["Et si on allait au cinéma ce soir ?", 'Peki ya bu akşam sinemaya gitsek?'],
  ["Avec plaisir, c'est une bonne idée !", 'Memnuniyetle, iyi bir fikir!'],
  ["Je préfère le travail en présentiel.", 'Yerinde (ofiste) çalışmayı tercih ederim.'],
  ["Mon émission préférée passe le samedi soir.", 'En sevdiğim program cumartesi akşamı yayınlanıyor.'],
);

WRITING.push({
  id: 'accept', emoji: '🥂', title: 'Daveti kabul et',
  tr: 'Arkadaşın Paul seni cumartesi akşamı yemeğe davet etti. Teşekkür et, kabul ettiğini söyle, ne getirebileceğini sor ve saati/adresi teyit et.',
  fr: "Votre ami Paul vous invite à dîner samedi soir. Vous le remerciez, vous acceptez, vous proposez d'apporter quelque chose et vous posez des questions (heure, adresse). (60 à 80 mots)",
  checks: [
    ['Selamla (Cher Paul,)', /(salut|bonjour|cher|chère|coucou)/i],
    ['Teşekkür et (merci)', /merci/i],
    ['Kabul et (avec plaisir / je viendrai)', /(avec plaisir|je viens|je viendrai|bonne idée|super|d'accord)/i],
    ['Bir şey getirmeyi öner', /(apporter|j'apporte|je peux apporter)/i],
    ['Soru sor (À quelle heure ?)', /\?/],
    ['Vedalaş (À samedi !)', /(bisous|bises|à bientôt|à samedi|amitiés|à plus)/i],
  ],
  phrases: [
    ['Cher Paul,', 'Sevgili Paul,'],
    ['Merci pour ton invitation !', 'Davetin için teşekkürler!'],
    ['Avec plaisir, je viendrai samedi soir.', 'Memnuniyetle, cumartesi akşamı geleceğim.'],
    ["Est-ce que je peux apporter un dessert ?", 'Bir tatlı getirebilir miyim?'],
    ['À quelle heure ?', 'Saat kaçta?'],
    ['Tu peux me donner ton adresse ?', 'Adresini verebilir misin?'],
    ["J'ai hâte de te voir !", 'Seni görmeyi sabırsızlıkla bekliyorum!'],
    ['À samedi !', 'Cumartesi görüşürüz!'],
  ],
  model: "Cher Paul,\nMerci beaucoup pour ton invitation ! Avec plaisir, je viendrai dîner chez toi samedi soir. Est-ce que je peux apporter quelque chose ? Je peux préparer un dessert turc, par exemple du baklava. Tu peux me donner ton adresse exacte ? Et on se retrouve à quelle heure ? Je vais prendre le métro, alors je préfère arriver vers dix-neuf heures. J'ai hâte de te voir !\nÀ samedi,\nNeslihan",
});

// ---------- Gramer: öğretmenin listesindeki 6 konu ----------
// Soru: [boşluklu cümle, seçenekler (ilki doğru), türkçesi]
const GRAMMAR = [
  { id: 'present', emoji: '⏺️', name: 'Présent', sub: 'Şimdiki / geniş zaman',
    when: 'Şimdi olanlar ve her zaman olanlar (alışkanlıklar).',
    forms: [['je suis, tu es, il/elle est, nous sommes, vous êtes, ils sont', 'être = olmak'], ["j'ai, tu as, il a, nous avons, vous avez, ils ont", 'avoir = sahip olmak'], ['je vais, tu vas, il va, nous allons, vous allez, ils vont', 'aller = gitmek'], ['je fais, tu fais, il fait, nous faisons, vous faites, ils font', 'faire = yapmak'], ['je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent', '-er fiilleri: parler = konuşmak']],
    examples: [["J'habite à Istanbul.", "İstanbul'da yaşıyorum."], ['Le samedi, je vais au marché.', 'Cumartesileri pazara giderim.']],
    qs: [['Je ___ turque.', ['suis', 'ai', 'es'], 'Ben Türküm.'], ['Nous ___ à Istanbul.', ['habitons', 'habitez', 'habitent'], "İstanbul'da yaşıyoruz."], ['Elle ___ deux enfants.', ['a', 'est', 'as'], 'Onun iki çocuğu var.'], ['Tu ___ au marché ?', ['vas', 'va', 'allez'], 'Pazara mı gidiyorsun?'], ['Ils ___ du sport le samedi.', ['font', 'faisons', 'fait'], 'Cumartesileri spor yapıyorlar.'], ['Vous ___ français ?', ['parlez', 'parlons', 'parles'], 'Fransızca konuşuyor musunuz?'], ["J'___ le café.", ['aime', 'aimes', 'aimons'], 'Kahveyi severim.'], ['On ___ au cinéma ce soir ?', ['va', 'vont', 'vais'], 'Bu akşam sinemaya gidiyor muyuz?']] },
  { id: 'pc', emoji: '✔️', name: 'Passé composé', sub: 'Di’li geçmiş zaman',
    when: 'Geçmişte olup bitmiş tek bir olay (yaptım, gittim). avoir/être + geçmiş ortaç.',
    forms: [["j'ai mangé, j'ai fait, j'ai vu, j'ai lu, j'ai pris, j'ai eu", 'çoğu fiil AVOIR ile'], ['je suis allée, je suis partie, je suis arrivée, je suis restée, je suis rentrée, je suis née', 'hareket fiilleri ÊTRE ile (aller, venir, partir, arriver, entrer, sortir, rester, tomber…)'], ['je suis allée · nous sommes allés', 'ÊTRE ile kadınlarda -e, çoğulda -s eklenir']],
    examples: [["Samedi, j'ai visité un musée.", 'Cumartesi bir müze gezdim.'], ['Hier, je suis allée au cinéma.', 'Dün sinemaya gittim.']],
    qs: [["Samedi, j'___ visité un musée.", ['ai', 'suis', 'avais'], 'Cumartesi bir müze gezdim.'], ['Hier, je suis ___ au cinéma.', ['allée', 'aller', 'allez'], 'Dün sinemaya gittim. (kadın)'], ['Nous ___ mangé au restaurant.', ['avons', 'sommes', 'avez'], 'Restoranda yemek yedik.'], ['Elle est ___ à 8 heures.', ['partie', 'partir', 'partons'], 'Saat 8’de çıktı.'], ['Ils ___ arrivés en retard.', ['sont', 'ont', 'êtes'], 'Geç geldiler.'], ["J'ai ___ un livre.", ['lu', 'lire', 'lisé'], 'Bir kitap okudum.'], ['Je ___ restée à la maison.', ['suis', 'ai', 'es'], 'Evde kaldım.'], ['Nous avons ___ une promenade.', ['fait', 'faire', 'faisons'], 'Yürüyüş yaptık.'], ['Tu as ___ ton CV ?', ['envoyé', 'envoyer', 'envoie'], 'Özgeçmişini gönderdin mi?']] },
  { id: 'imp', emoji: '🕰️', name: 'Imparfait', sub: 'Geçmişte süreklilik / alışkanlık',
    when: 'Geçmişte süren durumlar, alışkanlıklar, tasvirler (yapıyordum, yapardım, hava güzeldi).',
    forms: [['nous parlons → je parlais', 'Yapılış: nous hâlinden -ons at, ek getir'], ['je parlais, tu parlais, il parlait, nous parlions, vous parliez, ils parlaient', 'ekler: -ais, -ais, -ait, -ions, -iez, -aient'], ["j'étais, j'avais, je faisais, j'allais", 'en çok kullanılanlar (être → ét-)'], ["il faisait beau · c'était super", 'hava ve yorum']],
    examples: [["Quand j'étais petite, j'habitais en Turquie.", "Küçükken Türkiye'de yaşıyordum."], ['Avant, je travaillais comme secrétaire.', 'Eskiden sekreter olarak çalışıyordum.']],
    qs: [["Quand j'___ petite, j'habitais en Turquie.", ['étais', 'suis', 'serai'], "Küçükken Türkiye'de yaşıyordum."], ['Avant, je ___ comme secrétaire.', ['travaillais', 'travaille', 'travaillerai'], 'Eskiden sekreter olarak çalışıyordum.'], ["Quand j'étais enfant, il ___ toujours chaud en été.", ['faisait', 'fera', 'fait'], 'Ben çocukken yazın hava hep sıcak olurdu.'], ['Avant, nous ___ à la mer chaque été.', ['allions', 'allons', 'irons'], 'Eskiden her yaz denize giderdik.'], ['Avant, mes enfants ___ beaucoup la télé.', ['regardaient', 'regardent', 'regarderont'], 'Eskiden çocuklarım çok televizyon izlerdi.'], ["Quand j'étais jeune, j'___ les cheveux longs.", ['avais', 'ai', 'aurai'], 'Gençken saçlarım uzundu.'], ['Avant, tu ___ à Ankara ?', ['habitais', 'habites', 'habiteras'], "Eskiden Ankara'da mı yaşıyordun?"], ['Hier soir, le film ___ très intéressant.', ['était', 'est', 'sera'], 'Dün akşam film çok ilginçti.']] },
  { id: 'imppc', emoji: '⚖️', name: 'Imparfait mi, Passé composé mu?', sub: 'Arka plan mı, olay mı?',
    when: 'Hikâyede ARKA PLAN (hava, duygu, ne oluyordu) = imparfait. OLAYLAR (ne yaptım) = passé composé.',
    forms: [['Il faisait beau, alors je suis sortie.', 'Hava güzeldi (arka plan), dışarı çıktım (olay).'], ['Je regardais la télé quand le téléphone a sonné.', 'TV izliyordum (süren), telefon çaldı (olay).']],
    examples: [['Quand je suis arrivée, il pleuvait.', 'Vardığımda yağmur yağıyordu.'], ['Nous étions fatigués, alors nous sommes rentrés.', 'Yorgunduk, bu yüzden eve döndük.']],
    qs: [['Il faisait beau, alors je ___ sortie.', ['suis', 'étais', 'ai'], 'Hava güzeldi, ben de dışarı çıktım.'], ['Je ___ la télé quand le téléphone a sonné.', ['regardais', 'ai regardé', 'regarde'], 'Telefon çaldığında televizyon izliyordum.'], ['Quand je suis arrivée, il ___.', ['pleuvait', 'a plu', 'pleut'], 'Vardığımda yağmur yağıyordu.'], ["Hier, j'___ un gâteau pour ma fille.", ['ai fait', 'faisais', 'fais'], 'Dün kızım için bir kek yaptım.'], ['Nous étions fatigués, alors nous ___ rentrés.', ['sommes', 'étions', 'avons'], 'Yorgunduk, bu yüzden eve döndük.'], ["Quand j'étais petite, je ___ souvent chez ma grand-mère.", ['allais', 'suis allée', 'vais'], 'Küçükken sık sık büyükanneme giderdim.'], ['Le restaurant ___ petit mais très joli.', ['était', 'a été', 'sera'], 'Restoran küçük ama çok güzeldi.'], ['Samedi dernier, nous ___ un film au cinéma.', ['avons vu', 'voyions', 'verrons'], 'Geçen cumartesi sinemada bir film izledik.']] },
  { id: 'futur', emoji: '🔮', name: 'Futur', sub: 'Gelecek zaman',
    when: 'Yakın plan: aller + fiil (futur proche). Daha uzak gelecek: futur simple.',
    forms: [['je vais partir, tu vas manger, on va voir', 'futur proche = aller + mastar'], ['je parlerai, tu parleras, il parlera, nous parlerons, vous parlerez, ils parleront', 'futur simple = mastar + -ai, -as, -a, -ons, -ez, -ont'], ["je serai, j'aurai, j'irai, je ferai, je pourrai", 'düzensizler: être, avoir, aller, faire, pouvoir']],
    examples: [['Je vais partir en vacances.', 'Tatile gideceğim.'], ["L'année prochaine, je parlerai mieux français.", 'Seneye daha iyi Fransızca konuşacağım.']],
    qs: [['Demain, je ___ partir en vacances.', ['vais', 'vas', 'va'], 'Yarın tatile gideceğim.'], ['Ce soir, nous allons ___ au restaurant.', ['dîner', 'dînons', 'dîné'], 'Bu akşam restoranda yemek yiyeceğiz.'], ["L'année prochaine, je ___ mieux français.", ['parlerai', 'parlais', 'parlé'], 'Seneye daha iyi Fransızca konuşacağım.'], ['Le week-end prochain, il ___ beau.', ['fera', 'faisait', 'a fait'], 'Gelecek hafta sonu hava güzel olacak.'], ['Demain, tu ___ chez le médecin ?', ['iras', 'allais', 'es allé'], 'Yarın doktora gidecek misin?'], ['Dans deux ans, nous ___ à Paris.', ['habiterons', 'habitions', 'avons habité'], "İki yıl sonra Paris'te yaşayacağız."], ['Elle va ___ son CV demain.', ['envoyer', 'envoie', 'envoyé'], 'Yarın özgeçmişini gönderecek.'], ['Je ___ le DELF le 3 novembre.', ['passerai', 'passais', 'ai passé'], "3 Kasım'da DELF sınavına gireceğim."]] },
  { id: 'cond', emoji: '🙏', name: 'Conditionnel présent', sub: 'Kibar istek, dilek, tavsiye',
    when: 'Kibarca istemek, dilek ve tavsiye: je voudrais (isterdim), j’aimerais, pourriez-vous… ? tu devrais…',
    forms: [["je voudrais, j'aimerais, je pourrais", 'futur gövdesi + imparfait ekleri'], ['je voudrais, tu voudrais, il voudrait, nous voudrions, vous voudriez, ils voudraient', 'vouloir'], ["Pourriez-vous m'aider ? · Tu devrais te reposer. · On pourrait aller au cinéma.", 'kibar soru · tavsiye · öneri']],
    examples: [['Je voudrais un rendez-vous, s’il vous plaît.', 'Bir randevu istiyorum, lütfen.'], ["J'aimerais voyager en France.", "Fransa'ya seyahat etmek isterdim."]],
    qs: [["Je ___ un café, s'il vous plaît.", ['voudrais', 'voudrait', 'voudraient'], 'Bir kahve istiyorum, lütfen.'], ["___-vous m'aider, s'il vous plaît ?", ['Pourriez', 'Pourrions', 'Pourrait'], 'Bana yardım edebilir misiniz, lütfen?'], ["J'___ un rendez-vous avec le docteur.", ['aimerais', 'aimerait', 'aimeriez'], 'Doktordan randevu almak isterdim.'], ['Nous ___ réserver une table pour quatre.', ['voudrions', 'voudrais', 'voudraient'], 'Dört kişilik bir masa ayırtmak istiyoruz.'], ['Elle ___ partir en vacances.', ['aimerait', 'aimerais', 'aimeraient'], 'Tatile gitmek isterdi.'], ['Vous ___ prendre ce médicament le soir.', ['devriez', 'devrais', 'devraient'], 'Bu ilacı akşam almalısınız (tavsiye).'], ['Tu ___ venir à ma fête ?', ['pourrais', 'pourrait', 'pourrions'], 'Partime gelebilir misin?'], ['À ta place, je ___ chez le médecin.', ['irais', 'irait', 'irions'], 'Senin yerinde olsam doktora giderdim.']] },
];

// ---------- Okuma (Compréhension des écrits) ----------
// Soru: [soru, türkçesi, seçenekler (ilki doğru)]
const READING = [
  { id: 'piquenique', emoji: '📧', title: 'E-posta: Piknik', text: "De : Marc\nObjet : Pique-nique samedi !\n\nSalut Neslihan,\nSamedi, s'il fait beau, on fait un pique-nique au parc avec les amis du cours de français. Rendez-vous à midi devant l'entrée principale. Chacun apporte quelque chose : Julie apporte les boissons, moi le pain et le fromage. Est-ce que tu peux apporter une salade ? S'il pleut, on va au restaurant italien à côté du parc. Réponds-moi avant jeudi !\nÀ samedi,\nMarc",
    qs: [['Quand est le pique-nique ?', 'Piknik ne zaman?', ['Samedi à midi', 'Jeudi à midi', 'Samedi soir']], ["Qu'est-ce que Neslihan doit apporter ?", 'Neslihan ne getirmeli?', ['Une salade', 'Les boissons', 'Le pain et le fromage']], ["S'il pleut, où vont-ils ?", 'Yağmur yağarsa nereye gidecekler?', ['Au restaurant italien', 'Chez Marc', 'Au cinéma']]] },
  { id: 'appart', emoji: '🏢', title: 'İlan: Kiralık daire', text: "À LOUER — Appartement 2 pièces\n45 m², 2e étage avec ascenseur, centre-ville.\nCuisine équipée, grand balcon.\nÀ 5 minutes à pied du métro.\nLoyer : 900 € par mois, charges comprises.\nAnimaux non acceptés.\nLibre le 1er décembre.\nContact : Mme Leblanc — 01 45 55 01 99 (après 18 h)",
    qs: [["Combien coûte l'appartement ?", 'Daire ne kadar?', ['900 € par mois', '45 € par mois', '900 € par semaine']], ['On peut avoir un chat ?', 'Kedi beslenebilir mi?', ['Non', 'Oui', 'Seulement un petit chat']], ['Quand faut-il téléphoner ?', 'Ne zaman aranmalı?', ['Après 18 heures', 'Le matin', 'Le week-end']]] },
  { id: 'biblio', emoji: '📚', title: 'Duyuru: Kütüphane', text: "BIBLIOTHÈQUE MUNICIPALE\nHoraires : du mardi au vendredi de 10 h à 19 h, le samedi de 10 h à 13 h.\nFermée le dimanche et le lundi.\nInscription gratuite : apportez une pièce d'identité.\nVous pouvez emprunter 5 livres et 2 DVD pendant 3 semaines.\nAtelier de conversation française : chaque mercredi à 17 h. Gratuit !",
    qs: [['Le samedi, la bibliothèque ferme à quelle heure ?', 'Cumartesi kütüphane saat kaçta kapanıyor?', ['À 13 h', 'À 19 h', 'À 10 h']], ['Combien de livres peut-on emprunter ?', 'Kaç kitap ödünç alınabilir?', ['5', '2', '3']], ["Quand a lieu l'atelier de conversation ?", 'Konuşma atölyesi ne zaman?', ['Le mercredi à 17 h', 'Le lundi à 17 h', 'Le samedi à 10 h']]] },
  { id: 'sms', emoji: '📱', title: 'Mesaj: Gecikme', text: "Coucou maman ! Mon train a du retard 😕 J'arrive à 18 h 30 au lieu de 17 h. On ne peut pas aller au cinéma à 18 h… On va au restaurant d'abord et on voit le film de 21 h ? Rendez-vous devant la gare. Bisous !",
    qs: [['Pourquoi la fille est en retard ?', 'Kız neden gecikiyor?', ['Son train a du retard', 'Elle est malade', 'Elle travaille']], ['À quelle heure arrive-t-elle ?', 'Saat kaçta varıyor?', ['À 18 h 30', 'À 17 h', 'À 21 h']], ["Qu'est-ce qu'elle propose ?", 'Ne öneriyor?', ['Le restaurant, puis le film de 21 h', 'Le cinéma à 18 h', 'Rester à la maison']], ['Où est le rendez-vous ?', 'Buluşma nerede?', ['Devant la gare', 'Devant le cinéma', 'Au restaurant']]] },
];

// ---------- Sözlü sınav ----------
const INTRO_DEFAULT = "Bonjour, je m'appelle Neslihan.\nJe suis turque et j'habite à Istanbul.\nJ'ai une fille. Elle est designer.\nAvant, je travaillais comme secrétaire.\nJ'aime la cuisine, la lecture et les promenades.\nJ'apprends le français parce que j'aime cette langue et je voudrais voyager en France.\nJe suis des cours de français à l'Institut français d'Istanbul.";

// Monolog: [id, soru, türkçesi, örnek cevap]
const MONOLOGUES = [
  ['weekend', 'Racontez votre dernier week-end.', 'Son hafta sonunuzu anlatın.', "Le week-end dernier, je suis restée à Istanbul. Samedi matin, je suis allée au marché avec ma fille. Il faisait froid mais il y avait du soleil. L'après-midi, j'ai cuisiné des plats turcs. Dimanche, j'ai lu un livre et j'ai regardé un film. C'était un week-end calme et agréable."],
  ['cuisine', 'Vous aimez cuisiner ? Présentez un plat que vous aimez préparer.', 'Yemek yapmayı sever misiniz? Pişirmeyi sevdiğiniz bir yemeği anlatın.', "Oui, j'adore cuisiner ! J'aime préparer les dolmas. C'est un plat turc. Il faut des feuilles de vigne, du riz, des oignons, de l'huile d'olive et des épices. D'abord, je prépare le riz avec les oignons. Ensuite, je mets le riz dans les feuilles. Après, je fais cuire les dolmas pendant une heure. C'est délicieux !"],
  ['emission', 'Quelle est votre émission préférée ? Quand passe-t-elle ?', 'En sevdiğiniz program hangisi? Ne zaman yayınlanıyor?', "Mon émission préférée, c'est une émission de cuisine. Elle passe le samedi soir à vingt heures. Je la regarde avec ma fille. J'aime cette émission parce que j'apprends de nouvelles recettes et les candidats sont sympathiques."],
  ['medias', "Quels médias utilisez-vous pour suivre l'actualité ?", 'Haberleri takip etmek için hangi medyayı kullanıyorsunuz?', "Pour suivre l'actualité, j'utilise surtout mon téléphone. Le matin, je lis les informations sur Internet. Le soir, je regarde le journal télévisé. J'écoute aussi la radio dans la voiture. Je préfère Internet parce que c'est rapide et pratique."],
  ['logement', 'Parlez de votre logement.', 'Evinizden bahsedin.', "J'habite dans un appartement à Istanbul. Il y a deux chambres, un salon, une cuisine et une salle de bains. Mon appartement est lumineux et calme. J'aime beaucoup ma cuisine parce que je cuisine tous les jours. Le quartier est agréable : il y a un parc et des magasins près de chez moi."],
  ['famille', 'Présentez une personne de votre famille. Quelle relation avez-vous ?', 'Ailenizden birini tanıtın ve aranızdaki ilişkiyi anlatın.', "Je vais présenter ma fille. Elle est designer. Elle est gentille, drôle et très créative. Nous avons une très bonne relation. Nous parlons tous les jours au téléphone et nous aimons beaucoup voyager ensemble. Elle m'aide beaucoup avec mon français !"],
  ['ville', 'Vous préférez vivre en ville ou à la campagne ? Pourquoi ?', 'Şehirde mi kırsalda mı yaşamayı tercih edersiniz? Neden?', "Je préfère vivre en ville parce que c'est pratique. Il y a des magasins, des restaurants, des cinémas et des transports. J'habite à Istanbul, c'est une très grande ville. Mais la campagne, c'est calme et joli. Plus tard, j'aimerais avoir une petite maison à la campagne pour les vacances."],
  ['vacances', 'Parlez de vos dernières vacances.', 'Son tatilinizi anlatın.', "L'été dernier, je suis partie à Bodrum avec ma famille pendant deux semaines. Il faisait très chaud, alors nous sommes allés à la mer tous les jours. J'ai mangé beaucoup de bons plats. J'ai passé de très bonnes vacances !"],
  ['souvenir', "Racontez un souvenir d'enfance.", 'Bir çocukluk anınızı anlatın.', "Quand j'étais petite, je passais l'été chez mes grands-parents. Leur maison était près de la mer. Tous les matins, je jouais avec mes cousins dans le jardin. Ma grand-mère faisait des gâteaux délicieux. Un jour, nous sommes allés en bateau et j'ai vu des dauphins ! C'est un très beau souvenir."],
  ['projets', 'Quels sont vos projets pour les prochaines vacances ?', 'Gelecek tatil için planlarınız neler?', "Pour les prochaines vacances, je vais aller en France ! Je voudrais visiter Paris et voir la tour Eiffel. Je vais parler français avec les gens. Après, j'irai peut-être à Nice, parce que j'aime la mer. Ce sera un beau voyage !"],
  ['livres', 'Quels livres ou quelle musique aimez-vous ?', 'Hangi kitapları ya da müziği seversiniz?', "J'aime beaucoup lire. En ce moment, je lis un roman turc. Je lis le soir, avant de dormir. J'aime aussi la musique : j'écoute de la musique turque et des chansons françaises. Ma chanteuse préférée est Édith Piaf. Sa voix est magnifique !"],
  ['techno', 'Quelle place a la technologie dans votre vie ?', 'Teknolojinin hayatınızdaki yeri nedir?', "J'utilise mon téléphone tous les jours. Je parle avec ma fille par vidéo. J'utilise aussi Internet pour lire les informations et pour apprendre le français. Mais je n'aime pas passer trop de temps sur les écrans. Le soir, je préfère lire un livre."],
  ['travail', 'Parlez de vos études et de votre travail.', 'Eğitiminizden ve işinizden bahsedin.', "J'ai fait mes études en Turquie. Après l'université, j'ai travaillé comme secrétaire dans une entreprise. Je m'occupais des rendez-vous et je travaillais en équipe. J'aimais beaucoup l'ambiance de travail. Maintenant, j'apprends le français à l'Institut français d'Istanbul."],
];

// Diyalog: E = sınav görevlisi, C = Neslihan
const DIALOGUES = [
  { id: 'fete', emoji: '🎉', title: 'Partiye gitmek için izin istemek', fr: "Vous voulez aller à une fête samedi soir. Vous demandez la permission.", lines: [
    ['E', "Oui ? Qu'est-ce qu'il y a ?"], ['C', "Samedi soir, mon amie Claire fait une fête pour son anniversaire. Est-ce que je peux y aller ?"], ['E', 'Samedi soir ? À quelle heure ?'], ['C', 'La fête commence à dix-neuf heures et finit vers minuit.'], ['E', "C'est où ?"], ['C', 'Chez elle, dans le centre-ville. Je peux prendre le métro.'], ['E', 'Et pour rentrer ?'], ['C', "Mon amie va me ramener en voiture. Je t'enverrai un message quand j'arriverai."], ['E', "D'accord, mais fais attention !"], ['C', "Merci beaucoup, c'est gentil !"]] },
  { id: 'paris', emoji: '🗼', title: 'Paris’te bir hafta planlamak', fr: 'Vous organisez une semaine à Paris avec un ami. Vous décidez ensemble du programme.', lines: [
    ['E', "Alors, qu'est-ce qu'on fait à Paris ?"], ['C', 'Et si on visitait la tour Eiffel le premier jour ?'], ['E', 'Bonne idée ! Et après ?'], ['C', "On pourrait aller au musée du Louvre. J'aimerais voir la Joconde."], ['E', 'Moi, je préfère faire du shopping…'], ['C', "D'accord : shopping mardi et Louvre mercredi. Ça te va ?"], ['E', 'Parfait. Et pour manger ?'], ['C', 'On pourrait dîner dans un petit restaurant à Montmartre.'], ['E', "Et l'hôtel ?"], ['C', "Je vais réserver un hôtel près du métro. C'est plus pratique."], ['E', "Super, c'est décidé !"]] },
  { id: 'voisins', emoji: '🏘️', title: 'Komşularla tanışmak', fr: 'Vous rencontrez votre nouvelle voisine dans l’escalier.', lines: [
    ['E', 'Bonjour ! Vous êtes la nouvelle voisine ?'], ['C', "Oui, bonjour ! Je m'appelle Neslihan. J'habite au troisième étage."], ['E', "Enchantée ! Moi, c'est Marie. Vous venez d'où ?"], ['C', "Je suis d'Istanbul. J'habite ici depuis un mois."], ['E', 'Vous aimez le quartier ?'], ['C', "Oui, beaucoup ! C'est calme. Il y a un supermarché près d'ici ?"], ['E', 'Oui, au bout de la rue, à droite.'], ['C', 'Merci ! Vous voulez prendre un thé chez moi samedi ?'], ['E', 'Avec plaisir !']] },
  { id: 'sortie', emoji: '🚤', title: 'Bir gezi için bilgi istemek', fr: "Vous êtes à l'office de tourisme. Vous demandez des informations sur une visite.", lines: [
    ['E', 'Bonjour, je peux vous aider ?'], ['C', "Bonjour, je voudrais des informations sur la visite du vieux port, s'il vous plaît."], ['E', 'Bien sûr. Il y a une visite tous les jours à dix heures.'], ['C', 'Elle dure combien de temps ?'], ['E', 'Deux heures.'], ['C', 'Et ça coûte combien ?'], ['E', 'Quinze euros par personne.'], ['C', "Est-ce qu'il faut réserver ?"], ['E', "Oui, c'est mieux."], ['C', "Alors, je voudrais réserver deux places pour samedi, s'il vous plaît."]] },
  { id: 'biblio', emoji: '📚', title: 'Kütüphaneye üye olmak', fr: 'Vous voulez vous inscrire à la bibliothèque.', lines: [
    ['E', 'Bonjour madame, je peux vous aider ?'], ['C', "Bonjour, je voudrais m'inscrire à la bibliothèque, s'il vous plaît."], ['E', "Oui, vous avez une pièce d'identité ?"], ['C', "Oui, voici mon passeport. C'est gratuit ?"], ['E', "Oui, c'est gratuit pour les habitants de la ville."], ['C', "Combien de livres est-ce que je peux emprunter ?"], ['E', 'Cinq livres pour trois semaines.'], ['C', 'Et la bibliothèque est ouverte le dimanche ?'], ['E', 'Non, elle est fermée le dimanche et le lundi.'], ['C', "D'accord, merci beaucoup !"]] },
  { id: 'pharmacie', emoji: '💊', title: 'Eczacıdan tavsiye istemek', fr: 'Vous êtes malade. Vous demandez conseil au pharmacien.', lines: [
    ['E', 'Bonjour madame, qu’est-ce que je peux faire pour vous ?'], ['C', "Bonjour, j'ai mal à la gorge et je tousse depuis deux jours."], ['E', 'Vous avez de la fièvre ?'], ['C', 'Non, mais je suis très fatiguée.'], ['E', 'Je vous conseille ce sirop. Prenez-le trois fois par jour.'], ['C', 'Avant ou après les repas ?'], ['E', "Après les repas. Et buvez beaucoup d'eau."], ['C', "Et si ça ne va pas mieux ?"], ['E', 'Dans ce cas, allez chez le médecin.'], ['C', "D'accord. Ça coûte combien ?"], ['E', 'Huit euros.'], ['C', 'Voilà. Merci beaucoup, au revoir !']] },
  { id: 'tele', emoji: '📺', title: 'TV’de ne izleneceğine karar vermek', fr: 'Vous décidez avec un ami du programme à regarder ce soir.', lines: [
    ['E', "Qu'est-ce qu'on regarde ce soir ?"], ['C', "Il y a un film à vingt et une heures. C'est une comédie."], ['E', "Bof, je n'aime pas les comédies. Il y a un match de foot."], ['C', "Le foot ? Je préfère regarder autre chose… Et le documentaire sur l'Italie ?"], ['E', 'Il commence à quelle heure ?'], ['C', 'À vingt heures trente, sur la deuxième chaîne.'], ['E', "D'accord, bonne idée !"], ['C', 'Super ! Je prépare du thé.']] },
];

// Diyalog için hazır kalıplar (çalışma programından)
const DIALOG_PHRASES = [
  ['Je voudrais… / Est-ce que je peux… ?', '… istiyorum / … yapabilir miyim?'],
  ["Pourriez-vous m'aider ?", 'Bana yardım edebilir misiniz?'],
  ['Et si on allait… ? / On pourrait…', 'Peki ya … gitsek? / … yapabiliriz'],
  ["D'accord ! Bonne idée ! Avec plaisir.", 'Tamam! İyi fikir! Memnuniyetle.'],
  ['Désolée, je ne peux pas, parce que…', 'Üzgünüm, yapamam çünkü…'],
  ["Pouvez-vous répéter, s'il vous plaît ?", 'Tekrar eder misiniz lütfen?'],
  ['Ça coûte combien ? À quelle heure ?', 'Ne kadar? Saat kaçta?'],
];

// ---------- Çalışma programı (Ecem'in planı) ----------
const EXAM_DATE = '2026-11-03';
const RFI = ['🎧 RFI A2 dinleme (15 dk)', 'https://francaisfacile.rfi.fr/fr/comprendre-actualit%C3%A9-fran%C3%A7ais/a2/'];
const PLAN = [
  ['2026-10-20', 'Présent', [['📐 Gramer: Présent', '#/gram/present'], ['🎤 Kendini tanıtmayı 5 kez sesli oku', '#/oral/intro'], RFI, ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-21', 'Passé composé (avoir)', [['📐 Gramer: Passé composé', '#/gram/pc'], ['🎤 Monolog: Son hafta sonun (1 dk)', '#/oral/m/weekend'], RFI, ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-22', 'Passé composé (être)', [['📐 Gramer: Passé composé', '#/gram/pc'], ['📖 Okuma: e-posta ve ilan', '#/read'], ['🎤 Monolog: Son tatilin', '#/oral/m/vacances'], ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-23', 'Imparfait', [['📐 Gramer: Imparfait', '#/gram/imp'], ['🎤 Monolog: Çocukluk anın', '#/oral/m/souvenir'], RFI, ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-24', 'Imparfait mi Passé composé mu?', [['📐 Gramer: Imparfait / PC', '#/gram/imppc'], ['✍️ Yazma: Geçen hafta sonunu anlat', '#/write/weekend'], ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-25', 'Hafif gün: tekrar', [['🎤 Kendini tanıtmayı kaydet ve dinle', '#/oral/intro'], ['🧠 Kelime tekrarı', '#/cards/smart'], ['🧩 Cümle kur', '#/order']]],
  ['2026-10-26', 'Futur proche + Futur simple', [['📐 Gramer: Futur', '#/gram/futur'], ['🎤 Monolog: Gelecek tatil planların', '#/oral/m/projets'], RFI, ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-27', 'Conditionnel présent', [['📐 Gramer: Conditionnel', '#/gram/cond'], ['💬 Diyalog: Eczacı', '#/oral/d/pharmacie'], RFI, ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-28', 'Randevu kabul / ret', [['✍️ Yazma: Daveti kabul et', '#/write/accept'], ['✍️ Yazma: Daveti reddet', '#/write/refuse'], ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-10-29', 'Diyaloglar 1', [['💬 Partiye gitmek için izin', '#/oral/d/fete'], ['💬 Kütüphaneye üye olmak', '#/oral/d/biblio'], ['💬 Komşularla tanışmak', '#/oral/d/voisins'], RFI]],
  ['2026-10-30', 'Diyaloglar 2', [['💬 Paris’te bir hafta', '#/oral/d/paris'], ['💬 Gezi için bilgi', '#/oral/d/sortie'], ['💬 TV’de ne izlesek', '#/oral/d/tele'], ['📖 Okuma', '#/read']]],
  ['2026-10-31', 'Deneme sınavı 📝', [['📝 Örnek DELF A2 sınavı (süre tut)', 'https://www.france-education-international.fr/en/diplome/delf-tout-public/niveau-a2'], ['🧠 Kelime tekrarı', '#/cards/smart']]],
  ['2026-11-01', 'Zayıf bölümü tekrar', [['📊 Zorlandığın yerlere bak', '#/stats'], ['🎤 3 monolog konusu anlat', '#/oral'], ['📐 Gramer karışık tekrar', '#/gram']]],
  ['2026-11-02', 'Hafif tekrar · erken yat 😴', [['🎤 Kendini tanıtma', '#/oral/intro'], ['💬 2 diyalog', '#/oral'], ['🧠 Kısa kelime tekrarı', '#/cards/smart']]],
  ['2026-11-03', 'SINAV GÜNÜ 🍀 Bonne chance !', [['💡 Önce soruları oku, sonra dinle', ''], ['💡 Anlamazsan: “Pouvez-vous répéter ?”', ''], ['💡 Yazıda 5 dk kontrol: fiil sonları, être/avoir', '']]],
];

// ---------- Ders kitabı s.158–159: Dolaylı anlatım, CV ve profesyonel ağlar ----------
THEMES.find(t => t.id === 'travail').words.push(
  ['le réseau professionnel', 'profesyonel ağ', 'Je suis sur un réseau professionnel.', 'Profesyonel bir ağdayım.', 'm'],
  ['le profil', 'profil', 'La photo du profil doit être neutre.', 'Profil fotoğrafı nötr olmalı.', 'm'],
  ["l'employeur", 'işveren', "J'écris un message à un employeur.", 'Bir işverene mesaj yazıyorum.', 'm'],
  ['le recruteur', 'işe alım uzmanı', 'Le recruteur lit mon CV.', 'İşe alım uzmanı özgeçmişimi okuyor.', 'm', 'kadın: la recruteuse'],
  ['utile', 'faydalı / işe yarar', 'Le CV est encore utile.', 'CV hâlâ faydalı.'],
  ['se demander', 'merak etmek', 'Je me demande si le CV est utile.', 'CV’nin faydalı olup olmadığını merak ediyorum.'],
  ['vouloir savoir', 'bilmek istemek', 'Je voudrais savoir ce que je dois écrire.', 'Ne yazmam gerektiğini bilmek istiyorum.'],
  ['expliquer', 'açıklamak', "Elle explique qu'elle a beaucoup d'expérience.", 'Çok deneyimi olduğunu açıklıyor.'],
  ['ajouter', 'eklemek', "Acceptez-vous de m'ajouter à vos contacts ?", 'Beni kişilerinize eklemeyi kabul eder misiniz?'],
  ['Bien à vous', 'Saygılarımla (resmî kapanış)', 'Merci pour votre réponse. Bien à vous.', 'Cevabınız için teşekkürler. Saygılarımla.', '', 'eş anlamlı: Bien cordialement'],
);

SENTENCES.push(
  ["Elle dit qu'elle aimerait être dans ce réseau.", 'Bu ağda olmak istediğini söylüyor.'],
  ["Il affirme que ce poste l'intéresse.", 'Bu pozisyonun ilgisini çektiğini söylüyor.'],
  ['Je me demande si le CV est encore utile.', 'CV’nin hâlâ faydalı olup olmadığını merak ediyorum.'],
  ['Je voudrais savoir ce que je dois écrire sur mon profil.', 'Profilime ne yazmam gerektiğini öğrenmek istiyorum.'],
  ["Acceptez-vous de m'ajouter à vos contacts ?", 'Beni kişilerinize eklemeyi kabul eder misiniz?'],
  ['Merci pour votre réponse.', 'Cevabınız için teşekkürler.'],
);

GRAMMAR.push({ id: 'indirect', emoji: '💬', name: 'Dolaylı anlatım', sub: 'Şimdiki zamanda aktarma (s.159)',
  when: 'Birinin söylediğini ya da sorduğunu aktarmak: "… olduğunu söylüyor", "… olup olmadığını soruyor". Zamirleri değiştirmeyi unutma!',
  forms: [
    ['dire, répondre, affirmer, ajouter, annoncer, déclarer, expliquer, répéter + que', 'Bir cümleyi aktarmak: fiil + que'],
    ["« C'est plus facile pour nous. » → Ils disent que c'est plus facile pour eux.", 'nous → eux: zamir değişti'],
    ['demander, vouloir savoir, aimer savoir + où, qui, quand, comment, pourquoi', 'Bir soruyu aktarmak: fiil + soru kelimesi'],
    ["« Pourquoi ce poste vous intéresse ? » → Elle me demande pourquoi ce poste m'intéresse.", 'vous → m’: zamir değişti'],
    ['« Le CV est utile ? » → Elle se demande si le CV est utile.', 'Est-ce que / soru kelimesi yok → SI'],
    ["« Qu'est-ce que vous pouvez apporter ? » → On vous demande ce que vous pouvez apporter.", "Qu'est-ce que → CE QUE"],
    ["« Qu'est-ce qui est important ? » → Ils se demandent ce qui est important.", "Qu'est-ce qui → CE QUI"],
  ],
  examples: [["Il affirme que ce poste l'intéresse.", 'Bu pozisyonun ilgisini çektiğini söylüyor.'], ['Je me demande comment écrire le premier message.', 'İlk mesajı nasıl yazacağımı merak ediyorum.']],
  qs: [
    ["« J'aimerais être dans ce réseau professionnel. » → Elle dit ___ aimerait être dans ce réseau professionnel.", ["qu'elle", 'si elle', "ce qu'elle"], '(Alıştırma 2a) Bu profesyonel ağda olmak istediğini söylüyor.'],
    ["« Ce poste m'intéresse. » → Il affirme que ce poste ___.", ["l'intéresse", "m'intéresse", 'vous intéresse'], '(Alıştırma 2b) Bu pozisyonun ilgisini çektiğini söylüyor.'],
    ["« Nous avons beaucoup d'expérience dans la formation. » → Ils expliquent qu'ils ___ beaucoup d'expérience dans la formation.", ['ont', 'avons', 'avez'], '(Alıştırma 2c) Eğitim alanında çok deneyimleri olduğunu açıklıyorlar.'],
    ['« Je vais créer un profil sur LinkedIn. » → Elle annonce qu’elle ___ créer un profil sur LinkedIn.', ['va', 'vais', 'allons'], '(Alıştırma 2d) LinkedIn’de profil oluşturacağını duyuruyor.'],
    ['Nous nous demandons ___ les réseaux sociaux sont nécessaires.', ['si', 'ce que', 'que'], '(Alıştırma 3a) Sosyal medyanın gerekli olup olmadığını merak ediyoruz.'],
    ['Les recruteurs affirment ___ le CV est encore utile.', ['que', 'si', 'ce qui'], '(Alıştırma 3b) İşe alım uzmanları CV’nin hâlâ faydalı olduğunu söylüyor.'],
    ['Il demande au candidat ___ est sa formation.', ['quelle', 'ce que', 'si'], '(Alıştırma 3c) Adaya eğitiminin ne olduğunu soruyor.'],
    ["J'explique ___ m'intéresse dans ce poste.", ['ce qui', 'ce que', 'qu’est-ce qui'], '(Alıştırma 3d) Bu pozisyonda beni neyin ilgilendirdiğini açıklıyorum.'],
    ['« Est-ce que le CV est utile ? » → Elle se demande ___ le CV est utile.', ['si', 'que', 'ce que'], 'CV’nin faydalı olup olmadığını merak ediyor.'],
    ["« Qu'est-ce que vous pouvez apporter ? » → On vous demande ___ vous pouvez apporter.", ['ce que', 'qu’est-ce que', 'ce qui'], 'Size ne katabileceğiniz soruluyor.'],
    ["« Qu'est-ce qui est important dans un CV ? » → Ils se demandent ___ est important dans un CV.", ['ce qui', 'ce que', 'qu’est-ce qui'], 'CV’de neyin önemli olduğunu merak ediyorlar.'],
    ['« Où est-ce que tu as étudié ? » → Jana veut savoir ___ tu as étudié.', ['où', 'si', 'que'], '(Alıştırma 5) Jana nerede okuduğunu bilmek istiyor.'],
    ["« J'ai étudié à Bratislava. » → Rita dit qu'elle ___ étudié à Bratislava.", ['a', 'ai', 'as'], '(Alıştırma 6) Rita, Bratislava’da okuduğunu söylüyor.'],
    ["« Vous avez de l'expérience ? » → Le recruteur demande ___ j'ai de l'expérience.", ['si', 'que', 'ce que'], 'İşe alım uzmanı deneyimim olup olmadığını soruyor.'],
  ] });

READING.push({ id: 'forum', emoji: '💼', title: 'Forum: Profesyonel profil (s.158)', text: "FORUM — Réseaux professionnels\n\nLina : Bonjour, je voudrais savoir ce que je dois écrire sur mon profil professionnel. Merci d'avance.\n\nPaul (recruteur) : Votre profil doit avoir un titre (votre métier ou vos métiers) et montrer vos expériences et vos compétences. Si vous mettez une photo, elle doit être neutre.\n\nLina : Merci pour votre réponse. Je me demande aussi comment écrire le premier message pour contacter un employeur. Vous avez des exemples ?\n\nPaul : Vous pouvez écrire : « Bonjour Madame, j'ai regardé les offres d'emploi de votre entreprise et je suis très intéressée par le poste de secrétaire. Acceptez-vous de m'ajouter à vos contacts ? Bien à vous, Lina »",
  qs: [
    ["Qu'est-ce qu'il faut mettre sur un profil professionnel ?", 'Profesyonel profile ne konmalı?', ['Un titre, les expériences et les compétences', "Son âge et sa famille", 'Seulement une photo']],
    ['Comment doit être la photo ?', 'Fotoğraf nasıl olmalı?', ['Neutre', 'De vacances', 'Avec la famille']],
    ['Quelle phrase sert à faire une demande polie ?', 'Hangi cümle kibar bir istek?', ["Acceptez-vous de m'ajouter à vos contacts ?", 'Bien à vous', "J'ai regardé les offres d'emploi"]],
    ['Quelle expression termine un message formel ?', 'Hangi ifade resmî bir mesajı bitirir?', ['Bien à vous', 'Bisous', 'À plus !']],
  ] });

WRITING.push({
  id: 'reseau', emoji: '🤝', title: 'Resmî mesaj: bağlantı isteği (s.158)',
  tr: 'Profesyonel bir ağda (LinkedIn gibi) bir şirketin işe alım sorumlusuna mesaj yaz: kibarca selamla, hangi pozisyonla ilgilendiğini söyle, kibar bir istekte bulun (seni kişilerine eklemesi, CV’ni göndermek), resmî şekilde bitir.',
  fr: "Sur un réseau professionnel, vous écrivez à un(e) recruteur(se). Vous saluez, vous dites quel poste vous intéresse, vous faites une demande polie et vous terminez le message de manière formelle. (60 à 80 mots)",
  checks: [
    ['Resmî selamla (Bonjour Madame, / Monsieur,)', /(madame|monsieur)/i],
    ['Pozisyonu söyle (le poste de…)', /(poste|offre|annonce)/i],
    ['Kibar istek (Acceptez-vous de… ? / Pouvez-vous… ?)', /(acceptez-vous|pouvez-vous|pourriez-vous|je voudrais)/i],
    ['Soru sor', /\?/],
    ['Teşekkür et (Merci d’avance)', /merci/i],
    ['Resmî kapanış (Bien à vous, / Bien cordialement,)', /(bien à vous|cordialement)/i],
  ],
  phrases: [
    ['Bonjour Madame,', 'Merhaba Hanımefendi,'],
    ['Bonjour Monsieur,', 'Merhaba Beyefendi,'],
    ["J'ai regardé les offres d'emploi de votre entreprise", 'Şirketinizin iş ilanlarına baktım'],
    ['et je suis très intéressée par le poste de…', 've … pozisyonuyla çok ilgileniyorum'],
    ['Je voudrais vous envoyer mon CV.', 'Size CV’mi göndermek istiyorum.'],
    ["Acceptez-vous de m'ajouter à vos contacts ?", 'Beni kişilerinize eklemeyi kabul eder misiniz?'],
    ['Pouvez-vous me dire… ?', 'Bana … söyleyebilir misiniz?'],
    ["Merci d'avance.", 'Şimdiden teşekkürler.'],
    ['Bien à vous,', 'Saygılarımla,'],
    ['Bien cordialement,', 'Saygılarımla,'],
  ],
  model: "Bonjour Madame,\nJ'ai regardé les offres d'emploi de votre entreprise et je suis très intéressée par le poste de secrétaire. J'ai dix ans d'expérience et j'aime beaucoup le travail en équipe. Je voudrais vous envoyer mon CV. Acceptez-vous de m'ajouter à vos contacts ? Pouvez-vous aussi me dire quels sont les horaires de travail ? Merci d'avance pour votre réponse.\nBien à vous,\nNeslihan",
});

MONOLOGUES.push(
  ['cv', "Selon vous, est-ce utile de faire un CV aujourd'hui ? Pourquoi ?", 'Size göre bugün CV hazırlamak faydalı mı? Neden?', "Oui, je pense que le CV est encore utile. C'est un document simple et pratique : le recruteur voit vite notre formation, nos expériences et nos compétences. Mais aujourd'hui, les réseaux professionnels sont aussi importants. À mon avis, il faut avoir un CV d'une page et un profil en ligne. Moi, j'ai préparé mon CV en français pour pratiquer !"],
  ['reseaux', "Que pensez-vous des réseaux sociaux pour chercher un emploi ?", 'İş aramak için sosyal ağlar hakkında ne düşünüyorsunuz?', "Je pense que c'est une bonne méthode. Sur un réseau professionnel, on peut voir les offres d'emploi et contacter directement les employeurs. C'est rapide et gratuit. Mais il faut faire attention : le profil doit être sérieux et la photo doit être neutre. Je préfère quand même rencontrer les gens en personne."],
);

// Programa yeni dersi ekle
PLAN.find(p => p[0] === '2026-10-22')[2].unshift(['📐 Yeni ders: Dolaylı anlatım (s.159)', '#/gram/indirect']);
PLAN.find(p => p[0] === '2026-10-28')[2].push(['✍️ Resmî mesaj: bağlantı isteği (s.158)', '#/write/reseau']);
PLAN.find(p => p[0] === '2026-11-01')[2].push(['💬 Dolaylı anlatım tekrarı', '#/gram/indirect']);
