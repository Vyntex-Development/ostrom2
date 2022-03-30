  const calulateTarifScHeader=document.querySelector('.header-tarrif .tarrif-sc')
  const inputDesktop = document.querySelector('#postal-code-input');
  const calulateTarifMobile=document.querySelector('.header-tarrif-mobile .tarrif-sc')
  const inputMobile = document.querySelector('#autocomplete-3');
  const calculateTarifBody = document.querySelector('.calcul-tarrif-sc');
  const inputBody = document.querySelector('#autocomplete-2');
  let dropdownValues = [];
  function translatePlaceholder(inputEl,lang){
    if(lang==="en"){inputEl.placeholder="Postal code number"}else if(lang==="de"){inputEl.placeholder="Postleitzahl"}
  }
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-text').forEach(lg=>{lg.textContent=currentLanguage==="de" ? "Deutsch" : "English"})
    function tarrifHandler(wrapperEl,input) {
      let postalCodeIsValid = false;
      const personText = wrapperEl.querySelector('.person-text')
      let dropdown = wrapperEl.querySelector(".pc-dropdown");
      let allInputs = Array.from(document.querySelectorAll('.postalcode-input'));
      const kwhInput = wrapperEl.querySelector('.tarrif-input');
      const closeImg = wrapperEl.querySelector('.close-img');
      const postalCodeInput = wrapperEl.querySelector('.autocomplete-input');
      const buttonCalculate = wrapperEl.querySelector('#calculate-btn')
      const increaseBtn = wrapperEl.querySelector('#increase')
      const decreaseBtn = wrapperEl.querySelector('#decrease')
      const error = wrapperEl.querySelector('.error')
      const error2 = wrapperEl.querySelector('.error-text-2')
      let firstSelected = {};
      let firstFetch = false;
      let postalCodeIsSet = false;
      let postalCode = null;
      let data = {};
      let kwHValue = 1500
      let personCount = 1
      let isChosen = false;
      init()
      translatePlaceholder(inputDesktop,currentLanguage)
      translatePlaceholder(inputMobile,currentLanguage);
      translatePlaceholder(inputBody,currentLanguage);
      const setError = (el, message) => {
        el.innerText = message;
       	el.style.display = 'block';
      };
      const removeAndClearDropdown = (dd) => {
        dd.style.display = "none"; dd.innerHTML = ""; dd.classList.remove("scroll")
      };
      const removeDropdown = (dd) => { dd.style.display = "none"; dd.classList.remove("scroll")};
      const clearDropdown = (dd) => {
        dd.innerHTML = "";
      };
      const getDropdown = el => {
         let wrapperParent = el.closest('.dropdown-wrapper');
         let dropdown = wrapperParent.querySelector('.pc-dropdown');
         return dropdown;
      }
        const setDropdown = (postalCodes, dd) => {
        clearDropdown(dd)
        let ddWrap = document.createElement("div");
        ddWrap.classList.add("dd-wrapp");
        firstSelected = {...postalCodes[0]}
        postalCodes.length > 3 ? dd.classList.add("scroll") : "";
        postalCodes.forEach((code) => {
          const li = document.createElement("li");
          li.classList.add("dropdown-element");
          li.innerText = `${code.postcode} ${code.name}`;
          ddWrap.appendChild(li);
          dd.style.display = "block";
          dd.appendChild(ddWrap);
          li.addEventListener("click", (ev) => {
          	isChosen = true;
            postalCodeInput.value = ev.target.innerText;
            postalCode = code.postcode;
            postalCodeIsValid = true;
            data = { ...code };
            removeAndClearDropdown(dd);
          });
        });
      };
	    
	function language() { 
	let currentLanguage = ''
	  if (localStorage.getItem("txlive:selectedlang")) {
	    currentLanguage = JSON.parse(localStorage.getItem("txlive:selectedlang"));
	  }
	  return currentLanguage;
	}
	    
       const fetchData = async (code, el) => {
        if (!code) return;postalCodeIsSet = true; firstFetch = true;
        const response = await fetch(`https://api.ostrom.de/v1/addresses/cities?zip=${code}`);
        const data = await response.json();
        if (data[0] === null) {
        	let msg = language() === 'de' ? 'Diese Postleitzahl existiert nicht' : "This postal code doesn't exist";
          setError(error, msg);
          postalCodeIsValid = false;
          return;
        }
        postalCodeIsValid = true; let dropdown = getDropdown(el); removeAndClearDropdown(dropdown); setDropdown(data, dropdown);
        dropdownValues = [...data];
      };
      input.addEventListener("input", (ev) => {
        let enteredNumbersLength = ev.target.value.trim().length;
				let dropdown = getDropdown(ev.target);
        enteredNumbersLength > 0 ? closeImg.style.display = 'block' : closeImg.style.display = 'none';
        if (enteredNumbersLength === 5) {
          fetchData(ev.target.value, ev.target);
          setError(error, "");
          dropdownValues = [];
        } else {
          let msg = language() === 'de' ? 'Die Postleitzahl muss fünfstellig sein' : "Postal code must have five digits";
          if (firstFetch && input.length !== 0) setError(error, msg);
          removeAndClearDropdown(dropdown);
          input.value = ev.target.value;
          postalCode = ev.target.value;
          postalCodeIsValid = false;
          dropdownValues = [];
        }
      });
      input.addEventListener("click", (ev) => {
        let dropdown = getDropdown(ev.target);
        if(input.value === "") return;
        postalCodeIsValid = true;
        if(postalCodeIsValid && !error.innerText) {
        	postalCodeIsValid = false;
          if(!isChosen) return;
        	input.value = postalCode.toString().length === 4 ? `0${postalCode}` : postalCode;
        	dropdown.style.display = "block";
          setDropdown(dropdownValues, dropdown); 
          return;
        }
         postalCodeIsValid = false;
        removeDropdown(dropdown);
      });
      document.body.addEventListener("click", (ev) => {
      	//let dd1 = document.querySelector('.dd-1'); 
	//let dd2 = document.querySelector('.dd-2');
	//let dd3 = document.querySelector('.dd-3');
        //if(window.innerWidth > 768 && dd2.style.display === 'none') return;
       	//if(window.innerWidth <= 768 &&  dd1.style.display === 'none') return;
        if (ev.target.closest(".tarrif-sc")) { removeDropdown(ev.target.querySelector('.pc-dropdown')); 
        //removeDropdown(dd2);  removeDropdown(dd3);
        if (!ev.target.classList.contains("dropdown-element")) {
        		allInputs.forEach( input => {
            	if(input.value === '') { input.value = ''; return; }
                input.value = `${dropdownValues[0].postcode} ${dropdownValues[0].name}`;
            	postalCodeIsValid = true;
            })
          }
          data = { ...dropdownValues[0] };
        }
      });
      closeImg.addEventListener('click', (ev) => {
        let dropdownWrapper = ev.target.closest('.dropdown-wrapper');
        dropdownWrapper.querySelector('.autocomplete-input').value = '';
        ev.target.style.display = 'none';
        postalCode = '';
        removeAndClearDropdown(dropdownWrapper.querySelector('.pc-dropdown'))
      })
      buttonCalculate.addEventListener('click', e => {
        e.preventDefault()
        let inputLength = input.value.trim().length;
        let msg = language() === 'de' ? 'Die Postleitzahl muss fünfstellig sein' : "Postal code must have five digits";
        if(inputLength < 5) { setError(error, msg); return;}
        if(!postalCodeIsValid) return;
        if (+kwhInput.value > 15000 || +kwhInput.value < 600) { displayError(error2,  language() === 'de' ? "Muss zwischen 600 und 15000 kWh liegen" : "Must be between 600 and 15000 kWh")
          return;
        }
        const urlLanguge=JSON.parse(localStorage.getItem('txlive:selectedlang'))==="de" ? "de_DE" : JSON.parse(localStorage.getItem('txlive:selectedlang'))
        const { id, postcode, name } = data;
        const URL = `https://join.ostrom.de/tariff-plan?cityId=${id}&postalCode=${postcode}&cityName=${name}&usage=${kwhInput.value}`;
        hideErrors()
        location.href = URL
      })
      kwhInput.addEventListener('input', function(e){
       let msg = language() === 'de' ? 'Muss zwischen 600 und 15000 kWh liegen' : "Must be between 600 and 15000 kWh";
       if(+e.target.value > 15000 || +e.target.value < 600) { displayError(error2, msg); personText.classList.add('hide'); return;};
       	displayError(error2, "");
        personText.classList.add('hide')
        if (this.value.length >= 5) { this.value = this.value.slice(0, 5)}
      })
       increaseBtn.addEventListener('click', e => {
        checkHide()
        personCount += 1
        kwHValue += 1000
        if (personCount >= 100) { personCount = 100 }
        personText.textContent = buildPersonText(personCount)
        displayKwh(kwhInput, kwHValue)
      })
      decreaseBtn.addEventListener('click', e => {
        checkHide();
        personCount -= 1;
        if (personCount <= 0) { personCount = 1; return };
        kwHValue -= 1000;
        personText.textContent = buildPersonText(personCount);
        displayKwh(kwhInput, kwHValue);
      })
      function displayKwh(input, value) {
      	input.value = value;
      }
      function checkHide() {
        if (personText.classList.contains('hide')) personText.classList.remove('hide')
      }
      function init() {
        personText.textContent = `${personCount} Person`; kwhInput.value = kwHValue;
      }
      function buildPersonText(personCount){
        if(personCount > 1) {return `${personCount} People`}
        return `${personCount} Person`
      }
      function displayError(errorEl, errorText) {
        errorEl.textContent = errorText; errorEl.style.display = "block";
      }
      function hideErrors() { error.style.display = "none" }
    }
    tarrifHandler(calulateTarifScHeader,inputDesktop)
    tarrifHandler(calulateTarifMobile,inputMobile)
    tarrifHandler(calculateTarifBody,inputBody)
  })
