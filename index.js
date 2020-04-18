const COOKIE_NAME = '__uid'
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  console.log(result)
  return result
}


function getRandomURL(items){
  var item = items[Math.floor(Math.random() < 0.5)];
  // console.log(item);
  return item;
}


class TitleHandler {
  element(element) {
    element.setInnerContent("Jordan's take home project")
  }
}

class BodyHandler {
  element(element) {
    element.append("\nThe power of Cloudflare workers!")
  }
}

class URLHandler {
  element(element) {
    let mysite = 'https:/romanjordan.github.io/JRoman/'
    element.setInnerContent("Visit my site & my Github!")
    // console.log(element.getAttribute())
    element.setAttribute("href", mysite)
    // console.log(element.getAttribute("class"))
  }
}

class h1TitleHandler {
  element(element) {
    element.append(" provided by the Cloudflare API!")
  }
}


async function handleRequest(request) {
  
  var urlVariants = []
  var url = 'https://cfw-takehome.developers.workers.dev/api/variants';
  
  var res = await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) =>{
      urlVariants.push(data.variants[0])
      urlVariants.push(data.variants[1])
    });
  
  
  var randNumb = Math.floor(Math.random() * 2)
  
  var randresp = await fetch(urlVariants[randNumb])
  
  
  const cookie = getCookie(request, COOKIE_NAME)
  
  var rewrite = new HTMLRewriter()
    .on("title", new TitleHandler())
    .on("a#url", new URLHandler())
    .on("p#description", new BodyHandler())
    .on("h1#title", new h1TitleHandler())
    .transform(randresp)
    

  
  return (rewrite)
}
