"use strict";(self["webpackChunkproject"]=self["webpackChunkproject"]||[]).push([[262],{1262:function(e,t,s){s.r(t),s.d(t,{default:function(){return B}});var i=s(641),a=s(33),n=s(3751);const r={class:"container",id:"menu"},o={class:"container",id:"container-admin",style:{display:"none"}},l={style:{width:"100%",display:"flex","align-items":"center","justify-content":"space-around",height:"20%"}},m=["value"],d={id:"infoUser"},u={key:0},c={id:"container-history",class:"box"},p={key:0},h={key:1,style:{width:"100%"}},y={style:{display:"grid","grid-template-columns":"repeat(3, 33%)",gap:"1%",width:"100%"}},b={id:"container-dataUser"},k={id:"dataUser"},U={key:0,style:{"margin-bottom":"15px"},id:"acessoAdmin"},L={id:"nameUser"},v={id:"cursoUser"},g={id:"matriculaUser"},C={id:"tempoC11"},f={style:{height:"8vh"}},M={style:{display:"flex","justify-content":"space-between","align-items":"flex-start"}},E={id:"membresiaUser"},w={id:"alert",style:{display:"none"}};function A(e,t,s,A,S,T){return(0,i.uX)(),(0,i.CE)(i.FK,null,[(0,i.Lk)("section",r,[(0,i.Lk)("button",{type:"button",onClick:t[0]||(t[0]=e=>T.newCad())},"Cadastrar novo Membro"),(0,i.Lk)("button",{type:"button",onClick:t[1]||(t[1]=e=>T.openAdmin())},"buscar Usuário")]),(0,i.Lk)("section",o,[(0,i.Lk)("a",{onClick:t[2]||(t[2]=e=>T.openAdmin()),class:"setas",style:{"justify-content":"flex-start !important",cursor:"pointer","margin-left":"5px"}},"voltar"),(0,i.Lk)("div",l,[(0,i.bo)((0,i.Lk)("select",{"onUpdate:modelValue":t[3]||(t[3]=e=>S.select=e),name:"select",id:"select-admin"},[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(S.users,(e=>((0,i.uX)(),(0,i.CE)("option",{key:e,value:e.id},(0,a.v_)(e.nome),9,m)))),128))],512),[[n.u1,S.select]]),(0,i.Lk)("button",{type:"button",onClick:t[4]||(t[4]=e=>T.buscarUser()),class:"btn"},"buscar")]),(0,i.Lk)("div",d,[""!==S.nomeUser?((0,i.uX)(),(0,i.CE)("div",u,[(0,i.Lk)("p",null,"Nome: "+(0,a.v_)(S.nomeUser),1),(0,i.Lk)("p",null,"Matricula: "+(0,a.v_)(S.matriculaUser),1),(0,i.Lk)("p",null,"Tempo na C11: "+(0,a.v_)(S.tempoUser),1)])):(0,i.Q3)("",!0),S.itsAdmin?((0,i.uX)(),(0,i.CE)("button",{key:1,onClick:t[5]||(t[5]=(...e)=>T.atribuirAdmin&&T.atribuirAdmin(...e)),class:"btn"}," Atribuir Admin ")):(0,i.Q3)("",!0)]),(0,i.Lk)("div",c,[this.historicoUser?.error?((0,i.uX)(),(0,i.CE)("div",p,(0,a.v_)(this.historicoUser.error),1)):((0,i.uX)(),(0,i.CE)("div",h,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(S.historicoUser,(e=>((0,i.uX)(),(0,i.CE)("div",{class:"history-item",key:e},[(0,i.Lk)("div",y,[(0,i.Lk)("p",null," Data: "+(0,a.v_)(e.data),1),(0,i.Lk)("p",null," Tempo: "+(0,a.v_)(e.horas),1),(0,i.Lk)("p",null," Horário: "+(0,a.v_)(e.horario),1)]),t[13]||(t[13]=(0,i.Lk)("br",null,null,-1)),(0,i.eW)(" Descrição: "+(0,a.v_)(e.descricao),1)])))),128))]))])]),(0,i.Lk)("section",{id:"openMenu",onClick:t[6]||(t[6]=e=>T.abrirMenu())},"🔜"),(0,i.Lk)("section",b,[(0,i.Lk)("div",k,[S.isAdmin?((0,i.uX)(),(0,i.CE)("div",U,[t[14]||(t[14]=(0,i.Lk)("hr",null,null,-1)),(0,i.Lk)("p",{style:{"text-align":"end",cursor:"pointer"},onClick:t[7]||(t[7]=e=>T.goToAdmin())},"Acesso Admin"),t[15]||(t[15]=(0,i.Lk)("hr",null,null,-1))])):(0,i.Q3)("",!0),((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(S.dataUser,(e=>((0,i.uX)(),(0,i.CE)("div",{key:e},[(0,i.Lk)("p",null,[t[16]||(t[16]=(0,i.eW)("Nome: ")),(0,i.Lk)("span",L,(0,a.v_)(e.nome),1)]),t[22]||(t[22]=(0,i.Lk)("hr",null,null,-1)),(0,i.Lk)("p",null,[t[17]||(t[17]=(0,i.eW)("Curso: ")),(0,i.Lk)("span",v,(0,a.v_)(e.curso),1)]),t[23]||(t[23]=(0,i.Lk)("hr",null,null,-1)),(0,i.Lk)("p",null,[t[18]||(t[18]=(0,i.eW)("Matrícula: ")),(0,i.Lk)("span",g,(0,a.v_)(e.matricula),1)]),t[24]||(t[24]=(0,i.Lk)("hr",null,null,-1)),(0,i.Lk)("p",null,[t[19]||(t[19]=(0,i.eW)("Seu tempo na C11: ")),(0,i.Lk)("span",C,(0,a.v_)(S.auxTempoC11),1)]),t[25]||(t[25]=(0,i.Lk)("hr",null,null,-1)),(0,i.Lk)("div",f,[(0,i.Lk)("div",M,[(0,i.Lk)("p",null,[t[20]||(t[20]=(0,i.eW)("Nº Membresia: ")),(0,i.Lk)("span",E,(0,a.v_)(e.membresia.split("/")[0]),1)]),(0,i.Lk)("button",{onClick:t[8]||(t[8]=e=>T.openFormMembreship()),id:"upMembreship"},"🖋️")]),S.isEditMembresia?((0,i.uX)(),(0,i.CE)("form",{key:0,method:"get",onSubmit:t[11]||(t[11]=(0,n.D$)((e=>T.upMembreship()),["prevent"])),id:"formMembreship"},[(0,i.bo)((0,i.Lk)("input",{"onUpdate:modelValue":t[9]||(t[9]=e=>S.membresia=e),type:"text",name:"mebresia",maxlength:"8"},null,512),[[n.Jo,S.membresia]]),t[21]||(t[21]=(0,i.Lk)("button",{type:"submit"},"ok",-1)),(0,i.Lk)("button",{onClick:t[10]||(t[10]=e=>T.closeFormMembreship()),type:"button"},"cancelar")],32)):(0,i.Q3)("",!0)])])))),128))])]),(0,i.Lk)("section",w,[(0,i.Lk)("p",{class:"messageAlert",onKey:t[12]||(t[12]=(...e)=>S.message&&S.message(...e))},(0,a.v_)(S.message),33)])],64)}s(4114);var S=s(2741),T=s(7713),I=s(9031),x={name:"DashboardAdmin",data(){return{isOpen:!1,dataUser:[],widthScreen:0,usuarioID:"",historicoUser:[],dataUserSearch:[],tempoUser:"00:00:00",nomeUser:"",matriculaUser:"",itsAdmin:!1,idUserSearch:"",message:"",isAdmin:!1,select:"",users:[],membresia:"",isEditMembresia:!1,auxTempoC11:0}},mounted(){this.loading()},methods:{async loading(){const e=JSON.parse(localStorage.getItem("dataUser"));this.usuarioID=e.uid,this.membresia=e.membresia??"",this.dataUser=await(0,I.Cl)(this.usuarioID),this.isAdmin="admin"===this.dataUser[0].role},abrirMenu(){this.isOpen=(0,T.W)(this.isOpen)},openFormMembreship(){confirm("Você possui membresia?")&&(this.isEditMembresia=!0,this.membresia=this.dataUser[0].membresia.split("/")[0])},closeFormMembreship(){this.byTag("id","formMembreship").style.display="none"},async upMembreship(){const e={id:this.usuarioID,membresia:this.membresia+"/ON"},t=await(0,I.LO)();t.status?(this.dataUser[0].membresia=e.membresia,this.membresia=e.membresia.split("/")[0],this.isEditMembresia=!1,this.alertCustomized("Membresia atualizada com sucesso!","30vw")):this.alertCustomized("Não foi possível atualizar a membresia","35vw")},goToAdmin(){this.$router.back()},async addSelect(){this.users=await(0,I.CF)(),console.log(this.users)},async openAdmin(){"flex"==this.byTag("id","container-admin").style.display?(this.byTag("id","menu").style.display="flex",this.byTag("id","container-admin").style.display="none"):(this.byTag("id","menu").style.display="none",this.byTag("id","container-admin").style.display="flex",await this.addSelect())},byTag(e,t){return"id"==e?document.getElementById(t):"name"==e?document.getElementsByName(t)[0]:void 0},newCad(){this.$router.push("/cadastro")},async buscarUser(){"--"!==this.select&&(this.dataUserSearch=await(0,I.Cl)(this.select),this.tempoUser=await(0,I.m0)(this.dataUserSearch[0].id),0!==this.tempoUser&&(this.historicoUser=await(0,I.CK)(this.dataUserSearch[0].matricula)),this.preencheTabela())},preencheTabela(){this.nomeUser=this.dataUserSearch[0].nome,this.matriculaUser=this.dataUserSearch[0].matricula,this.tempoUser=this.tempoUser?this.formatarTempo(this.tempoUser):"00:00:00",this.itsAdmin="admin"!==this.dataUserSearch[0].role,this.idUserSearch=this.dataUserSearch[0].id},atribuirAdmin(){S.A.post("/admin_role",{id:this.idUserSearch,role:"admin"}).then((()=>{this.alertCustomized("Atribuido com sucesso!! ","30vw")})).catch((()=>{this.alertCustomized("Não foi possível atribuir","30vw")}))},dateVisual(e){const t=e.split("T")[0],s=t.split("-")[2],i=t.split("-")[1],a=t.split("-")[0];return s+"/"+i+"/"+a},formatarTempo(e){let t=Math.floor(e/3600),s=Math.floor(e%3600/60),i=e%60;return String(t).padStart(2,"0")+":"+String(s).padStart(2,"0")+":"+String(i).padStart(2,"0")},alertCustomized(e,t){const s=document.getElementById("alert");s.innerHTML="",s.style.display="flex",s.style.width=t;const i=document.createElement("p");i.classList.add("messageAlert"),i.innerHTML=e,s.appendChild(i),setInterval((()=>{s.style.display="none"}),7e3)}}},_=s(6262);const X=(0,_.A)(x,[["render",A],["__scopeId","data-v-3198e622"]]);var B=X},7713:function(e,t,s){function i(e){let t=a();return e?(document.getElementById("container-dataUser").style.transform="translateX(0)",document.getElementById("openMenu").style.transform="translateX(0)",document.getElementById("openMenu").innerText="🔜"):(document.getElementById("container-dataUser").style.transform=`translateX(${t})`,document.getElementById("openMenu").style.transform=`translateX(${t})`,document.getElementById("openMenu").innerText="🔙"),document.getElementById("openMenu").style.transition="0.4s",document.getElementById("container-dataUser").style.transition="0.4s",!e}function a(){let e="";return e=window.screen.width<=400?"70vw":"30vw",e}s.d(t,{W:function(){return i}})}}]);
//# sourceMappingURL=262.8aeb5f19.js.map