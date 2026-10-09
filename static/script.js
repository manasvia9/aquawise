const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const I18N = {
  en: {
    myField:"My Field", weatherCentre:"Weather Centre", history:"History",
    fieldSub:"Get irrigation advice", weatherSub:"Live weather & forecast", historySub:"Your saved analyses",
    soilHeading:"Select Soil Type", soilHelp:"Choose the soil that best matches your field.",
    redSoil:"Red Soil", blackSoil:"Black Soil", sandySoil:"Sandy Soil", claySoil:"Clay Soil", loamySoil:"Loamy Soil",
    categoryHeading:"Select Crop Category", categoryHelp:"Choose the category for your crop.",
    grains:"Grains", pulses:"Pulses", vegetables:"Vegetables", fruits:"Fruits", cashCrops:"Cash Crops",
    specificCrop:"Select Specific Crop", chooseCrop:"Choose crop", growthStage:"Select Crop Growth Stage (Age)", chooseAge:"Select age range",
    analyse:"Analyse My Field", formNote:"Month ranges are general; actual crop stages vary by crop and climate.",
    analysisResult:"Analysis Result", soilMoisture:"Soil Moisture", temperature:"Temperature", forecastRain:"Forecast Rainfall",
    humidity:"Humidity", currentWeather:"Current weather", next24:"Next 24 hours", relativeHumidity:"Relative humidity",
    whyDecision:"Why this decision?", disclaimer:"This is a model-based estimate. Always verify with field conditions and local agricultural advice.",
    recommendation:"Recommendation", fieldDetails:"Field Details", locationLabel:"Location", soilLabel:"Soil Type", cropLabel:"Crop", stageLabel:"Growth Stage", keyMetrics:"Key Metrics",
    readyToAnalyse:"Ready to analyse your field", emptyResultText:"Choose your soil, crop category, specific crop and growth stage, then select Analyse My Field.",
    decisionGuide:"HOW AQUAWISE DECIDES", understandAdvice:"Understand your irrigation recommendation",
    guideIntro:"These are prototype rules using model-estimated soil moisture and forecast rainfall. They are not universal crop irrigation thresholds.",
    irrigateTitle:"Irrigate — verify first", irrigateText:"Low estimated moisture (below 15%) and less than 5 mm forecast rain. Check root-zone moisture and crop needs before watering.",
    checkTitle:"Check the field", checkText:"Moisture estimate unavailable or between 15% and 30%. Inspect the root zone, crop condition, and schedule before deciding.",
    waitTitle:"Wait / don't irrigate yet", waitText:"At least 5 mm rain is forecast or estimated moisture is 30% or higher. Recheck conditions before applying more water.",
    weatherTitle:"Weather Centre", weatherIntro:"Current conditions and the next seven days for your selected location.",
    sevenDay:"Seven-day forecast", hourlyForecast:"Hourly outlook", historyTitle:"Analysis History", historyIntro:"Review analyses saved on this device.",
    savedAnalyses:"Saved analyses", clearHistory:"Clear history", saveHistory:"Save to history", analysisError:"Analysis could not be completed",
    chooseCategory:"Choose a crop category", selectLocation:"Please enter your field location."
  },
  te: {
    myField:"నా పొలం", weatherCentre:"వాతావరణ కేంద్రం", history:"చరిత్ర",
    fieldSub:"నీటిపారుదల సలహా", weatherSub:"ప్రస్తుత వాతావరణం", historySub:"మీ విశ్లేషణలు",
    soilHeading:"నేల రకాన్ని ఎంచుకోండి", soilHelp:"మీ పొలానికి సరిపోయే నేలను ఎంచుకోండి.",
    redSoil:"ఎర్ర నేల", blackSoil:"నల్ల నేల", sandySoil:"ఇసుక నేల", claySoil:"బంకమట్టి నేల", loamySoil:"లోమీ నేల",
    categoryHeading:"పంట వర్గాన్ని ఎంచుకోండి", categoryHelp:"మీ పంట వర్గాన్ని ఎంచుకోండి.",
    grains:"ధాన్యాలు", pulses:"పప్పుధాన్యాలు", vegetables:"కూరగాయలు", fruits:"పండ్లు", cashCrops:"వాణిజ్య పంటలు",
    specificCrop:"పంటను ఎంచుకోండి", chooseCrop:"పంటను ఎంచుకోండి", growthStage:"పంట వయస్సు / పెరుగుదల దశ", chooseAge:"వయస్సు పరిధిని ఎంచుకోండి",
    analyse:"నా పొలాన్ని విశ్లేషించండి", formNote:"నెలల పరిధులు సాధారణమైనవి; పంటను బట్టి దశలు మారుతాయి.",
    analysisResult:"విశ్లేషణ ఫలితం", soilMoisture:"నేల తేమ", temperature:"ఉష్ణోగ్రత", forecastRain:"వర్ష సూచన",
    humidity:"తేమ శాతం", currentWeather:"ప్రస్తుత వాతావరణం", next24:"తదుపరి 24 గంటలు", relativeHumidity:"సాపేక్ష ఆర్ద్రత",
    whyDecision:"ఈ నిర్ణయానికి కారణం?", disclaimer:"ఇది మోడల్ అంచనా మాత్రమే. పొల పరిస్థితులు మరియు స్థానిక వ్యవసాయ సలహాతో నిర్ధారించండి.",
    recommendation:"సిఫార్సు", fieldDetails:"పొలం వివరాలు", locationLabel:"ప్రదేశం", soilLabel:"నేల రకం", cropLabel:"పంట", stageLabel:"పెరుగుదల దశ", keyMetrics:"ముఖ్య కొలతలు",
    readyToAnalyse:"మీ పొలాన్ని విశ్లేషించడానికి సిద్ధంగా ఉంది", emptyResultText:"నేల, పంట వర్గం, పంట పేరు, పెరుగుదల దశ ఎంచుకుని విశ్లేషించండి.",
    decisionGuide:"AQUAWISE నిర్ణయం ఎలా తీసుకుంటుంది", understandAdvice:"నీటిపారుదల సిఫార్సును అర్థం చేసుకోండి",
    guideIntro:"ఇవి మోడల్ అంచనా నేల తేమ మరియు వర్ష సూచన ఆధారంగా ఉన్న నమూనా నియమాలు మాత్రమే.",
    irrigateTitle:"నీరు పెట్టండి — ముందుగా నిర్ధారించండి", irrigateText:"అంచనా తేమ 15% కంటే తక్కువగా, వర్ష సూచన 5 mm కంటే తక్కువగా ఉంటే. నీరు పెట్టే ముందు వేర్ల దగ్గర తేమను తనిఖీ చేయండి.",
    checkTitle:"పొలాన్ని తనిఖీ చేయండి", checkText:"తేమ అంచనా అందుబాటులో లేకపోయినా లేదా 15%–30% మధ్య ఉన్నా వేర్ల ప్రాంతం, పంట పరిస్థితిని తనిఖీ చేయండి.",
    waitTitle:"వేచి ఉండండి / ఇప్పుడే నీరు పెట్టవద్దు", waitText:"5 mm లేదా అంతకంటే ఎక్కువ వర్షం అంచనా ఉన్నా లేదా తేమ 30% లేదా అంతకంటే ఎక్కువగా ఉన్నా పరిస్థితిని మళ్లీ తనిఖీ చేయండి.",
    weatherTitle:"వాతావరణ కేంద్రం", weatherIntro:"మీ ప్రదేశానికి ప్రస్తుత వాతావరణం మరియు ఏడు రోజుల సూచన.",
    sevenDay:"ఏడు రోజుల సూచన", hourlyForecast:"గంటల వారీ సూచన", historyTitle:"విశ్లేషణ చరిత్ర", historyIntro:"ఈ పరికరంలో సేవ్ చేసిన విశ్లేషణలు.",
    savedAnalyses:"సేవ్ చేసిన విశ్లేషణలు", clearHistory:"చరిత్ర తొలగించండి", saveHistory:"చరిత్రలో సేవ్ చేయండి", analysisError:"విశ్లేషణ పూర్తి కాలేదు",
    chooseCategory:"పంట వర్గాన్ని ఎంచుకోండి", selectLocation:"దయచేసి మీ పొలం ప్రదేశాన్ని నమోదు చేయండి."
  },
  hi: {
    myField:"मेरा खेत", weatherCentre:"मौसम केंद्र", history:"इतिहास",
    fieldSub:"सिंचाई सलाह", weatherSub:"मौसम और पूर्वानुमान", historySub:"आपके विश्लेषण",
    soilHeading:"मिट्टी का प्रकार चुनें", soilHelp:"अपने खेत से मेल खाने वाली मिट्टी चुनें।",
    redSoil:"लाल मिट्टी", blackSoil:"काली मिट्टी", sandySoil:"रेतीली मिट्टी", claySoil:"चिकनी मिट्टी", loamySoil:"दोमट मिट्टी",
    categoryHeading:"फसल श्रेणी चुनें", categoryHelp:"अपनी फसल की श्रेणी चुनें।",
    grains:"अनाज", pulses:"दलहन", vegetables:"सब्ज़ियाँ", fruits:"फल", cashCrops:"नकदी फसलें",
    specificCrop:"विशिष्ट फसल चुनें", chooseCrop:"फसल चुनें", growthStage:"फसल की आयु / विकास चरण", chooseAge:"आयु सीमा चुनें",
    analyse:"मेरे खेत का विश्लेषण करें", formNote:"महीने की सीमाएँ सामान्य हैं; वास्तविक चरण फसल और जलवायु पर निर्भर हैं।",
    analysisResult:"विश्लेषण परिणाम", soilMoisture:"मिट्टी की नमी", temperature:"तापमान", forecastRain:"अनुमानित बारिश",
    humidity:"आर्द्रता", currentWeather:"वर्तमान मौसम", next24:"अगले 24 घंटे", relativeHumidity:"सापेक्ष आर्द्रता",
    whyDecision:"यह निर्णय क्यों?", disclaimer:"यह मॉडल-आधारित अनुमान है। खेत की स्थिति और स्थानीय कृषि सलाह से हमेशा पुष्टि करें।",
    recommendation:"सिफारिश", fieldDetails:"खेत का विवरण", locationLabel:"स्थान", soilLabel:"मिट्टी", cropLabel:"फसल", stageLabel:"विकास चरण", keyMetrics:"मुख्य माप",
    readyToAnalyse:"खेत का विश्लेषण करने के लिए तैयार", emptyResultText:"मिट्टी, फसल श्रेणी, फसल और विकास चरण चुनें, फिर विश्लेषण करें।",
    decisionGuide:"AQUAWISE कैसे निर्णय लेता है", understandAdvice:"सिंचाई की सिफारिश समझें",
    guideIntro:"ये मॉडल-अनुमानित मिट्टी की नमी और बारिश के पूर्वानुमान पर आधारित प्रोटोटाइप नियम हैं।",
    irrigateTitle:"सिंचाई करें — पहले जाँचें", irrigateText:"अनुमानित नमी 15% से कम और अनुमानित बारिश 5 mm से कम हो। पानी देने से पहले जड़ क्षेत्र की नमी जाँचें।",
    checkTitle:"खेत की जाँच करें", checkText:"नमी का अनुमान उपलब्ध न हो या 15%–30% के बीच हो। जड़ क्षेत्र और फसल की स्थिति जाँचें।",
    waitTitle:"रुकें / अभी सिंचाई न करें", waitText:"कम से कम 5 mm बारिश का अनुमान हो या नमी 30% या अधिक हो। पानी देने से पहले फिर जाँचें।",
    weatherTitle:"मौसम केंद्र", weatherIntro:"आपके चुने हुए स्थान का वर्तमान मौसम और सात दिन का पूर्वानुमान।",
    sevenDay:"सात दिन का पूर्वानुमान", hourlyForecast:"घंटेवार पूर्वानुमान", historyTitle:"विश्लेषण इतिहास", historyIntro:"इस डिवाइस पर सहेजे गए विश्लेषण।",
    savedAnalyses:"सहेजे गए विश्लेषण", clearHistory:"इतिहास साफ़ करें", saveHistory:"इतिहास में सहेजें", analysisError:"विश्लेषण पूरा नहीं हो सका",
    chooseCategory:"फसल श्रेणी चुनें", selectLocation:"कृपया खेत का स्थान दर्ज करें।"
  }
};

const CROPS = {
  "Grains":["Rice","Maize","Wheat","Sorghum","Millet"],
  "Pulses":["Chickpea","Pigeon pea","Green gram","Black gram"],
  "Vegetables":["Tomato","Potato","Onion","Chilli","Okra"],
  "Fruits":["Mango","Banana","Grapes","Citrus"],
  "Cash crops":["Cotton","Sugarcane","Groundnut","Soybean"]
};
const CROP_TRANSLATIONS = {
  te:{"Rice":"వరి","Maize":"మొక్కజొన్న","Wheat":"గోధుమ","Sorghum":"జొన్న","Millet":"సజ్జ","Chickpea":"శనగ","Pigeon pea":"కంది","Green gram":"పెసలు","Black gram":"మినుములు","Tomato":"టమాటా","Potato":"బంగాళాదుంప","Onion":"ఉల్లిపాయ","Chilli":"మిరప","Okra":"బెండకాయ","Mango":"మామిడి","Banana":"అరటి","Grapes":"ద్రాక్ష","Citrus":"నిమ్మజాతి","Cotton":"పత్తి","Sugarcane":"చెరకు","Groundnut":"వేరుశనగ","Soybean":"సోయాబీన్"},
  hi:{"Rice":"धान","Maize":"मक्का","Wheat":"गेहूँ","Sorghum":"ज्वार","Millet":"बाजरा","Chickpea":"चना","Pigeon pea":"अरहर","Green gram":"मूंग","Black gram":"उड़द","Tomato":"टमाटर","Potato":"आलू","Onion":"प्याज़","Chilli":"मिर्च","Okra":"भिंडी","Mango":"आम","Banana":"केला","Grapes":"अंगूर","Citrus":"खट्टे फल","Cotton":"कपास","Sugarcane":"गन्ना","Groundnut":"मूंगफली","Soybean":"सोयाबीन"}
};
let currentLanguage = localStorage.getItem("aquawiseLanguage") || "en";
let installPrompt = null;
const locationStore = "aquawiseLocation";
const read = (k, fallback="") => { try { return localStorage.getItem(k) || fallback; } catch { return fallback; } };
const write = (k,v) => { try { localStorage.setItem(k,v); } catch {} };

function translateStatic() {
  const t = I18N[currentLanguage] || I18N.en;
  $$("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  $("#languageSelect").value = currentLanguage;
  document.documentElement.lang = currentLanguage;
  refreshCropOptions();
}
function refreshCropOptions() {
  const category = $("#categoryValue").value;
  const cropSelect = $("#cropSelect");
  const old = cropSelect.value || (window.AQUAWISE_FORM && window.AQUAWISE_FORM.crop) || "";
  cropSelect.replaceChildren();
  const t = I18N[currentLanguage] || I18N.en;
  const first = document.createElement("option");
  first.value = "";
  first.textContent = t.chooseCrop || "Choose crop";
  cropSelect.appendChild(first);
  (CROPS[category] || []).forEach(crop => {
    const option = document.createElement("option");
    option.value = crop;
    option.textContent = (CROP_TRANSLATIONS[currentLanguage] || {})[crop] || crop;
    cropSelect.appendChild(option);
  });
  if ((CROPS[category] || []).includes(old)) cropSelect.value = old;
}
function setCategory(category) {
  $("#categoryValue").value = category;
  $$(".category-option").forEach(button => button.classList.toggle("selected",button.dataset.category===category));
  refreshCropOptions();
}
function enterApp(location) {
  const clean = (location || "").trim();
  if (!clean) { $("#welcomeError").textContent = (I18N[currentLanguage]||I18N.en).selectLocation; return; }
  write(locationStore, clean);
  $("#fieldLocation").value = clean;
  $("#locationPill").textContent = "⌖ " + clean;
  $("#welcomeScreen").classList.add("hidden");
  $("#appShell").classList.remove("hidden");
  loadWeather();
}
function showPage(name) {
  ["field","weather","history"].forEach(p => $("#"+p+"Page").classList.toggle("hidden",p!==name));
  $$(".nav-tab").forEach(b => b.classList.toggle("active",b.dataset.page===name));
  $$(".side-link").forEach(b => b.classList.toggle("selected",b.dataset.page===name));
  if (name==="weather") loadWeather();
  if (name==="history") renderHistory();
  window.scrollTo({top:0,behavior:"smooth"});
}
function weatherText(code) {
  if (code===0) return "Clear sky";
  if ([1,2].includes(code)) return "Partly cloudy";
  if (code===3) return "Overcast";
  if ([45,48].includes(code)) return "Fog";
  if ([51,53,55,56,57].includes(code)) return "Drizzle";
  if ([61,63,65,66,67,80,81,82].includes(code)) return "Rain";
  if ([95,96,99].includes(code)) return "Thunderstorm";
  return "Current conditions";
}
function dayName(value) {
  return new Date(value+"T12:00:00").toLocaleDateString(undefined,{weekday:"short"});
}
async function loadWeather() {
  const location = read(locationStore);
  if (!location || $("#appShell").classList.contains("hidden")) return;
  $("#weatherLoading").classList.remove("hidden");
  $("#weatherError").classList.add("hidden");
  $("#weatherContent").classList.add("hidden");
  try {
    const response = await fetch("/api/weather?location="+encodeURIComponent(location));
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Weather unavailable");
    const w = data.weather, c = w.current, d = w.daily, h = w.hourly;
    $("#heroDate").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
    $("#heroTemp").textContent = Math.round(c.temperature_2m)+"°C";
    $("#heroWeatherText").textContent = weatherText(c.weather_code);
    $("#heroWeatherIcon").textContent = [61,63,65,80,81,82,95,96,99].includes(c.weather_code) ? "🌧" : "☀";
    $("#heroHumidity").textContent = "Humidity: "+c.relative_humidity_2m+"%";
    $("#heroWind").textContent = "Wind: "+c.wind_speed_10m+" km/h";
    $("#weatherTemp").textContent = Math.round(c.temperature_2m)+"°C";
    $("#weatherSummary").textContent = weatherText(c.weather_code);
    $("#weatherDetails").textContent = "Humidity "+c.relative_humidity_2m+"% · Wind "+c.wind_speed_10m+" km/h · Precipitation "+(c.precipitation||0)+" mm";
    $("#weatherIcon").textContent = $("#heroWeatherIcon").textContent;
    const forecast = $("#forecastGrid"); forecast.replaceChildren();
    d.time.forEach((date,i)=>{
      const card=document.createElement("div");card.className="forecast-day";
      const day=document.createElement("b");day.textContent=i===0?"Today":dayName(date);
      const icon=document.createElement("span");icon.textContent=(d.precipitation_sum[i]||0)>=2?"🌧":"☀";
      const temp=document.createElement("strong");temp.textContent=Math.round(d.temperature_2m_max[i])+"° / "+Math.round(d.temperature_2m_min[i])+"°";
      const rain=document.createElement("small");rain.textContent=(d.precipitation_sum[i]||0).toFixed(1)+" mm rain";
      const chance=document.createElement("small");chance.textContent=(d.precipitation_probability_max[i]??0)+"% chance";
      card.append(day,icon,temp,rain,chance);forecast.appendChild(card);
    });
    const hourly=$("#hourlyGrid");hourly.replaceChildren();
    let start=h.time.findIndex(t=>t>=c.time);if(start<0)start=0;
    for(let i=start;i<Math.min(start+12,h.time.length);i++){
      const card=document.createElement("div");card.className="hourly-item";
      const time=document.createElement("b");time.textContent=h.time[i].slice(11,16);
      const temp=document.createElement("span");temp.textContent=Math.round(h.temperature_2m[i])+"°C";
      const rain=document.createElement("small");rain.textContent=(h.precipitation[i]||0).toFixed(1)+" mm rain";
      card.append(time,temp,rain);hourly.appendChild(card);
    }
    $("#weatherLoading").classList.add("hidden");
    $("#weatherContent").classList.remove("hidden");
  } catch(err) {
    $("#weatherLoading").classList.add("hidden");
    $("#weatherError").textContent="Weather could not be loaded: "+err.message;
    $("#weatherError").classList.remove("hidden");
  }
}
function getHistory() { try { return JSON.parse(localStorage.getItem("aquawiseHistory")||"[]"); } catch { return []; } }
function renderHistory() {
  const root=$("#historyList");root.replaceChildren();const items=getHistory();
  if(!items.length){const p=document.createElement("p");p.className="empty-history";p.textContent="No saved analyses yet. Analyse your field and choose Save to history.";root.appendChild(p);return;}
  items.forEach(item=>{
    const div=document.createElement("div");div.className="history-item";
    const title=document.createElement("b");title.textContent=item.decision+" · "+item.location;
    const details=document.createElement("p");details.textContent=[item.crop,item.soil,item.stage,item.date].join(" · ");
    const reason=document.createElement("p");reason.textContent=item.explanation;
    div.append(title,details,reason);root.appendChild(div);
  });
}
function saveCurrentResult() {
  const r=window.AQUAWISE_RESULT;if(!r)return;
  const items=getHistory();
  items.unshift({decision:r.decision,location:r.location,crop:r.crop,soil:r.soil,stage:r.stage,explanation:r.explanation,date:new Date().toLocaleString()});
  try{localStorage.setItem("aquawiseHistory",JSON.stringify(items.slice(0,40)));}catch{}
  $("#saveHistoryButton").textContent="✓ "+(I18N[currentLanguage].saveHistory||"Saved");
}
$("#welcomeForm").addEventListener("submit",e=>{e.preventDefault();enterApp($("#welcomeLocation").value);});
$("#useLocationButton").addEventListener("click",()=>{
  if(!navigator.geolocation){$("#welcomeError").textContent="Location access is not supported by this browser.";return;}
  $("#welcomeError").textContent="Getting location…";
  navigator.geolocation.getCurrentPosition(pos=>{
    const location=pos.coords.latitude.toFixed(4)+", "+pos.coords.longitude.toFixed(4);
    $("#welcomeLocation").value=location;enterApp(location);
  },()=>{$("#welcomeError").textContent="Location permission failed. Enter your town or city instead."},{timeout:10000});
});
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("#homeBrand").addEventListener("click",e=>{e.preventDefault();showPage("field");});
$("#languageSelect").addEventListener("change",e=>{currentLanguage=e.target.value;write("aquawiseLanguage",currentLanguage);translateStatic();});
$$(".category-option").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.category)));
$("#fieldForm").addEventListener("submit",e=>{
  const location=read(locationStore);
  if(!location){e.preventDefault();$("#welcomeScreen").classList.remove("hidden");$("#appShell").classList.add("hidden");$("#welcomeError").textContent="Choose your field location first.";return;}
  $("#fieldLocation").value=location;
  if(!$("#categoryValue").value){e.preventDefault();alert((I18N[currentLanguage]||I18N.en).chooseCategory);return;}
  write("aquawiseLastCrop",$("#cropSelect").value);
});
if($("#saveHistoryButton"))$("#saveHistoryButton").addEventListener("click",saveCurrentResult);
$("#clearHistoryButton").addEventListener("click",()=>{if(confirm("Clear saved analysis history on this device?")){write("aquawiseHistory","[]");renderHistory();}});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installButton").classList.remove("hidden");});
$("#installButton").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installButton").classList.add("hidden");});
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("/static/service-worker.js").catch(()=>{}));}

translateStatic();
const savedLocation=read(locationStore);
// Always ask for the field location on a fresh visit. Only keep the dashboard open
// after a form POST so that the analysis result/error remains visible.
if (savedLocation) {
  $("#welcomeLocation").value = savedLocation;
  $("#fieldLocation").value = savedLocation;
  $("#locationPill").textContent = "⌖ " + savedLocation;
}
if (window.AQUAWISE_RESULT || window.AQUAWISE_ERROR) {
  $("#welcomeScreen").classList.add("hidden");
  $("#appShell").classList.remove("hidden");
} else {
  $("#welcomeScreen").classList.remove("hidden");
  $("#appShell").classList.add("hidden");
}
if(window.AQUAWISE_FORM?.category)setCategory(window.AQUAWISE_FORM.category);
if(window.AQUAWISE_FORM?.crop)$("#cropSelect").value=window.AQUAWISE_FORM.crop;
if(savedLocation)loadWeather();
if($("#analysisResult"))setTimeout(()=>$("#analysisResult").scrollIntoView({behavior:"smooth",block:"start"}),180);
