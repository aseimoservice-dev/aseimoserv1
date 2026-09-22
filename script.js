/* ====== Configuration ======
   FORM_ENDPOINT : URL de votre service de formulaire (ex. Formspree, Getform, votre backend).
   Laissé vide = aperçu, rien n'est envoyé. */
var FORM_ENDPOINT = "";

/* Suivi des conversions Google Ads (clic sur un numéro).
   Collez votre balise gtag dans le <head> puis remplacez AW-XXXX/YYYY. */
function trackCall(){
  if (typeof gtag === "function") {
    gtag("event", "conversion", { send_to: "AW-XXXXXXXXX/YYYYYYYYYYY" });
  }
}
document.querySelectorAll(".js-call").forEach(function(a){ a.addEventListener("click", trackCall); });

var form = document.getElementById("leadForm");
var err = document.getElementById("formErr");
form.addEventListener("submit", function(e){
  e.preventDefault();
  var tel = form.telephone.value.replace(/[\s.\-]/g, "");
  var msgs = [];
  if (!form.nom.value.trim()) msgs.push("indiquez votre nom");
  if (!/^(\+33|0)[1-9]\d{8}$/.test(tel)) msgs.push("saisissez un numéro à 10 chiffres (ex. 06 12 34 56 78)");
  if (!form.ville.value.trim()) msgs.push("indiquez votre ville");
  if (!form.service.value) msgs.push("choisissez votre besoin");
  if (!form.rgpd.checked) msgs.push("cochez la case d'accord de rappel");
  if (msgs.length){ err.textContent = "Pour envoyer : " + msgs.join(", ") + "."; err.hidden = false; return; }
  err.hidden = true;

  function done(text){
    form.innerHTML = '<div class="ok">' + text + '</div>';
    if (typeof gtag === "function") gtag("event", "conversion", { send_to: "AW-XXXXXXXXX/ZZZZZZZZZZZ" });
  }
  if (!FORM_ENDPOINT){
    done("Aperçu : le formulaire fonctionne mais n'est pas encore relié à un service d'envoi. Renseignez FORM_ENDPOINT dans script.js pour recevoir les demandes.");
    return;
  }
  fetch(FORM_ENDPOINT, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
    .then(function(r){ if (!r.ok) throw 0; done("Merci, votre demande est bien reçue. Un plombier vous rappelle au plus vite."); })
    .catch(function(){ err.textContent = "L'envoi n'a pas abouti. Appelez-nous directement au 02 38 00 00 00."; err.hidden = false; });
});
