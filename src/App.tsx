 import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

import { 
  BookOpen, Gamepad2, HelpCircle, HeartHandshake, Award, Flame, 
  CheckCircle, ChevronRight, Play, RefreshCw, Sparkles, ArrowRight, 
  BarChart2, Cpu, Database, Search, Share2, Layers, Code, ShieldCheck, 
  Brain, FileText, Check, X, Info, Trophy, Star, User, Moon, Sun, Clock,
  Users, GraduationCap, Eye, FileCheck, Key, Settings, Lock, Unlock, CheckSquare,
  AlertTriangle, UserCheck, Layers3, LogIn, EyeOff, ShieldAlert, Send,
  ThumbsUp, RotateCcw, Zap, Printer, Filter, UserPlus, FileSpreadsheet, XCircle,
  Cloud, Globe, ExternalLink, Download
} from 'lucide-react';

// Fallback aman jika aplikasi dijalankan di Vercel / GitHub tanpa environment variable Canvas
const defaultFirebaseConfig = {
  apiKey: "AIzaSyDemoKeyForPublicLMSDeploymentOnly",
  authDomain: "lms-informatika-sma.firebaseapp.com",
  projectId: "lms-informatika-sma",
  storageBucket: "lms-informatika-sma.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:demo1234567890"
};

let firebaseConfig = defaultFirebaseConfig;

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    firebaseConfig = JSON.parse(__firebase_config);
  }
} catch (e) {
  console.log("Menggunakan fallback Firebase config standar untuk deployment cloud");
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'lms-informatika-kelas10-default';

const MOCK_STUDENTS = [
  { id: "101", name: "Ahmad Rizky", kelas: "X - A", level: 3, xp: 520, completed: [1, 2, 3], testScores: { 1: 88, 2: 90, 3: 85 }, finalExamScore: null, status: "Aktif" },
  { id: "102", name: "Siti Nurhaliza", kelas: "X - A", level: 4, xp: 740, completed: [1, 2, 3, 4, 5, 6], testScores: { 1: 94, 2: 90, 3: 92, 4: 88, 5: 96, 6: 90 }, finalExamScore: 93, status: "Sangat Baik" },
  { id: "103", name: "Bagus Pratama", kelas: "X - B", level: 2, xp: 310, completed: [1], testScores: { 1: 70 }, finalExamScore: null, status: "Perlu Pendampingan" },
  { id: "104", name: "Dina Fitriani", kelas: "X - B", level: 3, xp: 480, completed: [1, 2], testScores: { 1: 82, 2: 80 }, finalExamScore: null, status: "Aktif" }
];

const CURRICULUM_DATA = [
  {
    id: 1,
    title: "Literasi Informasi & Digital",
    subtitle: "Mesin Pencari Lanjutan, Membaca Lateral & Periksa Fakta",
    icon: Search,
    color: "from-blue-600 to-cyan-500",
    badge: "Info Detective",
    materials: [
      {
        title: "Pencarian Lanjutan dengan Operator Boolean",
        content: "Mesin pencari seperti Google menyediakan sintaks khusus untuk menyaring informasi dengan presisi tinggi. Operator seperti 'site:', 'filetype:', dan frasa persis dengan tanda petik ganda (\") memungkinkan siswa menemukan dokumen ilmiah tanpa terdistraksi oleh konten promosi."
      },
      {
        title: "Teknik Membaca Lateral (Lateral Reading)",
        content: "Membaca lateral adalah teknik verifikasi yang digunakan oleh pemeriksa fakta profesional. Alih-alih hanya membaca secara vertikal ke bawah pada satu halaman web, pembaca membuka tab baru untuk memeriksa reputasi penulis dan sumber di situs independen lainnya."
      },
      {
        title: "Metodologi Cek Fakta & Deteksi Hoaks",
        content: "Proses verifikasi hoaks melibatkan pemeriksaan narasumber, tanggal rilis, dan pencarian gambar terbalik (Reverse Image Search) menggunakan Google Lens untuk mengetahui konteks asli dari sebuah gambar."
      }
    ],
    sampleQuestions: [
      {
        id: "sq1_1", type: "pg_single",
        q: "Sintaks pencarian Google untuk menemukan jurnal ilmiah format PDF khusus dari web resmi pemerintah (.go.id) adalah...",
        options: [
          "filetype:pdf site:go.id \"Artificial Intelligence\"",
          "search:pdf domain:go.id Artificial Intelligence",
          "ext:pdf go.id Artificial Intelligence",
          "site:go.id +pdf \"Artificial Intelligence\"",
          "Artificial Intelligence file:pdf site.go.id"
        ],
        answer: 0,
        explanation: "Operator 'filetype:pdf' membatasi berkas PDF dan 'site:go.id' membatasi domain resmi pemerintah Indonesia."
      },
      {
        id: "sq1_2", type: "pg_single",
        q: "Teknik verifikasi informasi dengan membuka tab peramban baru untuk menelusuri kredibilitas penulis disebut...",
        options: ["Membaca Vertikal", "Membaca Lateral", "Membaca Diagnostik", "Skimming Digital", "Scanning Informasi"],
        answer: 1,
        explanation: "Membaca lateral dilakukan dengan menelusuri sumber independen di tab terpisah."
      },
      {
        id: "sq1_3", type: "pg_multi",
        q: "Pilihlah TIGA tindakan paling tepat untuk memverifikasi kebenaran berita di internet! (Pilih 3)",
        options: [
          "Melakukan Reverse Image Search pada foto berita",
          "Mengecek kredibilitas situs di periksa fakta resmi (CekFakta.com)",
          "Memeriksa kejelasan tanggal dan narasumber berita",
          "Langsung menyebarkan ke grup obrolan agar orang lain waspada",
          "Percaya berita jika gambar latarnya tampak mewah"
        ],
        answers: [0, 1, 2],
        explanation: "Tindakan terverifikasi meliputi pencarian gambar terbalik, cek portal periksa fakta, dan verifikasi narasumber/tanggal."
      },
      {
        id: "sq1_4", type: "isian",
        q: "Judul berita hiperbola dan provokatif yang dibuat hanya untuk mendulang klik pembaca dinamakan...",
        answer: "Clickbait",
        explanation: "Clickbait atau umpan klik dirancang menarik perhatian pemirsa tanpa memperhatikan kebenaran konten."
      },
      {
        id: "sq1_5", type: "tf_statements",
        q: "Evaluasilah kebenaran dari tiga pernyataan literasi digital berikut:",
        statements: [
          { text: "Operator 'site:ac.id' menyaring hasil pencarian khusus kampus di Indonesia.", isTrue: true },
          { text: "Tanda petik ganda (\") digunakan untuk menghapus kata kunci dari hasil pencarian.", isTrue: false },
          { text: "Reverse Image Search membantu mendeteksi rekayasa foto dan lokasi asli gambar.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR (domain ac.id). Pernyataan 2 SALAH (tanda petik untuk frasa persis). Pernyataan 3 BENAR."
      }
    ],
    moduleTest: [
      {
        id: "mt1_1", type: "pg_single",
        q: "Operator pencarian Google yang digunakan untuk mengecualikan kata kunci tertentu adalah...",
        options: ["AND", "OR", "Minus (-)", "NOT", "site:"],
        answer: 2,
        explanation: "Simbol minus (-) digunakan untuk membuang kata yang tidak diinginkan dalam pencarian."
      },
      {
        id: "mt1_2", type: "pg_single",
        q: "Domain tingkat atas yang paling terpercaya untuk referensi akademik di Indonesia adalah...",
        options: [".com", ".ac.id", ".org", ".net", ".xyz"],
        answer: 1,
        explanation: ".ac.id diperuntukkan resmi bagi institusi akademis perguruan tinggi Indonesia."
      },
      {
        id: "mt1_3", type: "pg_single",
        q: "Ciri utama dari berita hoaks yang paling sering ditemukan adalah...",
        options: ["Menggunakan judul provokatif dan meminta disebarkan", "Mencantumkan tanggal rilis yang jelas", "Merujuk pada jurnal ilmiah terindeks", "Ditulis oleh wartawan bersertifikasi", "Menyajikan data statistik transparan"],
        answer: 0,
        explanation: "Hoaks umumnya memakai judul heboh provokatif dan ajakan menyebarkan."
      },
      {
        id: "mt1_4", type: "pg_multi",
        q: "Pilihlah TIGA domain situs resmi yang berintegritas tinggi di Indonesia! (Pilih 3)",
        options: [".go.id (Pemerintah)", ".ac.id (Akademik)", ".mil.id (Militer)", ".blogspot.com (Blog Gratis)", ".wordpress.com (Blog Publik)"],
        answers: [0, 1, 2],
        explanation: "Domain .go.id, .ac.id, dan .mil.id memerlukan verifikasi identitas resmi."
      },
      {
        id: "mt1_5", type: "pg_multi",
        q: "Pilihlah TIGA ciri dari artikel ilmiah tepercaya! (Pilih 3)",
        options: [
          "Memiliki daftar pustaka / sitasi yang jelas",
          "Ditinjau oleh sejawat (Peer-reviewed)",
          "Mencantumkan nama dan afiliasi penulis",
          "Banyak menyajikan iklan banner pop-up",
          "Tidak memiliki tanggal publikasi"
        ],
        answers: [0, 1, 2],
        explanation: "Artikel ilmiah dicirikan oleh daftar pustaka, proses peer-review, serta identitas penulis yang jelas."
      },
      {
        id: "mt1_6", type: "pg_multi",
        q: "Pilihlah TIGA dampak negatif dari penyebaran berita hoaks! (Pilih 3)",
        options: [
          "Kepanikan publik yang tidak bersumber",
          "Kerugian finansial akibat penipuan digital",
          "Polarisasi dan konflik sosial di masyarakat",
          "Meningkatnya literasi sains pembaca",
          "Terciptanya iklim komunikasi yang sehat"
        ],
        answers: [0, 1, 2],
        explanation: "Dampak negatif hoaks mencakup kepanikan, penipuan, dan konflik sosial."
      },
      {
        id: "mt1_7", type: "isian",
        q: "Proses mencari konteks foto dengan mengunggah gambar ke mesin pencari disebut Reverse Image...",
        answer: "Search",
        explanation: "Istilah teknisnya adalah Reverse Image Search."
      },
      {
        id: "mt1_8", type: "isian",
        q: "Etika dan aturan bertata krama dalam berkomunikasi di jaringan internet dikenal dengan istilah...",
        answer: "Netiquette",
        explanation: "Netiquette singkatan dari Network Etiquette."
      },
      {
        id: "mt1_9", type: "tf_statements",
        q: "Evaluasilah tiga pernyataan kebiasaan berinternet berikut:",
        statements: [
          { text: "Membaca berita hanya dari judulnya saja sudah cukup untuk mengambil kesimpulan.", isTrue: false },
          { text: "Situs periksa fakta CekFakta.com diinisiasi oleh konsorsium media terpercaya.", isTrue: true },
          { text: "Semua informasi di internet yang menempati urutan teratas Google pasti benar.", isTrue: false }
        ],
        explanation: "Pernyataan 1 SALAH. Pernyataan 2 BENAR. Pernyataan 3 SALAH (iklan / SEO bisa berada di atas)."
      },
      {
        id: "mt1_10", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan keamanan informasi berikut:",
        statements: [
          { text: "Mengklik tautan asing yang dikirim nomor tak dikenal berbahaya bagi data pribadi.", isTrue: true },
          { text: "Fitur 'filetype:pdf' akan menampilkan berkas bertipe .docx dan .xlsx.", isTrue: false },
          { text: "Pemeriksaan tanggal publikasi penting untuk menghindari berita kadaluarsa.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR (phishing). Pernyataan 2 SALAH (pdf khusus berkas PDF). Pernyataan 3 BENAR."
      }
    ]
  },
  {
    id: 2,
    title: "Pengolahan Data Berkualitas",
    subtitle: "Siklus Pengolahan Data, GIGO & Data Cleaning",
    icon: Database,
    color: "from-emerald-600 to-teal-500",
    badge: "Data Sanitizer",
    materials: [
      {
        title: "Konsep Garbage In, Garbage Out (GIGO)",
        content: "GIGO adalah prinsip utama komputasi pengolahan data. Apabila data input yang dimasukkan mentah/kotor (mengandung kesalahan ketik, duplikat, atau outlier), maka analisis dan output yang dihasilkan akan keliru."
      },
      {
        title: "Tahapan Pembersihan Data (Data Cleaning)",
        content: "Proses pembersihan data meliputi penghapusan data duplikat (removing duplicates), penanganan nilai kosong (handling missing values), dan penyeragaman format data (standardization)."
      },
      {
        title: "Penanganan Pencilan (Outlier) & Imputasi",
        content: "Data pencilan adalah nilai ekstrem yang jauh berbeda dari mayoritas data. Imputasi adalah teknik mengisi nilai kosong menggunakan estimasi rata-rata statistik (mean/median)."
      }
    ],
    sampleQuestions: [
      {
        id: "sq2_1", type: "pg_single",
        q: "Dalam data tinggi siswa: 160cm, 165cm, 158cm, 1700cm, 162cm. Nilai '1700cm' dikategorikan sebagai...",
        options: ["Missing Value", "Outlier", "Data Duplikat", "Standardized Data", "Valid Entry"],
        answer: 1,
        explanation: "1700 cm merupakan angka pencilan ekstrem (outlier) akibat kesalahan input."
      },
      {
        id: "sq2_2", type: "pg_single",
        q: "Teknik mengisi data yang kosong (missing value) dengan nilai rata-rata statistik dinamakan...",
        options: ["Normalisasi", "Imputasi", "Duplikasi", "Filtering", "Eksportasi"],
        answer: 1,
        explanation: "Imputasi adalah teknik pengisian nilai kosong berdasarkan perhitungan statistik."
      },
      {
        id: "sq2_3", type: "pg_multi",
        q: "Pilihlah TIGA tahapan utama dalam proses Data Cleaning! (Pilih 3)",
        options: [
          "Removing Duplicates (Menghapus baris data ganda)",
          "Handling Missing Values (Mengolah nilai kosong)",
          "Data Standardization (Penyeragaman format data)",
          "Menginstal ulang peramban web",
          "Mengganti tema latar belakang laptop"
        ],
        answers: [0, 1, 2],
        explanation: "Data cleaning berfokus pada duplikasi, missing values, dan standardisasi format."
      },
      {
        id: "sq2_4", type: "isian",
        q: "Singkatan dari prinsip komputasi yang menyatakan bahwa input buruk menghasilkan output buruk adalah...",
        answer: "GIGO",
        explanation: "GIGO singkatan dari Garbage In, Garbage Out."
      },
      {
        id: "sq2_5", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan pengolahan data berikut:",
        statements: [
          { text: "Data duplikat sebaiknya dibiarkan agar jumlah sampel data menjadi lebih banyak.", isTrue: false },
          { text: "Proses pembersihan data dilakukan sebelum melakukan analisis data.", isTrue: true },
          { text: "Format tanggal yang konsisten (seperti YYYY-MM-DD) memudahkan analisis sistem.", isTrue: true }
        ],
        explanation: "Pernyataan 1 SALAH (duplikasi merusak validitas). Pernyataan 2 BENAR. Pernyataan 3 BENAR."
      }
    ],
    moduleTest: [
      {
        id: "mt2_1", type: "pg_single",
        q: "Data yang tidak konsisten formatnya akan menyulitkan proses...",
        options: ["Analisis Komputasi", "Penyimpanan Harddisk", "Pengunduhan File", "Koneksi Internet", "Cetak Printer"],
        answer: 0,
        explanation: "Inkonsistensi format data menggagalkan algoritma analisis otomatis."
      },
      {
        id: "mt2_2", type: "pg_single",
        q: "Siklus pengolahan data diawali dengan tahap...",
        options: ["Data Collection / Input", "Data Analysis", "Reporting", "Archiving", "Visualization"],
        answer: 0,
        explanation: "Pengolahan data selalu dimulai dari pengumpulan/input data mentah."
      },
      {
        id: "mt2_3", type: "pg_single",
        q: "Manakah contoh format tanggal yang terstandardisasi secara internasional?",
        options: ["YYYY-MM-DD", "DD-MMMM-YY", "MM/YY/DDDD", "Tgl-Bln-Thn", "Hari, Tanggal"],
        answer: 0,
        explanation: "ISO 8601 menetapkan standar YYYY-MM-DD."
      },
      {
        id: "mt2_4", type: "pg_multi",
        q: "Pilihlah TIGA kriteria utama data yang berkualitas tinggi! (Pilih 3)",
        options: [
          "Akurat (Sesuai kenyataan)",
          "Lengkap / Complete (Tidak ada nilai penting hilang)",
          "Konsisten (Format seragam)",
          "Ukuran file harus di atas 1 GB",
          "Disimpan dalam format ZIP saja"
        ],
        answers: [0, 1, 2],
        explanation: "Kualitas data diukur dari Akurasi, Kelengkapan, dan Konsistensi."
      },
      {
        id: "mt2_5", type: "pg_multi",
        q: "Pilihlah TIGA metode untuk menangani missing value! (Pilih 3)",
        options: [
          "Menghapus baris data yang kosong (Deletion)",
          "Mengisi nilai kosong dengan rata-rata (Mean Imputation)",
          "Mengisi nilai kosong dengan angka median (Median Imputation)",
          "Mengubah seluruh data menjadi teks acak",
          "Menutup aplikasi tanpa menyimpan"
        ],
        answers: [0, 1, 2],
        explanation: "Metode valid meliputi penghapusan baris, imputasi rata-rata, dan imputasi median."
      },
      {
        id: "mt2_6", type: "pg_multi",
        q: "Pilihlah TIGA contoh tipe data dasar pada pemrograman! (Pilih 3)",
        options: [
          "Integer (Bilangan Bulat)",
          "Float / Double (Bilangan Desimal)",
          "String (Teks / Karakter)",
          "Router",
          "Motherboard"
        ],
        answers: [0, 1, 2],
        explanation: "Integer, Float, dan String adalah tipe data variabel komputasi."
      },
      {
        id: "mt2_7", type: "isian",
        q: "Nilai data ekstrem yang melenceng jauh dari rata-rata data lainnya disebut...",
        answer: "Outlier",
        explanation: "Outlier adalah data pencilan."
      },
      {
        id: "mt2_8", type: "isian",
        q: "Penggabungan dua dataset berbeda menjadi satu tabel utuh dinamakan Merge atau Data...",
        answer: "Integration",
        explanation: "Data Integration adalah proses penggabungan berbagai sumber data."
      },
      {
        id: "mt2_9", type: "tf_statements",
        q: "Ujilah tiga pernyataan penanganan data berikut:",
        statements: [
          { text: "Data kotor tidak berdampak pada hasil keputusan bisnis berbasis AI.", isTrue: false },
          { text: "GIGO menegaskan pentingnya validasi data pada tahap input.", isTrue: true },
          { text: "Visualisasi grafik membantu mendeteksi keberadaan pencilan (outlier).", isTrue: true }
        ],
        explanation: "Pernyataan 1 SALAH. Pernyataan 2 BENAR. Pernyataan 3 BENAR."
      },
      {
        id: "mt2_10", type: "tf_statements",
        q: "Evaluasilah kebenaran tiga pernyataan tipe data berikut:",
        statements: [
          { text: "Tipe data Boolean hanya memiliki dua nilai: True atau False.", isTrue: true },
          { text: "Angka desimal seperti 3.14 disimpan menggunakan tipe data Integer.", isTrue: false },
          { text: "Pembersihan data dapat dikerjakan secara otomatis menggunakan skrip pemrograman.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 SALAH (desimal memakai Float). Pernyataan 3 BENAR."
      }
    ]
  },
  {
    id: 3,
    title: "Komunikasi & Kolaborasi Digital",
    subtitle: "Produktivitas Cloud, Lisensi CC & Kerja Tim",
    icon: Share2,
    color: "from-purple-600 to-pink-500",
    badge: "Digital Collaborator",
    materials: [
      {
        title: "Perangkat Produktivitas Berbasis Cloud",
        content: "Aplikasi produktivitas berbasis web (seperti Google Docs/Drive) memungkinkan pengguna berkolaborasi secara real-time. Fitur riwayat versi (Version History) menjaga pemulihan dokumen jika terjadi kesalahan pengetikan."
      },
      {
        title: "Kerja Tim Synchronous vs Asynchronous",
        content: "Kolaborasi Synchronous terjadi saat anggota tim bekerja bersamaan pada waktu nyata (misal: panggilan Zoom sambil mengedit file). Asynchronous terjadi saat anggota bekerja pada waktu terpisah melalui komentar dan tugas terencana."
      },
      {
        title: "Hak Cipta & Lisensi Creative Commons (CC)",
        content: "Creative Commons menyediakan standar lisensi terbuka bagi kreator digital. Elemen kunci meliputi BY (Attribution), NC (Non-Commercial), SA (ShareAlike), dan ND (NoDerivatives)."
      }
    ],
    sampleQuestions: [
      {
        id: "sq3_1", type: "pg_single",
        q: "Fitur pada aplikasi cloud yang berfungsi melacak riwayat revisi dokumen dan memulihkan versi lama adalah...",
        options: ["Auto-Save", "Version History", "Track Changes", "Cloud Backup", "Document Export"],
        answer: 1,
        explanation: "Version History menyimpan catatan revisi dari waktu ke waktu."
      },
      {
        id: "sq3_2", type: "pg_single",
        q: "Pola kolaborasi digital di mana anggota tim bekerja pada lokasi dan waktu berbeda disebut...",
        options: ["Synchronous", "Asynchronous", "Parallel", "Sequential", "Sistemik"],
        answer: 1,
        explanation: "Asynchronous adalah kolaborasi tidak serempak."
      },
      {
        id: "sq3_3", type: "pg_multi",
        q: "Pilihlah TIGA elemen utama dari lisensi Creative Commons (CC)! (Pilih 3)",
        options: [
          "BY (Attribution / Wajib mencantumkan pencipta)",
          "NC (Non-Commercial / Tidak untuk dijual)",
          "SA (ShareAlike / Berbagi dengan lisensi serupa)",
          "PR (Pay Royalty / Bayar tunai)",
          "EX (Exclusive / Dilarang dibagikan)"
        ],
        answers: [0, 1, 2],
        explanation: "Elemen dasar CC meliputi BY, NC, SA, dan ND."
      },
      {
        id: "sq3_4", type: "isian",
        q: "Etika dan sopan santun dalam berkomunikasi digital dinamakan...",
        answer: "Netiquette",
        explanation: "Netiquette adalah etika komunikasi digital."
      },
      {
        id: "sq3_5", type: "tf_statements",
        q: "Ujilah tiga pernyataan etika digital berikut:",
        statements: [
          { text: "Hak akses 'Viewer' pada Google Docs membolehkan pengguna mengubah teks.", isTrue: false },
          { text: "Bekerja mengetik dokumen saat rapat Zoom termasuk kolaborasi Synchronous.", isTrue: true },
          { text: "Lisensi CC-BY mengharuskan pengguna menyebutkan nama pencipta asli karya.", isTrue: true }
        ],
        explanation: "Pernyataan 1 SALAH (Viewer hanya bisa melihat). Pernyataan 2 BENAR. Pernyataan 3 BENAR."
      }
    ],
    moduleTest: [
      {
        id: "mt3_1", type: "pg_single",
        q: "Perangkat cloud storage milik Microsoft dinamakan...",
        options: ["Google Drive", "OneDrive", "Dropbox", "ICloud", "Mega"],
        answer: 1,
        explanation: "OneDrive adalah layanan cloud dari Microsoft."
      },
      {
        id: "mt3_2", type: "pg_single",
        q: "Pemberian akses dokumen dengan izin 'Editor' memungkinkan pengguna untuk...",
        options: ["Melihat saja", "Memberi komentar saja", "Mengedit, menghapus, dan menambah isi", "Mengunci file", "Membeli lisensi"],
        answer: 2,
        explanation: "Akses Editor memberikan kontrol penuh penyuntingan file."
      },
      {
        id: "mt3_3", type: "pg_single",
        q: "Simbol CC-NC pada lisensi Creative Commons berarti bahwa karya tersebut...",
        options: ["Boleh dijual bebas", "Dilarang digunakan untuk kepentingan komersial", "Tidak boleh diubah", "Harus berbayar", "Bebas klaim nama"],
        answer: 1,
        explanation: "NC singkatan dari Non-Commercial (Non-Komersial)."
      },
      {
        id: "mt3_4", type: "pg_multi",
        q: "Pilihlah TIGA keuntungan utama dari penggunaan aplikasi produktivitas cloud! (Pilih 3)",
        options: [
          "Dapat diakses dari berbagai perangkat mana saja",
          "Kolaborasi real-time tanpa bertukar file manual",
          "Penyimpanan tersimpan otomatis (Auto-save)",
          "Menghilangkan kebutuhan akan koneksi internet",
          "Membuat laptop tidak membutuhkan arus listrik"
        ],
        answers: [0, 1, 2],
        explanation: "Akses fleksibel, kolaborasi real-time, dan auto-save adalah keunggulan utama cloud."
      },
      {
        id: "mt3_5", type: "pg_multi",
        q: "Pilihlah TIGA aplikasi ruang kerja digital berbasis cloud yang populer! (Pilih 3)",
        options: [
          "Google Docs / Sheets",
          "Microsoft Teams / 365",
          "Notion",
          "MS-DOS 1981",
          "Paint XP Offline"
        ],
        answers: [0, 1, 2],
        explanation: "Google Docs, MS Teams, dan Notion adalah platform kolaborasi modern."
      },
      {
        id: "mt3_6", type: "pg_multi",
        q: "Pilihlah TIGA prinsip etika berkomunikasi dalam grup percakapan sekolah! (Pilih 3)",
        options: [
          "Menggunakan bahasa yang sopan dan santun",
          "Memperhatikan jam berkomunikasi yang wajar",
          "Memverifikasi kebenaran informasi sebelum dikirim",
          "Mengirimkan spam stiker secara terus menerus",
          "Mengunggah dokumen rahasia milik orang lain"
        ],
        answers: [0, 1, 2],
        explanation: "Prinsip netiquette meliputi kesopanan, waktu yang pas, dan verifikasi informasi."
      },
      {
        id: "mt3_7", type: "isian",
        q: "Sistem penyimpanan data jarak jauh yang terhubung melalui jaringan internet disebut...",
        answer: "Cloud",
        explanation: "Istilahnya adalah Cloud Storage."
      },
      {
        id: "mt3_8", type: "isian",
        q: "Izin yang diberikan oleh pemilik hak cipta kepada orang lain untuk menggunakan karyanya disebut...",
        answer: "Lisensi",
        explanation: "Lisensi adalah izin resmi penggunaan karya cipta."
      },
      {
        id: "mt3_9", type: "tf_statements",
        q: "Evaluasilah tiga pernyataan hak cipta berikut:",
        statements: [
          { text: "Mengambil gambar dari Google tanpa izin langsung diperbolehkan jika untuk komersial.", isTrue: false },
          { text: "Lisensi CC-ND melarang pengguna membuat karya turunan/modifikasi.", isTrue: true },
          { text: "Public Domain berarti karya sudah bebas digunakan tanpa batasan hak cipta.", isTrue: true }
        ],
        explanation: "Pernyataan 1 SALAH. Pernyataan 2 BENAR (ND = No Derivatives). Pernyataan 3 BENAR."
      },
      {
        id: "mt3_10", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan fitur cloud berikut:",
        statements: [
          { text: "Fitur 'Comment' di Google Docs memfasilitasi diskusi tanpa mengubah teks utama.", isTrue: true },
          { text: "Penyimpanan cloud tidak membutuhkan sistem keamanan kata sandi.", isTrue: false },
          { text: "Version history memungkinkan kita memulihkan file yang terhapus secara tak sengaja.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 SALAH. Pernyataan 3 BENAR."
      }
    ]
  },
  {
    id: 4,
    title: "Arsitektur Komputer & Sistem Operasi",
    subtitle: "Model Von Neumann (Input-Process-Output) & OS",
    icon: Cpu,
    color: "from-amber-600 to-red-500",
    badge: "Hardware Architect",
    materials: [
      {
        title: "Model Arsitektur Komputer Von Neumann",
        content: "Arsitektur Von Neumann membagi komponen komputer menjadi Input Device, Processing Unit (CPU yang terdiri atas ALU, CU, dan Register), Memory (RAM/ROM), dan Output Device."
      },
      {
        title: "Siklus Eksekusi Instruksi CPU (Fetch-Decode-Execute)",
        content: "CPU mengeksekusi instruksi melalui 3 langkah berulang: Fetch (mengambil instruksi dari RAM), Decode (menerjemahkan perintah di CU), dan Execute (menjalankan operasi di ALU)."
      },
      {
        title: "Peran dan Fungsi Utama Sistem Operasi (OS)",
        content: "Sistem Operasi (Windows, Linux, macOS) mengelola sumber daya perangkat keras, alokasi memori, manajemen berkas, dan menyediakan antarmuka pengguna (GUI/CLI)."
      }
    ],
    sampleQuestions: [
      {
        id: "sq4_1", type: "pg_single",
        q: "Komponen CPU yang bertugas mengoordinasikan seluruh lalu lintas instruksi komputer adalah...",
        options: ["Arithmetic Logic Unit (ALU)", "Control Unit (CU)", "RAM", "SSD", "Power Supply"],
        answer: 1,
        explanation: "Control Unit (CU) mengendalikan jalannya instruksi sistem."
      },
      {
        id: "sq4_2", type: "pg_single",
        q: "Urutan tahapan siklus eksekusi instruksi CPU yang benar adalah...",
        options: ["Execute -> Fetch -> Decode", "Fetch -> Decode -> Execute", "Decode -> Execute -> Fetch", "Fetch -> Execute -> Decode", "Decode -> Fetch -> Execute"],
        answer: 1,
        explanation: "Siklus instruksi adalah Fetch -> Decode -> Execute."
      },
      {
        id: "sq4_3", type: "pg_multi",
        q: "Pilihlah TIGA komponen utama di dalam Central Processing Unit (CPU)! (Pilih 3)",
        options: [
          "Arithmetic Logic Unit (ALU)",
          "Control Unit (CU)",
          "Register Internal",
          "DVD Drive",
          "Power Supply Unit"
        ],
        answers: [0, 1, 2],
        explanation: "Komponen CPU inti meliputi ALU, CU, dan Register."
      },
      {
        id: "sq4_4", type: "isian",
        q: "Memori utama komputer yang bersifat volatile (data hilang saat listrik mati) dinamakan...",
        answer: "RAM",
        explanation: "RAM singkatan dari Random Access Memory."
      },
      {
        id: "sq4_5", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan arsitektur komputer berikut:",
        statements: [
          { text: "ALU bertugas melakukan operasi perhitungan aritmatika dan logika.", isTrue: true },
          { text: "Sistem Operasi menjembatani komunikasi antara hardware dan aplikasi.", isTrue: true },
          { text: "Harddisk dan SSD bersifat volatile.", isTrue: false }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 BENAR. Pernyataan 3 SALAH (media simpan bersifat non-volatile)."
      }
    ],
    moduleTest: [
      {
        id: "mt4_1", type: "pg_single",
        q: "Perangkat lunak yang pertama kali dimuat saat komputer dihidupkan dinamakan...",
        options: ["Operating System (OS)", "Web Browser", "Antivirus", "Microsoft Office", "Media Player"],
        answer: 0,
        explanation: "Sistem Operasi adalah perangkat lunak dasar yang memuat pertama kali."
      },
      {
        id: "mt4_2", type: "pg_single",
        q: "Komponen hardware yang berfungsi memasukkan data gambar visual ke komputer adalah...",
        options: ["Scanner", "Printer", "Speaker", "Monitor", "Plotter"],
        answer: 0,
        explanation: "Scanner adalah perangkat input data visual."
      },
      {
        id: "mt4_3", type: "pg_single",
        q: "Ukuran kecepatan pemrosesan CPU umumnya dinyatakan dalam satuan...",
        options: ["Hertz / Gigahertz (GHz)", "Byte / Gigabyte (GB)", "Pixel", "Watt", "RPM"],
        answer: 0,
        explanation: "Clock speed CPU diukur dalam Hertz / GHz."
      },
      {
        id: "mt4_4", type: "pg_multi",
        q: "Pilihlah TIGA contoh Perangkat Input (Input Device) komputer! (Pilih 3)",
        options: [
          "Keyboard",
          "Mouse",
          "Microphone",
          "Monitor",
          "Printer"
        ],
        answers: [0, 1, 2],
        explanation: "Keyboard, Mouse, dan Microphone adalah perangkat masukan."
      },
      {
        id: "mt4_5", type: "pg_multi",
        q: "Pilihlah TIGA contoh Sistem Operasi populer untuk perangkat lunak! (Pilih 3)",
        options: [
          "Microsoft Windows",
          "Linux (Ubuntu/Debian)",
          "macOS",
          "Google Chrome",
          "Adobe Photoshop"
        ],
        answers: [0, 1, 2],
        explanation: "Windows, Linux, dan macOS adalah Sistem Operasi."
      },
      {
        id: "mt4_6", type: "pg_multi",
        q: "Pilihlah TIGA fungsi utama dari Sistem Operasi! (Pilih 3)",
        options: [
          "Manajemen Memori Komputer",
          "Manajemen Berkas dan File",
          "Manajemen Tugas CPU (Multitasking)",
          "Memperbaiki layar monitor pecah",
          "Menyuplai listrik ke motherboard"
        ],
        answers: [0, 1, 2],
        explanation: "Fungsi OS mencakup manajemen memori, berkas, dan instruksi CPU."
      },
      {
        id: "mt4_7", type: "isian",
        q: "Memori berkecepatan paling tinggi yang berada sangat dekat di dalam inti CPU disebut Cache...",
        answer: "Memory",
        explanation: "Cache Memory mempercepat akses data instruksi CPU."
      },
      {
        id: "mt4_8", type: "isian",
        q: "Papan sirkuit utama tempat semua komponen hardware tersambung dinamakan...",
        answer: "Motherboard",
        explanation: "Motherboard / Mainboard tempat tersambungnya komponen."
      },
      {
        id: "mt4_9", type: "tf_statements",
        q: "Evaluasilah kebenaran tiga pernyataan hardware berikut:",
        statements: [
          { text: "ROM menyimpan data BIOS yang bersifat permanen (non-volatile).", isTrue: true },
          { text: "GPU dirancang khusus untuk mempercepat pemrosesan grafis dan visual.", isTrue: true },
          { text: "Makin kecil ukuran RAM, komputer berjalan semakin cepat.", isTrue: false }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 BENAR. Pernyataan 3 SALAH."
      },
      {
        id: "mt4_10", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan eksekusi program berikut:",
        statements: [
          { text: "Tahap 'Fetch' berarti CPU mengambil perintah dari memori RAM.", isTrue: true },
          { text: "Multitasking memungkinkan komputer menjalankan lebih dari satu aplikasi.", isTrue: true },
          { text: "Command Line Interface (CLI) menggunakan navigasi tombol ikon grafik.", isTrue: false }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 BENAR. Pernyataan 3 SALAH (CLI berbasis teks)."
      }
    ]
  },
  {
    id: 5,
    title: "Konsep Struktur Data & Algoritma",
    subtitle: "Array, Stack (LIFO), Queue (FIFO), Sorting & Searching",
    icon: Layers,
    color: "from-indigo-600 to-purple-600",
    badge: "Algorithm Ninja",
    materials: [
      {
        title: "Struktur Data Linier: Array, Stack, dan Queue",
        content: "Array menyimpan elemen dengan tipe data sejenis berindeks. Stack menggunakan prinsip LIFO (Last In, First Out) seperti tumpukan piring (Push & Pop). Queue menggunakan prinsip FIFO (First In, First Out) seperti antrean tiket (Enqueue & Dequeue)."
      },
      {
        title: "Algoritma Pengurutan (Sorting Algorithm)",
        content: "Algoritma sorting menyusun data secara terurut (ascending/descending). Contoh utama: Bubble Sort (membandingkan pasangan bertahap), Insertion Sort, dan Selection Sort."
      },
      {
        title: "Algoritma Pencarian (Searching Algorithm)",
        content: "Linear Search memeriksa elemen satu per satu dari awal. Binary Search membagi dua area pencarian secara berulang, namun mensyaratkan data harus sudah terurut terlebih dahulu."
      }
    ],
    sampleQuestions: [
      {
        id: "sq5_1", type: "pg_single",
        q: "Antrean pencetakan dokumen pada printer menerapkan struktur data...",
        options: ["Stack (LIFO)", "Queue (FIFO)", "Tree", "Graph", "Matrix"],
        answer: 1,
        explanation: "Printer mencetak dokumen pertama yang dikirim (FIFO/Queue)."
      },
      {
        id: "sq5_2", type: "pg_single",
        q: "Fitur tombol 'Undo' pada aplikasi pengolah kata menggunakan prinsip kerja...",
        options: ["LIFO (Stack)", "FIFO (Queue)", "Random Access", "Sorting", "Hashing"],
        answer: 0,
        explanation: "Undo membatalkan aksi terakhir terlebih dahulu (LIFO/Stack)."
      },
      {
        id: "sq5_3", type: "pg_multi",
        q: "Pilihlah TIGA jenis algoritma pengurutan data (Sorting)! (Pilih 3)",
        options: [
          "Bubble Sort",
          "Insertion Sort",
          "Selection Sort",
          "Linear Search",
          "Binary Search"
        ],
        answers: [0, 1, 2],
        explanation: "Bubble, Insertion, dan Selection adalah algoritma pengurutan data."
      },
      {
        id: "sq5_4", type: "isian",
        q: "Singkatan dari prinsip kerja Stack di mana elemen terakhir masuk akan keluar pertama adalah...",
        answer: "LIFO",
        explanation: "LIFO singkatan Last In, First Out."
      },
      {
        id: "sq5_5", type: "tf_statements",
        q: "Ujilah tiga pernyataan struktur data berikut:",
        statements: [
          { text: "Indeks elemen pertama pada Array umumnya dimulai dari angka 0.", isTrue: true },
          { text: "Binary Search bisa digunakan pada kumpulan data acak yang belum terurut.", isTrue: false },
          { text: "Operasi menambah data pada Stack dinamakan Push.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 SALAH (Binary search butuh data terurut). Pernyataan 3 BENAR."
      }
    ],
    moduleTest: [
      {
        id: "mt5_1", type: "pg_single",
        q: "Operasi untuk menghapus atau mengambil elemen paling atas pada Stack dinamakan...",
        options: ["Push", "Pop", "Enqueue", "Dequeue", "Peek"],
        answer: 1,
        explanation: "Pop digunakan untuk mengambil/menghapus elemen teratas Stack."
      },
      {
        id: "mt5_2", type: "pg_single",
        q: "Operasi memasukkan elemen baru ke bagian belakang antrean Queue dinamakan...",
        options: ["Push", "Pop", "Enqueue", "Dequeue", "Insert"],
        answer: 2,
        explanation: "Enqueue memasukkan elemen baru ke dalam antrean Queue."
      },
      {
        id: "mt5_3", type: "pg_single",
        q: "Algoritma pencarian yang mengecek elemen data satu per satu dari awal hingga akhir adalah...",
        options: ["Linear Search", "Binary Search", "Bubble Sort", "Quick Sort", "Merge Sort"],
        answer: 0,
        explanation: "Linear Search mencari data secara berurutan satu demi satu."
      },
      {
        id: "mt5_4", type: "pg_multi",
        q: "Pilihlah TIGA operasi dasar pada manipulasi struktur data Stack dan Queue! (Pilih 3)",
        options: [
          "Push",
          "Pop",
          "Enqueue",
          "Compile",
          "Render"
        ],
        answers: [0, 1, 2],
        explanation: "Push dan Pop milik Stack; Enqueue dan Dequeue milik Queue."
      },
      {
        id: "mt5_5", type: "pg_multi",
        q: "Pilihlah TIGA struktur data linier dalam ilmu komputer! (Pilih 3)",
        options: [
          "Array",
          "Stack",
          "Queue",
          "Router Hardware",
          "Harddisk Drive"
        ],
        answers: [0, 1, 2],
        explanation: "Array, Stack, dan Queue adalah struktur data linier."
      },
      {
        id: "mt5_6", type: "pg_multi",
        q: "Pilihlah TIGA kondisi wajib agar algoritma Binary Search dapat bekerja efisien! (Pilih 3)",
        options: [
          "Data sudah harus dalam keadaan terurut",
          "Dapat membagi area pencarian menjadi dua bagian",
          "Elemen tengah (mid) dapat diakses indeksnya",
          "Ukuran data wajib di bawah 10 elemen",
          "Sistem harus terhubung ke internet"
        ],
        answers: [0, 1, 2],
        explanation: "Binary search mensyaratkan data terurut, konsep pembagian dua (divide), dan akses indeks."
      },
      {
        id: "mt5_7", type: "isian",
        q: "Prinsip kerja Queue di mana elemen pertama masuk akan keluar pertama disebut singkatan...",
        answer: "FIFO",
        explanation: "FIFO singkatan First In, First Out."
      },
      {
        id: "mt5_8", type: "isian",
        q: "Proses mengurutkan angka dari terkecil ke terbesar dinamakan urutan...",
        answer: "Ascending",
        explanation: "Ascending adalah urutan menaik dari kecil ke besar."
      },
      {
        id: "mt5_9", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan algoritma berikut:",
        statements: [
          { text: "Bubble Sort bekerja dengan menukar dua elemen bersebelahan yang tidak terurut.", isTrue: true },
          { text: "Binary Search lebih cepat dibanding Linear Search untuk jumlah data sangat besar.", isTrue: true },
          { text: "Stack memakai prinsip FIFO sama persis seperti antrean loket kasir.", isTrue: false }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 BENAR. Pernyataan 3 SALAH (Stack memakai LIFO)."
      },
      {
        id: "mt5_10", type: "tf_statements",
        q: "Evaluasilah tiga pernyataan Array berikut:",
        statements: [
          { text: "Array dapat menampung elemen dengan tipe data berlainan dalam satu variabel.", isTrue: false },
          { text: "Elemen array diakses menggunakan nomor indeks angka.", isTrue: true },
          { text: "Panjang kapasitas array umumnya ditentukan saat pendefinisian.", isTrue: true }
        ],
        explanation: "Pernyataan 1 SALAH (Array menampung tipe data sejenis). Pernyataan 2 BENAR. Pernyataan 3 BENAR."
      }
    ]
  },
  {
    id: 6,
    title: "Problem Solving & Algoritma Standar",
    subtitle: "Empat Pilar Computational Thinking (CT) & Solusi",
    icon: Brain,
    color: "from-rose-600 to-orange-500",
    badge: "Problem Solver",
    materials: [
      {
        title: "Empat Pilar Computational Thinking (CT)",
        content: "Computational Thinking adalah metode memecahkan masalah kompleks. Terdiri atas: Dekomposisi (memecah masalah), Pengenalan Pola (Pattern Recognition), Abstraksi (fokus informasi penting), dan Perancangan Algoritma."
      },
      {
        title: "Penerapan Abstraksi dan Dekomposisi",
        content: "Dekomposisi membagi proyek besar menjadi sub-tugas kecil. Abstraksi menyaring detail teknis yang tidak relevan (seperti mengabaikan warna mobil saat membuat rumus perhitungan kecepatan waktu tempuh)."
      },
      {
        title: "Penyusunan Algoritma dan Pseudocode",
        content: "Algoritma disusun secara logis dan berhingga (finite). Pseudocode dan Flowchart membantu memvisualisasikan alur kontrol (sekuensial, percabangan IF-ELSE, dan perulangan FOR/WHILE)."
      }
    ],
    sampleQuestions: [
      {
        id: "sq6_1", type: "pg_single",
        q: "Saat membuat aplikasi navigasi GPS, pengembang mengabaikan warna bangunan dan fokus pada koordinat jalan. Pilar CT yang digunakan adalah...",
        options: ["Dekomposisi", "Pengenalan Pola", "Abstraksi", "Algoritma", "Debugging"],
        answer: 2,
        explanation: "Abstraksi membuang detail yang tidak relevan."
      },
      {
        id: "sq6_2", type: "pg_single",
        q: "Langkah-langkah terstruktur dan berhingga untuk menyelesaikan masalah dinamakan...",
        options: ["Algoritma", "Variabel", "Hardware", "Database", "Abstraksi"],
        answer: 0,
        explanation: "Algoritma adalah instruksi bertahap untuk pemecahan masalah."
      },
      {
        id: "sq6_3", type: "pg_multi",
        q: "Pilihlah TIGA dari empat pilar utama Computational Thinking! (Pilih 3)",
        options: [
          "Dekomposisi (Decomposition)",
          "Pengenalan Pola (Pattern Recognition)",
          "Abstraksi (Abstraction)",
          "Pembelian Laptop Mahal",
          "Pemasangan Kabel Listrik"
        ],
        answers: [0, 1, 2],
        explanation: "Dekomposisi, Pengenalan Pola, dan Abstraksi adalah pilar CT."
      },
      {
        id: "sq6_4", type: "isian",
        q: "Notasi informal yang menyerupai bahasa pemrograman untuk menuliskan algoritma disebut...",
        answer: "Pseudocode",
        explanation: "Pseudocode adalah notasi penulisan algoritma mirip kode."
      },
      {
        id: "sq6_5", type: "tf_statements",
        q: "Evaluasilah tiga pernyataan Computational Thinking berikut:",
        statements: [
          { text: "Dekomposisi memecah masalah besar menjadi bagian-bagian kecil.", isTrue: true },
          { text: "Computational Thinking HANYA bisa digunakan saat mengetik kode program.", isTrue: false },
          { text: "Pattern Recognition membantu memprediksi solusi dari masalah serupa.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 SALAH (CT berlaku universal). Pernyataan 3 BENAR."
      }
    ],
    moduleTest: [
      {
        id: "mt6_1", type: "pg_single",
        q: "Bagan alir yang menggunakan simbol-simbol standar untuk menggambarkan alur algoritma dinamakan...",
        options: ["Flowchart", "Pseudocode", "Structure Chart", "ERD", "Wireframe"],
        answer: 0,
        explanation: "Flowchart adalah bagan visual alur algoritma."
      },
      {
        id: "mt6_2", type: "pg_single",
        q: "Simbol jajaran genjang pada flowchart digunakan untuk menggambarkan...",
        options: ["Proses / Perhitungan", "Input / Output Data", "Keputusan / Decision", "Mulai / Selesai", "Garis Alir"],
        answer: 1,
        explanation: "Simbol jajaran genjang menyatakan Input atau Output data."
      },
      {
        id: "mt6_3", type: "pg_single",
        q: "Simbol belah ketupat pada flowchart melambangkan operasi...",
        options: ["Start/End", "Process", "Decision / Percabangan", "Input", "Connector"],
        answer: 2,
        explanation: "Simbol belah ketupat melambangkan kondisi Percabangan (Decision)."
      },
      {
        id: "mt6_4", type: "pg_multi",
        q: "Pilihlah TIGA struktur kontrol utama dalam pemrograman komputasi! (Pilih 3)",
        options: [
          "Sekuensial (Urutan langkah)",
          "Percabangan (Selection / IF-ELSE)",
          "Perulangan (Iteration / Loop)",
          "Restart Komputer",
          "Formatting Harddisk"
        ],
        answers: [0, 1, 2],
        explanation: "Struktur kontrol dasar: Sekuensial, Percabangan, dan Perulangan."
      },
      {
        id: "mt6_5", type: "pg_multi",
        q: "Pilihlah TIGA pilar Computational Thinking di bawah ini! (Pilih 3)",
        options: [
          "Dekomposisi",
          "Abstraksi",
          "Perancangan Algoritma",
          "Pembelian Software",
          "Perbaikan Monitor"
        ],
        answers: [0, 1, 2],
        explanation: "Dekomposisi, Abstraksi, dan Perancangan Algoritma adalah bagian dari 4 pilar CT."
      },
      {
        id: "mt6_6", type: "pg_multi",
        q: "Pilihlah TIGA ciri algoritma yang baik dan efisien! (Pilih 3)",
        options: [
          "Memiliki instruksi yang jelas (Unambiguous)",
          "Harus berakhir setelah sejumlah langkah berhingga (Finiteness)",
          "Menghasilkan output yang benar",
          "Berjalan tanpa pernah berhenti selamanya (Infinite loop)",
          "Menggunakan kata-kata puitis"
        ],
        answers: [0, 1, 2],
        explanation: "Algoritma baik harus jelas, berhingga (finite), dan menghasilkan output benar."
      },
      {
        id: "mt6_7", type: "isian",
        q: "Kesalahan logika atau sintaks pada skrip program yang menyebabkan error dinamakan...",
        answer: "Bug",
        explanation: "Bug adalah istilah kesalahan/error pemrograman."
      },
      {
        id: "mt6_8", type: "isian",
        q: "Proses melacak dan memperbaiki kesalahan bug pada kode program dinamakan...",
        answer: "Debugging",
        explanation: "Debugging adalah proses perbaikan bug program."
      },
      {
        id: "mt6_9", type: "tf_statements",
        q: "Ujilah tiga pernyataan pemrograman berikut:",
        statements: [
          { text: "Perulangan FOR digunakan jika jumlah iterasi sudah diketahui pasti.", isTrue: true },
          { text: "Pseudocode wajib mengikuti aturan titik koma sama ketatnya seperti bahasa C++.", isTrue: false },
          { text: "Dekomposisi mempermudah pembagian tugas dalam tim pengembang.", isTrue: true }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 SALAH (Pseudocode bersifat bebas informal). Pernyataan 3 BENAR."
      },
      {
        id: "mt6_10", type: "tf_statements",
        q: "Periksalah kebenaran tiga pernyataan Flowchart berikut:",
        statements: [
          { text: "Simbol oval (Terminal) menandakan awal dan akhir dari flowchart.", isTrue: true },
          { text: "Garis panah menunjukkan arah aliran proses instruksi.", isTrue: true },
          { text: "Satu flowchart hanya boleh berisi maksimal 3 langkah saja.", isTrue: false }
        ],
        explanation: "Pernyataan 1 BENAR. Pernyataan 2 BENAR. Pernyataan 3 SALAH (tidak ada batasan jumlah langkah)."
      }
    ]
  }
];

const FINAL_EXAM_QUESTIONS = [
  // Modul 1 Questions (1-5)
  {
    id: "fe_1", moduleId: 1, type: "pg_single",
    q: "Guna mencari dokumen format PDF dari domain pemerintah Indonesia tentang kebijakan AI, sintaks yang paling tepat adalah...",
    options: ["site:go.id filetype:pdf \"kebijakan AI\"", "search:go.id pdf AI", "domain:go.id ext:pdf AI", "filetype:doc site:go.id AI", "site:com filetype:pdf AI"],
    answer: 0,
    explanation: "Sintaks 'site:go.id filetype:pdf' mengunci domain pemerintah Indonesia dan tipe dokumen PDF."
  },
  {
    id: "fe_2", moduleId: 1, type: "pg_single",
    q: "Proses mengecek kredibilitas berita dengan membuka tab baru di browser dinamakan...",
    options: ["Membaca Vertikal", "Membaca Lateral", "Membaca Cepat", "Scanning", "Skimming"],
    answer: 1,
    explanation: "Membaca lateral adalah metode pemeriksa fakta dengan membuka informasi pembanding di tab lain."
  },
  {
    id: "fe_3", moduleId: 1, type: "pg_multi",
    q: "Pilihlah TIGA domain situs resmi yang berintegritas tinggi untuk dijadikan referensi! (Pilih 3)",
    options: [".go.id (Pemerintah Indonesia)", ".ac.id (Perguruan Tinggi Indonesia)", ".edu (Pendidikan Internasional)", ".blogspot.com (Blog Bebas)", ".xyz (Domain Publik Acak)"],
    answers: [0, 1, 2],
    explanation: ".go.id, .ac.id, dan .edu memerlukan verifikasi kelembagaan resmi."
  },
  {
    id: "fe_4", moduleId: 1, type: "isian",
    q: "Pencarian konteks gambar dengan mengunggah foto ke mesin pencari dinamakan Reverse Image...",
    answer: "Search",
    explanation: "Reverse Image Search digunakan memverifikasi keaslian sumber foto."
  },
  {
    id: "fe_5", moduleId: 1, type: "tf_statements",
    q: "Evaluasilah tiga pernyataan literasi digital berikut:",
    statements: [
      { text: "Berita hoaks sering kali mengggunakan judul provokatif dan mendesak disebarkan.", isTrue: true },
      { text: "Situs periksa fakta resmi di Indonesia salah satunya adalah CekFakta.com.", isTrue: true },
      { text: "Semua artikel di urutan pertama Google pasti 100% akurat.", isTrue: false }
    ],
    explanation: "Pernyataan 1 dan 2 BENAR. Pernyataan 3 SALAH karena urutan Google dipengaruhi SEO dan iklan."
  },

  // Modul 2 Questions (6-10)
  {
    id: "fe_6", moduleId: 2, type: "pg_single",
    q: "Prinsip komputasi yang menyatakan bahwa data buruk yang diinput akan menghasilkan output yang buruk adalah...",
    options: ["GIGO (Garbage In, Garbage Out)", "FIFO (First In, First Out)", "LIFO (Last In, First Out)", "CPU", "RAM"],
    answer: 0,
    explanation: "GIGO adalah singkatan Garbage In, Garbage Out."
  },
  {
    id: "fe_7", moduleId: 2, type: "pg_single",
    q: "Nilai data ekstrem yang sangat jauh melenceng dari rata-rata data lainnya disebut...",
    options: ["Missing Value", "Outlier", "Data Duplikat", "Standard Value", "Binary Data"],
    answer: 1,
    explanation: "Outlier adalah data pencilan ekstrem."
  },
  {
    id: "fe_8", moduleId: 2, type: "pg_multi",
    q: "Pilihlah TIGA tahapan penting dalam proses Pembersihan Data (Data Cleaning)! (Pilih 3)",
    options: ["Removing Duplicates (Hapus data ganda)", "Handling Missing Values (Olah data kosong)", "Data Standardization (Seragamkan format)", "Mengubah warna tema Excel", "Format Ulang Harddisk"],
    answers: [0, 1, 2],
    explanation: "Data cleaning berfokus pada duplikasi, missing values, dan penyeragaman format."
  },
  {
    id: "fe_9", moduleId: 2, type: "isian",
    q: "Teknik mengisi data yang kosong dengan mengestimasi nilai rata-rata dinamakan...",
    answer: "Imputasi",
    explanation: "Imputasi adalah teknik penanganan missing value."
  },
  {
    id: "fe_10", moduleId: 2, type: "tf_statements",
    q: "Evaluasilah tiga pernyataan pengolahan data berikut:",
    statements: [
      { text: "Format tanggal yang tidak konsisten menyulitkan proses pengolahan otomatis.", isTrue: true },
      { text: "Pembersihan data dilakukan SETELAH laporan bisnis dipublikasikan.", isTrue: false },
      { text: "Outlier selalu dapat terdeteksi melalui bantuan grafik visualisasi.", isTrue: true }
    ],
    explanation: "Pernyataan 1 dan 3 BENAR. Pernyataan 2 SALAH (pembersihan dilakukan sebelum analisis)."
  },

  // Modul 3 Questions (11-15)
  {
    id: "fe_11", moduleId: 3, type: "pg_single",
    q: "Fitur penyimpanan cloud yang memungkinkan pengguna memulihkan versi lama dari dokumen adalah...",
    options: ["Auto-Save", "Version History", "Download PDF", "Cloud Sync", "Share Link"],
    answer: 1,
    explanation: "Version History menyimpan riwayat perubahan dokumen."
  },
  {
    id: "fe_12", moduleId: 3, type: "pg_single",
    q: "Pola kerja tim digital yang berlangsung pada waktu bersamaan secara real-time disebut...",
    options: ["Synchronous", "Asynchronous", "Parallel", "Sequential", "Offline"],
    answer: 0,
    explanation: "Synchronous adalah kolaborasi serempak pada waktu yang sama."
  },
  {
    id: "fe_13", moduleId: 3, type: "pg_multi",
    q: "Pilihlah TIGA elemen utama dalam lisensi Creative Commons (CC)! (Pilih 3)",
    options: ["BY (Attribution / Mencantumkan nama)", "NC (Non-Commercial / Bukan tujuan komersial)", "SA (ShareAlike / Berbagi lisensi sama)", "PR (Pay Royalty / Wajib bayar)", "EX (Exclusive / Dilarang copy)"],
    answers: [0, 1, 2],
    explanation: "Elemen dasar lisensi CC meliputi BY, NC, SA, dan ND."
  },
  {
    id: "fe_14", moduleId: 3, type: "isian",
    q: "Sistem penyimpanan data digital jarak jauh berbasis internet dinamakan Cloud...",
    answer: "Storage",
    explanation: "Layanan tersebut dinamakan Cloud Storage."
  },
  {
    id: "fe_15", moduleId: 3, type: "tf_statements",
    q: "Ujilah tiga pernyataan etika kolaborasi digital berikut:",
    statements: [
      { text: "Lisensi CC-ND membolehkan pengguna untuk mengubah dan mengedit isi karya.", isTrue: false },
      { text: "Hak akses 'Viewer' pada Google Docs melarang pengguna mengubah isi file.", isTrue: true },
      { text: "Penggunaan bahasa yang sopan dalam grup sekolah adalah bagian dari Netiquette.", isTrue: true }
    ],
    explanation: "Pernyataan 1 SALAH (ND = No Derivatives). Pernyataan 2 dan 3 BENAR."
  },

  // Modul 4 Questions (16-20)
  {
    id: "fe_16", moduleId: 4, type: "pg_single",
    q: "Komponen CPU yang bertanggung jawab melakukan perhitungan matematis dan keputusan logika adalah...",
    options: ["Control Unit (CU)", "Arithmetic Logic Unit (ALU)", "RAM", "Harddisk", "ROM"],
    answer: 1,
    explanation: "ALU bertugas mengolah operasi aritmatika dan logika."
  },
  {
    id: "fe_17", moduleId: 4, type: "pg_single",
    q: "Siklus instruksi CPU diawali dengan langkah...",
    options: ["Execute", "Decode", "Fetch", "Store", "Compile"],
    answer: 2,
    explanation: "Siklus eksekusi CPU adalah Fetch -> Decode -> Execute."
  },
  {
    id: "fe_18", moduleId: 4, type: "pg_multi",
    q: "Pilihlah TIGA contoh sistem operasi (OS) utama komputer/perangkat digital! (Pilih 3)",
    options: ["Microsoft Windows", "Linux (Ubuntu)", "macOS", "Google Chrome Browser", "Microsoft Excel"],
    answers: [0, 1, 2],
    explanation: "Windows, Linux, dan macOS adalah Sistem Operasi."
  },
  {
    id: "fe_19", moduleId: 4, type: "isian",
    q: "Memori utama komputer yang bersifat volatile (hilang saat listrik mati) dinamakan...",
    answer: "RAM",
    explanation: "RAM singkatan dari Random Access Memory."
  },
  {
    id: "fe_20", moduleId: 4, type: "tf_statements",
    q: "Evaluasilah tiga pernyataan arsitektur komputer berikut:",
    statements: [
      { text: "Control Unit (CU) mengarahkan lalu lintas data dalam CPU.", isTrue: true },
      { text: "ROM menyimpan data BIOS secara permanen (non-volatile).", isTrue: true },
      { text: "Harddisk bersifat volatile sehingga data akan hilang jika komputer mati.", isTrue: false }
    ],
    explanation: "Pernyataan 1 dan 2 BENAR. Pernyataan 3 SALAH (Harddisk bersifat non-volatile)."
  },

  // Modul 5 Questions (21-25)
  {
    id: "fe_21", moduleId: 5, type: "pg_single",
    q: "Struktur data yang menerapkan prinsip Last In, First Out (LIFO) seperti tumpukan piring adalah...",
    options: ["Queue", "Stack", "Array", "Graph", "Tree"],
    answer: 1,
    explanation: "Stack menggunakan prinsip LIFO."
  },
  {
    id: "fe_22", moduleId: 5, type: "pg_single",
    q: "Antrean pembelian tiket bioskop menerapkan prinsip struktur data...",
    options: ["LIFO", "FIFO (First In, First Out)", "Random", "Priority", "Stack"],
    answer: 1,
    explanation: "Queue menerapkan prinsip FIFO."
  },
  {
    id: "fe_23", moduleId: 5, type: "pg_multi",
    q: "Pilihlah TIGA jenis algoritma pengurutan data (Sorting)! (Pilih 3)",
    options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Linear Search", "Binary Search"],
    answers: [0, 1, 2],
    explanation: "Bubble, Insertion, dan Selection adalah algoritma sorting."
  },
  {
    id: "fe_24", moduleId: 5, type: "isian",
    q: "Operasi untuk menambah elemen baru pada tumpukan Stack dinamakan...",
    answer: "Push",
    explanation: "Push menambah elemen, Pop mengambil elemen pada Stack."
  },
  {
    id: "fe_25", moduleId: 5, type: "tf_statements",
    q: "Periksalah tiga pernyataan struktur data berikut:",
    statements: [
      { text: "Indeks elemen pertama pada Array umumnya dimulai dari angka 0.", isTrue: true },
      { text: "Binary Search bisa digunakan pada data yang belum terurut.", isTrue: false },
      { text: "Enqueue adalah operasi memasukkan elemen pada Queue.", isTrue: true }
    ],
    explanation: "Pernyataan 1 dan 3 BENAR. Pernyataan 2 SALAH (Binary Search butuh data terurut)."
  },

  // Modul 6 Questions (26-30)
  {
    id: "fe_26", moduleId: 6, type: "pg_single",
    q: "Pilar Computational Thinking yang berfokus membuang detail yang tidak penting dinamakan...",
    options: ["Dekomposisi", "Abstraksi", "Pengenalan Pola", "Algoritma", "Debugging"],
    answer: 1,
    explanation: "Abstraksi menyaring detail teknis tidak relevan."
  },
  {
    id: "fe_27", moduleId: 6, type: "pg_single",
    q: "Simbol jajaran genjang pada diagram alir (Flowchart) digunakan untuk menyatakan...",
    options: ["Proses / Perhitungan", "Input / Output Data", "Keputusan / Decision", "Start / Stop", "Konektor"],
    answer: 1,
    explanation: "Simbol jajaran genjang melambangkan Input atau Output."
  },
  {
    id: "fe_28", moduleId: 6, type: "pg_multi",
    q: "Pilihlah TIGA pilar utama Computational Thinking (CT)! (Pilih 3)",
    options: ["Dekomposisi", "Pengenalan Pola", "Perancangan Algoritma", "Instalasi Hardware", "Browsing Internet"],
    answers: [0, 1, 2],
    explanation: "Dekomposisi, Pola, Abstraksi, dan Algoritma adalah 4 pilar CT."
  },
  {
    id: "fe_29", moduleId: 6, type: "isian",
    q: "Proses melacak dan memperbaiki kesalahan bug pada kode program dinamakan...",
    answer: "Debugging",
    explanation: "Debugging adalah proses perbaikan bug."
  },
  {
    id: "fe_30", moduleId: 6, type: "tf_statements",
    q: "Evaluasilah tiga pernyataan pemrograman berikut:",
    statements: [
      { text: "Pseudocode adalah notasi informal algoritma yang mirip kode program.", isTrue: true },
      { text: "Simbol belah ketupat pada flowchart digunakan untuk proses perulangan dan keputusan.", isTrue: true },
      { text: "Dekomposisi membuat masalah menjadi lebih rumit dan sukar diselesaikan.", isTrue: false }
    ],
    explanation: "Pernyataan 1 dan 2 BENAR. Pernyataan 3 SALAH (Dekomposisi mempermudah masalah)."
  }
];

export default function App() {
  const [userRole, setUserRole] = useState('murid'); 
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [studentProfile, setStudentProfile] = useState({
    name: "",
    kelas: "",
    isRegistered: false
  });

  const [studentsList, setStudentsList] = useState(MOCK_STUDENTS);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState(null);
  const [unlockedModules, setUnlockedModules] = useState([1, 2, 3, 4, 5, 6]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [selectedModuleId, setSelectedModuleId] = useState(1);
  const [moduleSubTab, setModuleSubTab] = useState('materi'); 
  
  const [userStats, setUserStats] = useState({
    name: "Siswa Baru",
    kelas: "X - A",
    xp: 320,
    level: 2,
    streak: 5,
    badges: ["First Step", "Info Detective"],
    completedModules: [1],
    testScores: { 1: 90 },
    finalExamScore: null,
    reflections: { 1: "Saya memahami cara membedakan berita hoaks dengan membaca lateral." }
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase auth error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setAuthUser(usr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    // Listen to real-time student updates across all devices
    const studentsCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
    const unsubscribeStudents = onSnapshot(studentsCollectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const loadedStudents = [];
        snapshot.forEach((docSnap) => {
          loadedStudents.push(docSnap.data());
        });
        setStudentsList(loadedStudents);

        // Auto sync local user state if student exists in cloud database
        if (studentProfile.name) {
          const match = loadedStudents.find(s => s.name.toLowerCase() === studentProfile.name.toLowerCase());
          if (match) {
            setUserStats(prev => ({
              ...prev,
              completedModules: match.completed || [],
              testScores: match.testScores || {},
              finalExamScore: match.finalExamScore !== undefined ? match.finalExamScore : null,
              xp: match.xp || prev.xp,
              level: match.level || prev.level
            }));
          }
        }
      }
    }, (err) => {
      console.error("Firestore students sync error:", err);
    });

    // Listen to real-time module lock/unlock settings across all devices
    const settingsDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'unlockedModules');
    const unsubscribeSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.modules)) {
          setUnlockedModules(data.modules);
        }
      }
    }, (err) => {
      console.error("Firestore settings sync error:", err);
    });

    return () => {
      unsubscribeStudents();
      unsubscribeSettings();
    };
  }, [authUser, studentProfile.name]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRegisterStudent = async (nama, kelas) => {
    setStudentProfile({ name: nama, kelas: kelas, isRegistered: true });
    setUserStats(prev => ({ ...prev, name: nama, kelas: kelas }));

    const studentId = nama.toLowerCase().replace(/[^a-z0-9]/g, '_') || Date.now().toString();
    const existing = studentsList.find(s => s.name.toLowerCase() === nama.toLowerCase());

    const studentData = existing ? {
      ...existing,
      kelas: kelas
    } : {
      id: studentId,
      name: nama,
      kelas: kelas,
      level: 2,
      xp: 320,
      completed: [1],
      testScores: { 1: 90 },
      finalExamScore: null,
      status: "Aktif"
    };

    if (authUser) {
      try {
        const studentDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
        await setDoc(studentDocRef, studentData, { merge: true });
      } catch (err) {
        console.error("Failed to save student to Firestore:", err);
      }
    }

    showToast(`Selamat Datang, ${nama} (Kelas ${kelas})! Data tersinkron otomatis untuk semua perangkat.`);
  };

  const handleUpdateStudentModuleScore = async (modId, score) => {
    const currentName = userStats.name || studentProfile.name;
    if (!currentName) return;

    const studentId = currentName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = studentsList.find(s => s.name.toLowerCase() === currentName.toLowerCase()) || {
      id: studentId,
      name: currentName,
      kelas: userStats.kelas || "X - A",
      level: userStats.level || 2,
      xp: userStats.xp || 320,
      completed: [],
      testScores: {},
      finalExamScore: null,
      status: "Aktif"
    };

    const updatedCompleted = existing.completed && existing.completed.includes(modId) 
      ? existing.completed 
      : [...(existing.completed || []), modId];
    
    const updatedScores = { ...(existing.testScores || {}), [modId]: score };

    const updatedStudent = {
      ...existing,
      completed: updatedCompleted,
      testScores: updatedScores,
      status: updatedCompleted.length >= 5 ? "Sangat Baik" : "Aktif"
    };

    if (authUser) {
      try {
        const studentDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
        await setDoc(studentDocRef, updatedStudent, { merge: true });
      } catch (err) {
        console.error("Failed to update score in Firestore:", err);
      }
    }
  };

  const handleUpdateStudentFinalExamScore = async (score) => {
    const currentName = userStats.name || studentProfile.name;
    if (!currentName) return;

    const studentId = currentName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = studentsList.find(s => s.name.toLowerCase() === currentName.toLowerCase()) || {
      id: studentId,
      name: currentName,
      kelas: userStats.kelas || "X - A",
      level: userStats.level || 2,
      xp: userStats.xp || 320,
      completed: [1, 2, 3, 4, 5, 6],
      testScores: {},
      finalExamScore: null,
      status: "Aktif"
    };

    const updatedStudent = {
      ...existing,
      finalExamScore: score,
      status: score >= 85 ? "Sangat Baik" : "Aktif"
    };

    if (authUser) {
      try {
        const studentDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentId);
        await setDoc(studentDocRef, updatedStudent, { merge: true });
      } catch (err) {
        console.error("Failed to update final exam in Firestore:", err);
      }
    }
  };

  const toggleModuleAccess = async (modId) => {
    let newUnlocked = [];
    if (unlockedModules.includes(modId)) {
      if (unlockedModules.length === 1) {
        showToast("⚠️ Minimal 1 modul harus tetap terbuka untuk murid!");
        return;
      }
      newUnlocked = unlockedModules.filter(id => id !== modId);
      showToast(`🔒 Modul ${modId} disembunyikan di semua perangkat.`);
    } else {
      newUnlocked = [...unlockedModules, modId];
      showToast(`🔓 Akses Modul ${modId} dibuka di semua perangkat!`);
    }

    setUnlockedModules(newUnlocked);

    if (authUser) {
      try {
        const settingsDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'unlockedModules');
        await setDoc(settingsDocRef, { modules: newUnlocked });
      } catch (err) {
        console.error("Failed to save settings to Firestore:", err);
      }
    }
  };

  const unlockAllModulesCloud = async () => {
    const allModules = [1, 2, 3, 4, 5, 6];
    setUnlockedModules(allModules);
    showToast("🔓 Seluruh 6 Modul dibuka untuk semua perangkat!");

    if (authUser) {
      try {
        const settingsDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'unlockedModules');
        await setDoc(settingsDocRef, { modules: allModules });
      } catch (err) {
        console.error("Failed to unlock all modules in Firestore:", err);
      }
    }
  };

  const addXP = (amount, badgeToEarn = null) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 200) + 1;
      let newBadges = [...prev.badges];
      
      if (badgeToEarn && !newBadges.includes(badgeToEarn)) {
        newBadges.push(badgeToEarn);
        showToast(`🎉 Lencana Baru Terbuka: ${badgeToEarn}! +${amount} XP`);
      } else {
        showToast(`⚡ +${amount} XP Berhasil Diterima!`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        badges: newBadges
      };
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === 'iskandar' && passwordInput === 'patue') {
      setIsAdminAuthenticated(true);
      setUserRole('guru');
      setIsLoginModalOpen(false);
      setLoginError('');
      setUsernameInput('');
      setPasswordInput('');
      setActiveTab('dashboard');
      showToast("Selamat Datang Bpk. Iskandar Patue, S.Pd! Mode Guru/Admin Aktif.");
    } else {
      setLoginError('Username atau Password Admin Salah!');
    }
  };

  const currentModule = CURRICULUM_DATA.find(m => m.id === selectedModuleId) || CURRICULUM_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col md:flex-row">
      
      {/* Modal Registrasi Awal Murid */}
      {userRole === 'murid' && !studentProfile.isRegistered && (
        <StudentOnboardingModal 
          onRegister={handleRegisterStudent} 
          onSwitchToTeacher={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* Modal Cetak Rapor Murid */}
      {selectedStudentForPrint && (
        <PrintableReportModal 
          student={selectedStudentForPrint} 
          onClose={() => setSelectedStudentForPrint(null)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center space-x-3 p-2 mb-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Informatika Hub</h1>
              <span className="text-xs text-indigo-400 font-medium tracking-wide">SMA KELAS 10 • LMS VERCEL</span>
            </div>
          </div>

          {/* DUAL MODE SELECTOR PROMINENT AT TOP */}
          <div className="bg-slate-950 p-2.5 rounded-2xl border border-indigo-500/40 mb-5 shadow-lg">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
              <span>PILIH MODE AKSES AWAL</span>
              <span className={userRole === 'guru' ? 'text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800' : 'text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800'}>
                {userRole === 'guru' ? 'GURU / ADMIN' : 'MODE MURID'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setUserRole('murid');
                  setActiveTab('dashboard');
                  showToast("Masuk ke Mode Murid");
                }}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'murid'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Mode Murid</span>
              </button>
              
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setUserRole('guru');
                    setActiveTab('dashboard');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'guru'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Mode Guru</span>
              </button>
            </div>
          </div>

          {userRole === 'murid' ? (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-5 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white shadow">
                    {userStats.name.charAt(0)}
                  </div>
                  <div className="truncate max-w-[110px]">
                    <p className="text-sm font-semibold text-white truncate">{userStats.name}</p>
                    <span className="text-[10px] text-indigo-300 font-bold bg-indigo-950/90 px-2 py-0.5 rounded-full border border-indigo-800/50">
                      Kelas {userStats.kelas || "X - A"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 bg-amber-950/60 border border-amber-700/50 px-2.5 py-1 rounded-full text-amber-400 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                  <span>{userStats.streak} Hari</span>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">XP Progress</span>
                  <span className="text-indigo-300">{userStats.xp} / {userStats.level * 200} XP</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (userStats.xp % 200) / 2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/90 border border-emerald-500/40 rounded-2xl p-4 mb-5 relative overflow-hidden shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md border border-emerald-400/40">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Iskandar Patue, S.Pd</p>
                  <span className="text-[11px] text-emerald-400 font-semibold">Guru Pengampu Informatika</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs text-slate-300 font-medium">
                <span>NIP: 19880412 201503 1 002</span>
                <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Admin</span>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'dashboard' 
                  ? userRole === 'guru' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>{userRole === 'guru' ? 'Dashboard Admin Guru' : 'Dashboard & Modul'}</span>
            </button>

            {userRole === 'guru' && (
              <button
                onClick={() => setActiveTab('classProgress')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === 'classProgress'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Rekap & Cetak Hasil Murid</span>
              </button>
            )}

            <div className="pt-3 pb-1 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Materi Informatika 10
            </div>

            {CURRICULUM_DATA.map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeTab === 'module' && selectedModuleId === mod.id;
              const isCompleted = userStats.completedModules.includes(mod.id);
              const isUnlockedByTeacher = unlockedModules.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    if (userRole === 'murid' && !isUnlockedByTeacher) {
                      showToast(`🔒 Modul ${mod.id} sedang disembunyikan oleh Bpk. Iskandar Patue, S.Pd`);
                      return;
                    }
                    setSelectedModuleId(mod.id);
                    setActiveTab('module');
                    setModuleSubTab('materi');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isSelected
                      ? userRole === 'guru' ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'bg-slate-800 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : !isUnlockedByTeacher && userRole === 'murid'
                        ? 'text-slate-600 bg-slate-950/40 opacity-60 cursor-not-allowed'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate pr-2">
                    <div className={`p-1.5 rounded-lg bg-slate-800 border border-slate-700 ${isSelected ? (userRole === 'guru' ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-400'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{mod.id}. {mod.title}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {userRole === 'murid' && !isUnlockedByTeacher && (
                      <Lock className="w-3.5 h-3.5 text-amber-500/80" />
                    )}
                    {isCompleted && userRole === 'murid' && isUnlockedByTeacher && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}

            <div className="pt-3 pb-1 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Evaluasi Akhir
            </div>

            <button
              onClick={() => setActiveTab('finalExam')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'finalExam'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 hover:bg-amber-950/30 hover:text-amber-300'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>{userRole === 'guru' ? 'Kunci Tes Akhir Semester' : 'Tes Akhir Semester'}</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4 text-xs text-slate-500 flex items-center justify-between">
          <span>Kurikulum Merdeka 2026</span>
          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Cloud Sync</span>
        </div>
      </aside>

      {/* Admin Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Login Portal Guru & Admin</h2>
              <p className="text-xs text-slate-400">
                Otentikasi khusus Guru Pengampu Informatika: <strong className="text-emerald-400">Iskandar Patue, S.Pd</strong>
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Username Admin</label>
                <input 
                  type="text"
                  placeholder="Masukkan Username (iskandar)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password Admin</label>
                <input 
                  type="password"
                  placeholder="Masukkan Password (patue)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Portal Guru</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Display Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl font-medium flex items-center space-x-2 border border-indigo-400 animate-bounce">
            <Sparkles className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic View Rendering */}
        {userRole === 'guru' ? (
          <>
            {activeTab === 'dashboard' && (
              <TeacherDashboardView 
                onSelectModule={(id) => {
                  setSelectedModuleId(id);
                  setActiveTab('module');
                  setModuleSubTab('tesModul');
                }}
                onViewClassProgress={() => setActiveTab('classProgress')}
                unlockedModules={unlockedModules}
                onToggleModuleAccess={toggleModuleAccess}
                onUnlockAllModules={unlockAllModulesCloud}
              />
            )}
            {activeTab === 'classProgress' && (
              <TeacherClassProgressView 
                studentsList={studentsList}
                onPrintStudent={(std) => setSelectedStudentForPrint(std)}
              />
            )}
            {activeTab === 'module' && (
              <TeacherModuleDetailView 
                moduleData={currentModule}
                subTab={moduleSubTab}
                setSubTab={setModuleSubTab}
              />
            )}
            {activeTab === 'finalExam' && (
              <TeacherFinalExamKeyView />
            )}
          </>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboardView 
                onSelectModule={(id) => {
                  if (!unlockedModules.includes(id)) {
                    showToast(`🔒 Modul ${id} belum dibuka oleh Bpk. Iskandar Patue, S.Pd`);
                    return;
                  }
                  setSelectedModuleId(id);
                  setActiveTab('module');
                  setModuleSubTab('materi');
                }}
                userStats={userStats}
                unlockedModules={unlockedModules}
                onStartExam={() => setActiveTab('finalExam')}
              />
            )}
            {activeTab === 'module' && (
              <ModuleDetailView 
                moduleData={currentModule}
                subTab={moduleSubTab}
                setSubTab={setModuleSubTab}
                userStats={userStats}
                addXP={addXP}
                setUserStats={setUserStats}
                onSyncModuleScore={handleUpdateStudentModuleScore}
              />
            )}
            {activeTab === 'finalExam' && (
              <FinalExamView 
                addXP={addXP} 
                userStats={userStats} 
                setUserStats={setUserStats}
                userRole={userRole}
                onSyncFinalExamScore={handleUpdateStudentFinalExamScore}
              />
            )}
          </>
        )}

      </main>
    </div>
  );
}

function StudentOnboardingModal({ onRegister, onSwitchToTeacher }) {
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('X - A');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim()) return;
    onRegister(nama.trim(), kelas);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Registrasi Masuk Murid</h2>
          <p className="text-xs text-slate-300">
            Silakan masukkan **Nama Lengkap** & pilih **Kelas** Anda sebelum memulai belajar. Data ini otomatis tersinkron ke **Bpk. Iskandar Patue, S.Pd**.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase mb-1.5">
              Nama Lengkap Murid:
            </label>
            <input 
              type="text"
              placeholder="Contoh: Ahmad Rizky"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase mb-1.5">
              Pilih Rombongan Belajar (Kelas X):
            </label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-bold"
            >
              <option value="X - A">Kelas X - A</option>
              <option value="X - B">Kelas X - B</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mulai Pembelajaran Informatika</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onSwitchToTeacher}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center justify-center space-x-1.5 mx-auto"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Anda Guru / Admin? Klik di sini untuk Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintableReportModal({ student, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 my-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b-2 border-slate-700 pb-4 text-center space-y-1">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            SISTEM MANAJEMEN PEMBELAJARAN (LMS) INFORMATIKA SMA
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">LAPORAN HASIL EVALUASI BELAJAR SISWA</h2>
          <p className="text-xs text-slate-300">Tahun Ajaran 2025/2026 • Kurikulum Merdeka</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Nama Siswa:</span>
            <strong className="text-white text-sm">{student.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Kelas / Rombel:</span>
            <strong className="text-indigo-400 text-sm">{student.kelas || "X - A"}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Status Capaian:</span>
            <strong className="text-emerald-400 text-sm">{student.status}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Total Pengalaman:</span>
            <strong className="text-amber-400 text-sm">{student.xp || 320} XP (Lvl {student.level || 2})</strong>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Hasil Tes Evaluasi Formatif Tiap Modul (1 - 6)</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800">
              <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Modul Pembelajaran</th>
                  <th className="p-2.5">Status Tes Modul</th>
                  <th className="p-2.5 text-right">Nilai / Skor Modul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {CURRICULUM_DATA.map((mod) => {
                  const isFinished = student.completed && student.completed.includes(mod.id);
                  const score = student.testScores ? student.testScores[mod.id] : null;

                  return (
                    <tr key={mod.id}>
                      <td className="p-2.5 font-medium text-slate-200">
                        Modul {mod.id}: {mod.title}
                      </td>
                      <td className="p-2.5">
                        {isFinished ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Sudah Mengerjakan
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Belum Mengerjakan
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-indigo-300">
                        {score !== undefined && score !== null ? `${score} / 100` : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Tes Evaluasi Akhir Semester (30 Nomor)</h4>
            <p className="text-xs text-slate-400">
              Status Ujian: {student.finalExamScore !== null && student.finalExamScore !== undefined ? "✅ Selesai Dikerjakan" : "⏳ Belum Mengerjakan"}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Skor Ujian Akhir</span>
            <span className="text-2xl font-extrabold text-amber-400">
              {student.finalExamScore !== null && student.finalExamScore !== undefined ? `${student.finalExamScore} / 100` : "N/A"}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs text-slate-300">
          <div>
            <p className="text-slate-400">Cetak Otomatis LMS Informatika SMA</p>
            <p className="text-[10px] text-slate-500">Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="text-center space-y-10">
            <p className="font-semibold">Guru Pengampu Mata Pelajaran,</p>
            <div>
              <p className="font-bold text-white underline text-sm">Iskandar Patue, S.Pd</p>
              <p className="text-[10px] text-slate-400">NIP: 19880412 201503 1 002</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3 print:hidden">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Tutup Window
          </button>
          <button 
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Hasil / Rapor (PDF/Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherClassProgressView({ studentsList, onPrintStudent }) {
  const [classFilter, setClassFilter] = useState('Semua');

  const filteredStudents = studentsList.filter(s => {
    if (classFilter === 'Semua') return true;
    return s.kelas === classFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Monitoring, Rekap & Cetak Hasil Murid</h1>
              <p className="text-xs text-slate-400">Mata Pelajaran Informatika X • Guru Pengampu: Iskandar Patue, S.Pd</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <Filter className="w-4 h-4 text-emerald-400 ml-2" />
            <span className="text-xs font-bold text-slate-400">Kelas:</span>
            {['Semua', 'X - A', 'X - B'].map(cls => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  classFilter === cls
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Murid</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Status Tes Modul 1-6</th>
                <th className="py-3 px-4">Tes Akhir Semester</th>
                <th className="py-3 px-4 text-center">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStudents.map((std) => {
                const finishedCount = std.completed ? std.completed.length : 0;
                const hasDoneFinalExam = std.finalExamScore !== null && std.finalExamScore !== undefined;

                return (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {std.name}
                      <div className="text-[10px] text-slate-500">Level {std.level || 2} ({std.xp || 320} XP)</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-indigo-400">
                      {std.kelas || "X - A"}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 mb-1">
                        {[1, 2, 3, 4, 5, 6].map(mId => {
                          const done = std.completed && std.completed.includes(mId);
                          return (
                            <span 
                              key={mId} 
                              title={`Modul ${mId}: ${done ? 'Selesai' : 'Belum'}`}
                              className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center border ${
                                done 
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                                  : 'bg-rose-950 text-rose-300 border-rose-900'
                              }`}
                            >
                              M{mId}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {finishedCount} dari 6 Modul Selesai
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {hasDoneFinalExam ? (
                        <span className="text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Skor: {std.finalExamScore}
                        </span>
                      ) : (
                        <span className="text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Belum Ujian
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onPrintStudent(std)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md flex items-center space-x-1 mx-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Hasil</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboardView({ onSelectModule, onViewClassProgress, unlockedModules, onToggleModuleAccess, onUnlockAllModules }) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PORTAL GURU & ADMIN</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Bpk. Iskandar Patue, S.Pd</h1>
            <p className="text-xs text-slate-400 mt-1">Sistem Manajemen Pembelajaran Informatika SMA Kelas 10</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onUnlockAllModules}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-md"
          >
            <Unlock className="w-4 h-4" />
            <span>Buka Seluruh Modul</span>
          </button>
          <button
            onClick={onViewClassProgress}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-md"
          >
            <Users className="w-4 h-4" />
            <span>Rekap Murid</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Kontrol Rilis & Akses Materi Siswa (6 Modul)</span>
        </h2>
        <p className="text-xs text-slate-400">Guru dapat mengunci/membuka akses modul agar murid fokus pada topik terdaftar.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {CURRICULUM_DATA.map((mod) => {
            const isUnlocked = unlockedModules.includes(mod.id);
            const Icon = mod.icon;

            return (
              <div key={mod.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate pr-2">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">Modul {mod.id}</p>
                    <p className="text-[11px] text-slate-400 truncate">{mod.title}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleModuleAccess(mod.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isUnlocked
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isUnlocked ? 'Terbuka' : 'Terkunci'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeacherModuleDetailView({ moduleData, subTab, setSubTab }) {
  const Icon = moduleData.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${moduleData.color} text-white shadow-lg`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">MODE GURU (KUNCI & PEMBAHASAN)</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Modul {moduleData.id}: {moduleData.title}</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">{moduleData.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto">
        {[
          { id: 'materi', label: '📚 Materi Pembelajaran', icon: BookOpen },
          { id: 'soal', label: '❓ 5 Contoh Soal & Pembahasan', icon: HelpCircle },
          { id: 'tesModul', label: '🔑 Kunci & Pembahasan Tes Modul (10 Soal)', icon: FileCheck }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {subTab === 'materi' && <MateriContent materials={moduleData.materials} />}
        {subTab === 'soal' && <SampleQuestionsContent questions={moduleData.sampleQuestions} showTeacherNote={true} />}
        {subTab === 'tesModul' && <TeacherModuleTestAnswers questions={moduleData.moduleTest} moduleId={moduleData.id} />}
      </div>
    </div>
  );
}

function TeacherModuleTestAnswers({ questions, moduleId }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <span>Kunci Jawaban & Pembahasan Pedagogis Tes Modul {moduleId}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Panduan Asesmen khusus Bpk. Iskandar Patue, S.Pd (10 Soal Format Kompleks)</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((item, idx) => (
          <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs px-3 py-1 rounded-full">
                Soal #{idx + 1} • {
                  item.type === 'pg_single' ? 'PG A-E' :
                  item.type === 'pg_multi' ? 'PG Kompleks (3 Jawaban)' :
                  item.type === 'isian' ? 'Isian Singkat' : 'Pernyataan B/S'
                }
              </span>
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed">{item.q}</p>

            {item.type === 'pg_single' && (
              <div className="space-y-2">
                {item.options.map((opt, oIdx) => {
                  const isCorrect = item.answer === oIdx;
                  return (
                    <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between ${
                      isCorrect ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                      {isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            )}

            {item.type === 'pg_multi' && (
              <div className="space-y-2">
                {item.options.map((opt, oIdx) => {
                  const isCorrect = item.answers.includes(oIdx);
                  return (
                    <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between ${
                      isCorrect ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                      {isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            )}

            {item.type === 'isian' && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-300 font-bold">
                Kunci Jawaban Isian: "{item.answer}"
              </div>
            )}

            {item.type === 'tf_statements' && (
              <div className="space-y-2">
                {item.statements.map((st, sIdx) => (
                  <div key={sIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                    <span className="text-slate-300">{sIdx + 1}. {st.text}</span>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      st.isTrue ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {st.isTrue ? 'BENAR' : 'SALAH'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300 space-y-1">
              <strong className="block text-indigo-400">💡 Pembahasan Pedagogis Guru:</strong>
              <p>{item.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherFinalExamKeyView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-2xl">
            <Key className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">PORTAL GURU & ADMIN</span>
            <h1 className="text-2xl font-extrabold text-white">Kunci Jawaban Ujian Akhir Semester (30 Soal)</h1>
            <p className="text-xs text-slate-400 mt-1">Panduan Asesmen Komprehensif • Bpk. Iskandar Patue, S.Pd</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {FINAL_EXAM_QUESTIONS.map((item, idx) => (
          <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs px-3 py-1 rounded-full">
              Soal #{idx + 1} (Modul {item.moduleId}) • {
                item.type === 'pg_single' ? 'PG A-E' :
                item.type === 'pg_multi' ? 'PG Kompleks (3 Jawaban)' :
                item.type === 'isian' ? 'Isian' : 'Pernyataan B/S'
              }
            </span>

            <p className="text-sm font-semibold text-white leading-relaxed">{item.q}</p>

            {item.type === 'pg_single' && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-xl font-bold">
                Kunci Jawaban Benar: Option {String.fromCharCode(65 + item.answer)} — {item.options[item.answer]}
              </div>
            )}

            {item.type === 'pg_multi' && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-xl font-bold space-y-1">
                <div>3 Kunci Jawaban Benar:</div>
                <ul className="list-disc list-inside">
                  {item.answers.map(ans => (
                    <li key={ans}>Option {String.fromCharCode(65 + ans)}: {item.options[ans]}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.type === 'isian' && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-xl font-bold">
                Kunci Jawaban Isian: "{item.answer}"
              </div>
            )}

            {item.type === 'tf_statements' && (
              <div className="space-y-1.5">
                {item.statements.map((st, sIdx) => (
                  <div key={sIdx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs flex justify-between">
                    <span>{sIdx + 1}. {st.text}</span>
                    <strong className={st.isTrue ? 'text-emerald-400' : 'text-rose-400'}>{st.isTrue ? 'BENAR' : 'SALAH'}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300">
              <strong>💡 Pembahasan Pedagogis:</strong> {item.explanation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentDashboardView({ onSelectModule, userStats, unlockedModules, onStartExam }) {
  const completedCount = userStats.completedModules.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/40">
            SELAMAT DATANG SISWA
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            Halo, {userStats.name}! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Siap tingkatkan kompetensi informatika digitalmu? Selesaikan materi, taklukkan kuis game Gen Z, dan raih nilai tertinggi pada Tes Akhir Semester!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Tingkat Pengalaman</span>
            <h3 className="text-2xl font-black text-amber-400">Level {userStats.level}</h3>
          </div>
          <Award className="w-8 h-8 text-amber-400" />
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Total Pengalaman (XP)</span>
            <h3 className="text-2xl font-black text-indigo-400">{userStats.xp} XP</h3>
          </div>
          <Zap className="w-8 h-8 text-indigo-400" />
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold">Ketuntasan Tes Modul</span>
            <h3 className="text-2xl font-black text-emerald-400">{completedCount} / 6 Modul</h3>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Materi Pembelajaran Informatika X</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_DATA.map((mod) => {
            const Icon = mod.icon;
            const isUnlocked = unlockedModules.includes(mod.id);
            const isCompleted = userStats.completedModules.includes(mod.id);

            return (
              <div 
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  !isUnlocked 
                    ? 'bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed' 
                    : isCompleted 
                      ? 'bg-slate-900 border-emerald-500/40 hover:border-emerald-400' 
                      : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.color} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {!isUnlocked ? (
                    <span className="bg-amber-950 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-800 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Disembunyikan Guru
                    </span>
                  ) : isCompleted ? (
                    <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Tuntas
                    </span>
                  ) : (
                    <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-800">
                      Modul {mod.id}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base mb-1">{mod.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{mod.subtitle}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-bold">
                  <span>{isUnlocked ? 'Mulai Pelajari' : 'Terkunci'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModuleDetailView({ moduleData, subTab, setSubTab, userStats, addXP, setUserStats, onSyncModuleScore }) {
  const Icon = moduleData.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${moduleData.color} text-white shadow-lg`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">MODUL PEMBELAJARAN {moduleData.id}</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{moduleData.title}</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">{moduleData.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto">
        {[
          { id: 'materi', label: '📚 Bahan Ajar Materi', icon: BookOpen },
          { id: 'soal', label: '❓ 5 Contoh Soal & Pembahasan', icon: HelpCircle },
          { id: 'game', label: '🎮 Game Kuis Gen Z', icon: Gamepad2 },
          { id: 'tesModul', label: '📝 Tes Evaluasi Modul (10 Soal)', icon: CheckSquare },
          { id: 'refleksi', label: '🧠 Refleksi Diri', icon: Brain }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-3 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {subTab === 'materi' && <MateriContent materials={moduleData.materials} />}
        {subTab === 'soal' && <SampleQuestionsContent questions={moduleData.sampleQuestions} showTeacherNote={false} />}
        {subTab === 'game' && <GameQuizContent moduleData={moduleData} addXP={addXP} />}
        {subTab === 'tesModul' && (
          <StudentModuleTest 
            questions={moduleData.moduleTest} 
            moduleId={moduleData.id}
            addXP={addXP}
            setUserStats={setUserStats}
            onSyncModuleScore={onSyncModuleScore}
          />
        )}
        {subTab === 'refleksi' && (
          <ReflectionView 
            moduleId={moduleData.id} 
            userStats={userStats} 
            setUserStats={setUserStats} 
            addXP={addXP}
          />
        )}
      </div>
    </div>
  );
}

function StudentModuleTest({ questions, moduleId, addXP, setUserStats, onSyncModuleScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSingleChange = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleMultiChange = (qId, optionIdx) => {
    const current = answers[qId] || [];
    if (current.includes(optionIdx)) {
      setAnswers(prev => ({ ...prev, [qId]: current.filter(i => i !== optionIdx) }));
    } else {
      if (current.length < 3) {
        setAnswers(prev => ({ ...prev, [qId]: [...current, optionIdx] }));
      }
    }
  };

  const handleIsianChange = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleTFChange = (qId, stmtIdx, isTrue) => {
    const current = answers[qId] || {};
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...current, [stmtIdx]: isTrue }
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;

    questions.forEach(q => {
      const userAns = answers[q.id];
      if (userAns === undefined) return;

      if (q.type === 'pg_single') {
        if (userAns === q.answer) correctCount++;
      } else if (q.type === 'pg_multi') {
        if (Array.isArray(userAns) && userAns.length === 3) {
          const match = q.answers.every(a => userAns.includes(a));
          if (match) correctCount++;
        }
      } else if (q.type === 'isian') {
        if (typeof userAns === 'string' && userAns.trim().toLowerCase() === q.answer.toLowerCase()) {
          correctCount++;
        }
      } else if (q.type === 'tf_statements') {
        let allTrue = true;
        q.statements.forEach((st, idx) => {
          if (userAns[idx] !== st.isTrue) allTrue = false;
        });
        if (allTrue) correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    setUserStats(prev => {
      const completed = prev.completedModules.includes(moduleId) 
        ? prev.completedModules 
        : [...prev.completedModules, moduleId];
      return {
        ...prev,
        completedModules: completed,
        testScores: { ...prev.testScores, [moduleId]: finalScore }
      };
    });

    onSyncModuleScore(moduleId, finalScore);
    addXP(150, `Module ${moduleId} Master`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Tes Evaluasi Akhir Modul {moduleId}</h2>
          <p className="text-xs text-slate-400 mt-1">Kerjakan 10 soal evaluasi. Hasil nilai akan langsung tercatat di rapor.</p>
        </div>
        {submitted && (
          <div className="bg-emerald-950 border border-emerald-700 px-4 py-2 rounded-2xl text-center">
            <span className="text-[10px] text-emerald-300 font-bold uppercase block">Skor Kamu</span>
            <span className="text-2xl font-black text-emerald-400">{score} / 100</span>
          </div>
        )}
      </div>

      {!submitted ? (
        <div className="space-y-6">
          {questions.map((item, idx) => (
            <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-3 py-1 rounded-full">
                Soal #{idx + 1} • {
                  item.type === 'pg_single' ? 'PG A-E' :
                  item.type === 'pg_multi' ? 'PG Kompleks (Pilih 3)' :
                  item.type === 'isian' ? 'Isian Singkat' : 'Pernyataan B/S'
                }
              </span>

              <p className="text-sm font-semibold text-white leading-relaxed">{item.q}</p>

              {item.type === 'pg_single' && (
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => (
                    <label key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center space-x-3 cursor-pointer transition-all ${
                      answers[item.id] === oIdx ? 'bg-indigo-950 border-indigo-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <input 
                        type="radio" 
                        name={item.id} 
                        checked={answers[item.id] === oIdx}
                        onChange={() => handleSingleChange(item.id, oIdx)}
                        className="accent-indigo-500"
                      />
                      <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {item.type === 'pg_multi' && (
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => {
                    const isChecked = (answers[item.id] || []).includes(oIdx);
                    return (
                      <label key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center space-x-3 cursor-pointer transition-all ${
                        isChecked ? 'bg-indigo-950 border-indigo-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleMultiChange(item.id, oIdx)}
                          className="accent-indigo-500 rounded"
                        />
                        <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {item.type === 'isian' && (
                <input 
                  type="text"
                  placeholder="Ketikkan jawaban 1 atau 2 kata..."
                  value={answers[item.id] || ''}
                  onChange={(e) => handleIsianChange(item.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              )}

              {item.type === 'tf_statements' && (
                <div className="space-y-3">
                  {item.statements.map((st, sIdx) => {
                    const currentVal = answers[item.id]?.[sIdx];
                    return (
                      <div key={sIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <span className="text-slate-300">{sIdx + 1}. {st.text}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleTFChange(item.id, sIdx, true)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentVal === true ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            BENAR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTFChange(item.id, sIdx, false)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentVal === false ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            SALAH
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={calculateScore}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Kirim Jawaban & Selesaikan Tes Modul</span>
          </button>
        </div>
      ) : (
        <div className="p-8 bg-slate-950 border border-emerald-500/30 rounded-3xl text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-black text-white">Tes Modul {moduleId} Selesai Dikerjakan!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Hasil skor kamu **{score} / 100** telah berhasil disimpan ke database guru **Bpk. Iskandar Patue, S.Pd**. Kunci jawaban dirahasiakan untuk menjaga integritas tes.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Kerjakan Ulang Tes Modul
          </button>
        </div>
      )}
    </div>
  );
}

function FinalExamView({ addXP, userStats, setUserStats, userRole, onSyncFinalExamScore }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isUnlockedForStudent = userRole === 'guru' || userStats.completedModules.length >= 6;

  const handleSingleChange = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleMultiChange = (qId, optionIdx) => {
    const current = answers[qId] || [];
    if (current.includes(optionIdx)) {
      setAnswers(prev => ({ ...prev, [qId]: current.filter(i => i !== optionIdx) }));
    } else {
      if (current.length < 3) {
        setAnswers(prev => ({ ...prev, [qId]: [...current, optionIdx] }));
      }
    }
  };

  const handleIsianChange = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleTFChange = (qId, stmtIdx, isTrue) => {
    const current = answers[qId] || {};
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...current, [stmtIdx]: isTrue }
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;

    FINAL_EXAM_QUESTIONS.forEach(q => {
      const userAns = answers[q.id];
      if (userAns === undefined) return;

      if (q.type === 'pg_single') {
        if (userAns === q.answer) correctCount++;
      } else if (q.type === 'pg_multi') {
        if (Array.isArray(userAns) && userAns.length === 3) {
          const match = q.answers.every(a => userAns.includes(a));
          if (match) correctCount++;
        }
      } else if (q.type === 'isian') {
        if (typeof userAns === 'string' && userAns.trim().toLowerCase() === q.answer.toLowerCase()) {
          correctCount++;
        }
      } else if (q.type === 'tf_statements') {
        let allTrue = true;
        q.statements.forEach((st, idx) => {
          if (userAns[idx] !== st.isTrue) allTrue = false;
        });
        if (allTrue) correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / FINAL_EXAM_QUESTIONS.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    setUserStats(prev => ({ ...prev, finalExamScore: finalScore }));
    onSyncFinalExamScore(finalScore);
    addXP(300, "Semester Conqueror");
  };

  if (!isUnlockedForStudent) {
    return (
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/40">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Tes Akhir Semester Terkunci</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Kamu harus menuntaskan **seluruh 6 Tes Evaluasi Modul** terlebih dahulu untuk membuka Ujian Akhir Semester.
        </p>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl max-w-sm mx-auto space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Ketuntasan Modul</span>
            <span className="text-indigo-400">{userStats.completedModules.length} / 6 Selesai</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(userStats.completedModules.length / 6) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">EVALUASI AKHIR COMPREHENSIVE</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Tes Akhir Semester Informatika X (30 Soal)</h1>
          <p className="text-xs text-slate-300 mt-1">Menguji seluruh kompetensi Modul 1 sampai Modul 6.</p>
        </div>
        {submitted && (
          <div className="bg-emerald-950 border border-emerald-700 px-5 py-3 rounded-2xl text-center">
            <span className="text-xs text-emerald-300 font-bold uppercase block">Skor Ujian Akhir</span>
            <span className="text-3xl font-black text-amber-400">{score} / 100</span>
          </div>
        )}
      </div>

      {!submitted ? (
        <div className="space-y-6">
          {FINAL_EXAM_QUESTIONS.map((item, idx) => (
            <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs px-3 py-1 rounded-full">
                Soal #{idx + 1} (Modul {item.moduleId}) • {
                  item.type === 'pg_single' ? 'PG A-E' :
                  item.type === 'pg_multi' ? 'PG Kompleks (Pilih 3)' :
                  item.type === 'isian' ? 'Isian Singkat' : 'Pernyataan B/S'
                }
              </span>

              <p className="text-sm font-semibold text-white leading-relaxed">{item.q}</p>

              {item.type === 'pg_single' && (
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => (
                    <label key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center space-x-3 cursor-pointer transition-all ${
                      answers[item.id] === oIdx ? 'bg-amber-950 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <input 
                        type="radio" 
                        name={item.id} 
                        checked={answers[item.id] === oIdx}
                        onChange={() => handleSingleChange(item.id, oIdx)}
                        className="accent-amber-500"
                      />
                      <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {item.type === 'pg_multi' && (
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => {
                    const isChecked = (answers[item.id] || []).includes(oIdx);
                    return (
                      <label key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center space-x-3 cursor-pointer transition-all ${
                        isChecked ? 'bg-amber-950 border-amber-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleMultiChange(item.id, oIdx)}
                          className="accent-amber-500 rounded"
                        />
                        <span><strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {item.type === 'isian' && (
                <input 
                  type="text"
                  placeholder="Ketikkan jawaban 1 atau 2 kata..."
                  value={answers[item.id] || ''}
                  onChange={(e) => handleIsianChange(item.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              )}

              {item.type === 'tf_statements' && (
                <div className="space-y-3">
                  {item.statements.map((st, sIdx) => {
                    const currentVal = answers[item.id]?.[sIdx];
                    return (
                      <div key={sIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <span className="text-slate-300">{sIdx + 1}. {st.text}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleTFChange(item.id, sIdx, true)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentVal === true ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            BENAR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTFChange(item.id, sIdx, false)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              currentVal === false ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            SALAH
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={calculateScore}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Kirim Jawaban & Selesaikan Tes Akhir Semester</span>
          </button>
        </div>
      ) : (
        <div className="p-8 bg-slate-950 border border-amber-500/30 rounded-3xl text-center space-y-4 shadow-2xl">
          <Trophy className="w-14 h-14 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-3xl font-black text-white">Selamat! Ujian Akhir Semester Selesai!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Skor Ujian Akhir Kamu: <strong className="text-amber-400 text-lg">{score} / 100</strong>. Data hasil telah berhasil disinkronkan ke **Bpk. Iskandar Patue, S.Pd**.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Ulangi Tes Ujian Akhir
          </button>
        </div>
      )}
    </div>
  );
}

function MateriContent({ materials }) {
  return (
    <div className="space-y-6">
      {materials.map((item, idx) => (
        <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-lg font-bold text-indigo-300 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500 text-indigo-400 text-xs flex items-center justify-center font-bold">{idx + 1}</span>
            <span>{item.title}</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed pl-8">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}

function SampleQuestionsContent({ questions, showTeacherNote }) {
  const [activeExplain, setActiveExplain] = useState({});

  const toggleExplain = (idx) => {
    setActiveExplain(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white">5 Contoh Soal & Pembahasan Latihan</h2>
        <p className="text-xs text-slate-400 mt-1">Variasi pilihan ganda A-E, kompleks, isian, dan pernyataan benar/salah.</p>
      </div>

      {questions.map((item, idx) => (
        <div key={item.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-3 py-1 rounded-full">
            Contoh Soal #{idx + 1} • {
              item.type === 'pg_single' ? 'PG A-E' :
              item.type === 'pg_multi' ? 'PG Kompleks (3 Jawaban)' :
              item.type === 'isian' ? 'Isian Singkat' : 'Pernyataan B/S'
            }
          </span>

          <p className="text-sm font-semibold text-white leading-relaxed">{item.q}</p>

          {item.type === 'pg_single' && (
            <div className="space-y-2">
              {item.options.map((opt, oIdx) => (
                <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border ${
                  item.answer === oIdx ? 'bg-indigo-950 text-indigo-300 border-indigo-700 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}
                </div>
              ))}
            </div>
          )}

          {item.type === 'pg_multi' && (
            <div className="space-y-2">
              {item.options.map((opt, oIdx) => (
                <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border ${
                  item.answers.includes(oIdx) ? 'bg-indigo-950 text-indigo-300 border-indigo-700 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <strong className="mr-2">{String.fromCharCode(65 + oIdx)}.</strong>{opt}
                </div>
              ))}
            </div>
          )}

          {item.type === 'isian' && (
            <div className="p-3 bg-indigo-950 border border-indigo-800 rounded-xl text-xs text-indigo-300 font-bold">
              Jawaban Benar: "{item.answer}"
            </div>
          )}

          {item.type === 'tf_statements' && (
            <div className="space-y-2">
              {item.statements.map((st, sIdx) => (
                <div key={sIdx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs flex justify-between">
                  <span className="text-slate-300">{sIdx + 1}. {st.text}</span>
                  <strong className={st.isTrue ? 'text-emerald-400' : 'text-rose-400'}>{st.isTrue ? 'BENAR' : 'SALAH'}</strong>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => toggleExplain(idx)}
            className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{activeExplain[idx] ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan Lengkap'}</span>
          </button>

          {activeExplain[idx] && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
              <strong className="text-indigo-400 block">💡 Pembahasan Detail:</strong>
              <p>{item.explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GameQuizContent({ moduleData, addXP }) {
  return (
    <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-indigo-500/30 text-center space-y-6">
      <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/40">
        <Gamepad2 className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">Gen Z Gamified Quiz Arena — Modul {moduleData.id}</h2>
        <p className="text-xs text-slate-400 mt-1">Selesaikan simulasi interaktif untuk klaim +100 XP!</p>
      </div>

      <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 max-w-md mx-auto">
        <span className="bg-indigo-950 text-indigo-300 font-bold text-xs px-3 py-1 rounded-full border border-indigo-800">
          Arena Game Tantangan #{moduleData.id}
        </span>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tunjukkan kemampuan komputasimu dalam mini game bertema **{moduleData.title}**. Uji pemahaman materi secara menyenangkan!
        </p>

        <button
          onClick={() => addXP(100, moduleData.badge)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Selesaikan Tantangan Game & Klaim +100 XP</span>
        </button>
      </div>
    </div>
  );
}

function ReflectionView({ moduleId, userStats, setUserStats, addXP }) {
  const [text, setText] = useState(userStats.reflections[moduleId] || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setUserStats(prev => ({
      ...prev,
      reflections: { ...prev.reflections, [moduleId]: text }
    }));

    setSaved(true);
    addXP(50);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span>Refleksi Pembelajaran Siswa — Modul {moduleId}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Tuliskan pemahaman mendalam dan pengalaman belajar kamu untuk modul ini (+50 XP).</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <textarea
          rows={5}
          placeholder="Apa hal paling berkesan yang kamu pelajari dari modul ini? Bagian mana yang menurutmu paling menantang?"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          required
        ></textarea>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">*Refleksi dapat diperbarui kapan saja.</span>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simpan Refleksi Diri</span>
          </button>
        </div>
      </form>

      {saved && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Refleksi berhasil disimpan! Kamu mendapatkan +50 XP.</span>
        </div>
      )}
    </div>
  );
}
