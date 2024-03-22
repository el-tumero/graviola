import{A as S,H as E,N as b,C as m,R as _,p as v,b as x,s as M,r as N,O as h,i as O,c as p,S as W,x as C,d as I,E as u,e as R,M as U,f as $,g as A}from"./index-BZyF2ZQM.js";const f={FIVE_MINUTES_IN_MS:3e5};class j{constructor(e){const{enabled:n=!0,nonceRefetchIntervalMs:i=f.FIVE_MINUTES_IN_MS,sessionRefetchIntervalMs:a=f.FIVE_MINUTES_IN_MS,signOutOnAccountChange:s=!0,signOutOnDisconnect:o=!0,signOutOnNetworkChange:r=!0,...l}=e;this.options={enabled:n,nonceRefetchIntervalMs:i,sessionRefetchIntervalMs:a,signOutOnDisconnect:o,signOutOnAccountChange:s,signOutOnNetworkChange:r},this.methods=l}async getNonce(){const e=await this.methods.getNonce();if(!e)throw new Error("siweControllerClient:getNonce - nonce is undefined");return e}createMessage(e){const n=this.methods.createMessage(e);if(!n)throw new Error("siweControllerClient:createMessage - message is undefined");return n}async verifyMessage(e){return await this.methods.verifyMessage(e)}async getSession(){const e=await this.methods.getSession();if(!e)throw new Error("siweControllerClient:getSession - session is undefined");return e}async signIn(){var l;const e=await this.methods.getNonce(),{address:n}=S.state;if(!n)throw new Error("An address is required to create a SIWE message.");const i=E.caipNetworkIdToNumber((l=b.state.caipNetwork)==null?void 0:l.id);if(!i)throw new Error("A chainId is required to create a SIWE message.");const a=this.methods.createMessage({address:n,nonce:e,chainId:i}),s=await m.signMessage(a);if(!await this.methods.verifyMessage({message:a,signature:s}))throw new Error("Error verifying SIWE signature");const r=await this.methods.getSession();if(!r)throw new Error("Error verifying SIWE signature");return this.methods.onSignIn&&this.methods.onSignIn(r),_.navigateAfterNetworkSwitch(),r}async signOut(){return this.methods.signOut()}}const c=v({status:"uninitialized"}),g={state:c,subscribeKey(t,e){return x(c,t,e)},subscribe(t){return M(c,()=>t(c))},_getClient(){if(!c._client)throw new Error("SIWEController client not set");return c._client},async getNonce(){const e=await this._getClient().getNonce();return this.setNonce(e),e},async getSession(){const e=await this._getClient().getSession();return e&&(this.setSession(e),this.setStatus("success")),e},createMessage(t){const n=this._getClient().createMessage(t);return this.setMessage(n),n},async verifyMessage(t){return await this._getClient().verifyMessage(t)},async signIn(){return await this._getClient().signIn()},async signOut(){var e;const t=this._getClient();await t.signOut(),this.setStatus("ready"),(e=t.onSignOut)==null||e.call(t)},onSignIn(t){var n;const e=this._getClient();(n=e.onSignIn)==null||n.call(e,t)},onSignOut(){var e;const t=this._getClient();(e=t.onSignOut)==null||e.call(t)},setSIWEClient(t){c._client=N(t),c.status="ready",h.setIsSiweEnabled(t.options.enabled)},setNonce(t){c.nonce=t},setStatus(t){c.status=t},setMessage(t){c.message=t},setSession(t){c.session=t}},V=O`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;var T=function(t,e,n,i){var a=arguments.length,s=a<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(t,e,n,i);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(s=(a<3?o(s):a>3?o(e,n,s):o(e,n))||s);return a>3&&s&&Object.defineProperty(e,n,s),s};let d=class extends p{constructor(){var e;super(...arguments),this.dappImageUrl=(e=h.state.metadata)==null?void 0:e.icons,this.walletImageUrl=W.getConnectedWalletImageUrl()}firstUpdated(){var n;const e=(n=this.shadowRoot)==null?void 0:n.querySelectorAll("wui-visual-thumbnail");e!=null&&e[0]&&this.createAnimation(e[0],"translate(18px)"),e!=null&&e[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){var e;return C`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${(e=this.dappImageUrl)==null?void 0:e[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,n){e.animate([{transform:"translateX(0px)"},{transform:n}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};d.styles=V;d=T([I("w3m-connecting-siwe")],d);var y=function(t,e,n,i){var a=arguments.length,s=a<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(t,e,n,i);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(s=(a<3?o(s):a>3?o(e,n,s):o(e,n))||s);return a>3&&s&&Object.defineProperty(e,n,s),s};let w=class extends p{constructor(){var e;super(...arguments),this.dappName=(e=h.state.metadata)==null?void 0:e.name,this.isSigning=!1}render(){return C`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-connecting-siwe></w3m-connecting-siwe>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="md"
          ?fullwidth=${!0}
          variant="shade"
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          Cancel
        </wui-button>
        <wui-button
          size="md"
          ?fullwidth=${!0}
          variant="fill"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0,u.sendEvent({event:"CLICK_SIGN_SIWE_MESSAGE",type:"track"});try{g.setStatus("loading");const e=await g.signIn();return g.setStatus("success"),u.sendEvent({event:"SIWE_AUTH_SUCCESS",type:"track"}),e}catch{return R.showError("Signature declined"),g.setStatus("error"),u.sendEvent({event:"SIWE_AUTH_ERROR",type:"track"})}finally{this.isSigning=!1}}async onCancel(){const{isConnected:e}=S.state;e?(await m.disconnect(),U.close()):$.push("Connect"),u.sendEvent({event:"CLICK_CANCEL_SIWE",type:"track"})}};y([A()],w.prototype,"isSigning",void 0);w=y([I("w3m-connecting-siwe-view")],w);function F(t){return new j(t)}export{g as SIWEController,d as W3mConnectingSiwe,w as W3mConnectingSiweView,F as createSIWEConfig};
