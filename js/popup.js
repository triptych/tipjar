// Function for sending events to Google Analytics
function sendEvent(eventCategory, eventAction) {
    return new Promise(async function (resolve) {
        // Get UUID from storage
        chrome.storage.local.get(function (data) {
            var uuid = data.uuid
            // Send Fetch data
            fetch('https://www.google-analytics.com/collect', {
                method: 'POST',
                body: 'v=1&tid=UA-59452245-8&cid=' + uuid + '&t=event&ec=' + encodeURIComponent(eventCategory) + '&ea=' + encodeURIComponent(eventAction)
            }).then(function (data) {
                console.log('Response from Analytics:', data)
                resolve()
            }).catch(function (err) {
                console.log('Fetch error:', err)
                resolve()
            })
        })
    })
}

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
    document.querySelector('#meta-btn-container button').addEventListener('click', async function () {
        await sendEvent('Metatag Button Click', source)
        chrome.tabs.create({ url: generateLink(pageData.supportUrl) })
    })
    document.querySelector('#meta-btn-container').style.display = 'block'
} else if (pageData.hasOwnProperty('tipjarUrl')) {
    document.querySelector('#tipjar-btn-container button').addEventListener('click', async function () {
        await sendEvent('Internal Button Click', source)
        chrome.tabs.create({ url: generateLink(pageData.tipjarUrl) })
    })
    document.querySelector('#tipjar-btn-container').style.display = 'block'
}

// Display Scroll button if available
if (pageData.hasOwnProperty('scroll')) {
    document.querySelector('#scroll-btn-container button').addEventListener('click', async function () {
        await sendEvent('Scroll Button Click', source)
        chrome.tabs.create({ url: generateLink('https://scroll.com/') })
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
        walletLink.href = '#'
        walletLink.innerText = pageData.crypto.address
        walletLink.addEventListener('click', function () {
            chrome.tabs.create({ url: 'bitcoin:' + pageData.crypto.address })
        })
        document.querySelector('#crypto-address').appendChild(walletLink)
    } else if ((pageData.crypto.currency === 'LTC') || (pageData.crypto.currency === 'LITECOIN')) {
        // Litecoin
        var walletLink = document.createElement('a')
        walletLink.href = '#'
        walletLink.innerText = pageData.crypto.address
        walletLink.addEventListener('click', function () {
            chrome.tabs.create({ url: 'litecoin:' + pageData.crypto.address })
        })
        document.querySelector('#crypto-address').appendChild(walletLink)
    } else {
        // Other
        document.querySelector('#crypto-address').innerText = pageData.crypto.address
    }
    // QR code
    var walletImgLink = document.createElement('a')
    walletImgLink.href = '#'
    walletImgLink.addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://chart.googleapis.com/chart?cht=qr&chl=' + pageData.crypto.address + '&choe=UTF-8&chs=500x500' })
    })
    walletImgLink.innerText = 'Display QR code'
    walletImgLink.target = '_blank'
    document.querySelector('#crypto-qr').appendChild(walletImgLink)
    // Add click event for crypto button
    document.querySelector('#crypto-btn-container button').addEventListener('click', async function () {
        await sendEvent('Crypto Button Click', source)
    })
    // Show the main crypto button
    document.querySelector('#crypto-btn-container').style.display = 'block'
}

// Misc links
document.querySelector('#tipjar-list-info').addEventListener('click', function () {
    chrome.tabs.create({ url: 'https://github.com/corbindavenport/tipjar/wiki/Support-links-provided-by-Tipjar' })
})

// Create pageview in Analytics
chrome.storage.local.get(function (data) {
    var uuid = data.uuid
    // Send Fetch data
    fetch('https://www.google-analytics.com/collect', {
        method: 'POST',
        body: 'v=1&tid=UA-59452245-8&cid=' + uuid + '&t=pageview&dp=popup.html&dr=https://' + source
    }).then(function (data) {
        console.log('Analytics pageview response:', data)
    }).catch(function (err) {
        console.log('Fetch error:', err)
    })
})