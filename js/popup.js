// Load Plausible Analytics
window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

// Function for generating donate link with tracking attributes
function generateLink(link) {
    var url = new URL(link)
    url.searchParams.set('utm_source', 'Tipjar Extension (github.com/corbindavenport/tipjar)')
    url.searchParams.set('utm_medium', 'referral')
    url.searchParams.set('utm_campaign', 'none')
    return url.href
}

// Parse input
const params = (new URL(document.location)).searchParams
const source = params.get('source')
const pageData = JSON.parse(params.get('data'))
console.log('Recieved data:', pageData)

// Display meta tag button if available, fallback to Tipjar list
if (pageData.hasOwnProperty('supportUrl')) {
    document.querySelector('#meta-btn-container button').addEventListener('click', function() {
        plausible('Meta Tag Button', {
            callback: chrome.tabs.create({ url: generateLink(pageData.supportUrl) })
        })
    })
    document.querySelector('#meta-btn-container').style.display = 'block'
} else if (pageData.hasOwnProperty('tipjarUrl')) {
    document.querySelector('#tipjar-btn-container button').addEventListener('click', function() {
        plausible('Tipjar List Button', {
            callback: chrome.tabs.create({ url: generateLink(pageData.tipjarUrl) })
        })
    })
    document.querySelector('#tipjar-btn-container').style.display = 'block'
}

// Display Scroll button if available
if (pageData.hasOwnProperty('scroll')) {
    document.querySelector('#scroll-btn-container button').addEventListener('click', function() {
        plausible('Scroll Button', {
            callback: chrome.tabs.create({ url: generateLink('https://scroll.com/') })
        })
    })
    document.querySelector('#scroll-btn-container').style.display = 'block'
}

// Display cryptocurrency if available
if (pageData.hasOwnProperty('crypto')) {
    // Crypto format
    document.querySelector('#crypto-currency').textContent = pageData.crypto.currency
    // Crypto wallet address
    if ((pageData.crypto.currency === 'BTC') || (pageData.crypto.currency === 'BITCOIN')) {
        // Bitcoin
        var walletLink = document.createElement('a')
        walletLink.href = 'bitcoin:' + pageData.crypto.address
        walletLink.innerText = pageData.crypto.address
        walletLink.target = '_blank'
        document.querySelector('#crypto-address').appendChild(walletLink)
    } else if ((pageData.crypto.currency === 'LTC') || (pageData.crypto.currency === 'LITECOIN')) {
        // Litecoin
        var walletLink = document.createElement('a')
        walletLink.href = 'litecoin:' + pageData.crypto.address
        walletLink.innerText = pageData.crypto.address
        walletLink.target = '_blank'
        document.querySelector('#crypto-address').appendChild(walletLink)
    } else {
        // Other
        document.querySelector('#crypto-address').innerText = pageData.crypto.address
    }
    // QR code
    var walletImgLink = document.createElement('a')
    walletImgLink.href = 'https://chart.googleapis.com/chart?cht=qr&chl=' + pageData.crypto.address + '&choe=UTF-8&chs=500x500'
    walletImgLink.innerText = 'Display QR code'
    walletImgLink.target = '_blank'
    document.querySelector('#crypto-qr').appendChild(walletImgLink)
    // Add click event for crypto button
    document.querySelector('#crypto-btn-container button').addEventListener('click', function() {
        plausible('Cryptocurrency Button')
    })
    // Show the main crypto button
    document.querySelector('#crypto-btn-container').style.display = 'block'
}