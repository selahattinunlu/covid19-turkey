// 1 - Sağlık bakanlığının sitesinde bugünün verisi paylaşılmış mı kontrol et.
// 2 - Eğer yeni veri paylaşılmışsa parse et
// 3 - data.json dosyasına yeni verileri ekle
// 4 - parcel'i çalıştır ve build et
// 5 - tarayıcıda açarak yeni grafiğin ss'ini al
// 6 - Aldığın ss ile birlikte yeni gün post'unu facebook'a gönder

// -------------------

// 1 - Burada http response'daki Date'i kullanabiliriz. Bugünün tarihi ile uyuşuyorsa
//     ve henüz data.json'da bugünün verisi yok ise işlem yapılır, veri var ise işlem yapılmaz

// 2 - puppeteer ile açıp parse edicez || jsdom kütüphanesi ile parsing işlemi yapacağız

// 3 - fs modülü ile güncel veriyi dosyamıza yazacağız

// 4 - child_process modülü ile terminal'de "npm run build" komutunu çalıştıracağız

// 5 - puppeteer ile tarayıcıda açıp, ilgili kısmın resmini çek - kaydet
// https://dev.to/benjaminmock/how-to-take-a-screenshot-of-a-page-with-javascript-1e7c

// 6 - Bu adımı facebook api kısıtlaması nedeniyle direkt api üzerinden yapamıyoruz
// Bu adım için de puppeteer'i kullanıcaz
// https://medium.com/@progrium/the-only-way-you-can-automate-facebook-posts-now-bd3a40fd1c4b

const puppeteer = require('puppeteer')

const login = require('./login')
const update = require('./update')

const INTERVAL_MS = 1000 * 60 * 30 // per 30 minutes
const RUN_FOR_LOGIN = process.argv[2] === '--login';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: '.data',
    defaultViewport: {
      width: 1900,
      height: 800
    }
  })

  const page = (await browser.pages())[0]

  if (RUN_FOR_LOGIN) {
    return login(browser, page)
  }

  update(browser, page)

  // TODO: open here
  // setInterval(() => update(browser, page), INTERVAL_MS);
})()
