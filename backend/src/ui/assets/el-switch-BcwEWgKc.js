import{b as Y,c7 as se,k as N,f as j,l as q,e as m,o as t,m as h,n as g,x as B,s as r,p as a,P as u,Q as f,Y as $,af as J,t as D,S as y,T as d,B as F,by as oe,_ as X,M as Z,U as O,c as w,i as A,a as _,C as U,c3 as L,O as V,aE as le,E as ce,F as re,g as ue,r as K,K as Q,G as de,aJ as ve,R as I,A as M,a9 as fe,L as pe,y as me,c8 as W,bh as he,bg as ye}from"./index-C8JXs5Hf.js";import{f as be}from"./el-tag-Db5OJvu_.js";const ge=Y({type:{type:String,values:["primary","success","info","warning","danger"],default:"primary"},closable:Boolean,disableTransitions:Boolean,hit:Boolean,color:String,size:{type:String,values:se},effect:{type:String,values:["dark","light","plain"],default:"light"},round:Boolean}),ke={close:n=>n instanceof MouseEvent,click:n=>n instanceof MouseEvent},Ie=N({name:"ElTag"}),Ce=N({...Ie,props:ge,emits:ke,setup(n,{emit:C}){const p=n,s=j(),l=q("tag"),S=m(()=>{const{type:o,hit:k,effect:b,closable:P,round:z}=p;return[l.b(),l.is("closable",P),l.m(o||"primary"),l.m(s.value),l.m(b),l.is("hit",k),l.is("round",z)]}),i=o=>{C("close",o)},T=o=>{C("click",o)};return(o,k)=>o.disableTransitions?(t(),h("span",{key:0,class:r(a(S)),style:F({backgroundColor:o.color}),onClick:T},[g("span",{class:r(a(l).e("content"))},[B(o.$slots,"default")],2),o.closable?(t(),u(a(y),{key:0,class:r(a(l).e("close")),onClick:D(i,["stop"])},{default:f(()=>[$(a(J))]),_:1},8,["class","onClick"])):d("v-if",!0)],6)):(t(),u(oe,{key:1,name:`${a(l).namespace.value}-zoom-in-center`,appear:""},{default:f(()=>[g("span",{class:r(a(S)),style:F({backgroundColor:o.color}),onClick:T},[g("span",{class:r(a(l).e("content"))},[B(o.$slots,"default")],2),o.closable?(t(),u(a(y),{key:0,class:r(a(l).e("close")),onClick:D(i,["stop"])},{default:f(()=>[$(a(J))]),_:1},8,["class","onClick"])):d("v-if",!0)],6)]),_:3},8,["name"]))}});var Se=X(Ce,[["__file","tag.vue"]]);const $e=Z(Se),Te=Y({modelValue:{type:[Boolean,String,Number],default:!1},disabled:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},size:{type:String,validator:be},width:{type:[String,Number],default:""},inlinePrompt:{type:Boolean,default:!1},inactiveActionIcon:{type:V},activeActionIcon:{type:V},activeIcon:{type:V},inactiveIcon:{type:V},activeText:{type:String,default:""},inactiveText:{type:String,default:""},activeValue:{type:[Boolean,String,Number],default:!0},inactiveValue:{type:[Boolean,String,Number],default:!1},name:{type:String,default:""},validateEvent:{type:Boolean,default:!0},beforeChange:{type:le(Function)},id:String,tabindex:{type:[String,Number]},label:{type:String,default:void 0}}),Ee={[O]:n=>w(n)||A(n)||_(n),[U]:n=>w(n)||A(n)||_(n),[L]:n=>w(n)||A(n)||_(n)},Ve=["onClick"],we=["id","aria-checked","aria-disabled","aria-label","name","true-value","false-value","disabled","tabindex","onKeydown"],Be=["aria-hidden"],Ne=["aria-hidden"],Pe=["aria-hidden"],x="ElSwitch",ze=N({name:x}),Ae=N({...ze,props:Te,emits:Ee,setup(n,{expose:C,emit:p}){const s=n,{formItem:l}=ce(),S=j(),i=q("switch"),{inputId:T}=re(s,{formItemContext:l}),o=ue(m(()=>s.loading)),k=K(s.modelValue!==!1),b=K(),P=K(),z=m(()=>[i.b(),i.m(S.value),i.is("disabled",o.value),i.is("checked",c.value)]),ee=m(()=>[i.e("label"),i.em("label","left"),i.is("active",!c.value)]),ae=m(()=>[i.e("label"),i.em("label","right"),i.is("active",c.value)]),te=m(()=>({width:ye(s.width)}));Q(()=>s.modelValue,()=>{k.value=!0});const G=m(()=>k.value?s.modelValue:!1),c=m(()=>G.value===s.activeValue);[s.activeValue,s.inactiveValue].includes(G.value)||(p(O,s.inactiveValue),p(U,s.inactiveValue),p(L,s.inactiveValue)),Q(c,e=>{var v;b.value.checked=e,s.validateEvent&&((v=l==null?void 0:l.validate)==null||v.call(l,"change").catch(ne=>pe()))});const E=()=>{const e=c.value?s.inactiveValue:s.activeValue;p(O,e),p(U,e),p(L,e),me(()=>{b.value.checked=c.value})},R=()=>{if(o.value)return;const{beforeChange:e}=s;if(!e){E();return}const v=e();[W(v),w(v)].includes(!0)||he(x,"beforeChange must return type `Promise<boolean>` or `boolean`"),W(v)?v.then(H=>{H&&E()}).catch(H=>{}):v&&E()},ie=()=>{var e,v;(v=(e=b.value)==null?void 0:e.focus)==null||v.call(e)};return de(()=>{b.value.checked=c.value}),C({focus:ie,checked:c}),(e,v)=>(t(),h("div",{class:r(a(z)),onClick:D(R,["prevent"])},[g("input",{id:a(T),ref_key:"input",ref:b,class:r(a(i).e("input")),type:"checkbox",role:"switch","aria-checked":a(c),"aria-disabled":a(o),"aria-label":e.label,name:e.name,"true-value":e.activeValue,"false-value":e.inactiveValue,disabled:a(o),tabindex:e.tabindex,onChange:E,onKeydown:ve(R,["enter"])},null,42,we),!e.inlinePrompt&&(e.inactiveIcon||e.inactiveText)?(t(),h("span",{key:0,class:r(a(ee))},[e.inactiveIcon?(t(),u(a(y),{key:0},{default:f(()=>[(t(),u(I(e.inactiveIcon)))]),_:1})):d("v-if",!0),!e.inactiveIcon&&e.inactiveText?(t(),h("span",{key:1,"aria-hidden":a(c)},M(e.inactiveText),9,Be)):d("v-if",!0)],2)):d("v-if",!0),g("span",{ref_key:"core",ref:P,class:r(a(i).e("core")),style:F(a(te))},[e.inlinePrompt?(t(),h("div",{key:0,class:r(a(i).e("inner"))},[e.activeIcon||e.inactiveIcon?(t(),u(a(y),{key:0,class:r(a(i).is("icon"))},{default:f(()=>[(t(),u(I(a(c)?e.activeIcon:e.inactiveIcon)))]),_:1},8,["class"])):e.activeText||e.inactiveText?(t(),h("span",{key:1,class:r(a(i).is("text")),"aria-hidden":!a(c)},M(a(c)?e.activeText:e.inactiveText),11,Ne)):d("v-if",!0)],2)):d("v-if",!0),g("div",{class:r(a(i).e("action"))},[e.loading?(t(),u(a(y),{key:0,class:r(a(i).is("loading"))},{default:f(()=>[$(a(fe))]),_:1},8,["class"])):a(c)?B(e.$slots,"active-action",{key:1},()=>[e.activeActionIcon?(t(),u(a(y),{key:0},{default:f(()=>[(t(),u(I(e.activeActionIcon)))]),_:1})):d("v-if",!0)]):a(c)?d("v-if",!0):B(e.$slots,"inactive-action",{key:2},()=>[e.inactiveActionIcon?(t(),u(a(y),{key:0},{default:f(()=>[(t(),u(I(e.inactiveActionIcon)))]),_:1})):d("v-if",!0)])],2)],6),!e.inlinePrompt&&(e.activeIcon||e.activeText)?(t(),h("span",{key:1,class:r(a(ae))},[e.activeIcon?(t(),u(a(y),{key:0},{default:f(()=>[(t(),u(I(e.activeIcon)))]),_:1})):d("v-if",!0),!e.activeIcon&&e.activeText?(t(),h("span",{key:1,"aria-hidden":!a(c)},M(e.activeText),9,Pe)):d("v-if",!0)],2)):d("v-if",!0)],10,Ve))}});var _e=X(Ae,[["__file","switch.vue"]]);const De=Z(_e);export{$e as E,De as a,ge as t};