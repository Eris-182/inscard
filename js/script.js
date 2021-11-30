const addImageProxy = (e) =>
  "https://stremio-subscene.htdesignz.net/insmage?url=" + encodeURIComponent(e);
String.prototype.replaceAll = function (e, t) {
  return this.split(e).join(t);
};
let lang = "vi";
const translate = {
    vi: {
      make: "Tạo InsCard",
      download: "Tải InsCard",
      posts: "Bài viết",
      followers: "Người theo dõi",
      following: "Đang theo dõi",
      emptyUrl: "Bạn phải dán link!",
      isPrivateLink:
        "Có vẻ như ảnh thuộc tài khoản riêng tư, hãy thử ảnh của tài khoản công khai nhé!",
      insurlPlaceholder: "Ví dụ: https://www.instagram.com/p/B0cz6KDgtjb/",
      fromInstagram: "Ảnh Instagram",
      fromCustomize: "Info Tùy chỉnh",
      fromUpload: "Ảnh Upload",
      postLink: "Link bài đăng",
      language: "Ngôn ngữ",
      username: "Tên người dùng",
      name: "Tên tài khoản",
      photo: "Ảnh bài viết",
      avatar: "Ảnh đại diện",
      usernamePrivate:
        "Username trên Instagram - Có thể nhập tài khoản riêng tư.",
      errorMessage: "Có lỗi xảy ra",
    },
    en: {
      make: "Make InsCard",
      download: "Download InsCard",
      posts: "Posts",
      followers: "Followers",
      following: "Following",
      emptyUrl: "Photo url is missing!",
      isPrivateLink:
        "It looks like this photo belongs to a private account, try photos of public accounts!",
      insurlPlaceholder: "Example: https://www.instagram.com/p/B0cz6KDgtjb/",
      fromInstagram: "Instagram Photo",
      fromCustomize: "Custom Info",
      fromUpload: "Upload Photo",
      postLink: "Post url",
      language: "Language",
      username: "Username",
      name: "Fullname",
      photo: "Photo",
      avatar: "Avatar",
      usernamePrivate:
        "Username on Instagram - You can enter private accounts.",
      errorMessage: "Error",
    },
  },
  changeLanguage = (e) => {
    (lang = e),
      Object.keys(translate[lang]).forEach((e) => {
        try {
          "insurlPlaceholder" == e
            ? (document.getElementById("insurl").placeholder =
                translate[lang][e])
            : document.querySelectorAll(`.trans-${e}`).forEach((t) => {
                t.innerText = translate[lang][e];
              });
        } catch (e) {
          console.log(e);
        }
      });
  },
  formatCash = (e) =>
    e < 1e3
      ? e
      : e >= 1e3 && e < 1e6
      ? +(e / 1e3).toFixed(1) + "K"
      : e >= 1e6 && e < 1e9
      ? +(e / 1e6).toFixed(1) + "M"
      : e >= 1e9 && e < 1e12
      ? +(e / 1e9).toFixed(1) + "B"
      : e >= 1e12
      ? +(e / 1e12).toFixed(1) + "T"
      : void 0,
  openFile = (e, t) => {
    let n = e.target,
      a = new FileReader();
    (a.onload = () => {
      let e = a.result;
      document.getElementById(t).value = e;
    }),
      a.readAsDataURL(n.files[0]);
  },
  makeHttpObject = () => {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {}
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
    throw new Error("Could not create HTTP request object.");
  },
  download = () => {
    let e = document.getElementById("finalImg").getAttribute("src"),
      t = document.createElement("a");
    (t.href = e),
      (t.style.display = "none"),
      t.setAttribute("download", "InsCard-htdesignz.net.jpg"),
      document.body.appendChild(t),
      t.click(),
      document.body.removeChild(t);
  },
  showForm = (e) => {
    [...document.getElementsByClassName("form-toggle")].forEach((e, t) => {
      e.classList.add("d-none");
    }),
      document.getElementById(e).classList.remove("d-none");
  },
  drawImageFit = (e, t) => {
    let n = t.canvas,
      a = n.width / e.width,
      o = n.height / e.height,
      r = Math.max(a, o),
      l = (n.width - e.width * r) / 2,
      s = (n.height - e.height * r) / 2;
    t.clearRect(0, 0, n.width, n.height),
      t.drawImage(e, 0, 0, e.width, e.height, l, s, e.width * r, e.height * r);
  },
  makeInsCard = () => {
    let e = document.getElementById("insurl").value,
      t = "";
    if (0 != e.length) {
      try {
        t = e.split("/p/")[1].split("/")[0];
      } catch (e) {
        return void alert(translate[lang].emptyUrl);
      }
      document.getElementById("loading").classList.remove("d-none"), getPost(t);
    } else alert(translate[lang].emptyUrl);
  },
  makeCustomInsCard = () => {
    document.getElementById("loading").classList.remove("d-none");
    let e = [];
    [
      "photo_url",
      "pro_pic_url",
      "username",
      "posts",
      "followers",
      "following",
      "personname",
    ].forEach((t) => {
      e.push(document.getElementById(`c_${t}`).value);
    }),
      generateCard(...e);
  },
  makeUploadInsCard = () => {
    document.getElementById("loading").classList.remove("d-none");
    let e = [];
    ["username", "photo_url"].forEach((t) => {
      e.push(document.getElementById(`u_${t}`).value);
    }),
      getUser(...e);
  },
  getPost = (e, t = !1) => {
    let n = `https://inscard-procodereris.glitch.me/api?action=getPost&postId=${e}`;
    if (t && e.length >= 15) return void alert(translate[lang].isPrivateLink);
    let a = makeHttpObject();
    try {
      a.open("GET", n, !0),
        a.send(null),
        (a.onreadystatechange = () => {
          if (4 == a.readyState) {
            let n = a.responseText,
              o = "";
            try {
              o = JSON.parse(n);
            } catch (n) {
              return t
                ? void alert(translate[lang].errorMessage)
                : void getPost(e, !0);
            }
            let r = o.graphql.shortcode_media.display_url;
            r = addImageProxy(r);
            let l = o.graphql.shortcode_media.owner.username;
            getUser(l, r);
          }
        });
    } catch (e) {
      alert(translate[lang].errorMessage);
    }
  },
  getUser = (e, t, n = !1) => {
    let a = `https://inscard-procodereris.glitch.me/api?action=getUser&username=${e}`,
      o = makeHttpObject();
    try {
      o.open("GET", a, !0),
        o.send(null),
        (o.onreadystatechange = () => {
          if (4 == o.readyState) {
            let a = o.responseText,
              r = "";
            try {
              r = JSON.parse(a);
            } catch (a) {
              return n
                ? void alert(translate[lang].errorMessage)
                : void getUser(e, t, !0);
            }
            let l = r.graphql.user.full_name,
              s = r.graphql.user.edge_owner_to_timeline_media.count,
              i = r.graphql.user.profile_pic_url;
            i = addImageProxy(i);
            let d = r.graphql.user.edge_followed_by.count,
              m = r.graphql.user.edge_follow.count;
            generateCard(t, i, e, s, d, m, l);
          }
        });
    } catch (e) {
      alert(translate[lang].errorMessage);
    }
  },
  generateCard = (e, t, n, a, o, r, l) => {
    (document.getElementById("name").innerText = l),
      (document.getElementById("user-text").innerText = n),
      (document.getElementById("posts").innerText = formatCash(a)),
      (document.getElementById("followers").innerText = formatCash(o)),
      (document.getElementById("following").innerText = formatCash(r));
    let s = new Image();
    (s.onload = function () {
      (document.getElementById("avatar-img").src = t),
        (document.getElementById("avatar-bottom").src = t),
        setTimeout(() => {
          makeMainImage(e);
        }, 0);
    }),
      s.setAttribute("crossOrigin", "anonymous"),
      (s.src = t);
  },
  makeMainImage = (e) => {
    let t = new Image();
    (t.onload = function () {
      (canvas = document.getElementById("main-img-canvas")),
        (ctx = canvas.getContext("2d")),
        drawImageFit(this, ctx),
        setTimeout(() => {
          makeBlurImage(e);
        }, 0);
    }),
      t.setAttribute("crossOrigin", "anonymous"),
      (t.src = e);
  },
  makeBlurImage = (e) => {
    let t = document.createElement("canvas"),
      n = t.getContext("2d"),
      a = new Image();
    (a.onload = function () {
      try {
        document.getElementById("blur").remove();
      } catch (e) {}
      (t.id = "blur"),
        (t.width = this.width),
        (t.height = this.height),
        n.drawImage(this, 0, 0),
        document.getElementById("wrapper").appendChild(t),
        stackBlurCanvasRGB("blur", 0, 0, t.width, t.height, 20),
        setTimeout(makeFinalCanvas, 0);
    }),
      a.setAttribute("crossOrigin", "anonymous"),
      (a.src = e);
  },
  makeFinalCanvas = () => {
    html2canvas(document.getElementById("wrapper"), {
      useCORS: !0,
      scrollX: 0,
      scrollY: 0,
      width: 1200,
      height: 1200,
      scale: 1,
    }).then((e) => {
      let t = document.getElementById("result");
      t.innerText = "";
      let n = e.toDataURL("image/jpeg", 1),
        a = document.createElement("a");
      (a.id = "download-btn"),
        (a.title = translate[lang].download),
        (a.href = n),
        a.setAttribute("download", "InsCard-htdesignz.net.jpg"),
        a.setAttribute("class", "btn btn-success m-3 trans-download"),
        (a.innerText = translate[lang].download),
        t.appendChild(a);
      let o = new Image();
      (o.src = n),
        (o.id = "finalImg"),
        t.appendChild(o),
        document.getElementById("loading").classList.add("d-none");
    });
    GetURLParameter = (sParam) => {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split("&");
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }
      }
    };
  };
