
const translations = {
    ar: {
        langBtn: "English",
        titleStart: "محمل صور",
        titleEnd: "يوتيوب",
        placeholder: "الصق رابط الفيديو هنا...",
        fetchBtn: "جلب الصورة",
        error: "الرابط غير صالح! تأكد من الرابط وحاول مرة أخرى.",
        download: "تحميل الصورة (HD)",
        note: "أعلى جودة متوفرة"
    },
    en: {
        langBtn: "العربية",
        titleStart: "YouTube",
        titleEnd: "Grabber",
        placeholder: "Paste YouTube Link Here...",
        fetchBtn: "GET THUMBNAIL",
        error: "Invalid URL! Please check the link.",
        download: "Download Image (HD)",
        note: "Highest Quality Available"
    }
};

let currentLang = 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = translations[currentLang];
    const htmlTag = document.documentElement;

    // تغيير الاتجاه
    htmlTag.setAttribute('lang', currentLang);
    htmlTag.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    // تحديث النصوص
    document.querySelector('.lang-btn').innerText = t.langBtn;
    // تم تعديل هذا الجزء ليتناسب مع كلاس CSS الجديد
    document.getElementById('titleTxt').innerHTML = `${t.titleStart} <span class="neon-pink-text">${t.titleEnd}</span>`; 
    document.getElementById('videoUrl').placeholder = t.placeholder;
    document.getElementById('fetchBtn').innerText = t.fetchBtn;
    document.getElementById('errorMsg').innerText = t.error;
    document.getElementById('dwnBtn').innerText = t.download;
    document.getElementById('noteTxt').innerText = t.note;
}

// تشغيل الدالة لضمان أن النصوص الأولى عربية إذا كان الاتجاهrtl 
toggleLanguage('ar'); 

function fetchThumbnail() {
    const urlInput = document.getElementById('videoUrl').value;
    const resultDiv = document.getElementById('result');
    const thumbImg = document.getElementById('thumbImg');
    const errorMsg = document.getElementById('errorMsg');

    // إخفاء النتائج والخطأ قبل البدء
    errorMsg.style.display = 'none';
    resultDiv.style.opacity = '0';
    setTimeout(() => { resultDiv.style.display = 'none'; }, 300);

    const videoId = extractVideoID(urlInput);

    if (videoId) {
        // نستخدم maxresdefault للحصول على أعلى جودة
        thumbImg.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        // عند نجاح تحميل الصورة (أو فشلها)
        thumbImg.onload = () => {
             errorMsg.style.display = 'none';
             resultDiv.style.display = 'block';
             setTimeout(() => { resultDiv.style.opacity = '1'; }, 100);
        };
        
        // إذا فشل maxresdefault، جرب جودة أقل (hqdefault)
        thumbImg.onerror = () => {
            thumbImg.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            
            // إذا فشل hqdefault، اعرض رسالة خطأ
            thumbImg.onerror = () => {
                errorMsg.style.display = 'block';
                resultDiv.style.opacity = '0';
                resultDiv.style.display = 'none';
            };
        };
        
    } else {
        errorMsg.style.display = 'block';
    }
}

function extractVideoID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7] && match[7].length === 11) ? match[7] : false;
}

async function downloadImage() {
    const imgUrl = document.getElementById('thumbImg').src;
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'yt-thumbnail-hd.jpg';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        // إذا فشل Fetch، افتح الصورة في تبويب جديد للسماح للمستخدم بالتحميل اليدوي
        window.open(imgUrl, '_blank');
    }
}
