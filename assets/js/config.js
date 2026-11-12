/* YourEye.org settings. Edit values here; no other file needs to change. */
window.YE_CONFIG = {
  /* Form inbox, stored encoded. It is decoded only at the moment a form is sent. Do not replace with plain text. */
  inbox: [122, 120, 116, 57, 123, 126, 118, 122, 112, 87, 38, 118, 100, 124, 101, 120, 96, 117, 114, 96],
  formEndpoint: "https://formsubmit.co/ajax/",

  /* AdSense display-unit slot IDs. Leave blank until approved; Auto ads work without them. */
  adSlots: { "in-content": "", "sidebar": "", "home-mid": "" },

  /* Payment links for the Support page. When blank, the page collects a pledge and you reply with a link. */
  donate: {
    paypal: "",   /* e.g. https://www.paypal.com/donate/?hosted_button_id=XXXX */
    stripe: "",   /* e.g. https://buy.stripe.com/XXXX (one-time) */
    stripeMonthly: "",
    bmc: ""       /* e.g. https://buymeacoffee.com/yourname */
  },

  /* Eyewear affiliate links (EyeBuyDirect, Zenni and similar). Blank = link to the buying guide instead. */
  affiliates: { glasses: "", contacts: "", sunglasses: "" },

  /* Contest settings shown on the Contests page. */
  contest: {
    prize: "US$50 eyewear gift card",
    runnerUp: "YourEye.org digital badge and a shout-out in the monthly digest",
    sponsor: ""
  },

  cookieNotice: true
};
