(self.webpackChunk=self.webpackChunk||[]).push([[948],{171:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>i});var r=n(719);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class a{constructor(){s(this,"element",void 0),s(this,"start",10),s(this,"end",18),s(this,"duration",1),s(this,"days",["Mon","Tue","Wed","Thu","Fri"]),s(this,"eventData",{}),s(this,"onFormSubmit",(e=>{e.preventDefault(),this.setEventData(this.element),this.eventData.name.length&&this.eventData.members.length?this.element.querySelector("#create-event__alert_error").style.display="none":this.element.querySelector("#create-event__alert_error").style.display="block",this.eventData.name.length&&this.eventData.members.length&&(this.element.querySelector("#create-event__alert_success").style.display="block",localStorage.setItem("meetingsDB",JSON.stringify([...this.meetings,this.eventData])),setTimeout((()=>{document.location.href="/meeting-planning-calendar"}),500))})),this.meetings=JSON.parse(localStorage.getItem("meetingsDB")),this.members=JSON.parse(localStorage.getItem("membersDB")),this.render()}render(){const e=document.createElement("div");e.innerHTML=this.template;const t=e.firstElementChild;return this.element=t,this.initEventListeners(),this.element}initEventListeners(){this.element.querySelector("#allMembersCheckbox").addEventListener("click",(()=>{[...document.querySelectorAll("[data-member]")].forEach((e=>e.checked=!e.checked))})),this.element.addEventListener("submit",this.onFormSubmit)}get template(){return`\n    <div>\n      <div class="alert alert-warning" role="alert" style='display: none;' id='create-event__alert_error'>\n        Please fill out all fields.\n      </div>\n      <div class="alert alert-success" role="alert" style='display: none;' id='create-event__alert_success'>\n        New event created!\n      </div>\n      <form>\n        <div>\n          <span>Name of the event</span>\n          <input\n            placeholder='Type here'\n            type='search'\n            class='form-control rounded'\n            data-name='name'\n          />\n        </div>\n\n        <div>\n          <span>Participants</span>\n          ${this.getMembersDropdown()}\n        </div>\n\n        <div>\n          <span>Day</span>\n          ${this.getDaysDropdown()}\n        </div>\n        <div>\n          <span>Time</span>\n          ${this.getEventHoursDropdown()}\n        </div>\n\n        <div>\n          <a href='/meeting-planning-calendar'>\n            <button type="button" class="btn btn-secondary">Cancel</button>\n          </a>\n\n          <button type="submit" class="btn btn-primary">Create</button>\n        </div>\n      </form>\n    </div>`}getMembersDropdown(){return`\n    <div style='height:2.5rem; overflow: scroll; border: 1px solid black'>\n      <div class="form-check">\n        <input class="form-check-input"type="checkbox" id='allMembersCheckbox' value='All members'>\n        <label class="form-check-label" for="allMembersCheckbox">All members</label>\n      </div>\n      ${this.members.map((e=>`\n          <div class="form-check">\n            <input class="form-check-input" class="member" type="checkbox" data-member=${e.id} value=${e.id}>\n            <label class="form-check-label">${e.name}</label>\n          </div>`)).join("")}\n    </div>`}getDaysDropdown(){return`\n    <div>\n      <select class='form-select form-select-lg'>\n        ${this.days.map((e=>`<option data-day='${e}' value='${e}'>${e}</option>`)).join("")}\n      </select>\n    </div>`}getEventHoursDropdown(){return`\n    <div class='calendar__header_handling-dropdown'>\n      <select class='form-select form-select-lg'>\n        ${this.getEventHours()}\n      </select>\n    </div>`}getEventHours(){let e=[];for(let t=this.start;t<=this.end;t+=this.duration)e.push(`<option data-time='${t}'>${t}:00</option>`);return e.join("")}setEventData(e){const t=e.querySelectorAll("[data-day]"),n=e.querySelectorAll("[data-time]"),s=e.querySelectorAll("[data-member]"),a=e.querySelector("[data-name]").value;this.eventData.id=(0,r.v4)(),this.eventData.name=a.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),this.eventData.day=Object.values(t).find((e=>e.selected)).value,this.eventData.time=Object.values(n).find((e=>e.selected)).value,this.eventData.members=Object.values(s).filter((e=>e.checked)).reduce(((e,t)=>[...e,{id:t.value}]),[])}destroy(){this.element.remove()}}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class i{constructor(){l(this,"element",void 0),l(this,"subElements",{}),l(this,"components",{})}get template(){return'<div>\n      <div data-element="createEvent">\n        \x3c!-- CreateEvent component --\x3e\n      </div>\n    </div>'}render(){const e=document.createElement("div");return e.innerHTML=this.template,this.element=e.firstElementChild,this.subElements=this.getSubElements(this.element),this.initComponents(),this.renderComponents(),this.element}getSubElements(e){return[...e.querySelectorAll("[data-element]")].reduce(((e,t)=>(e[t.dataset.element]=t,e)),{})}initComponents(){const e=new a;this.components.createEvent=e}renderComponents(){Object.keys(this.components).forEach((e=>{const t=this.subElements[e],{element:n}=this.components[e];t.append(n)}))}destroy(){for(const e of Object.values(this.components))e.destroy()}}},719:(e,t,n)=>{var r=n(998),s=n(541),a=s;a.v1=r,a.v4=s,e.exports=a},973:e=>{for(var t=[],n=0;n<256;++n)t[n]=(n+256).toString(16).substr(1);e.exports=function(e,n){var r=n||0,s=t;return[s[e[r++]],s[e[r++]],s[e[r++]],s[e[r++]],"-",s[e[r++]],s[e[r++]],"-",s[e[r++]],s[e[r++]],"-",s[e[r++]],s[e[r++]],"-",s[e[r++]],s[e[r++]],s[e[r++]],s[e[r++]],s[e[r++]],s[e[r++]]].join("")}},963:e=>{var t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(t){var n=new Uint8Array(16);e.exports=function(){return t(n),n}}else{var r=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),r[t]=e>>>((3&t)<<3)&255;return r}}},998:(e,t,n)=>{var r,s,a=n(963),l=n(973),i=0,o=0;e.exports=function(e,t,n){var c=t&&n||0,d=t||[],m=(e=e||{}).node||r,u=void 0!==e.clockseq?e.clockseq:s;if(null==m||null==u){var v=a();null==m&&(m=r=[1|v[0],v[1],v[2],v[3],v[4],v[5]]),null==u&&(u=s=16383&(v[6]<<8|v[7]))}var h=void 0!==e.msecs?e.msecs:(new Date).getTime(),p=void 0!==e.nsecs?e.nsecs:o+1,b=h-i+(p-o)/1e4;if(b<0&&void 0===e.clockseq&&(u=u+1&16383),(b<0||h>i)&&void 0===e.nsecs&&(p=0),p>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");i=h,o=p,s=u;var f=(1e4*(268435455&(h+=122192928e5))+p)%4294967296;d[c++]=f>>>24&255,d[c++]=f>>>16&255,d[c++]=f>>>8&255,d[c++]=255&f;var y=h/4294967296*1e4&268435455;d[c++]=y>>>8&255,d[c++]=255&y,d[c++]=y>>>24&15|16,d[c++]=y>>>16&255,d[c++]=u>>>8|128,d[c++]=255&u;for(var g=0;g<6;++g)d[c+g]=m[g];return t||l(d)}},541:(e,t,n)=>{var r=n(963),s=n(973);e.exports=function(e,t,n){var a=t&&n||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null);var l=(e=e||{}).random||(e.rng||r)();if(l[6]=15&l[6]|64,l[8]=63&l[8]|128,t)for(var i=0;i<16;++i)t[a+i]=l[i];return t||s(l)}}}]);
//# sourceMappingURL=create-event-index-js.8add5ee88e01dd0098f8.js.map