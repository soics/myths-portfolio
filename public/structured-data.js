(function() {
  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Richard Germain",
    "alternateName": "myths",
    "jobTitle": "Digital Explorer & Full-Stack Developer",
    "email": "richardgermain29@gmail.com",
    "url": "https://myths-portfolio.vercel.app",
    "sameAs": ["https://github.com/soics", "https://instagram.com/mv.lls/"]
  });
  document.head.appendChild(script);
})();
