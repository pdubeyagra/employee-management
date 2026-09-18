var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:ee,getOwnPropertySymbols:te,getPrototypeOf:ne}=Object,f=globalThis,re=f.trustedTypes,ie=re?re.emptyScript:``,ae=f.reactiveElementPolyfillSupport,p=(e,t)=>e,m={toAttribute(e,t){switch(t){case Boolean:e=e?ie:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},oe=(e,t)=>!l(e,t),se={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:oe};Symbol.metadata??=Symbol(`metadata`),f.litPropertyMetadata??=new WeakMap;var h=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??se}static _$Ei(){if(this.hasOwnProperty(p(`elementProperties`)))return;let e=ne(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(p(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(p(`properties`))){let e=this.properties,t=[...ee(e),...te(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?m:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?m:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??oe)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};h.elementStyles=[],h.shadowRootOptions={mode:`open`},h[p(`elementProperties`)]=new Map,h[p(`finalized`)]=new Map,ae?.({ReactiveElement:h}),(f.reactiveElementVersions??=[]).push(`2.1.2`);var ce=globalThis,le=e=>e,g=ce.trustedTypes,ue=g?g.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,de=`$lit$`,_=`lit$${Math.random().toFixed(9).slice(2)}$`,fe=`?`+_,pe=`<${fe}>`,v=document,y=()=>v.createComment(``),b=e=>e===null||typeof e!=`object`&&typeof e!=`function`,me=Array.isArray,he=e=>me(e)||typeof e?.[Symbol.iterator]==`function`,ge=`[ 	
\f\r]`,x=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_e=/-->/g,ve=/>/g,S=RegExp(`>|${ge}(?:([^\\s"'>=/]+)(${ge}*=${ge}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ye=/'/g,be=/"/g,xe=/^(?:script|style|textarea|title)$/i,C=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),w=Symbol.for(`lit-noChange`),T=Symbol.for(`lit-nothing`),Se=new WeakMap,E=v.createTreeWalker(v,129);function Ce(e,t){if(!me(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ue===void 0?t:ue.createHTML(t)}var we=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=x;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===x?c[1]===`!--`?o=_e:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=S):(xe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=S):o=ve:o===S?c[0]===`>`?(o=i??x,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?S:c[3]===`"`?be:ye):o===be||o===ye?o=S:o===_e||o===ve?o=x:(o=S,i=void 0);let d=o===S&&e[t+1].startsWith(`/>`)?` `:``;a+=o===x?n+pe:l>=0?(r.push(s),n.slice(0,l)+de+n.slice(l)+_+d):n+_+(l===-2?t:d)}return[Ce(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Te=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=we(t,n);if(this.el=e.createElement(l,r),E.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=E.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(de)){let t=u[o++],n=i.getAttribute(e).split(_),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Oe:r[1]===`?`?ke:r[1]===`@`?Ae:O}),i.removeAttribute(e)}else e.startsWith(_)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(xe.test(i.tagName)){let e=i.textContent.split(_),t=e.length-1;if(t>0){i.textContent=g?g.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],y()),E.nextNode(),c.push({type:2,index:++a});i.append(e[t],y())}}}else if(i.nodeType===8){if(i.data===fe)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(_,e+1))!==-1;)c.push({type:7,index:a}),e+=_.length-1}}a++}}static createElement(e,t){let n=v.createElement(`template`);return n.innerHTML=e,n}};function D(e,t,n=e,r){if(t===w)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=b(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=D(e,i._$AS(e,t.values),i,r)),t}var Ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??v).importNode(t,!0);E.currentNode=r;let i=E.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new De(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new je(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=E.nextNode(),a++)}return E.currentNode=v,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},De=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),b(e)?e===T||e==null||e===``?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==w&&this._(e):e._$litType$===void 0?e.nodeType===void 0?he(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&b(this._$AH)?this._$AA.nextSibling.data=e:this.T(v.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Te.createElement(Ce(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ee(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Se.get(e.strings);return t===void 0&&Se.set(e.strings,t=new Te(e)),t}k(t){me(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(y()),this.O(y()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=le(e).nextSibling;le(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=T}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=D(this,e,t,0),a=!b(e)||e!==this._$AH&&e!==w,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=D(this,r[n+o],t,o),s===w&&(s=this._$AH[o]),a||=!b(s)||s!==this._$AH[o],s===T?e=T:e!==T&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Oe=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}},ke=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}},Ae=class extends O{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=D(this,e,t,0)??T)===w)return;let n=this._$AH,r=e===T&&n!==T||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==T&&(n===T||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},je=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}},Me=ce.litHtmlPolyfillSupport;Me?.(Te,De),(ce.litHtmlVersions??=[]).push(`3.3.3`);var Ne=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new De(t.insertBefore(y(),e),e,void 0,n??{})}return i._$AI(e),i},Pe=globalThis,k=class extends h{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};k._$litElement$=!0,k.finalized=!0,Pe.litElementHydrateSupport?.({LitElement:k});var Fe=Pe.litElementPolyfillSupport;Fe?.({LitElement:k}),(Pe.litElementVersions??=[]).push(`4.2.2`);var A=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Ie={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:oe},Le=(e=Ie,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function j(e){return(t,n)=>typeof n==`object`?Le(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function M(e){return j({...e,state:!0,attribute:!1})}var N={primary:{50:`#eff6ff`,100:`#dbeafe`,200:`#bfdbfe`,300:`#93c5fd`,400:`#60a5fa`,500:`#3b82f6`,600:`#2563eb`,700:`#1d4ed8`,800:`#1e40af`,900:`#1e3a8a`},gray:{50:`#f9fafb`,100:`#f3f4f6`,200:`#e5e7eb`,300:`#d1d5db`,400:`#9ca3af`,500:`#6b7280`,600:`#4b5563`,700:`#374151`,800:`#1f2937`,900:`#111827`},success:{50:`#f0fdf4`,100:`#dcfce7`,200:`#bbf7d0`,300:`#86efac`,400:`#4ade80`,500:`#22c55e`,600:`#16a34a`,700:`#15803d`,800:`#166534`,900:`#145231`},danger:{50:`#fef2f2`,100:`#fee2e2`,200:`#fecaca`,300:`#fca5a5`,400:`#f87171`,500:`#ef4444`,600:`#dc2626`,700:`#b91c1c`,800:`#991b1b`,900:`#7f1d1d`},warning:{50:`#fffbeb`,100:`#fef3c7`,200:`#fde68a`,300:`#fcd34d`,400:`#fbbf24`,500:`#f59e0b`,600:`#d97706`,700:`#b45309`,800:`#92400e`,900:`#78350f`},background:{light:`#ffffff`,lighter:`#f9fafb`,dark:`#16171d`},text:{primary:`#111827`,secondary:`#374151`,tertiary:`#6b7280`,inverse:`#ffffff`},border:{light:`#e5e7eb`,medium:`#d1d5db`,dark:`#9ca3af`},shadow:`rgba(0, 0, 0, 0.05)`},P=()=>`
    --color-primary: ${N.primary[600]};
    --color-primary-hover: ${N.primary[700]};
    --color-primary-light: ${N.primary[50]};

    --color-secondary: ${N.gray[200]};
    --color-secondary-hover: ${N.gray[300]};

    --color-success: ${N.success[600]};
    --color-success-hover: ${N.success[700]};

    --color-danger: ${N.danger[600]};
    --color-danger-hover: ${N.danger[700]};

    --color-warning: ${N.warning[600]};

    --color-text-primary: ${N.text.primary};
    --color-text-secondary: ${N.text.secondary};
    --color-text-tertiary: ${N.text.tertiary};
    --color-text-inverse: ${N.text.inverse};

    --color-background: ${N.background.light};
    --color-background-secondary: ${N.gray[50]};

    --color-border: ${N.border.light};
    --color-border-secondary: ${N.border.medium};

    --color-shadow: ${N.shadow};
  `,F={breakpoints:{xs:320,sm:640,md:768,lg:1024,xl:1280,"2xl":1536},spacing:{xs:`4px`,sm:`8px`,md:`12px`,lg:`16px`,xl:`20px`,"2xl":`24px`,"3xl":`32px`},radius:{sm:`4px`,md:`8px`,lg:`12px`,full:`999px`},zIndex:{hide:`-1`,base:`0`,dropdown:`1000`,sticky:`1020`,fixed:`1030`,modal:`1040`,popover:`1050`,tooltip:`1060`},fontSize:{xs:`12px`,sm:`13px`,base:`14px`,md:`15px`,lg:`16px`,xl:`18px`,"2xl":`20px`,"3xl":`24px`,"4xl":`30px`,"5xl":`36px`},lineHeight:{tight:`1.2`,normal:`1.4`,relaxed:`1.5`,loose:`1.6`},shadows:{sm:`0 1px 2px rgba(0, 0, 0, 0.05)`,base:`0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`,md:`0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)`,lg:`0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)`,xl:`0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)`},transitions:{fast:`150ms`,base:`200ms`,slow:`300ms`},fontFamily:`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`},I=()=>{let{spacing:e,radius:t,fontSize:n,lineHeight:r,shadows:i,transitions:a}=F;return`

    --spacing-xs: ${e.xs};
    --spacing-sm: ${e.sm};
    --spacing-md: ${e.md};
    --spacing-lg: ${e.lg};
    --spacing-xl: ${e.xl};
    --spacing-2xl: ${e[`2xl`]};
    --spacing-3xl: ${e[`3xl`]};

    --radius-sm: ${t.sm};
    --radius-md: ${t.md};
    --radius-lg: ${t.lg};
    --radius-full: ${t.full};

    --font-size-xs: ${n.xs};
    --font-size-sm: ${n.sm};
    --font-size-base: ${n.base};
    --font-size-md: ${n.md};
    --font-size-lg: ${n.lg};
    --font-size-xl: ${n.xl};
    --font-size-2xl: ${n[`2xl`]};
    --font-size-3xl: ${n[`3xl`]};
    --font-size-4xl: ${n[`4xl`]};

    --line-height-tight: ${r.tight};
    --line-height-normal: ${r.normal};
    --line-height-relaxed: ${r.relaxed};
    --line-height-loose: ${r.loose};

    --shadow-sm: ${i.sm};
    --shadow-base: ${i.base};
    --shadow-md: ${i.md};
    --shadow-lg: ${i.lg};
    --shadow-xl: ${i.xl};

    --transition-fast: ${a.fast};
    --transition-base: ${a.base};
    --transition-slow: ${a.slow};

    --z-hide: ${F.zIndex.hide};
    --z-base: ${F.zIndex.base};
    --z-dropdown: ${F.zIndex.dropdown};
    --z-sticky: ${F.zIndex.sticky};
    --z-modal: ${F.zIndex.modal};
  `};function L(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var R=class extends k{constructor(...e){super(...e),this.variant=`primary`,this.size=`medium`,this.shape=`rounded`,this.iconOnly=!1,this.disabled=!1,this.loading=!1,this.fullWidth=!1,this.type=`button`,this.label=``}static{this.styles=o`
    :host {
      display: inline-block;
      width: auto;
      max-width: 100%;
      ${a(P())}
      ${a(I())}
      --button-primary: var(--color-primary);
      --button-primary-hover: var(--color-primary-hover);
      --button-secondary: var(--color-secondary);
      --button-secondary-hover: var(--color-secondary-hover);
      --button-danger: var(--color-danger);
      --button-danger-hover: var(--color-danger-hover);
      --button-success: var(--color-success);
      --button-success-hover: var(--color-success-hover);
      --button-text: var(--color-text-inverse);
      --button-text-secondary: var(--color-text-secondary);
      --button-radius: var(--radius-md);
      --button-font-size: var(--font-size-base);
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    button {
      box-sizing: border-box;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: auto;
      max-width: 100%;
      min-width: 80px;

      gap: 8px;

      border: none;
      outline: none;

      font-family: inherit;
      font-size: var(--button-font-size);
      font-weight: 600;

      white-space: nowrap;

      cursor: pointer;

      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.1s ease,
        opacity 0.2s ease;
    }

    :host([full-width]) button {
      width: 100%;
    }

    button:active:not(:disabled) {
      transform: translateY(1px);
    }

    button:focus-visible {
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
    }

    button.small {
      min-height: 32px;
      padding: 6px 12px;
      font-size: 12px;
    }

    button.medium {
      min-height: 40px;
      padding: 9px 16px;
      font-size: 14px;
    }

    button.large {
      min-height: 48px;
      padding: 12px 22px;
      font-size: 16px;
    }

    button.rounded {
      border-radius: var(--button-radius);
    }

    button.pill {
      border-radius: 999px;
    }

    button.square {
      border-radius: 0;
    }

    button.primary {
      background: var(--button-primary);
      color: var(--button-text);
    }

    button.primary:hover:not(:disabled) {
      background: var(--button-primary-hover);
    }

    button.secondary {
      background: var(--button-secondary);
      color: var(--button-text-secondary);
    }

    button.secondary:hover:not(:disabled) {
      background: var(--button-secondary-hover);
    }

    button.danger {
      background: var(--button-danger);
      color: var(--button-text);
    }

    button.danger:hover:not(:disabled) {
      background: var(--button-danger-hover);
    }

    button.success {
      background: var(--button-success);
      color: var(--button-text);
    }

    button.success:hover:not(:disabled) {
      background: var(--button-success-hover);
    }

    button.ghost {
      background: transparent;
      color: var(--button-text-secondary);
    }

    button.ghost:hover:not(:disabled) {
      background: var(--color-background-secondary);
    }

    button.icon-only.small {
      width: 32px;
      min-width: 32px;
      height: 32px;
      padding: 0;
    }

    button.icon-only.medium {
      width: 40px;
      min-width: 40px;
      height: 40px;
      padding: 0;
    }

    button.icon-only.large {
      width: 48px;
      min-width: 48px;
      height: 48px;
      padding: 0;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .spinner {
      width: 16px;
      height: 16px;

      flex: 0 0 auto;

      border: 2px solid currentColor;
      border-right-color: transparent;

      border-radius: 50%;

      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    ::slotted(svg) {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    button.small ::slotted(svg) {
      width: 16px;
      height: 16px;
    }

    button.large ::slotted(svg) {
      width: 20px;
      height: 20px;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }

      .spinner {
        animation: none;
      }
    }
  `}get buttonClasses(){return[this.variant,this.size,this.shape,this.iconOnly?`icon-only`:``].filter(Boolean).join(` `)}handleClick(e){if(this.disabled||this.loading){e.preventDefault(),e.stopPropagation();return}this.dispatchEvent(new CustomEvent(`button-click`,{bubbles:!0,composed:!0})),this.type===`submit`&&this.dispatchEvent(new CustomEvent(`button-submit`,{bubbles:!0,composed:!0}))}render(){return C`
      <button
        class=${this.buttonClasses}
        type=${this.type}
        ?disabled=${this.disabled||this.loading}
        aria-disabled=${this.disabled||this.loading}
        aria-label=${this.label||T}
        @click=${this.handleClick}
      >
        ${this.loading?C`
              <span class="spinner" aria-label="Loading" role="status"></span>
            `:C` <slot name="icon"></slot> `}
        ${this.iconOnly?C` <slot name="icon-only"></slot> `:C` <slot></slot> `}
      </button>
    `}};L([j({type:String})],R.prototype,`variant`,void 0),L([j({type:String})],R.prototype,`size`,void 0),L([j({type:String})],R.prototype,`shape`,void 0),L([j({type:Boolean,attribute:`icon-only`})],R.prototype,`iconOnly`,void 0),L([j({type:Boolean})],R.prototype,`disabled`,void 0),L([j({type:Boolean})],R.prototype,`loading`,void 0),L([j({type:Boolean})],R.prototype,`fullWidth`,void 0),L([j({type:String})],R.prototype,`type`,void 0),L([j({type:String})],R.prototype,`label`,void 0),R=L([A(`ui-button`)],R);var Re=/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/,ze=`This field`;function Be(e,t){let n=t.label||ze,r=e.trim();return r?t.minlength&&r.length<t.minlength?`${n} must be at least ${t.minlength} characters.`:t.maxlength&&r.length>t.maxlength?`${n} must be ${t.maxlength} characters or fewer.`:t.type===`email`&&!Re.test(r)?`Please enter a valid email address.`:t.pattern&&!t.pattern.test(r)?t.patternMessage||`${n} is not in the expected format.`:``:t.required?`${n} is required.`:``}var z=class extends k{constructor(...e){super(...e),this.label=``,this.value=``,this.placeholder=``,this.type=`text`,this.inputmode=``,this.autocomplete=``,this.error=``,this.maxlength=0,this.minlength=0,this.pattern=null,this.patternMessage=``,this.required=!1,this.invalid=!1,this.selfError=``,this.hasIcon=!1}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      width: 100%;
      min-width: 0;
    }

    label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 600;
    }

    .required {
      margin-left: var(--spacing-xs);
      color: var(--color-danger);
    }

    .input-wrapper {
      position: relative;
      display: block;
      width: 100%;
      min-width: 0;
    }

    ::slotted([slot="icon"]) {
      position: absolute;
      top: 50%;
      left: var(--spacing-md);
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    input {
      display: block;
      width: 100%;
      min-width: 0;
      height: 44px;
      padding: var(--spacing-md) var(--spacing-md);
      color: var(--color-text-primary);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      outline: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      pointer-events: auto;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .input-wrapper.has-icon input {
      padding-left: calc(var(--spacing-md) * 2 + 16px);
    }

    input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    input.invalid {
      border-color: var(--color-danger);
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }
  `}handleIconSlotChange(e){let t=e.target;this.hasIcon=t.assignedNodes({flatten:!0}).length>0,this.requestUpdate()}get rules(){return{label:this.label,required:this.required,maxlength:this.maxlength,minlength:this.minlength,type:this.type,pattern:this.pattern,patternMessage:this.patternMessage}}validate(){return this.selfError=Be(this.value,this.rules),this.selfError}get validationMessage(){return this.error||this.selfError}handleInput(e){let t=e.target;this.value=t.value;let n=this.validate();this.dispatchEvent(new CustomEvent(`input-change`,{detail:{value:t.value,error:n},bubbles:!0,composed:!0}))}handleBlur(){let e=this.validate();this.dispatchEvent(new CustomEvent(`input-blur`,{detail:{value:this.value,error:e},bubbles:!0,composed:!0}))}render(){let e=this.validationMessage,t=this.invalid||!!e;return C`
      <div class="form-group">
        <label>
          ${this.label}
          ${this.required?C`<span class="required">*</span>`:``}
        </label>

        <div class="input-wrapper ${this.hasIcon?`has-icon`:``}">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

          <input
            type=${this.type}
            .value=${this.value}
            placeholder=${this.placeholder}
            inputmode=${this.inputmode||T}
            autocomplete=${this.autocomplete||T}
            maxlength=${this.maxlength>0?this.maxlength:T}
            class=${t?`invalid`:``}
            aria-invalid=${t?`true`:`false`}
            @input=${this.handleInput}
            @blur=${this.handleBlur}
          />
        </div>

        <div class="error-message" role="alert">${e}</div>
      </div>
    `}};L([j()],z.prototype,`label`,void 0),L([j()],z.prototype,`value`,void 0),L([j()],z.prototype,`placeholder`,void 0),L([j()],z.prototype,`type`,void 0),L([j()],z.prototype,`inputmode`,void 0),L([j()],z.prototype,`autocomplete`,void 0),L([j()],z.prototype,`error`,void 0),L([j({type:Number})],z.prototype,`maxlength`,void 0),L([j({type:Number})],z.prototype,`minlength`,void 0),L([j({attribute:!1})],z.prototype,`pattern`,void 0),L([j()],z.prototype,`patternMessage`,void 0),L([j({type:Boolean})],z.prototype,`required`,void 0),L([j({type:Boolean})],z.prototype,`invalid`,void 0),L([M()],z.prototype,`selfError`,void 0),z=L([A(`ui-input`)],z);var Ve=`This field`,B=class extends k{constructor(...e){super(...e),this.label=``,this.value=``,this.placeholder=`Select an option`,this.options=[],this.name=``,this.error=``,this.required=!1,this.disabled=!1,this.invalid=!1,this.compact=!1,this.selfError=``,this.hasIcon=!1}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      width: 100%;
      min-width: 0;
    }

    label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 600;
    }

    .required {
      margin-left: var(--spacing-xs);
      color: var(--color-danger);
    }

    .select-wrapper {
      position: relative;
      display: block;
      width: 100%;
      min-width: 0;
    }

    ::slotted([slot="icon"]) {
      position: absolute;
      top: 50%;
      left: var(--spacing-md);
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    select {
      display: block;
      width: 100%;
      min-width: 0;
      height: 44px;
      padding: var(--spacing-md) calc(var(--spacing-md) * 2 + 12px)
        var(--spacing-md) var(--spacing-md);
      color: var(--color-text-primary);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      cursor: pointer;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .select-wrapper.has-icon select {
      padding-left: calc(var(--spacing-md) * 2 + 16px);
    }

    select:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }

    select.invalid {
      border-color: var(--color-danger);
    }

    select:disabled {
      color: var(--color-text-tertiary);
      background: var(--color-background-secondary);
      cursor: not-allowed;
      opacity: 0.7;
    }

    select.placeholder-selected {
      color: var(--color-text-tertiary);
    }

    option {
      color: var(--color-text-primary);
    }

    .chevron {
      position: absolute;
      top: 50%;
      right: var(--spacing-md);
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    :host([compact]) {
      display: inline-block;
      width: auto;
    }

    :host([compact]) .form-group {
      gap: 0;
    }

    :host([compact]) select {
      height: 32px;
      padding: 0 calc(var(--spacing-md) + 12px) 0 var(--spacing-sm);
      font-size: var(--font-size-sm);
    }

    :host([compact]) .chevron {
      right: var(--spacing-sm);
      width: 10px;
      height: 10px;
    }

    @media (prefers-reduced-motion: reduce) {
      select {
        transition: none;
      }
    }
  `}updated(){let e=this.renderRoot.querySelector(`select`);e&&e.value!==this.value&&(e.value=this.value)}handleIconSlotChange(e){let t=e.target;this.hasIcon=t.assignedNodes({flatten:!0}).length>0,this.requestUpdate()}validate(){let e=this.label||Ve;return this.selfError=this.required&&!this.value.trim()?`${e} is required.`:``,this.selfError}get validationMessage(){return this.error||this.selfError}get selectedOption(){return this.options.find(e=>e.value===this.value)??null}handleChange(e){let t=e.target;this.value=t.value;let n=this.validate();this.dispatchEvent(new CustomEvent(`select-change`,{detail:{value:t.value,error:n},bubbles:!0,composed:!0}))}handleBlur(){let e=this.validate();this.dispatchEvent(new CustomEvent(`select-blur`,{detail:{value:this.value,error:e},bubbles:!0,composed:!0}))}get optionsTemplate(){return this.options.map(e=>C`
        <option value=${e.value} ?disabled=${e.disabled??!1}>
          ${e.label}
        </option>
      `)}render(){let e=this.validationMessage,t=this.invalid||!!e,n=this.value===``,r=[t?`invalid`:``,n?`placeholder-selected`:``].filter(Boolean).join(` `);return C`
      <div class="form-group">
        ${this.compact?T:C`
              <label>
                ${this.label}
                ${this.required?C`<span class="required">*</span>`:``}
              </label>
            `}

        <div class="select-wrapper ${this.hasIcon?`has-icon`:``}">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

          <select
            class=${r}
            name=${this.name||T}
            ?disabled=${this.disabled}
            aria-label=${this.compact&&this.label?this.label:T}
            aria-invalid=${t?`true`:`false`}
            @change=${this.handleChange}
            @blur=${this.handleBlur}
          >
            <option value="" ?disabled=${this.required}>
              ${this.placeholder}
            </option>

            ${this.optionsTemplate}
          </select>

          <svg
            class="chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        ${this.compact?T:C`<div class="error-message" role="alert">${e}</div>`}
      </div>
    `}};L([j()],B.prototype,`label`,void 0),L([j()],B.prototype,`value`,void 0),L([j()],B.prototype,`placeholder`,void 0),L([j({attribute:!1})],B.prototype,`options`,void 0),L([j()],B.prototype,`name`,void 0),L([j()],B.prototype,`error`,void 0),L([j({type:Boolean})],B.prototype,`required`,void 0),L([j({type:Boolean})],B.prototype,`disabled`,void 0),L([j({type:Boolean})],B.prototype,`invalid`,void 0),L([j({type:Boolean})],B.prototype,`compact`,void 0),L([M()],B.prototype,`selfError`,void 0),B=L([A(`ui-select`)],B);var V=class extends k{constructor(...e){super(...e),this.message=``,this.variant=`success`,this.open=!1,this.duration=3e3,this.closable=!0,this.placement=`top-right`}static{this.styles=o`
    :host {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
    }

    :host([placement="top-left"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="top-center"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="top-right"]) {
      top: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      right: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="bottom-left"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    :host([placement="bottom-center"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      left: 50%;
      transform: translateX(-50%);
    }

    :host([placement="bottom-right"]) {
      bottom: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
      right: clamp(var(--spacing-sm), 2vw, var(--spacing-2xl));
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      min-width: clamp(220px, 90vw, 420px);
      max-width: calc(100vw - var(--spacing-2xl));

      padding: var(--spacing-md) var(--spacing-lg);

      color: var(--color-text-inverse);

      border-radius: var(--radius-lg);

      font-size: clamp(var(--font-size-sm), 2vw, var(--font-size-base));
      font-weight: 500;
      line-height: var(--line-height-normal);

      box-shadow: var(--shadow-lg);

      opacity: 0;
      transform: translateY(-10px);

      transition:
        opacity var(--transition-base) ease,
        transform var(--transition-base) ease;

      pointer-events: none;
    }

    .toast.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    :host([placement^="bottom"]) .toast {
      transform: translateY(10px);
    }

    :host([placement^="bottom"]) .toast.open {
      transform: translateY(0);
    }

    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 22px;
      height: 22px;
    }

    .icon svg {
      display: block;

      width: 22px;
      height: 22px;

      fill: none;
      stroke: currentColor;

      stroke-width: 2;

      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .message {
      flex: 1;
      min-width: 0;

      overflow-wrap: anywhere;
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 auto;

      width: 24px;
      height: 24px;

      padding: 0;

      border: none;
      border-radius: var(--radius-sm);

      color: inherit;
      background: transparent;

      font-size: 20px;
      line-height: 1;

      cursor: pointer;

      opacity: 0.8;

      transition:
        background-color var(--transition-fast) ease,
        opacity var(--transition-fast) ease;
    }

    .close-button:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.15);
    }

    .close-button:focus-visible {
      outline: 2px solid var(--color-text-inverse);
      outline-offset: 2px;
    }

    .success {
      background: var(--color-success);
    }

    .error {
      background: var(--color-danger);
    }

    .info {
      background: var(--color-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        transition: none;
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.setAttribute(`placement`,this.placement)}updated(e){e.has(`placement`)&&this.setAttribute(`placement`,this.placement),(e.has(`open`)||e.has(`duration`))&&(this.open?this.startTimer():this.clearTimer())}show(e,t=`success`){this.message=e,this.variant=t,this.open=!0,this.startTimer()}close(){this.open=!1,this.clearTimer(),this.dispatchEvent(new CustomEvent(`toast-close`,{bubbles:!0,composed:!0}))}startTimer(){this.clearTimer(),!(!this.open||this.duration<=0)&&(this.timeoutId=window.setTimeout(()=>{this.close()},this.duration))}clearTimer(){this.timeoutId!==void 0&&(window.clearTimeout(this.timeoutId),this.timeoutId=void 0)}handleClose(){this.close()}renderIcon(){switch(this.variant){case`success`:return C`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="m8 12 2.5 2.5L16 9"></path>
          </svg>
        `;case`error`:return C`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        `;case`info`:return C`
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 10v6"></path>
            <path d="M12 7h.01"></path>
          </svg>
        `}}disconnectedCallback(){this.clearTimer(),super.disconnectedCallback()}render(){return C`
      <div
        class="toast ${this.variant} ${this.open?`open`:``}"
        role="alert"
        aria-live="polite"
        aria-hidden=${this.open?`false`:`true`}
      >
        <span class="icon" aria-hidden="true"> ${this.renderIcon()} </span>

        <span class="message">${this.message}</span>

        ${this.closable?C`
              <button
                type="button"
                class="close-button"
                aria-label="Close notification"
                @click=${this.handleClose}
              >
                ×
              </button>
            `:``}
      </div>
    `}};L([j({type:String})],V.prototype,`message`,void 0),L([j({type:String})],V.prototype,`variant`,void 0),L([j({type:Boolean})],V.prototype,`open`,void 0),L([j({type:Number})],V.prototype,`duration`,void 0),L([j({type:Boolean})],V.prototype,`closable`,void 0),L([j({type:String})],V.prototype,`placement`,void 0),V=L([A(`app-toast`)],V);var He=[`Engineering`,`Design`,`Product`,`Research`,`Sales`,`Marketing`,`Finance`,`Human Resources`,`Operations`,`Support`,`Legal`],Ue=[`Intern`,`Associate`,`Software Engineer`,`Senior Software Engineer`,`Staff Engineer`,`Principal Engineer`,`Engineering Manager`,`Director`,`VP Engineering`,`Chief Technology Officer`],We=e=>e.map(e=>({value:e,label:e})),Ge=We(He),Ke=We(Ue);function qe(e,t){let n=t.trim();return!n||e.some(e=>e.value===n)?e:[...e,{value:n,label:n}]}var Je={name:{label:`Name`,required:!0,maxlength:100},department:{label:`Department`,required:!0,maxlength:100},designation:{label:`Designation`,required:!0,maxlength:100},email:{label:`Email`,required:!0,maxlength:254,type:`email`}},Ye=Object.keys(Je),Xe=Object.fromEntries(Ye.map(e=>[e,Je[e].maxlength??0]));function Ze(e,t){return Be(t,Je[e])}function Qe(e){return Object.fromEntries(Ye.map(t=>[t,Ze(t,e[t])]))}function $e(e){return Object.values(e).every(e=>!e)}var H=class extends k{constructor(...e){super(...e),this.employeeToEdit=null,this.formData={name:``,department:``,designation:``,email:``},this.errors={name:``,department:``,designation:``,email:``},this.previousEmployeeId=null}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
      color: var(--color-text-primary);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .form-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .form-header-close {
      margin-left: auto;
    }

    .form-header-close ui-button {
      min-width: 0;
    }

    .close-icon {
      display: block;
      width: 16px;
      height: 16px;
    }

    .form-header h2 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .edit-badge {
      display: inline-flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-primary);
      background: var(--color-primary-light);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      line-height: 1;
      font-weight: 700;
    }

    .employee-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      width: 100%;
      min-width: 0;
    }

    .form-input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: var(--spacing-lg);
      width: 100%;
      min-width: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
    }

    .field-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      color: var(--color-text-tertiary);
    }

    .actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      margin-top: var(--spacing-sm);
    }

    ui-button {
      flex: 0 1 auto;
      min-width: 120px;
    }

    @supports not (
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr))
    ) {
      .form-input-section {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `}willUpdate(e){super.willUpdate(e),e.has(`employeeToEdit`)&&(this.employeeToEdit?this.previousEmployeeId!==this.employeeToEdit.id&&(this.previousEmployeeId=this.employeeToEdit.id,this.formData={name:this.employeeToEdit.name,department:this.employeeToEdit.department,designation:this.employeeToEdit.designation,email:this.employeeToEdit.email},this.errors={name:``,department:``,designation:``,email:``}):this.previousEmployeeId=null)}handleInput(e,t){let n=t.detail.value;this.formData={...this.formData,[e]:n},this.errors={...this.errors,[e]:Ze(e,n)}}handleBlur(e){this.errors={...this.errors,[e]:Ze(e,this.formData[e])}}handleSubmit(e){e.preventDefault();let t=Qe(this.formData);if(this.errors=t,!$e(t)){this.showToast(`Please fix the errors in the form.`,`error`);return}if(this.employeeToEdit){let e={id:this.employeeToEdit.id,name:this.formData.name.trim(),department:this.formData.department.trim(),designation:this.formData.designation.trim(),email:this.formData.email.trim()};this.dispatchEvent(new CustomEvent(`employee-updated`,{detail:e})),this.showToast(`Employee updated successfully!`,`success`),this.handleClear();return}let n={name:this.formData.name.trim(),department:this.formData.department.trim(),designation:this.formData.designation.trim(),email:this.formData.email.trim()};this.dispatchEvent(new CustomEvent(`employee-added`,{detail:n})),this.showToast(`Employee added successfully!`,`success`),this.handleClear()}handleSubmitButton(e){e.stopPropagation();let t=this.renderRoot.querySelector(`.employee-form`);t&&t.requestSubmit()}resetFormState(){this.formData={name:``,department:``,designation:``,email:``},this.errors={name:``,department:``,designation:``,email:``}}handleClear(){this.resetFormState(),this.employeeToEdit&&this.dispatchEvent(new CustomEvent(`edit-cancelled`))}handleClose(e){e.stopPropagation(),this.resetFormState(),this.dispatchEvent(new CustomEvent(`form-close`))}showToast(e,t){this.renderRoot.querySelector(`app-toast`)?.show?.(e,t)}get headerTemplate(){let e=this.employeeToEdit!==null;return C`
      <div class="form-header">
        <h2>${e?`Edit Employee`:`Employee Form`}</h2>
        ${e?C`<span class="edit-badge">Editing</span>`:``}

        <div class="form-header-close">
          <ui-button
            variant="ghost"
            size="small"
            shape="rounded"
            type="button"
            icon-only
            label="Close form"
            title="Close form"
            @button-click=${this.handleClose}
          >
            <svg
              class="close-icon"
              slot="icon-only"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </ui-button>
        </div>
      </div>
    `}renderFieldIcon(e){return{name:C`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>`,department:C`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      </svg>`,designation:C`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>`,email:C`<svg
        class="field-icon"
        slot="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>`}[e]}get template(){let e=this.employeeToEdit!==null;return C`
      <div class="form-container">
        ${this.headerTemplate}

        <form class="employee-form" novalidate @submit=${this.handleSubmit}>
          <div class="form-input-section">
            <ui-input
              label="Name"
              .maxlength=${Xe.name}
              placeholder="Enter employee name"
              .value=${this.formData.name}
              .error=${this.errors.name}
              .invalid=${!!this.errors.name}
              required
              @input-change=${e=>this.handleInput(`name`,e)}
              @input-blur=${()=>this.handleBlur(`name`)}
            >
              ${this.renderFieldIcon(`name`)}
            </ui-input>

            <ui-select
              label="Department"
              placeholder="Select a department"
              .options=${qe(Ge,this.formData.department)}
              .value=${this.formData.department}
              .error=${this.errors.department}
              .invalid=${!!this.errors.department}
              required
              @select-change=${e=>this.handleInput(`department`,e)}
              @select-blur=${()=>this.handleBlur(`department`)}
            >
              ${this.renderFieldIcon(`department`)}
            </ui-select>

            <ui-select
              label="Designation"
              placeholder="Select a designation"
              .options=${qe(Ke,this.formData.designation)}
              .value=${this.formData.designation}
              .error=${this.errors.designation}
              .invalid=${!!this.errors.designation}
              required
              @select-change=${e=>this.handleInput(`designation`,e)}
              @select-blur=${()=>this.handleBlur(`designation`)}
            >
              ${this.renderFieldIcon(`designation`)}
            </ui-select>

            <ui-input
              label="Email"
              .maxlength=${Xe.email}
              type="email"
              inputmode="email"
              autocomplete="off"
              placeholder="employee@example.com"
              .value=${this.formData.email}
              .error=${this.errors.email}
              .invalid=${!!this.errors.email}
              required
              @input-change=${e=>this.handleInput(`email`,e)}
              @input-blur=${()=>this.handleBlur(`email`)}
            >
              ${this.renderFieldIcon(`email`)}
            </ui-input>
          </div>

          <div class="actions">
            <ui-button
              size="medium"
              @button-submit=${this.handleSubmitButton}
              shape="rounded"
              type="submit"
            >
              ${e?`Update Employee`:`Save`}
            </ui-button>

            <ui-button
              variant="secondary"
              size="medium"
              shape="rounded"
              type="button"
              @click=${this.handleClear}
            >
              ${e?`Cancel`:`Clear`}
            </ui-button>
          </div>
        </form>
      </div>

      <app-toast></app-toast>
    `}render(){return this.template}};L([j({attribute:!1})],H.prototype,`employeeToEdit`,void 0),L([M()],H.prototype,`formData`,void 0),L([M()],H.prototype,`errors`,void 0),H=L([A(`employee-form`)],H);var et=[`#2563eb`,`#7c3aed`,`#db2777`,`#059669`,`#d97706`,`#0891b2`],tt=e=>et.map((t,n)=>`${e}.avatar-${n} { background: ${t}; }`).join(`
`),nt=e=>{let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t),t|=0;return Math.abs(t)%et.length},rt=e=>{let t=e.trim().split(/\s+/).filter(Boolean);return t.length===0?`?`:`${t[0]?.[0]??``}${t.length>1?t[t.length-1]?.[0]??``:``}`.toUpperCase()},U=class extends k{constructor(...e){super(...e),this.employees=[],this.searchActive=!1}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
      color: var(--color-text-primary);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .table-wrapper {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      -webkit-overflow-scrolling: touch;
    }

    table {
      width: 100%;
      min-width: 680px;
      border-collapse: collapse;
      table-layout: fixed;
    }

    thead {
      background: var(--color-background-secondary);
    }

    th {
      padding: var(--spacing-lg) var(--spacing-md);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 700;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    td {
      padding: var(--spacing-lg) var(--spacing-md);
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      vertical-align: middle;
      border-bottom: 1px solid var(--color-border);
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    tbody tr {
      transition: background-color var(--transition-base);
    }

    tbody tr:hover {
      background: var(--color-background-secondary);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    th:nth-child(1),
    td:nth-child(1) {
      width: 24%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 18%;
    }

    th:nth-child(3),
    td:nth-child(3) {
      width: 19%;
    }

    th:nth-child(4),
    td:nth-child(4) {
      width: 24%;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 15%;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      text-transform: uppercase;
    }

    ${a(tt(`.avatar`))}

    .name {
      color: var(--color-text-primary);
      font-weight: 600;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email {
      color: var(--color-primary);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      white-space: nowrap;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 220px;
      padding: var(--spacing-3xl) var(--spacing-xl);
      color: var(--color-text-secondary);
      text-align: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
      gap: var(--spacing-md);
    }

    .empty-icon {
      width: 56px;
      height: 56px;
      color: var(--color-text-tertiary);
    }

    .empty-title {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-md);
      font-weight: 600;
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      tbody tr {
        transition: none;
      }
    }
  `}handleEdit(e){this.dispatchEvent(new CustomEvent(`edit`,{detail:e}))}handleDelete(e){this.dispatchEvent(new CustomEvent(`delete`,{detail:e}))}handleAddEmployee(){this.dispatchEvent(new CustomEvent(`add-employee`))}get emptyStateTemplate(){return C`
      <div class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
          />
        </svg>

        <p class="empty-title">No employees found</p>

        <p class="empty-description">
          ${this.searchActive?`Try a different search term.`:`Add your first employee to get started.`}
        </p>

        ${this.searchActive?``:C`
              <ui-button
                variant="primary"
                size="medium"
                shape="rounded"
                type="button"
                @button-click=${this.handleAddEmployee}
              >
                + Add Employee
              </ui-button>
            `}
      </div>
    `}renderRow(e){let t=rt(e.name);return C`
      <tr>
        <td>
          <div class="name-cell">
            <span class="avatar avatar-${nt(e.name||e.id)}" aria-hidden="true"
              >${t}</span
            >
            <span class="name">${e.name||`—`}</span>
          </div>
        </td>

        <td>${e.department||`—`}</td>

        <td>${e.designation||`—`}</td>

        <td class="email">${e.email||`—`}</td>

        <td>
          <div class="actions">
            <ui-button
              variant="primary"
              size="small"
              shape="rounded"
              .iconOnly=${!0}
              type="button"
              aria-label="Edit employee"
              @button-click=${()=>this.handleEdit(e)}
            >
              <svg
                slot="icon-only"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </ui-button>

            <ui-button
              variant="danger"
              size="small"
              shape="rounded"
              .iconOnly=${!0}
              type="button"
              aria-label="Delete employee"
              @button-click=${()=>this.handleDelete(e)}
            >
              <svg
                slot="icon-only"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </ui-button>
          </div>
        </td>
      </tr>
    `}get template(){return this.employees.length===0?this.emptyStateTemplate:C`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            ${this.employees.map(e=>this.renderRow(e))}
          </tbody>
        </table>
      </div>
    `}render(){return this.template}};L([j({type:Array})],U.prototype,`employees`,void 0),L([j({type:Boolean,attribute:`search-active`})],U.prototype,`searchActive`,void 0),U=L([A(`employee-table`)],U);var W=class extends k{constructor(...e){super(...e),this.open=!1,this.heading=``,this.size=`medium`,this.dialogRole=`dialog`,this.hideClose=!1,this.disableOverlayClose=!1}static{this.styles=o`
    :host {
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg);
      background: rgba(15, 23, 42, 0.5);
    }

    .overlay.open {
      display: flex;
    }

    .dialog {
      width: 100%;
      background: var(--color-background);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      max-height: calc(100vh - var(--spacing-2xl) * 2);
      overflow-y: auto;
    }

    .dialog.small {
      max-width: 360px;
    }

    .dialog.medium {
      max-width: 420px;
    }

    .dialog.large {
      max-width: 640px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
    }

    .dialog-header h3 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      font-weight: 700;
    }

    .close-icon-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      color: var(--color-text-tertiary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }

    .close-icon-button:hover {
      background: var(--color-background-secondary);
      color: var(--color-text-secondary);
    }

    .close-icon-button:focus-visible {
      outline: 3px solid var(--color-primary-light);
      outline-offset: 2px;
      color: var(--color-text-secondary);
    }

    .close-icon-button svg {
      width: 18px;
      height: 18px;
    }

    .dialog-body {
      min-width: 0;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }
  `}emitClose(){this.dispatchEvent(new CustomEvent(`dialog-close`))}handleCloseClick(){this.emitClose()}handleOverlayClick(e){this.disableOverlayClose||e.target===e.currentTarget&&this.emitClose()}render(){return C`
      <div
        class="overlay ${this.open?`open`:``}"
        @click=${this.handleOverlayClick}
        role="presentation"
      >
        <div
          class="dialog ${this.size}"
          role=${this.dialogRole}
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div class="dialog-header">
            <h3 id="dialog-title">${this.heading}</h3>

            ${this.hideClose?T:C`
                  <button
                    type="button"
                    class="close-icon-button"
                    aria-label="Close"
                    @click=${this.handleCloseClick}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                `}
          </div>

          <div class="dialog-body">
            <slot></slot>
          </div>

          <div class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `}};L([j({type:Boolean})],W.prototype,`open`,void 0),L([j()],W.prototype,`heading`,void 0),L([j({type:String})],W.prototype,`size`,void 0),L([j({type:String,attribute:`dialog-role`})],W.prototype,`dialogRole`,void 0),L([j({type:Boolean,attribute:`hide-close`})],W.prototype,`hideClose`,void 0),L([j({type:Boolean,attribute:`disable-overlay-close`})],W.prototype,`disableOverlayClose`,void 0),W=L([A(`ui-dialog`)],W);var G=class extends k{constructor(...e){super(...e),this.open=!1,this.title=`Confirm`,this.message=`Are you sure?`,this.confirmText=`Confirm`,this.cancelText=`Cancel`,this.confirmVariant=`danger`,this.size=`medium`}static{this.styles=o`
    :host {
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .dialog-message {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }
  `}handleCancel(){this.dispatchEvent(new CustomEvent(`cancel`))}handleConfirm(){this.dispatchEvent(new CustomEvent(`confirm`))}get template(){return C`
      <ui-dialog
        .open=${this.open}
        .heading=${this.title}
        .size=${this.size}
        dialog-role="alertdialog"
        @dialog-close=${this.handleCancel}
      >
        <p class="dialog-message">${this.message}</p>

        <div class="dialog-actions" slot="footer">
          <ui-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleCancel}
          >
            ${this.cancelText}
          </ui-button>

          <ui-button
            .variant=${this.confirmVariant}
            size="medium"
            shape="rounded"
            type="button"
            @button-click=${this.handleConfirm}
          >
            ${this.confirmText}
          </ui-button>
        </div>
      </ui-dialog>
    `}render(){return this.template}};L([j({type:Boolean})],G.prototype,`open`,void 0),L([j()],G.prototype,`title`,void 0),L([j()],G.prototype,`message`,void 0),L([j()],G.prototype,`confirmText`,void 0),L([j()],G.prototype,`cancelText`,void 0),L([j({type:String,attribute:`confirm-variant`})],G.prototype,`confirmVariant`,void 0),L([j({type:String})],G.prototype,`size`,void 0),G=L([A(`confirm-dialog`)],G);var it=[1,5,10,20],K=class extends k{constructor(...e){super(...e),this.currentPage=1,this.totalPages=0,this.totalItems=0,this.pageSize=10,this.pageSizeOptions=it,this.showItemCount=!0,this.showFirstLast=!0,this.showPageSize=!0,this.loading=!1}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      min-width: 0;

      font-family: ${a(F.fontFamily)};

      color: var(--color-text-secondary);

      ${a(P())}
      ${a(I())}
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      min-width: 0;
      gap: clamp(var(--spacing-sm), 2vw, var(--spacing-xl));
      padding: var(--spacing-md) var(--spacing-sm);
    }

    .summary {
      display: flex;
      align-items: center;
      flex: 0 1 auto;
      flex-wrap: wrap;
      gap: clamp(var(--spacing-sm), 2vw, var(--spacing-lg));
      min-width: 0;
    }

    .item-count {
      flex: 0 1 auto;

      color: var(--color-text-tertiary);

      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      line-height: var(--line-height-relaxed);

      white-space: nowrap;
    }

    .page-size {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      gap: var(--spacing-sm);
    }

    .page-size-label {
      color: var(--color-text-tertiary);
      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      line-height: var(--line-height-relaxed);
      white-space: nowrap;
    }

    .controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: clamp(2px, 1vw, var(--spacing-md));

      min-width: 0;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: clamp(32px, 5vw, 40px);
      height: clamp(32px, 5vw, 40px);

      padding: 0 clamp(4px, 1vw, var(--spacing-md));

      color: var(--color-text-secondary);
      background: var(--color-background);

      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);

      font-family: inherit;
      font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
      font-weight: 600;

      cursor: pointer;

      transition:
        background-color var(--transition-fast) ease,
        border-color var(--transition-fast) ease,
        color var(--transition-fast) ease;
    }

    button:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-text-secondary);
    }

    button:focus-visible {
      outline: 3px solid rgba(37, 99, 235, 0.2);
      outline-offset: 2px;
    }

    button:disabled {
      color: var(--color-border-secondary);
      background: var(--color-background-secondary);

      border-color: var(--color-border);

      cursor: not-allowed;
    }

    .page-button.active {
      color: var(--color-text-inverse);
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    .page-button.active:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
    }

    .arrow {
      width: clamp(14px, 2vw, 18px);
      height: clamp(14px, 2vw, 18px);
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: clamp(24px, 4vw, 32px);
      height: clamp(32px, 5vw, 40px);

      color: var(--color-text-tertiary);

      font-size: clamp(var(--font-size-sm), 1.5vw, var(--font-size-base));
      user-select: none;
    }

    .mobile-page {
      display: none;
    }

    @media (max-width: 768px) {
      .pagination {
        justify-content: center;
      }

      .summary {
        width: 100%;
        justify-content: center;
        order: 1;
      }

      .item-count {
        width: 100%;
        text-align: center;
      }

      .controls {
        width: 100%;
        justify-content: center;
        order: 2;
      }

      .desktop-pages {
        display: none;
      }

      .mobile-page {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-width: clamp(36px, 5vw, 44px);
        height: clamp(36px, 5vw, 44px);

        padding: 0 clamp(4px, 1vw, var(--spacing-md));

        color: var(--color-text-inverse);
        background: var(--color-primary);

        border: 1px solid var(--color-primary);
        border-radius: var(--radius-md);

        font-size: clamp(var(--font-size-xs), 1.5vw, var(--font-size-sm));
        font-weight: 600;
      }

      .first-last {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `}get resolvedTotalPages(){if(this.totalPages>0)return this.totalPages;let e=Math.max(1,this.pageSize);return Math.max(1,Math.ceil(Math.max(0,this.totalItems)/e))}get safeCurrentPage(){return Math.min(Math.max(1,this.currentPage),this.resolvedTotalPages)}get pageSizeSelectOptions(){return(this.pageSizeOptions.includes(this.pageSize)?this.pageSizeOptions:[...this.pageSizeOptions,this.pageSize].sort((e,t)=>e-t)).map(e=>({value:String(e),label:String(e)}))}get pages(){let e=this.resolvedTotalPages,t=this.safeCurrentPage;if(e<=7)return Array.from({length:e},(e,t)=>t+1);let n=[];n.push(1),t>4&&n.push(`ellipsis`);let r=Math.max(2,t-1),i=Math.min(e-1,t+1);for(let e=r;e<=i;e++)n.push(e);t<e-3&&n.push(`ellipsis`),n.push(e);let a=new Set;return n.filter(e=>e===`ellipsis`||!a.has(e)&&(a.add(e),!0))}changePage(e){if(this.loading)return;let t=Math.min(Math.max(1,e),this.resolvedTotalPages);t!==this.safeCurrentPage&&this.dispatchEvent(new CustomEvent(`page-change`,{detail:t,bubbles:!0,composed:!0}))}handlePageSizeChange(e){e.stopPropagation();let t=Number(e.detail.value);if(!Number.isFinite(t)||t<1||t===this.pageSize)return;let n=(this.safeCurrentPage-1)*this.pageSize,r=Math.floor(n/t)+1;this.dispatchEvent(new CustomEvent(`page-size-change`,{detail:{pageSize:t,page:r},bubbles:!0,composed:!0}))}previousPage(){this.changePage(this.safeCurrentPage-1)}nextPage(){this.changePage(this.safeCurrentPage+1)}firstPage(){this.changePage(1)}lastPage(){this.changePage(this.totalPages)}renderArrow(e){return e===`previous`?C`
          <svg
            class="arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        `:C`
          <svg
            class="arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        `}get pageSizeTemplate(){return this.showPageSize?C`
      <div class="page-size">

        <span class="page-size-label" aria-hidden="true">Rows per page</span>

        <ui-select
          compact
          label="Rows per page"
          .options=${this.pageSizeSelectOptions}
          .value=${String(this.pageSize)}
          ?disabled=${this.loading}
          @select-change=${this.handlePageSizeChange}
        ></ui-select>
      </div>
    `:T}render(){let e=this.safeCurrentPage,t=this.resolvedTotalPages,n=this.totalItems===0?0:(e-1)*this.pageSize+1,r=this.totalItems===0?0:Math.min(e*this.pageSize,this.totalItems),i=e===1||this.loading,a=e===t||this.loading;return C`
      <nav
        class="pagination"
        aria-label="Employee table pagination"
        aria-busy=${this.loading?`true`:`false`}
      >
        <div class="summary">
          ${this.showItemCount?C`
                <div class="item-count">
                  ${this.totalItems===0?`No employees`:`Showing ${n}-${r} of ${this.totalItems}`}
                </div>
              `:T}
          ${this.pageSizeTemplate}
        </div>

        <div class="controls">
          ${this.showFirstLast?C`
                <button
                  type="button"
                  class="first-last"
                  @click=${this.firstPage}
                  ?disabled=${i}
                  aria-label="First page"
                >
                  «
                </button>
              `:``}

          <button
            type="button"
            @click=${this.previousPage}
            ?disabled=${i}
            aria-label="Previous page"
          >
            ${this.renderArrow(`previous`)}
          </button>

          <div class="desktop-pages">
            ${this.pages.map(t=>t===`ellipsis`?C` <span class="ellipsis" aria-hidden="true"> … </span> `:C`
                    <button
                      type="button"
                      class="page-button ${t===e?`active`:``}"
                      @click=${()=>this.changePage(t)}
                      ?disabled=${this.loading}
                      aria-current=${t===e?`page`:`false`}
                      aria-label="Page ${t}"
                    >
                      ${t}
                    </button>
                  `)}
          </div>

          <span
            class="mobile-page"
            aria-label="Current page ${e} of ${t}"
          >
            ${e} / ${t}
          </span>

          <button
            type="button"
            @click=${this.nextPage}
            ?disabled=${a}
            aria-label="Next page"
          >
            ${this.renderArrow(`next`)}
          </button>

          ${this.showFirstLast?C`
                <button
                  type="button"
                  class="first-last"
                  @click=${this.lastPage}
                  ?disabled=${a}
                  aria-label="Last page"
                >
                  »
                </button>
              `:``}
        </div>
      </nav>
    `}};L([j({type:Number})],K.prototype,`currentPage`,void 0),L([j({type:Number})],K.prototype,`totalPages`,void 0),L([j({type:Number})],K.prototype,`totalItems`,void 0),L([j({type:Number})],K.prototype,`pageSize`,void 0),L([j({attribute:!1})],K.prototype,`pageSizeOptions`,void 0),L([j({type:Boolean})],K.prototype,`showItemCount`,void 0),L([j({type:Boolean})],K.prototype,`showFirstLast`,void 0),L([j({type:Boolean})],K.prototype,`showPageSize`,void 0),L([j({type:Boolean})],K.prototype,`loading`,void 0),K=L([A(`pagination-control`)],K);var q=class extends k{constructor(...e){super(...e),this.variant=`spinner`,this.size=`medium`,this.tone=`primary`,this.label=`Loading`,this.hideLabel=!0,this.overlay=!1,this.fullscreen=!1,this.inline=!1,this.delay=0,this.progress=null,this.lines=3,this.active=!0,this.waiting=!1,this.hasCustomIcon=!1}static{this.styles=o`
    :host {
      display: block;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};

      --loading-size: 32px;
      --loading-thickness: 3px;
      --loading-color: var(--color-primary);
      --loading-track: color-mix(in srgb, var(--color-primary) 18%, transparent);
      --loading-gap: var(--spacing-md);
    }

    :host([hidden]) {
      display: none;
    }

    :host([inline]) {
      display: inline-flex;
      vertical-align: middle;
    }

    :host([size="small"]) {
      --loading-size: 18px;
      --loading-thickness: 2px;
      --loading-gap: var(--spacing-sm);
    }

    :host([size="large"]) {
      --loading-size: 48px;
      --loading-thickness: 4px;
      --loading-gap: var(--spacing-lg);
    }

    :host([tone="neutral"]) {
      --loading-color: var(--color-text-tertiary);
      --loading-track: var(--color-border);
    }

    :host([tone="inverse"]) {
      --loading-color: var(--color-text-inverse);
      --loading-track: rgba(255, 255, 255, 0.25);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .root {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: var(--loading-gap);
      width: 100%;
      min-width: 0;
    }

    :host([inline]) .root {
      flex-direction: row;
      width: auto;
    }

    :host([overlay]) .root,
    :host([fullscreen]) .root {
      position: absolute;
      inset: 0;
      z-index: var(--z-modal);
      background: color-mix(
        in srgb,
        var(--color-background) 72%,
        transparent
      );
      backdrop-filter: blur(2px);
    }

    :host([fullscreen]) .root {
      position: fixed;
    }

    .spinner {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      border: var(--loading-thickness) solid var(--loading-track);
      border-top-color: var(--loading-color);
      border-radius: var(--radius-full);
      animation: spin 0.75s linear infinite;
    }

    .ring {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      color: var(--loading-color);
      animation: spin 1.4s linear infinite;
    }

    .ring circle {
      fill: none;
      stroke: currentColor;
      stroke-width: var(--loading-thickness);
      stroke-linecap: round;
      stroke-dasharray: 62;
      stroke-dashoffset: 46;
    }

    .dots {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--loading-size) / 5);
    }

    .dot {
      width: calc(var(--loading-size) / 4);
      height: calc(var(--loading-size) / 4);
      background: var(--loading-color);
      border-radius: var(--radius-full);
      animation: bounce 1.1s ease-in-out infinite;
    }

    .dot:nth-child(2) {
      animation-delay: 0.14s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.28s;
    }

    .bar {
      position: relative;
      width: 100%;
      max-width: 320px;
      height: var(--loading-thickness);
      overflow: hidden;
      background: var(--loading-track);
      border-radius: var(--radius-full);
    }

    .bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: 40%;
      background: var(--loading-color);
      border-radius: inherit;
      animation: slide 1.2s ease-in-out infinite;
    }

    .bar-fill.determinate {
      position: relative;
      animation: none;
      transition: width var(--transition-slow) ease;
    }

    .skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      width: 100%;
    }

    .skeleton-line {
      height: calc(var(--loading-size) / 2.6);
      background: linear-gradient(
        90deg,
        var(--color-background-secondary) 25%,
        var(--color-border) 37%,
        var(--color-background-secondary) 63%
      );
      background-size: 400% 100%;
      border-radius: var(--radius-sm);
      animation: shimmer 1.4s ease infinite;
    }

    .skeleton-line:last-child {
      width: 60%;
    }

    .pulse {
      width: var(--loading-size);
      height: var(--loading-size);
      flex-shrink: 0;
      background: var(--loading-color);
      border-radius: var(--radius-full);
      animation: pulse 1.2s ease-in-out infinite;
    }

    .label {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      text-align: center;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }

    ::slotted([slot="icon"]) {
      width: var(--loading-size);
      height: var(--loading-size);
      color: var(--loading-color);
      animation: spin 1.2s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce {
      0%,
      80%,
      100% {
        transform: translateY(0);
        opacity: 0.55;
      }
      40% {
        transform: translateY(calc(var(--loading-size) / -4));
        opacity: 1;
      }
    }

    @keyframes slide {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(350%);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0 50%;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        transform: scale(0.75);
        opacity: 0.6;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner,
      .ring,
      .dot,
      .bar-fill,
      .skeleton-line,
      .pulse,
      ::slotted([slot="icon"]) {
        animation: none;
      }

      .bar-fill {
        width: 100%;
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.startDelay()}disconnectedCallback(){super.disconnectedCallback(),this.clearDelay()}willUpdate(e){(e.has(`delay`)||e.has(`active`))&&this.startDelay()}clearDelay(){this.delayTimer!==void 0&&(clearTimeout(this.delayTimer),this.delayTimer=void 0)}startDelay(){if(this.clearDelay(),!this.active||this.delay<=0){this.waiting=!1;return}this.waiting=!0,this.delayTimer=setTimeout(()=>{this.waiting=!1,this.delayTimer=void 0},this.delay)}get visible(){return this.active&&!this.waiting}get clampedProgress(){return this.progress===null||!Number.isFinite(this.progress)?null:Math.min(100,Math.max(0,this.progress))}handleIconSlotChange(e){let t=e.target;this.hasCustomIcon=t.assignedNodes({flatten:!0}).length>0,this.requestUpdate()}get indicatorTemplate(){if(this.hasCustomIcon)return T;if(this.variant===`dots`)return C`
        <div class="dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      `;if(this.variant===`bar`){let e=this.clampedProgress;return C`
        <div class="bar">
          <div
            class="bar-fill ${e===null?``:`determinate`}"
            style=${e===null?T:`width: ${e}%`}
          ></div>
        </div>
      `}return this.variant===`skeleton`?C`
        <div class="skeleton">
          ${Array.from({length:Math.max(1,this.lines)},()=>C`<div class="skeleton-line"></div>`)}
        </div>
      `:this.variant===`pulse`?C`<div class="pulse"></div>`:C`
      <svg class="ring" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
      </svg>
    `}render(){if(!this.visible)return T;let e=this.clampedProgress;return C`
      <div
        class="root"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label=${this.hideLabel?this.label:T}
        aria-valuenow=${e===null?T:e}
        aria-valuemin=${e===null?T:0}
        aria-valuemax=${e===null?T:100}
      >
        <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>

        ${this.indicatorTemplate}
        ${this.hideLabel?C`<span class="visually-hidden">${this.label}</span>`:C`<span class="label">${this.label}</span>`}
      </div>
    `}};L([j({type:String,reflect:!0})],q.prototype,`variant`,void 0),L([j({type:String,reflect:!0})],q.prototype,`size`,void 0),L([j({type:String,reflect:!0})],q.prototype,`tone`,void 0),L([j({type:String})],q.prototype,`label`,void 0),L([j({type:Boolean,attribute:`hide-label`})],q.prototype,`hideLabel`,void 0),L([j({type:Boolean,reflect:!0})],q.prototype,`overlay`,void 0),L([j({type:Boolean,reflect:!0})],q.prototype,`fullscreen`,void 0),L([j({type:Boolean,reflect:!0})],q.prototype,`inline`,void 0),L([j({type:Number})],q.prototype,`delay`,void 0),L([j({type:Number})],q.prototype,`progress`,void 0),L([j({type:Number})],q.prototype,`lines`,void 0),L([j({type:Boolean})],q.prototype,`active`,void 0),L([M()],q.prototype,`waiting`,void 0),q=L([A(`app-loading`)],q);var J=class extends k{constructor(...e){super(...e),this.heading=``,this.subheading=``,this.badge=``,this.variant=`elevated`,this.padding=`medium`,this.orientation=`vertical`,this.tone=`default`,this.clickable=!1,this.href=``,this.target=``,this.selected=!1,this.disabled=!1,this.loading=!1,this.loadingLabel=`Loading`,this.dividers=!1,this.fullHeight=!1,this.hasIcon=!1,this.hasMedia=!1,this.hasFooter=!1}static{this.styles=o`
    :host {
      display: block;
      min-width: 0;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};

      --card-padding: var(--spacing-xl);
      --card-radius: var(--radius-lg);
      --card-surface: var(--color-background);
      --card-border: var(--color-border);
      --card-shadow: var(--shadow-md);
      --card-accent: var(--color-primary);
      --card-icon-size: 40px;
      --card-icon-radius: var(--radius-md);
      --card-icon-background: color-mix(
        in srgb,
        var(--card-accent) 12%,
        transparent
      );
    }

    :host([hidden]) {
      display: none;
    }

    :host([full-height]) {
      height: 100%;
    }

    :host([padding="none"]) {
      --card-padding: 0px;
    }

    :host([padding="small"]) {
      --card-padding: var(--spacing-md);
    }

    :host([padding="large"]) {
      --card-padding: var(--spacing-3xl);
    }

    :host([tone="primary"]) {
      --card-accent: var(--color-primary);
    }

    :host([tone="success"]) {
      --card-accent: var(--color-success);
    }

    :host([tone="danger"]) {
      --card-accent: var(--color-danger);
    }

    :host([tone="warning"]) {
      --card-accent: var(--color-warning);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      width: 100%;
      height: 100%;
      min-width: 0;
      padding: var(--card-padding);
      color: var(--color-text-primary);
      background: var(--card-surface);
      border: 1px solid var(--card-border);
      border-radius: var(--card-radius);
      box-shadow: var(--card-shadow);
      text-align: left;
      text-decoration: none;
      overflow: hidden;
      transition:
        border-color var(--transition-base) ease,
        box-shadow var(--transition-base) ease,
        transform var(--transition-fast) ease,
        background-color var(--transition-base) ease;
    }

    .card.outlined {
      box-shadow: none;
    }

    .card.filled {
      background: var(--color-background-secondary);
      box-shadow: none;
    }

    .card.ghost {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }

    .card.horizontal {
      flex-direction: row;
      align-items: flex-start;
      gap: var(--spacing-xl);
    }

    .card.dividers .body {
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--card-border);
    }

    .card.dividers .footer {
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--card-border);
    }

    .card.interactive {
      cursor: pointer;
      appearance: none;
      font: inherit;
    }

    .card.interactive:hover:not(.disabled) {
      border-color: var(--card-accent);
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .card.interactive:active:not(.disabled) {
      transform: translateY(0);
    }

    .card.interactive:focus-visible {
      outline: 3px solid
        color-mix(in srgb, var(--card-accent) 35%, transparent);
      outline-offset: 2px;
    }

    .card.selected {
      border-color: var(--card-accent);
      box-shadow: 0 0 0 1px var(--card-accent);
    }

    .card.disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .card.loading {
      pointer-events: none;
    }

    :host([tone]:not([tone="default"])) .card::before {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 3px;
      background: var(--card-accent);
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: var(--card-icon-size);
      height: var(--card-icon-size);
      color: var(--card-accent);
      background: var(--card-icon-background);
      border-radius: var(--card-icon-radius);
    }

    .heading-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      min-width: 0;
      flex: 1 1 auto;
    }

    .heading {
      margin: 0;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-tight);
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    .subheading {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      overflow-wrap: anywhere;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      padding: var(--spacing-xs) var(--spacing-md);
      color: var(--card-accent);
      background: color-mix(in srgb, var(--card-accent) 14%, transparent);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      line-height: 1.6;
      font-weight: 700;
      white-space: nowrap;
    }

    .media {
      display: block;
      margin: calc(var(--card-padding) * -1) calc(var(--card-padding) * -1) 0;
    }

    .card.horizontal .media {
      margin: calc(var(--card-padding) * -1) 0 calc(var(--card-padding) * -1)
        calc(var(--card-padding) * -1);
      flex-shrink: 0;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      min-width: 0;
      flex: 1 1 auto;
    }

    .body {
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      min-width: 0;
    }

    .footer {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-md);
      min-width: 0;
    }

    .loading-layer {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--card-surface) 70%, transparent);
      backdrop-filter: blur(1px);
      z-index: var(--z-dropdown);
    }

    ::slotted([slot="media"]) {
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }

    ::slotted([slot="icon"]) {
      width: 20px;
      height: 20px;
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }

      .card.interactive:hover:not(.disabled) {
        transform: none;
      }
    }
  `}slotWatcher(e){return t=>{let n=t.target.assignedNodes({flatten:!0}).some(e=>e.nodeType!==Node.TEXT_NODE||!!e.textContent?.trim());this[e]!==n&&(this[e]=n,this.requestUpdate())}}get interactive(){return(this.clickable||!!this.href)&&!this.disabled}handleActivate(e){if(this.disabled||this.loading){e.preventDefault(),e.stopPropagation();return}!this.clickable&&!this.href||this.dispatchEvent(new CustomEvent(`card-click`,{detail:{originalEvent:e},bubbles:!0,composed:!0}))}handleKeydown(e){(e.key===`Enter`||e.key===` `)&&(this.href||(e.preventDefault(),this.handleActivate(e)))}get cardClasses(){return[`card`,this.variant,this.orientation,this.interactive?`interactive`:``,this.selected?`selected`:``,this.disabled?`disabled`:``,this.loading?`loading`:``,this.dividers?`dividers`:``].filter(Boolean).join(` `)}get headerTemplate(){return C`
      <div class="header" ?hidden=${!(this.hasIcon||this.heading||this.subheading||this.badge)}>
        <span class="icon-wrap" ?hidden=${!this.hasIcon}>
          <slot name="icon" @slotchange=${this.slotWatcher(`hasIcon`)}></slot>
        </span>

        <div class="heading-group">
          ${this.heading?C`<h3 class="heading">${this.heading}</h3>`:T}
          ${this.subheading?C`<p class="subheading">${this.subheading}</p>`:T}
          <slot name="heading"></slot>
        </div>

        ${this.badge?C`<span class="badge">${this.badge}</span>`:T}
      </div>
    `}get innerTemplate(){return C`
      <div class="media" ?hidden=${!this.hasMedia}>
        <slot name="media" @slotchange=${this.slotWatcher(`hasMedia`)}></slot>
      </div>

      <div class="content">
        ${this.headerTemplate}

        <div class="body">
          <slot></slot>
        </div>

        <div class="footer" ?hidden=${!this.hasFooter}>
          <slot name="footer" @slotchange=${this.slotWatcher(`hasFooter`)}></slot>
        </div>
      </div>

      ${this.loading?C`
            <div class="loading-layer">
              <app-loading
                size="small"
                .label=${this.loadingLabel}
              ></app-loading>
            </div>
          `:T}
    `}render(){return this.href&&!this.disabled?C`
        <a
          class=${this.cardClasses}
          href=${this.href}
          target=${this.target||T}
          rel=${this.target===`_blank`?`noopener noreferrer`:T}
          aria-busy=${this.loading?`true`:T}
          @click=${this.handleActivate}
        >
          ${this.innerTemplate}
        </a>
      `:this.clickable?C`
        <div
          class=${this.cardClasses}
          role="button"
          tabindex=${this.disabled?-1:0}
          aria-disabled=${this.disabled?`true`:`false`}
          aria-pressed=${this.selected?`true`:T}
          aria-busy=${this.loading?`true`:T}
          @click=${this.handleActivate}
          @keydown=${this.handleKeydown}
        >
          ${this.innerTemplate}
        </div>
      `:C`
      <div
        class=${this.cardClasses}
        aria-busy=${this.loading?`true`:T}
      >
        ${this.innerTemplate}
      </div>
    `}};L([j()],J.prototype,`heading`,void 0),L([j()],J.prototype,`subheading`,void 0),L([j()],J.prototype,`badge`,void 0),L([j({type:String,reflect:!0})],J.prototype,`variant`,void 0),L([j({type:String,reflect:!0})],J.prototype,`padding`,void 0),L([j({type:String,reflect:!0})],J.prototype,`orientation`,void 0),L([j({type:String,reflect:!0})],J.prototype,`tone`,void 0),L([j({type:Boolean})],J.prototype,`clickable`,void 0),L([j()],J.prototype,`href`,void 0),L([j()],J.prototype,`target`,void 0),L([j({type:Boolean})],J.prototype,`selected`,void 0),L([j({type:Boolean})],J.prototype,`disabled`,void 0),L([j({type:Boolean})],J.prototype,`loading`,void 0),L([j({type:String,attribute:`loading-label`})],J.prototype,`loadingLabel`,void 0),L([j({type:Boolean})],J.prototype,`dividers`,void 0),L([j({type:Boolean,attribute:`full-height`,reflect:!0})],J.prototype,`fullHeight`,void 0),J=L([A(`ui-card`)],J);var at=[`#2563eb`,`#7c3aed`,`#db2777`,`#059669`,`#d97706`,`#0891b2`],ot=e=>at.map((t,n)=>`${e}.avatar-${n} { background: ${t}; }`).join(`
`),st=e=>{let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t),t|=0;return Math.abs(t)%at.length},ct=e=>{let t=e.trim().split(/\s+/).filter(Boolean);return t.length===0?`?`:`${t[0]?.[0]??``}${t.length>1?t[t.length-1]?.[0]??``:``}`.toUpperCase()},Y=class extends k{constructor(...e){super(...e),this.employees=[],this.loading=!1,this.loadingLabel=`Loading employees`,this.employeeToDelete=null,this.currentPage=1,this.searchQuery=``,this.pageSize=10}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      color: var(--color-text-primary);
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .details-container {
      width: 100%;
      min-width: 0;
      padding: var(--spacing-2xl);
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .details-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .details-header h2 {
      margin: 0;
      color: var(--color-text-primary);
      font-size: clamp(var(--font-size-xl), 5vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
      flex: 1 1 auto;
      min-width: 0;
    }

    .search-bar {
      position: relative;
      flex: 0 1 280px;
      min-width: 200px;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: var(--spacing-md);
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--color-text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm)
        calc(var(--spacing-md) * 2 + 16px);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background);
      color: var(--color-text-primary);
      font-family: inherit;
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      outline: none;
      transition:
        border-color var(--transition-base),
        box-shadow var(--transition-base);
    }

    .search-input::placeholder {
      color: var(--color-text-tertiary);
    }

    .search-input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .table-view {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .list-view {
      display: none;
      width: 100%;
      min-width: 0;
    }

    @media (max-width: 768px) {
      .table-view {
        display: none;
      }

      .list-view {
        display: block;
      }
    }

    .employee-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .card-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      text-transform: uppercase;
    }

    ${a(ot(`.card-avatar`))}

    .employee-card {
      --card-icon-size: 36px;
      --card-icon-radius: var(--radius-full);
      --card-icon-background: transparent;
    }

    .employee-card-row {
      display: grid;
      grid-template-columns: 90px minmax(0, 1fr);
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
    }

    .card-label {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-relaxed);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .card-value {
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .card-value.email {
      color: var(--color-primary);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      width: 100%;
      min-height: 200px;
      padding: var(--spacing-xl);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      min-height: 200px;
      padding: var(--spacing-2xl) var(--spacing-lg);
      color: var(--color-text-secondary);
      text-align: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-background-secondary);
    }

    .empty-title {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: var(--font-size-md);
      font-weight: 600;
    }

    .empty-description {
      margin: 0;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    .pagination-wrapper {
      width: 100%;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .search-input {
        transition: none;
      }
    }
  `}get filteredEmployees(){let e=this.searchQuery.trim().toLowerCase();return e?this.employees.filter(t=>[t.name,t.department,t.designation,t.email].join(` `).toLowerCase().includes(e)):this.employees}get totalPages(){return Math.max(1,Math.ceil(this.filteredEmployees.length/this.pageSize))}get paginatedEmployees(){let e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;return this.filteredEmployees.slice(e,t)}handleSearchInput(e){let t=e.target.value;this.searchQuery=t,this.currentPage=1}handlePageChange(e){e.stopPropagation(),this.currentPage=Math.min(Math.max(1,e.detail),this.totalPages)}handlePageSizeChange(e){e.stopPropagation(),this.pageSize=e.detail.pageSize,this.currentPage=Math.min(Math.max(1,e.detail.page),this.totalPages)}requestEdit(e){this.dispatchEvent(new CustomEvent(`employee-edit`,{detail:e}))}requestDelete(e){this.employeeToDelete=e}handleEdit(e){e.stopPropagation(),this.requestEdit(e.detail)}handleDelete(e){e.stopPropagation(),this.requestDelete(e.detail)}handleAddEmployeeBubbled(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent(`add-employee`))}handleCancelDelete(e){e.stopPropagation(),this.employeeToDelete=null}handleConfirmDelete(e){if(e.stopPropagation(),!this.employeeToDelete)return;let t=this.employeeToDelete;this.dispatchEvent(new CustomEvent(`employee-delete`,{detail:t})),this.employeeToDelete=null}get searchBarTemplate(){return C`
      <div class="search-bar">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          type="search"
          class="search-input"
          placeholder="Search employees..."
          .value=${this.searchQuery}
          @input=${this.handleSearchInput}
          aria-label="Search employees"
        />
      </div>
    `}get emptyStateTemplate(){return C`
      <div class="empty-state">
        <p class="empty-title">No employees found</p>
        <p class="empty-description">
          ${this.searchQuery?`Try a different search term.`:`Add an employee to see them listed here.`}
        </p>

        ${this.searchQuery?``:C`
              <ui-button
                variant="primary"
                size="medium"
                shape="rounded"
                type="button"
                @button-click=${this.handleAddEmployeeBubbled}
              >
                + Add Employee
              </ui-button>
            `}
      </div>
    `}renderEmployeeCard(e){let t=ct(e.name),n=st(e.name||e.id);return C`
      <li>
        <ui-card
          class="employee-card"
          variant="outlined"
          padding="small"
          dividers
          full-height
          .heading=${e.name||`—`}
          .badge=${e.department||``}
        >
          <span
            slot="icon"
            class="card-avatar avatar-${n}"
            aria-hidden="true"
            >${t}</span
          >

          <div class="employee-card-row">
            <span class="card-label">Designation</span>
            <span class="card-value">${e.designation||`—`}</span>
          </div>

          <div class="employee-card-row">
            <span class="card-label">Email</span>
            <span class="card-value email">${e.email||`—`}</span>
          </div>

          <ui-button
            slot="footer"
            variant="primary"
            size="small"
            shape="rounded"
            .iconOnly=${!0}
            type="button"
            aria-label="Edit employee"
            @button-click=${()=>this.requestEdit(e)}
          >
            <svg
              slot="icon-only"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </ui-button>

          <ui-button
            slot="footer"
            variant="danger"
            size="small"
            shape="rounded"
            .iconOnly=${!0}
            type="button"
            aria-label="Delete employee"
            @button-click=${()=>this.requestDelete(e)}
          >
            <svg
              slot="icon-only"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>
          </ui-button>
        </ui-card>
      </li>
    `}get listViewTemplate(){return this.filteredEmployees.length===0?this.emptyStateTemplate:C`
      <ul class="employee-list">
        ${this.paginatedEmployees.map(e=>this.renderEmployeeCard(e))}
      </ul>
    `}get loadingStateTemplate(){return C`
      <div class="loading-state">
        <app-loading
          variant="skeleton"
          .lines=${Math.min(6,Math.max(3,this.pageSize))}
          .label=${this.loadingLabel}
        ></app-loading>
      </div>
    `}get template(){return C`
      <div class="details-container">
        <div class="details-header">
          <h2>Employee Table</h2>
          ${this.searchBarTemplate}
        </div>

        <div class="table-view">
          ${this.loading?this.loadingStateTemplate:C`
                <employee-table
                  .employees=${this.paginatedEmployees}
                  .searchActive=${this.searchQuery.trim().length>0}
                  @edit=${this.handleEdit}
                  @delete=${this.handleDelete}
                  @add-employee=${this.handleAddEmployeeBubbled}
                ></employee-table>
              `}
        </div>

        <div class="list-view">
          ${this.loading?this.loadingStateTemplate:this.listViewTemplate}
        </div>

        <div class="pagination-wrapper">
          <pagination-control
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            .totalItems=${this.filteredEmployees.length}
            .pageSize=${this.pageSize}
            .loading=${this.loading}
            @page-change=${this.handlePageChange}
            @page-size-change=${this.handlePageSizeChange}
          ></pagination-control>
        </div>

        <confirm-dialog
          .open=${this.employeeToDelete!==null}
          title="Delete Employee"
          .message=${this.employeeToDelete?`Are you sure you want to delete ${this.employeeToDelete.name}? This action cannot be undone.`:`Are you sure you want to delete this employee? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          @cancel=${this.handleCancelDelete}
          @confirm=${this.handleConfirmDelete}
        ></confirm-dialog>
      </div>
    `}render(){return this.template}};L([j({type:Array})],Y.prototype,`employees`,void 0),L([j({type:Boolean})],Y.prototype,`loading`,void 0),L([j({type:String,attribute:`loading-label`})],Y.prototype,`loadingLabel`,void 0),L([M()],Y.prototype,`employeeToDelete`,void 0),L([M()],Y.prototype,`currentPage`,void 0),L([M()],Y.prototype,`searchQuery`,void 0),L([M()],Y.prototype,`pageSize`,void 0),Y=L([A(`employee-details`)],Y);var lt=0,X=class extends k{constructor(...e){super(...e),this.label=``,this.value=``,this.placeholder=`Select an option`,this.options=[],this.error=``,this.required=!1,this.disabled=!1,this.invalid=!1,this.compact=!1,this.tone=`default`,this.placement=`bottom`,this.maxVisible=6,this.open=!1,this.activeIndex=-1,this.selfError=``,this.uid=`ui-dropdown-${++lt}`,this.typeahead=``,this.handleDocumentPointerDown=e=>{this.open&&(e.composedPath().includes(this)||this.closeMenu())},this.handleReposition=()=>{this.positionMenu()}}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      font-family: ${a(F.fontFamily)};

      --dropdown-height: 44px;
      --dropdown-surface: var(--color-background);
      --dropdown-border: var(--color-border);
      --dropdown-text: var(--color-text-primary);
      --dropdown-muted: var(--color-text-tertiary);
      --dropdown-accent: var(--color-primary);
      --dropdown-menu-surface: var(--color-background);
      --dropdown-menu-text: var(--color-text-primary);
      --dropdown-hover: var(--color-background-secondary);
    }

    :host([hidden]) {
      display: none;
    }

    :host([compact]) {
      display: inline-block;
      width: auto;
      --dropdown-height: 32px;
    }

    :host([tone="inverse"]) {
      --dropdown-surface: rgba(255, 255, 255, 0.16);
      --dropdown-border: rgba(255, 255, 255, 0.45);
      --dropdown-text: #ffffff;
      --dropdown-muted: rgba(255, 255, 255, 0.75);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      width: 100%;
      min-width: 0;
    }

    :host([compact]) .field {
      gap: 0;
    }

    .label {
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      font-weight: 600;
    }

    .required-mark {
      margin-left: var(--spacing-xs);
      color: var(--color-danger);
    }

    .anchor {
      position: relative;
      width: 100%;
      min-width: 0;
    }

    .trigger {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      width: 100%;
      min-width: 0;
      height: var(--dropdown-height);
      padding: 0 var(--spacing-md);
      color: var(--dropdown-text);
      background: var(--dropdown-surface);
      border: 1px solid var(--dropdown-border);
      border-radius: var(--radius-md);
      outline: none;
      font-family: inherit;
      font-size: var(--font-size-md);
      text-align: left;
      cursor: pointer;
      transition:
        border-color var(--transition-base) ease,
        box-shadow var(--transition-base) ease;
    }

    :host([compact]) .trigger {
      font-size: var(--font-size-sm);
      padding: 0 var(--spacing-sm);
    }

    .trigger:hover:not(:disabled) {
      border-color: var(--dropdown-accent);
    }

    .trigger:focus-visible {
      border-color: var(--dropdown-accent);
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--dropdown-accent) 28%, transparent);
    }

    .trigger[aria-expanded="true"] {
      border-color: var(--dropdown-accent);
    }

    .trigger:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    :host([invalid]) .trigger,
    .trigger.invalid {
      border-color: var(--color-danger);
    }

    .trigger-text {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .trigger-text.placeholder {
      color: var(--dropdown-muted);
    }

    .chevron {
      flex-shrink: 0;
      width: 12px;
      height: 12px;
      color: var(--dropdown-muted);
      transition: transform var(--transition-fast) ease;
    }

    .trigger[aria-expanded="true"] .chevron {
      transform: rotate(180deg);
    }

    .menu {
      position: fixed;
      top: 0;
      left: 0;
      z-index: var(--z-modal);
      margin: 0;
      padding: var(--spacing-xs);
      list-style: none;
      width: max-content;
      max-width: min(90vw, 420px);
      max-height: calc(var(--dropdown-height) * var(--dropdown-max-visible, 6));
      overflow-y: auto;
      overscroll-behavior: contain;
      color: var(--dropdown-menu-text);
      background: var(--dropdown-menu-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
    }

    .option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      color: var(--color-text-primary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      cursor: pointer;
      white-space: nowrap;
    }

    .option[aria-selected="true"] {
      color: var(--dropdown-accent);
      font-weight: 600;
    }

    .option.active {
      background: var(--dropdown-hover);
    }

    .option[aria-disabled="true"] {
      color: var(--color-text-tertiary);
      cursor: not-allowed;
    }

    .option-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1 1 auto;
    }

    .option-description {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-xs);
      font-weight: 400;
    }

    .check {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
      color: var(--dropdown-accent);
    }

    .check.hidden {
      visibility: hidden;
    }

    .empty {
      padding: var(--spacing-sm) var(--spacing-md);
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    .error-message {
      min-height: 18px;
      color: var(--color-danger);
      font-size: var(--font-size-xs);
      line-height: var(--line-height-normal);
    }

    @media (prefers-reduced-motion: reduce) {
      .trigger,
      .chevron {
        transition: none;
      }
    }
  `}connectedCallback(){super.connectedCallback(),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown),this.watchViewport(!1),this.typeaheadTimer!==void 0&&clearTimeout(this.typeaheadTimer)}get selectedOption(){return this.options.find(e=>e.value===this.value)??null}get isOpen(){return this.open}get validationMessage(){return this.error||this.selfError}validate(){let e=this.label||`This field`;return this.selfError=this.required&&!this.value.trim()?`${e} is required.`:``,this.selfError}get selectableIndexes(){return this.options.map((e,t)=>e.disabled?-1:t).filter(e=>e>=0)}openMenu(){if(this.disabled||this.open)return;this.open=!0;let e=this.options.findIndex(e=>e.value===this.value&&!e.disabled);this.activeIndex=e>=0?e:this.selectableIndexes[0]??-1,this.dispatchEvent(new CustomEvent(`dropdown-open`,{bubbles:!0,composed:!0}))}closeMenu(){this.open&&(this.open=!1,this.activeIndex=-1,this.dispatchEvent(new CustomEvent(`dropdown-close`,{bubbles:!0,composed:!0})))}toggleMenu(){if(this.open){this.closeMenu();return}this.openMenu()}selectIndex(e){let t=this.options[e];!t||t.disabled||(this.closeMenu(),t.value!==this.value&&(this.value=t.value,this.validate(),this.dispatchEvent(new CustomEvent(`dropdown-change`,{detail:{value:t.value,option:t},bubbles:!0,composed:!0}))))}moveActive(e){let t=this.selectableIndexes;if(t.length===0)return;let n=t.indexOf(this.activeIndex),r=n===-1?0:n+e,i=Math.min(Math.max(r,0),t.length-1);this.activeIndex=t[i]}runTypeahead(e){this.typeahead+=e.toLowerCase(),this.typeaheadTimer!==void 0&&clearTimeout(this.typeaheadTimer),this.typeaheadTimer=setTimeout(()=>{this.typeahead=``},600);let t=this.options.findIndex(e=>!e.disabled&&e.label.toLowerCase().startsWith(this.typeahead));if(t!==-1){if(this.open){this.activeIndex=t;return}this.selectIndex(t)}}handleKeydown(e){if(this.disabled)return;let{key:t}=e;if(t===`Escape`){this.open&&(e.preventDefault(),this.closeMenu());return}if(t===`Tab`){this.closeMenu();return}if(t===`ArrowDown`||t===`ArrowUp`){if(e.preventDefault(),!this.open){this.openMenu();return}this.moveActive(t===`ArrowDown`?1:-1);return}if(t===`Home`||t===`End`){if(!this.open)return;e.preventDefault();let n=this.selectableIndexes;this.activeIndex=(t===`Home`?n[0]:n[n.length-1])??-1;return}if(t===`Enter`||t===` `){if(e.preventDefault(),!this.open){this.openMenu();return}this.selectIndex(this.activeIndex);return}t.length===1&&/\S/.test(t)&&this.runTypeahead(t)}watchViewport(e){let t=e?`addEventListener`:`removeEventListener`;window[t](`resize`,this.handleReposition),window[t](`scroll`,this.handleReposition,!0)}positionMenu(){let e=this.renderRoot.querySelector(`.trigger`),t=this.renderRoot.querySelector(`.menu`);if(!e||!t||!this.open)return;let n=e.getBoundingClientRect(),r=window.innerHeight||0,i=window.innerWidth||0;this.compact?t.style.minWidth=`${n.width}px`:t.style.width=`${n.width}px`,t.style.maxHeight=``;let a=t.offsetHeight,o=r-n.bottom-4,s=n.top-4,c=this.placement===`top`||a>o&&s>o,l=Math.max(0,c?s:o);t.style.maxHeight=`${l}px`;let u=Math.min(a,l);t.style.top=c?`${n.top-4-u}px`:`${n.bottom+4}px`;let d=t.offsetWidth||n.width,ee=n.left+d-i+4;t.style.left=`${Math.max(4,n.left-Math.max(0,ee))}px`}updated(e){e.has(`open`)&&this.watchViewport(this.open),this.open&&(this.positionMenu(),this.renderRoot.querySelector(`.option.active`)?.scrollIntoView?.({block:`nearest`}))}get triggerLabel(){let e=this.selectedOption;return e?e.label:this.placeholder}renderOption(e,t){let n=e.value===this.value;return C`
      <li
        id="${this.uid}-option-${t}"
        class="option ${t===this.activeIndex?`active`:``}"
        role="option"
        aria-selected=${n?`true`:`false`}
        aria-disabled=${e.disabled?`true`:T}
        @click=${()=>this.selectIndex(t)}
        @pointermove=${()=>{e.disabled||(this.activeIndex=t)}}
      >
        <svg
          class="check ${n?``:`hidden`}"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>

        <span class="option-body">
          <span>${e.label}</span>
          ${e.description?C`<span class="option-description">${e.description}</span>`:T}
        </span>
      </li>
    `}render(){let e=this.validationMessage,t=this.invalid||!!e,n=`${this.uid}-listbox`,r=this.selectedOption!==null;return C`
      <div class="field">
        ${this.compact?T:C`
              <span class="label" id="${this.uid}-label">
                ${this.label}
                ${this.required?C`<span class="required-mark">*</span>`:T}
              </span>
            `}

        <div class="anchor">
          <button
            type="button"
            class="trigger ${t?`invalid`:``}"
            ?disabled=${this.disabled}
            aria-haspopup="listbox"
            aria-expanded=${this.open?`true`:`false`}
            aria-controls=${n}
            aria-label=${this.compact&&this.label?this.label:T}
            aria-labelledby=${this.compact||!this.label?T:`${this.uid}-label`}
            aria-invalid=${t?`true`:`false`}
            aria-activedescendant=${this.open&&this.activeIndex>=0?`${this.uid}-option-${this.activeIndex}`:T}
            @click=${this.toggleMenu}
            @keydown=${this.handleKeydown}
          >
            <span class="trigger-text ${r?``:`placeholder`}">
              ${this.triggerLabel}
            </span>

            <svg
              class="chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <ul
            class="menu"
            id=${n}
            role="listbox"
            aria-label=${this.label||this.placeholder}
            style="--dropdown-max-visible: ${this.maxVisible}"
            ?hidden=${!this.open}
          >
            ${this.options.length===0?C`<li class="empty">No options</li>`:this.options.map((e,t)=>this.renderOption(e,t))}
          </ul>
        </div>

        ${this.compact?T:C`<div class="error-message" role="alert">${e}</div>`}
      </div>
    `}};L([j()],X.prototype,`label`,void 0),L([j()],X.prototype,`value`,void 0),L([j()],X.prototype,`placeholder`,void 0),L([j({attribute:!1})],X.prototype,`options`,void 0),L([j()],X.prototype,`error`,void 0),L([j({type:Boolean,reflect:!0})],X.prototype,`required`,void 0),L([j({type:Boolean,reflect:!0})],X.prototype,`disabled`,void 0),L([j({type:Boolean,reflect:!0})],X.prototype,`invalid`,void 0),L([j({type:Boolean,reflect:!0})],X.prototype,`compact`,void 0),L([j({type:String,reflect:!0})],X.prototype,`tone`,void 0),L([j({type:String,reflect:!0})],X.prototype,`placement`,void 0),L([j({type:Number,attribute:`max-visible`})],X.prototype,`maxVisible`,void 0),L([M()],X.prototype,`open`,void 0),L([M()],X.prototype,`activeIndex`,void 0),L([M()],X.prototype,`selfError`,void 0),X=L([A(`ui-dropdown`)],X);var ut=new Map;function dt(e,t=`state`){return{kind:`state`,requestedKind:t,async read(){return[...ut.get(e)??[]]},async write(t){ut.set(e,[...t])},async clear(){ut.delete(e)}}}function Z(e){try{let t=e===`local`?globalThis.localStorage:globalThis.sessionStorage;if(!t)return null;let n=`__probe__${Math.random()}`;return t.setItem(n,`1`),t.removeItem(n),t}catch{return null}}function ft(e){return Z(e)!==null}function pt(e,t){return{kind:e,requestedKind:e,async read(){let n=Z(e);if(!n)return[];try{let e=n.getItem(t);if(!e)return[];let r=JSON.parse(e);return Array.isArray(r)?r:[]}catch{return[]}},async write(n){let r=Z(e);if(r)try{r.setItem(t,JSON.stringify(n))}catch{return}},async clear(){Z(e)?.removeItem(t)}}}var mt=`employee-management`,Q=`collections`,ht=1;function gt(){try{return!!globalThis.indexedDB}catch{return!1}}function _t(){return new Promise((e,t)=>{let n=globalThis.indexedDB.open(mt,ht);n.onupgradeneeded=()=>{let e=n.result;e.objectStoreNames.contains(Q)||e.createObjectStore(Q)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error),n.onblocked=()=>t(Error(`IndexedDB upgrade blocked`))})}function vt(e,t){return _t().then(n=>new Promise((r,i)=>{let a=n.transaction(Q,e),o=t(a.objectStore(Q));o.onsuccess=()=>r(o.result),o.onerror=()=>i(o.error),a.oncomplete=()=>n.close(),a.onabort=()=>{n.close(),i(a.error)}}))}function yt(e){return{kind:`indexed`,requestedKind:`indexed`,async read(){try{let t=await vt(`readonly`,t=>t.get(e));return Array.isArray(t)?t:[]}catch{return[]}},async write(t){try{await vt(`readwrite`,n=>n.put(structuredClone(t),e))}catch{return}},async clear(){try{await vt(`readwrite`,t=>t.delete(e))}catch{return}}}}var bt=[`state`,`session`,`local`,`indexed`],xt={state:`In memory`,session:`Session storage`,local:`Local storage`,indexed:`IndexedDB`},St=bt.map(e=>({value:e,label:xt[e]}));function Ct(e){return bt.includes(e)}function wt(e){return e===`state`?!0:e===`indexed`?gt():ft(e)}function Tt(e,t){return wt(e)?e===`indexed`?yt(t):e===`session`||e===`local`?pt(e,t):dt(t,e):dt(t,e)}var Et=`employees`,$=class extends k{constructor(...e){super(...e),this.loading=!1,this.storage=`state`,this.employees=[],this.employeeBeingEdited=null,this.isFormOpen=!1,this.reading=!1,this.store=Tt(`state`,Et),this.loadToken=0}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      box-sizing: border-box;
      ${a(P())}
      ${a(I())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${a(F.fontFamily)};
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .page {
      width: 100%;
      min-height: 100vh;
      padding: clamp(var(--spacing-lg), 5vw, var(--spacing-3xl));
      display: flex;
      flex-direction: column;
    }

    .page-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }

    .hero-banner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-xl);
      flex-wrap: wrap;
      padding: clamp(var(--spacing-xl), 4vw, var(--spacing-2xl));
      border-radius: var(--radius-lg);
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        color-mix(in srgb, var(--color-primary) 75%, black) 100%
      );
      box-shadow: var(--shadow-md);
      color: white;
      overflow: hidden;
    }

    .hero-text {
      min-width: 0;
      flex: 1 1 auto;
    }

    .hero-title {
      margin: 0;
      color: white;
      font-size: clamp(var(--font-size-xl), 5vw, var(--font-size-3xl));
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .hero-description {
      margin: var(--spacing-sm) 0 0;
      color: rgba(255, 255, 255, 0.85);
      font-size: clamp(var(--font-size-sm), 3vw, var(--font-size-md));
      line-height: var(--line-height-relaxed);
    }

    .hero-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
      flex-shrink: 0;
    }

    .hero-actions ui-button {
      --color-primary: white;
      --color-text-on-primary: var(--color-primary);
    }

    .storage-picker {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .storage-label {
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      white-space: nowrap;
    }

    .storage-picker ui-dropdown {
      min-width: 160px;
    }

    .form-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--transition-base, 0.25s ease);
    }

    .form-panel.open {
      grid-template-rows: 1fr;
    }

    .form-panel-inner {
      overflow: hidden;
      min-height: 0;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      gap: var(--spacing-2xl);
    }

    employee-form,
    employee-details {
      display: block;
      width: 100%;
      min-width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .form-panel {
        transition: none;
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.adoptStorage(this.storage)}willUpdate(e){e.has(`storage`)&&e.get(`storage`)!==void 0&&this.adoptStorage(this.storage)}async adoptStorage(e){let t=++this.loadToken;this.store=Tt(e,Et),this.reading=!0,this.closeForm();try{let e=await this.store.read();t===this.loadToken&&(this.employees=e)}finally{this.reading=!1}this.store.kind!==this.store.requestedKind&&this.showToast(`${xt[e]} is unavailable here, using memory instead.`,`error`)}async persist(e){this.loadToken+=1,this.employees=e,await this.store.write(e)}handleStorageChange(e){e.stopPropagation();let t=e.detail.value;!Ct(t)||t===this.storage||(this.storage=t,this.dispatchEvent(new CustomEvent(`storage-change`,{detail:t,bubbles:!0,composed:!0})))}openForm(){this.isFormOpen=!0}closeForm(){this.isFormOpen=!1,this.employeeBeingEdited=null}handleAddEmployeeRequested(e){e.stopPropagation(),this.openForm()}handleToggleFormRequested(e){if(e.stopPropagation(),this.isFormOpen){this.closeForm();return}this.openForm()}handleFormClose(e){e.stopPropagation(),this.closeForm()}handleEmployeeAdded(e){e.stopPropagation();let t={id:crypto.randomUUID(),...e.detail};this.persist([...this.employees,t]),this.closeForm()}handleEmployeeEdit(e){e.stopPropagation(),this.employeeBeingEdited=e.detail,this.isFormOpen=!0}handleEmployeeUpdated(e){e.stopPropagation();let t=e.detail;this.persist(this.employees.map(e=>e.id===t.id?t:e)),this.closeForm()}handleEditCancelled(){this.closeForm()}handleEmployeeDelete(e){e.stopPropagation();let t=e.detail,n=this.employees.filter(e=>e.id!==t.id);n.length!==this.employees.length&&(this.persist(n),this.employeeBeingEdited?.id===t.id&&this.closeForm(),this.showToast(`Employee deleted successfully!`,`success`))}showToast(e,t){this.renderRoot.querySelector(`app-toast`)?.show?.(e,t)}get heroTemplate(){return C`
      <header class="hero-banner">
        <div class="hero-text">
          <h1 class="hero-title">Employee Management</h1>
          <p class="hero-description">Manage your organization employees.</p>
        </div>

        <div class="hero-actions">
          <div class="storage-picker">
            <span class="storage-label" aria-hidden="true">Store in</span>

            <ui-dropdown
              compact
              tone="inverse"
              label="Storage"
              .options=${St}
              .value=${this.storage}
              @dropdown-change=${this.handleStorageChange}
            ></ui-dropdown>
          </div>

          <ui-button
            variant="secondary"
            size="medium"
            shape="rounded"
            type="button"
            aria-expanded=${this.isFormOpen?`true`:`false`}
            @button-click=${this.handleToggleFormRequested}
          >
            ${this.isFormOpen?`Close Form`:`+ Add Employee`}
          </ui-button>
        </div>
      </header>
    `}get formPanelTemplate(){return C`
      <div class="form-panel ${this.isFormOpen?`open`:``}">
        <div class="form-panel-inner" ?inert=${!this.isFormOpen}>
          <employee-form
            .employeeToEdit=${this.employeeBeingEdited}
            @employee-added=${this.handleEmployeeAdded}
            @employee-updated=${this.handleEmployeeUpdated}
            @edit-cancelled=${this.handleEditCancelled}
            @form-close=${this.handleFormClose}
          ></employee-form>
        </div>
      </div>
    `}get template(){return C`
      <main class="page">
        <div class="page-container">
          ${this.heroTemplate}

          <section class="page-content">
            ${this.formPanelTemplate}

            <employee-details
              .employees=${this.employees}
              .loading=${this.loading||this.reading}
              @employee-delete=${this.handleEmployeeDelete}
              @employee-edit=${this.handleEmployeeEdit}
              @add-employee=${this.handleAddEmployeeRequested}
            ></employee-details>
          </section>
        </div>
      </main>

      <app-toast></app-toast>
    `}render(){return this.template}};L([j({type:Boolean})],$.prototype,`loading`,void 0),L([j({type:String})],$.prototype,`storage`,void 0),L([M()],$.prototype,`employees`,void 0),L([M()],$.prototype,`employeeBeingEdited`,void 0),L([M()],$.prototype,`isFormOpen`,void 0),L([M()],$.prototype,`reading`,void 0),$=L([A(`employee-widget`)],$);var Dt=class extends k{static{this.styles=o`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100svh;
      ${a(P())}
      ${a(I())}
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-family: ${a(F.fontFamily)};
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .nav {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      padding: var(--spacing-md)
        clamp(var(--spacing-lg), 5vw, var(--spacing-3xl));
      border-bottom: 1px solid var(--color-border);
      background: var(--color-background);
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      min-width: 0;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--color-primary);
      color: var(--color-text-inverse);
      font-size: var(--font-size-sm);
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .brand-name {
      overflow: hidden;
      color: var(--color-text-primary);
      font-size: var(--font-size-lg);
      font-weight: 700;
      line-height: var(--line-height-tight);
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tagline {
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-tight);
      white-space: nowrap;
    }

    main {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      min-height: 0;
      width: 100%;
    }

    employee-widget {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;
    }

    @media (max-width: ${a(F.breakpoints.sm)}px) {
      .tagline {
        display: none;
      }
    }
  `}get navTemplate(){return C`
      <header class="nav">
        <div class="nav-container">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">EM</span>
            <span class="brand-name">Employee Management</span>
          </div>

          <span class="tagline">Manage your organization employees.</span>
        </div>
      </header>
    `}get template(){return C`
      ${this.navTemplate}

      <main>
        <employee-widget></employee-widget>
      </main>
    `}render(){return this.template}};Dt=L([A(`app-shell`)],Dt);