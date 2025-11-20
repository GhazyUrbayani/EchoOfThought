(() => {
  "use strict";

  const CLIENT_NAME = "Echo of Thought Prototype";
  
  const STORY_TREE = {
    // --- EPISODE 1: HARI PERTAMA ---
    BEGIN: {
      text: "EPISODE 1: HARI PERTAMA\n\nGerbang SMA Harapan Bangsa menjulang seperti rahang baja yang membelah langit Jakarta yang keruh. Bau tanah basah bercampur asap knalpot, dan di antara riuh tawa siswa ada satu suara yang paling tajam.\n\n'Jangan mencolok,' bisik Echo, suara di kepalamu yang sudah menemani bertahun-tahun. 'Jadilah biasa saja. Aman itu nyaman. Jangan biarkan mereka mengintip bagian dirimu yang rapuh.'\n\nKamu berdiri di ambang gerbang, seragam putih abu-abu masih kaku dan berbau toko, telapak tangan sedikit berkeringat.",
      choices: [
        { text: "Tarik napas dalam, paksa kaki melangkah.", nextId: "EP1_CORRIDOR", delta: { echo: 1 } },
        { text: "Tundukkan kepala, hindari tatapan siapa pun.", nextId: "EP1_CORRIDOR_SHY", delta: { echo: -1 } },
        { text: "Pasang earphone, tenggelamkan dunia luar.", nextId: "EP1_CORRIDOR_ISOLATED", delta: { echo: -2 } },
        { text: "Senyum tipis pada satpam, paksa diri ramah.", nextId: "EP1_CORRIDOR_FRIENDLY", delta: { echo: 2 } }
      ]
    },
    EP1_CORRIDOR: {
      text: "Koridor utama memantulkan bayanganmu di lantai keramik yang licin. Poster lomba dan jadwal piket menempel sembarangan di dinding. Sebelum sempat membaca, bahumu tertabrak keras. Buku-buku berjatuhan dengan suara 'brukk' yang memecah bising pagi.\n\nSeorang gadis berkacamata bulat panik memunguti novel-novel tebalnya. Nara. 'Aduh, mati gue, telat, telat...' gumamnya terburu-buru.",
      choices: [
        { text: "Berlutut dan bantu pungut bukunya.", nextId: "EP1_MEET_NARA", delta: { nara: 2, echo: 1 } },
        { text: "Gumamkan 'sorry' pelan dan lanjut jalan.", nextId: "EP1_IGNORE_NARA", delta: { nara: 0, echo: -1 } },
        { text: "Diam saja, tunggu dia selesai.", nextId: "EP1_IGNORE_NARA", delta: { nara: -1, echo: 0 } },
        { text: "Salahkan lantai. 'Licin banget ya - '", nextId: "EP1_JOKE_NARA", delta: { nara: 1, echo: 1 } }
      ]
    },
    EP1_CORRIDOR_SHY: {
      text: "Kamu berjalan cepat, mata terpaku pada ujung sepatu. 'Bagus,' kata Echo. 'Tak ada yang memperhatikan.' Tiba-tiba, BRUK! Kamu menabrak seseorang. Buku-buku berhamburan. Seorang gadis berkacamata membeku menatapmu, terkejut dan terbata.",
      choices: [
        { text: "Bantu dia tanpa bicara.", nextId: "EP1_MEET_NARA", delta: { nara: 1, echo: 0 } },
        { text: "Lari ke kelas karena panik.", nextId: "EP1_IGNORE_NARA", delta: { nara: -1, echo: -2 } },
        { text: "Minta maaf berkali-kali.", nextId: "EP1_MEET_NARA", delta: { nara: 2, echo: -1 } }
      ]
    },
    EP1_CORRIDOR_ISOLATED: {
      text: "Musik di telingamu meredam segala hal, tapi tidak getaran tabrakan itu. Bahumu menghantam seorang gadis (Nara). Bibirnya bergerak, tapi lirik lagu menutup maknanya.",
      choices: [
        { text: "Lepas earphone, tanya dia bicara apa.", nextId: "EP1_MEET_NARA", delta: { nara: 1, echo: 1 } },
        { text: "Abaikan, jalan terus.", nextId: "EP1_IGNORE_NARA", delta: { nara: -2, echo: -2 } },
        { text: "Bantu pungut buku sambil tetap pakai earphone.", nextId: "EP1_MEET_NARA", delta: { nara: 0, echo: -1 } }
      ]
    },
    EP1_CORRIDOR_FRIENDLY: {
      text: "Satpam membalas senyummu. Percik percaya diri muncul. Di tikungan, kamu tak sengaja menyenggol seorang gadis (Nara). Buku-bukunya jatuh berserakan seperti confetti yang salah tempat.",
      choices: [
        { text: "Langsung bantu dengan sigap.", nextId: "EP1_MEET_NARA", delta: { nara: 3, echo: 2 } },
        { text: "Minta maaf sambil tersenyum.", nextId: "EP1_JOKE_NARA", delta: { nara: 2, echo: 1 } },
        { text: "Tunggu dia bereaksi.", nextId: "EP1_IGNORE_NARA", delta: { nara: 0, echo: 0 } }
      ]
    },
    EP1_MEET_NARA: {
      text: "'Makasih banget!' Nara tersenyum lebar, matanya menyipit di balik kacamata. 'Gue Nara. Sumpah, gue kira bakal dimarahin kakak kelas tadi.' Debu di roknya dia tepuk pelan, seolah merapikan juga rasa malunya. 'Lo anak baru ya -  Muka lo asing. Mau gue anter ke kelas - '\n\nEcho bergumam sinis: 'Terlalu ramah. Pasti ada maunya. Jangan terlalu dekat.'",
      choices: [
        { text: "'Boleh, gue butuh bantuan.' (Terima)", nextId: "EP1_CLASS_WITH_NARA", delta: { nara: 2, echo: 1 } },
        { text: "'Gue bisa cari sendiri.' (Tolak)", nextId: "EP1_CLASS", delta: { nara: -1, echo: -1 } },
        { text: "Senyum dan angguk saja.", nextId: "EP1_CLASS_WITH_NARA", delta: { nara: 1, echo: 0 } },
        { text: "Ragu-ragu, lihat sekeliling.", nextId: "EP1_CLASS", delta: { nara: 0, echo: 0 } }
      ]
    },
    EP1_JOKE_NARA: {
      text: "Nara tertawa renyah, suaranya memantul di koridor seperti lonceng kecil. 'Iya kan -  Lantai sekolah ini emang konspirasi buat bikin murid jatuh!' Suasana mencair. Dia mengulurkan tangan. 'Gue Nara. Lo - '",
      choices: [
        { text: "Sebut namamu dan jabat tangannya.", nextId: "EP1_CLASS_WITH_NARA", delta: { nara: 3, echo: 2 } },
        { text: "Sebut nama tanpa jabat tangan.", nextId: "EP1_CLASS_WITH_NARA", delta: { nara: 1, echo: 0 } },
        { text: "Hanya senyum.", nextId: "EP1_CLASS", delta: { nara: 0, echo: 0 } }
      ]
    },
    EP1_IGNORE_NARA: {
      text: "Kamu meninggalkan Nara yang masih menyeimbangkan bukunya. Rasa bersalah menggelitik, tapi Echo membenarkan: 'Lebih baik tidak terlibat.'\n\nKamu tiba di kelas XI-IPS 2. Suasana riuh dari fans K-pop di pojok sampai geng basket di depan. Kamu memilih bangku kosong di belakang, mencoba larut jadi wallpaper.",
      choices: [
        { text: "Duduk dan amati sekitar.", nextId: "EP1_CLASS_OBSERVE", delta: { echo: 0 } },
        { text: "Keluarkan HP, pura-pura sibuk.", nextId: "EP1_CLASS_PHONE", delta: { echo: -1 } }
      ]
    },
    EP1_CLASS_WITH_NARA: {
      text: "Kamu masuk kelas bersama Nara. Beberapa anak melirik ingin tahu. 'Duduk deket gue aja!' ajak Nara, menunjuk bangku kosong di sebelahnya. Di depan kalian, Dimas mencoret sketsa serupa mata yang seolah hidup, sementara Salsa terlihat stres menekuri buku paket tebal.",
      choices: [
        { text: "Duduk di sebelah Nara.", nextId: "EP1_CLASS_INTERACTION", delta: { nara: 1 } },
        { text: "Duduk di belakang Dimas.", nextId: "EP1_CLASS_INTERACTION", delta: { dimas: 1 } }
      ]
    },
    EP1_CLASS: {
      text: "Kamu masuk kelas sendirian. Di baris tengah, Dimas menggambar dengan sangat fokus, seolah dunia di sekitarnya disilent. Di sebelahnya, Salsa mengomel pelan pada kalkulatornya seakan kalkulator itu makhluk hidup yang bandel.",
      choices: [
        { text: "Perhatikan gambar Dimas.", nextId: "EP1_INTERACT_DIMAS", delta: { dimas: 1 } },
        { text: "Tanya Salsa soal pelajaran.", nextId: "EP1_INTERACT_SALSA", delta: { salsa: 1 } },
        { text: "Tidur sampai bel masuk.", nextId: "EP1_CLASS_END", delta: { echo: -1 } }
      ]
    },
    EP1_CLASS_OBSERVE: {
      text: "Dari belakang, kamu melihat dinamika kelas seperti panggung kecil. Ada kelompok populer, ada yang tidur dengan hoodie menutupi muka. Dimas, cowok di depanmu, menggambar sesuatu yang gelap dan rumit. Salsa, cewek di sebelahnya, perfeksionis sampai kertasnya nyaris sobek karena terus dihapus.",
      choices: [
        { text: "Tegur Dimas: 'Gambar apa - '", nextId: "EP1_INTERACT_DIMAS", delta: { dimas: 1, echo: 1 } },
        { text: "Diam saja.", nextId: "EP1_CLASS_END", delta: { echo: 0 } }
      ]
    },
    EP1_CLASS_PHONE: {
      text: "Layar HP menyala, tapi kamu tidak benar-benar melihat isinya. Jempolmu scrolling kosong hanya demi menghindari kontak mata. Echo puas: 'Begini lebih aman.'",
      choices: [
        { text: "Tunggu bel.", nextId: "EP1_CLASS_END", delta: { echo: -1 } }
      ]
    },
    EP1_INTERACT_DIMAS: {
      text: "Dimas tersentak kaget saat kamu mendekat. Buku sketsanya langsung dia tutup. 'Eh... nggak. Cuma coret-coret,' gumamnya pelan, mata tak berani menatapmu. Sekilas kamu melihat gambar mata yang sangat realistis, basah dan cemas.",
      choices: [
        { text: "'Keren kok gambarnya.'", nextId: "EP1_CLASS_END", delta: { dimas: 2, echo: 1 } },
        { text: "'Sorry ganggu.'", nextId: "EP1_CLASS_END", delta: { dimas: 0, echo: 0 } },
        { text: "Paksa lihat lagi.", nextId: "EP1_CLASS_END", delta: { dimas: -1, echo: -1 } }
      ]
    },
    EP1_INTERACT_SALSA: {
      text: "Salsa menoleh tajam. 'Jadwal -  Ada di papan tulis kan - ' nadanya ketus seperti penggaris besi. Dia menghela napas panjang, lalu melembut sedikit. 'Sorry. Gue lagi pusing sama materi Fisika ini. Lo anak baru ya - '",
      choices: [
        { text: "'Iya. Santai aja.'", nextId: "EP1_CLASS_END", delta: { salsa: 1, echo: 1 } },
        { text: "'Galak banget.'", nextId: "EP1_CLASS_END", delta: { salsa: -2, echo: 1 } },
        { text: "Mundur perlahan.", nextId: "EP1_CLASS_END", delta: { salsa: 0, echo: -1 } }
      ]
    },
    EP1_CLASS_INTERACTION: {
      text: "Pelajaran dimulai. Bu Rina menjelaskan sejarah dengan suara monoton. Nara diam-diam mengoper kertas kecil padamu. Isinya doodle kartun guru yang lucu dengan cape. Kamu menahan tawa di balik masker.",
      choices: [
        { text: "Tahan tawa dan balas gambar.", nextId: "EP1_CLASS_END", delta: { nara: 2 } },
        { text: "Abaikan kertasnya.", nextId: "EP1_CLASS_END", delta: { nara: -1 } },
        { text: "Senyum saja.", nextId: "EP1_CLASS_END", delta: { nara: 1 } }
      ]
    },
    EP1_CLASS_END: {
      text: "Bel pulang berbunyi nyaring. Langit di luar sudah gelap gulita. Hujan deras turun tiba-tiba, seperti menumpahkan seluruh air dari langit. Semua siswa tertahan di gerbang sekolah.\n\nNara menggigil, memeluk buku ke dada. Dimas berdiri diam menatap hujan seolah mencari jawaban di balik tirai air. Salsa sibuk menelepon jemputan dengan panik, layar HP berkali-kali diremas.",
      choices: [
        { text: "Tawarkan payung ke Nara.", nextId: "EP2_INTRO", delta: { nara: 3, echo: 2 } },
        { text: "Berdiri diam di sebelah Dimas, berbagi sunyi.", nextId: "EP2_INTRO", delta: { dimas: 2, echo: 1 } },
        { text: "Tanya Salsa butuh tebengan online - ", nextId: "EP2_INTRO", delta: { salsa: 2, echo: 1 } },
        { text: "Terobos hujan sendirian. Lari.", nextId: "EP2_INTRO", delta: { echo: -2 } }
      ]
    },

    // --- EPISODE 2: KATA YANG TAK TERUCAP ---
    EP2_INTRO: {
      text: "EPISODE 2: KATA YANG TAK TERUCAP\n\nSeminggu berlalu. Kamu hafal posisi kantin, toilet, dan warung es teh, tapi hati teman-temanmu masih seperti peta tanpa legenda.\n\nBu Rina memberikan tugas kelompok Sejarah. 'Kalian berempat satu tim,' tunjuknya padamu, Nara, Dimas, dan Salsa.\n\nDi perpustakaan, udara AC dingin tapi suasana kaku. Salsa mengetuk-ngetuk pulpen dengan tempo marah. 'Dimas, lo udah cari bahannya belum sih -  Dari tadi diem doang!'",
      choices: [
        { text: "Tengahi mereka: 'Sabar Sal, kita cari bareng.'", nextId: "EP2_CONFLICT", delta: { salsa: 1, dimas: 1, echo: 2 } },
        { text: "Diam dan pura-pura baca buku.", nextId: "EP2_SILENT", delta: { echo: -1 } },
        { text: "Bela Dimas: 'Jangan ngegas dong.'", nextId: "EP2_DEFEND_DIMAS", delta: { dimas: 3, salsa: -2 } },
        { text: "Dukung Salsa: 'Iya Dim, kita butuh bahannya.'", nextId: "EP2_SUPPORT_SALSA", delta: { salsa: 3, dimas: -2 } }
      ]
    },
    EP2_CONFLICT: {
      text: "Kamu mencoba bicara. Suaramu pelan tapi menembus celah tegang. Salsa menghela napas kasar, 'Oke, sorry. Gue cuma panik. Nilai gue semester lalu turun.'\n\nDimas mengangkat wajahnya sedikit, menatapmu dengan rasa terima kasih yang canggung. 'Gue... gue sebenernya udah rangkum, tapi belum diketik,' suaranya nyaris tak terdengar di antara dengung AC.",
      choices: [
        { text: "Senyum lega: 'Nah, kan ada progres.'", nextId: "EP3_INTRO", delta: { echo: 1, dimas: 1 } },
        { text: "Ajak mereka istirahat minum es teh dulu.", nextId: "EP3_INTRO", delta: { nara: 2, salsa: 1, dimas: 1 } },
        { text: "Langsung bagi tugas mengetik.", nextId: "EP3_INTRO", delta: { salsa: 2, echo: 0 } }
      ]
    },
    EP2_SILENT: {
      text: "Echo berbisik: 'Bukan urusanmu. Jangan cari masalah.' Kamu menunduk lebih dalam ke buku yang belum dibuka. Salsa membentak Dimas lagi, 'Lo tuh niat sekolah nggak sih - !'\n\nDimas tidak menjawab. Dia berdiri, mengemasi tasnya dengan tangan gemetar, dan pergi begitu saja. Nara mengejarnya. Kelompok bubar dengan perasaan tidak enak yang menggantung di udara.",
      choices: [
        { text: "Pulang dengan rasa bersalah yang berat.", nextId: "EP3_INTRO", delta: { echo: -2 } },
        { text: "Chat Nara: 'Gimana Dimas - '", nextId: "EP3_INTRO", delta: { nara: 1 } },
        { text: "Masa bodoh, kerjakan sendiri.", nextId: "EP3_INTRO", delta: { echo: -3, salsa: 1 } }
      ]
    },
    EP2_DEFEND_DIMAS: {
      text: "'Dimas udah kerjain bagiannya kok, gue liat tadi,' kamu berbohong demi melindunginya. Dimas kaget, matanya membulat. Salsa cemberut, melipat tangan di dada. 'Oke, awas aja kalo nggak selesai.'\n\nSetelah Salsa pergi ke toilet, Dimas berbisik, 'Makasih...' suaranya serak, seolah kata itu jarang ia gunakan.",
      choices: [
        { text: "'Sama-sama. Tapi beneran kerjain ya.'", nextId: "EP3_INTRO", delta: { dimas: 2, echo: 1 } },
        { text: "Tepuk bahunya dan senyum.", nextId: "EP3_INTRO", delta: { dimas: 3, echo: 2 } }
      ]
    },
    EP2_SUPPORT_SALSA: {
      text: "'Kita harus ngebut emang, deadline besok,' katamu tegas. Salsa merasa didukung dan mengangguk antusias. 'Tuh dengerin!' katanya tajam.\n\nDimas semakin menunduk, tubuhnya terlihat kecil di kursi perpustakaan. Dia tidak bicara sepatah kata pun sampai pertemuan selesai.",
      choices: [
        { text: "Lanjut ke Episode 3.", nextId: "EP3_INTRO", delta: { salsa: 2, dimas: -1 } }
      ]
    },

    // --- EPISODE 3: RUMAH YANG SUNYI ---
    EP3_INTRO: {
      text: "EPISODE 3: RUMAH YANG SUNYI\n\nMalam hari. Kamu pulang ke rumah yang besar tapi terasa kosong. Lampu ruang tengah menyala, tapi tidak ada suara TV atau obrolan. Hanya bau sup hangat yang menggantung tanpa cerita.\n\nMakan malam dengan orang tua. Hanya ada suara denting sendok beradu dengan piring keramik. Ayah sibuk dengan tabletnya, Ibu membalas chat di HP.\n\n'Gimana sekolah barumu - ' tanya Ibu tiba-tiba, tanpa menoleh dari layarnya.",
      choices: [
        { text: "'Biasa aja. Nggak ada yang spesial.'", nextId: "EP3_DINNER_COLD", delta: { echo: -2 } },
        { text: "'Ada temen baru, namanya Nara. Dia lucu.'", nextId: "EP3_DINNER_WARM", delta: { echo: 2 } },
        { text: "Angkat bahu saja, malas bicara.", nextId: "EP3_DINNER_COLD", delta: { echo: -1 } },
        { text: "'Capek. Tugas numpuk.'", nextId: "EP3_DINNER_COLD", delta: { echo: -1 } }
      ]
    },
    EP3_DINNER_COLD: {
      text: "Ibu hanya mengangguk pelan. 'Baguslah kalau nggak ada masalah. Jangan bikin ulah ya.'\n\nPercakapan mati sebelum sempat hidup. Echo berbisik di telingamu, suaranya dingin: 'Lihat -  Mereka tidak benar-benar ingin tahu tentangmu. Mereka cuma basa-basi.'",
      choices: [
        { text: "Masuk kamar dan kunci pintu.", nextId: "EP3_ROOM", delta: { echo: -1 } },
        { text: "Nyalakan TV keras-keras untuk memecah sunyi.", nextId: "EP3_ROOM", delta: { echo: 0 } },
        { text: "Menangis diam-diam di kamar mandi.", nextId: "EP3_ROOM", delta: { echo: 1 } }
      ]
    },
    EP3_DINNER_WARM: {
      text: "Ibu meletakkan HP-nya sebentar. Dia menatapmu, benar-benar menatapmu. 'Oh ya -  Bagus dong kalau udah punya temen. Ajak main ke rumah kapan-kapan.'\n\nSenyum tipis terbit di wajahnya. Koneksi kecil itu rapuh, tapi hangat seperti selimut yang baru ditarik ke bahu.",
      choices: [
        { text: "Cerita lebih banyak soal tugas kelompok.", nextId: "EP3_ROOM", delta: { echo: 3 } },
        { text: "Sudahi sebelum canggung, lalu makan.", nextId: "EP3_ROOM", delta: { echo: 1 } },
        { text: "Tanya balik: 'Ibu gimana kerjanya - '", nextId: "EP3_ROOM", delta: { echo: 2 } }
      ]
    },
    EP3_ROOM: {
      text: "Di kamarmu, kamu menatap cermin. Bayanganmu sendiri menatap balik, berkedip dengan jeda yang sama. Sunyi sekali.\n\nEcho: 'Kau sendirian. Selalu begitu. Dan itu lebih baik. Tidak ada yang bisa menyakitimu di sini.'",
      choices: [
        { text: "Buka HP, lihat foto profil teman-teman.", nextId: "EP4_INTRO", delta: { echo: 1 } },
        { text: "Matikan lampu, tidur dalam gelap.", nextId: "EP4_INTRO", delta: { echo: -2 } },
        { text: "Bisikkan pada diri sendiri: 'Gue nggak mau sendiri.'", nextId: "EP4_INTRO", delta: { echo: 3 } }
      ]
    },

    // --- EPISODE 4: SAAT KITA SALING MEMBUKA ---
    EP4_INTRO: {
      text: "EPISODE 4: SAAT KITA SALING MEMBUKA\n\nBeberapa minggu kemudian. Ujian semester semakin dekat. Tekanan di sekolah terasa mencekik seperti kerah seragam yang terlalu ketat.\n\nKamu naik ke atap sekolah untuk mencari udara segar. Di sana, di sudut tersembunyi dekat tangki air, seseorang duduk memeluk lutut. Bahunya berguncang pelan.",
      choices: [
        { text: "Itu Nara. (Dekati dia)", nextId: "EP4_COMFORT_NARA", delta: { nara: 1 } },
        { text: "Itu Dimas. (Dekati dia)", nextId: "EP4_COMFORT_DIMAS", delta: { dimas: 1 } },
        { text: "Itu Salsa. (Dekati dia)", nextId: "EP4_COMFORT_SALSA", delta: { salsa: 1 } },
        { text: "Mundur perlahan, jangan ganggu.", nextId: "EP5_INTRO", delta: { echo: -2 } }
      ]
    },
    EP4_COMFORT_NARA: {
      text: "Nara terkejut saat melihatmu. Dia buru-buru menghapus air matanya, mencoba menempelkan lagi topeng cerianya yang biasa. 'Eh, hai! Gue... gue cuma kelilipan.'\n\nTapi matanya merah dan bengkak. 'Gue capek,' bisiknya akhirnya, pertahanannya runtuh. 'Semua orang ngira gue happy terus. Padahal gue capek harus selalu jadi badut biar orang lain seneng.'",
      choices: [
        { text: "'Nggak apa-apa sedih kok. Lo manusia.'", nextId: "EP5_INTRO", delta: { nara: 3, echo: 2 } },
        { text: "Duduk diam di sebelahnya, menemani.", nextId: "EP5_INTRO", delta: { nara: 2, echo: 1 } },
        { text: "Cerita masalahmu juga biar adil.", nextId: "EP5_INTRO", delta: { nara: 4, echo: 3 } }
      ]
    },
    EP4_COMFORT_DIMAS: {
      text: "Dimas sedang merobek-robek kertas sketsanya. Dia kaget setengah mati saat kamu datang. 'Jangan liat!' serunya spontan.\n\nSobekan gambar-gambar indah itu berserakan seperti kepingan hati. 'Gue... gue ngerasa nggak ada gunanya,' suaranya bergetar. 'Orang tua gue mau gue masuk IPA, jadi dokter. Gambar gue dibilang sampah.'",
      choices: [
        { text: "'Gambar lo itu nyawa lo, Dim. Jangan berhenti.'", nextId: "EP5_INTRO", delta: { dimas: 3, echo: 2 } },
        { text: "Bantu pungut sobekan kertasnya.", nextId: "EP5_INTRO", delta: { dimas: 2, echo: 1 } },
        { text: "Duduk diam mendengarkan.", nextId: "EP5_INTRO", delta: { dimas: 1, echo: 0 } }
      ]
    },
    EP4_COMFORT_SALSA: {
      text: "Salsa menelepon dengan suara tinggi menahan tangis, lalu membanting HP-nya ke lantai sampai casingnya mental. Dia melihatmu dan langsung membuang muka.\n\n'Apa lo liat-liat - !' bentaknya, tapi air mata mengalir deras. 'Nilai gue turun satu poin. Satu poin! Dan bokap gue udah ngancem bakal sita semua fasilitas gue. Gue harus sempurna, atau gue nggak dianggap.'",
      choices: [
        { text: "'Nilai bukan segalanya, Sal. Lo lebih dari angka.'", nextId: "EP5_INTRO", delta: { salsa: 2, echo: 1 } },
        { text: "Ambilkan HP-nya dan cek kondisinya.", nextId: "EP5_INTRO", delta: { salsa: 3, echo: 2 } },
        { text: "Dengarkan keluhannya sampai habis.", nextId: "EP5_INTRO", delta: { salsa: 2, echo: 1 } }
      ]
    },

    // --- EPISODE 5: YANG INGIN KITA SAMPAIKAN ---
    EP5_INTRO: {
      text: "EPISODE 5: YANG INGIN KITA SAMPAIKAN\n\nHari terakhir semester. Raport akan dibagikan. Koridor riuh rendah, tapi kepalamu bising oleh satu suara.\n\nEcho bersuara keras, lebih keras dari biasanya: 'Jangan berharap lebih. Nanti sakit. Lihat mereka -  Mereka akan melupakanmu saat liburan. Kembali ke cangkangmu. Di sana aman.'\n\nNamun hatimu, yang sudah pernah disentuh orang lain, menolak diam.",
      choices: [
        { text: "Lawan Echo. Teriak dalam hati: 'GUE MAU BAHAGIA!'", nextId: "EP5_CONFRONTATION", delta: { echo: 5 } },
        { text: "Terima Echo. 'Lo bener. Sendiri itu aman.'", nextId: "FINALE_CHECK", delta: { echo: -5 } },
        { text: "Abaikan Echo, cari teman-temanmu.", nextId: "EP5_FRIENDS", delta: { echo: 2 } }
      ]
    },
    EP5_CONFRONTATION: {
      text: "Kamu berhenti di tengah koridor. Menutup mata. Mengambil napas panjang.\n\n'Gue nggak butuh aman,' batinmu melawan. 'Gue butuh hidup. Gue butuh rasa sakit, rasa senang, rasa kecewa. Itu artinya gue manusia.'\n\nEcho terdiam. Suaranya mengecil, berubah dari monster menjadi anak kecil yang ketakutan. 'Tapi... kalau kita terluka gimana - '",
      choices: [
        { text: "'Kita sembuhin bareng-bareng.'", nextId: "FINALE_CHECK", delta: { echo: 5 } },
        { text: "'Itu risiko yang gue ambil.'", nextId: "FINALE_CHECK", delta: { echo: 4 } }
      ]
    },
    EP5_FRIENDS: {
      text: "Kamu melihat Nara, Dimas, dan Salsa sedang berkumpul di dekat mading. Mereka tertawa, napas mereka membentuk dunia kecil yang ingin kamu masuki.\n\nEcho: 'Jangan. Berhenti.'\n\nKamu terus berjalan.",
      choices: [
        { text: "Sapa mereka dengan lantang.", nextId: "FINALE_CHECK", delta: { echo: 3, nara: 1, dimas: 1, salsa: 1 } }
      ]
    },

    // --- FINALE LOGIC NODE (Handled by Engine) ---
    FINALE_CHECK: {
      text: "Calculating Ending...",
      choices: [] // Engine will redirect based on stats
    },

    // --- ENDINGS ---
    END_SOFT_HEALING: {
      text: "FINALE: SOFT HEALING\n\nLiburan tiba. Kamu di rumah, membantu Ibu memotong sayur di dapur. Tidak ada obrolan berat, hanya cerita ringan tentang harga cabai dan tetangga sebelah.\n\nTapi suasananya beda. Lebih cair. Kamu berani tertawa kecil. Echo tidak hilang sepenuhnya; dia masih ada, duduk manis di sudut pikiranmu, tapi tidak lagi memerintah. Dia kini seperti teman lama yang cerewet tapi ingin kamu selamat.\n\nKamu belajar bahwa menyembuhkan diri sendiri dimulai dari keberanian untuk tidak menutup pintu kamar.",
      choices: [{ text: "Selesai.", nextId: "BEGIN", delta: {} }, { text: "Replay.", nextId: "BEGIN", delta: {} }]
    },
    END_CONNECTED: {
      text: "FINALE: CONNECTED\n\n'Woy! Jadi nggak nonton - ' Nara melambai dari kejauhan. Dimas dan Salsa sudah menunggu di gerbang sekolah dengan tiket di tangan.\n\nKamu berlari menghampiri mereka. Tawa kalian pecah di udara sore yang lembab. Kamu merasa... terlihat. Kamu merasa menjadi bagian dari sesuatu.\n\nEcho diam. Benar-benar diam. Atau mungkin, suaranya kini telah berpadu dengan suara tawa teman-temanmu, menjadi harmoni yang indah. Kamu tidak sendirian lagi.",
      choices: [{ text: "Selesai.", nextId: "BEGIN", delta: {} }, { text: "Replay.", nextId: "BEGIN", delta: {} }]
    },
    END_AMBIGUOUS: {
      text: "FINALE: AMBIGUOUS\n\nSemester berakhir. Kamu tersenyum tipis pada teman-temanmu saat berpapasan di gerbang, lalu berjalan pulang sendirian.\n\nAda harapan. Kamu tahu kamu bisa berteman kalau kamu mau. Tapi hari ini, kamu memilih untuk pulang dan istirahat. Mungkin semester depan akan lebih baik. Mungkin nanti kamu akan lebih berani.\n\nUntuk sekarang, 'baik-baik saja' sudah cukup, seperti menarik napas sebelum menyelam lagi.",
      choices: [{ text: "Selesai.", nextId: "BEGIN", delta: {} }, { text: "Replay.", nextId: "BEGIN", delta: {} }]
    },
    END_ISOLATED: {
      text: "FINALE: ISOLATED\n\nKamu berjalan keluar gerbang sendirian, earphone terpasang rapat, volume maksimal. Lagu favoritmu mengalun, meredam bising dunia.\n\nNara, Dimas, dan Salsa tertawa di kejauhan. Mereka tampak seperti dunia yang berbeda, dunia yang tidak bisa kamu sentuh.\n\n'Kita aman di sini,' bisik Echo lembut, memelukmu erat dalam kesendirian. 'Mereka cuma bakal nyakitin kita.'\n\nDan untuk pertama kalinya, kamu setuju sepenuhnya. Kamu berjalan menjauh, aman, tapi sangat, sangat sepi.",
      choices: [{ text: "Selesai.", nextId: "BEGIN", delta: {} }, { text: "Replay.", nextId: "BEGIN", delta: {} }]
    }
  };

  class GameState {
    constructor(initialScene = "intro") {
      this.scene = initialScene;
      this.relationship = { nara: 0, dimas: 0, salsa: 0, echo: 0 };
      this.choiceHistory = [];
    }

    rememberChoice(text) {
      if (!text) return;
      this.choiceHistory.push(text);
    }

    applyDelta(delta) {
      if (!delta) return;
      for (const [key, value] of Object.entries(delta)) {
        if (this.relationship[key] !== undefined) {
          this.relationship[key] += value;
        }
      }
    }
    
    determineEnding() {
      const { nara, dimas, salsa, echo } = this.relationship;
      const totalSocial = nara + dimas + salsa;
      
      if (echo <= -5) return "END_ISOLATED";
      if (totalSocial >= 8) return "END_CONNECTED";
      if (echo >= 5) return "END_SOFT_HEALING";
      return "END_AMBIGUOUS";
    }
  }

  class StoryEngine {
    constructor({ gameState }) {
      this.gameState = gameState;
    }

    async requestStoryBeat(nodeId) {
      await new Promise(resolve => setTimeout(resolve, 600));

      // Handle Finale Logic
      if (nodeId === "FINALE_CHECK") {
        const endingNodeId = this.gameState.determineEnding();
        nodeId = endingNodeId;
      }

      const node = STORY_TREE[nodeId] || STORY_TREE.BEGIN;
      
      const choices = node.choices.map(c => c.text);
      this.currentChoices = node.choices;

      return {
        response: node.text,
        prompt: "Apa yang kamu lakukan - ",
        scene: "static",
        relationship_delta: 0,
        choices: choices,
        id: nodeId
      };
    }

    getNextNodeId(choiceIndex) {
      if (this.currentChoices && this.currentChoices[choiceIndex]) {
        return this.currentChoices[choiceIndex];
      }
      return null;
    }
  }
  class StoryUI {
    constructor({
      logEl,
      choicesEl,
      statusEl,
      notificationEl,
      progressEl
    }) {
      this.logEl = logEl;
      this.choicesEl = choicesEl;
      this.statusEl = statusEl;
      this.notificationEl = notificationEl;
      this.progressEl = progressEl;
      this.awaitingChoice = false;
      this.currentChoices = [];
      this.choiceHandler = null;
      this.lastChoiceText = "";
    }

    addMessage(text, role = "game") {
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.textContent = text;
      this.logEl.appendChild(div);
      this.scrollToBottom();
    }

    showNotification(text) {
      if (!this.notificationEl) return;
      this.notificationEl.textContent = text;
      this.notificationEl.classList.add("show");
      setTimeout(() => {
        this.notificationEl.classList.remove("show");
      }, 4000);
    }

    setStatus(text) {
      this.statusEl.textContent = text;
    }

    setProgress(text) {
      if (!this.progressEl) return;
      this.progressEl.textContent = text;
    }

    setLastChoice(choiceText) {
      this.lastChoiceText = choiceText || "";
    }

    renderChoices(choices) {
      this.currentChoices = Array.isArray(choices)
        ? choices.filter((choice) => typeof choice === "string" && choice.trim())
        : [];
      this.choicesEl.innerHTML = "";
      if (!this.currentChoices.length) {
        this.clearChoices("Echo is thinking...");
        return;
      }
      this.awaitingChoice = true;
      this.choicesEl.classList.remove("empty");
      const fragment = document.createDocumentFragment();
      this.currentChoices.forEach((choiceText, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-btn";
        button.textContent = `${index + 1}. ${choiceText}`;
        if (this.lastChoiceText === choiceText) {
          button.classList.add("last-picked");
          button.setAttribute("aria-pressed", "true");
        }
        button.addEventListener("click", () => {
          if (this.choiceHandler) {
            this.choiceHandler(index, this.currentChoices[index]);
          }
        });
        fragment.appendChild(button);
      });
      this.choicesEl.appendChild(fragment);
      this.scrollToBottom();
    }

    clearChoices(message = "Echo is thinking...") {
      this.awaitingChoice = false;
      this.currentChoices = [];
      this.choicesEl.classList.add("empty");
      this.choicesEl.textContent = message;
    }

    onChoice(handler) {
      this.choiceHandler = handler;
    }

    isAwaitingChoice() {
      return this.awaitingChoice;
    }

    scrollToBottom() {
      if (!this.logEl) return;
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }
  }
  class EchoStoryApp {
    constructor() {
      this.gameState = new GameState();
      this.ui = new StoryUI({
        logEl: document.getElementById("log"),
        choicesEl: document.getElementById("choices"),
        statusEl: document.getElementById("status"),
        notificationEl: document.getElementById("notification-area"),
        progressEl: document.getElementById("progress-chip")
      });
      this.engine = new StoryEngine({
        gameState: this.gameState
      });
      this.isProcessingTurn = false;
      this.registerHandlers();
      this.startStory();
    }

    registerHandlers() {
      this.ui.onChoice((index, text) => this.handleChoiceSelection(index, text));
    }

    handleChoiceSelection(index, choiceText) {
      if (!choiceText || this.isProcessingTurn) {
        return;
      }
      
      this.ui.clearChoices("Echo is considering your choice...");
      this.ui.addMessage(`You pick: ${choiceText}`, "player");
      this.ui.setLastChoice(choiceText);
      this.gameState.rememberChoice(choiceText);
      
      // Get the next node ID from the engine based on the choice index
      const nextNodeId = this.engine.getNextNodeId(index);
      
      // Apply relationship delta if available
      if (nextNodeId && nextNodeId.delta) {
        this.gameState.applyDelta(nextNodeId.delta);
        
        // Check for significant relationship changes to show notification
        const deltas = nextNodeId.delta;
        if (deltas.nara > 0) this.ui.showNotification("Nara merasa dihargai.");
        if (deltas.nara < 0) this.ui.showNotification("Nara merasa diabaikan.");
        if (deltas.dimas > 0) this.ui.showNotification("Dimas merasa didengar.");
        if (deltas.salsa > 0) this.ui.showNotification("Salsa merasa didukung.");
        if (deltas.echo > 0) this.ui.showNotification("Echo: 'Bagus. Terbuka.'");
        if (deltas.echo < 0) this.ui.showNotification("Echo: 'Hati-hati. Tutup dirimu.'");
      }

      this.runStoryTurn(nextNodeId ? nextNodeId.nextId : "BEGIN");
    }

    async runStoryTurn(nodeId) {
      if (this.isProcessingTurn) {
        return;
      }

      this.isProcessingTurn = true;
      this.ui.clearChoices("Echo is considering your move...");
      this.ui.setStatus("Echo is thinking...");

      try {
        const payload = await this.engine.requestStoryBeat(nodeId);
        
        this.ui.addMessage(payload.response, "game");
        this.ui.renderChoices(payload.choices);
        this.ui.setProgress(this.deriveProgressLabel(payload.id || nodeId));
        this.ui.scrollToBottom();
      } catch (error) {
        console.error(error);
        this.ui.addMessage("Story engine error: " + error.message, "system");
        this.ui.showNotification("Koneksi cerita terganggu. Coba lagi.");
        this.ui.renderChoices(["Retry"]);
      } finally {
        this.isProcessingTurn = false;
        this.ui.setStatus("Idle");
      }
    }

    startStory() {
      this.ui.addMessage("You step into SMA Harapan Bangsa and breathe in the humid morning air.", "game");
      this.ui.setStatus("Echo is setting the scene...");
      this.ui.setProgress(this.deriveProgressLabel("BEGIN"));
      this.runStoryTurn("BEGIN");
    }

    deriveProgressLabel(nodeId) {
      if (!nodeId) return "Episode";
      const episodeMatch = nodeId.match(/EP(\d+)/);
      const episode = episodeMatch ? `Episode ${episodeMatch[1]}` : nodeId === "BEGIN" ? "Episode 1" : "Finale";
      const map = {
        BEGIN: "Gerbang",
        EP1_CORRIDOR: "Koridor",
        EP1_CORRIDOR_SHY: "Koridor",
        EP1_CORRIDOR_ISOLATED: "Koridor",
        EP1_CORRIDOR_FRIENDLY: "Koridor",
        EP1_CLASS: "Kelas",
        EP1_CLASS_WITH_NARA: "Kelas",
        EP1_CLASS_INTERACTION: "Kelas",
        EP1_CLASS_END: "Gerbang",
        EP2_INTRO: "Perpustakaan",
        EP3_INTRO: "Rumah",
        EP3_ROOM: "Kamar",
        EP4_INTRO: "Atap",
        EP5_INTRO: "Koridor",
        FINALE_CHECK: "Finale",
        END_SOFT_HEALING: "Finale",
        END_CONNECTED: "Finale",
        END_AMBIGUOUS: "Finale",
        END_ISOLATED: "Finale"
      };
      const location = map[nodeId] || nodeId.replace(/_/g, " ").toLowerCase();
      return `${episode} - ${location.charAt(0).toUpperCase()}${location.slice(1)}`;
    }
  }

  new EchoStoryApp();
})();



