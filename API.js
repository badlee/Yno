// Cockpit REST Client

/*
  Usage
  const API = require("path/to/API");
  // or 
  // import API from 'path/to/API';
  
  //inititialze the api
  API.init({
    "server": "http://cockpit_host",
    "baseUrl": "cockpit_directory",
    "token": "api_token", 
    "api": { 
      // collections or form here
      api_access : { // access like that : API.api_access
        "url": "collection_or_form_name", //collection or form name in cockpit 
        "limit": 5, // limit when get data from server
        "sort": { // sort results
          "_o": 1
        },
        "fields": [ //  fields to gets from the server, other will be ignored
          "title",
          "image",
          "description",
          "backgroundColor",
          "fontColor
        ],
        "map": { // change value of a property or set new property in result object 
          // you can build string from a template
          "image": "{{SERVER}}{{image.path}}"
          // or map a property's value to another
          "body" : "description" 
        },
        "filter": { // the default filters come here
          "published": true
        }
      },
      "another_access_key" : {
        "url": "test", // forms name
        "isForm" : true // if his key is present we can post data to server
      },
      "singleton" : {
        "url": "mysingleton", // singleton name
        "isSingleton" : true // if his key is present we can post data to server
      },
    }
  })
  // read collection data from server (Promise)
  API.api_access()
    .then(an_array_of_object=>console.log(an_array_of_object))
    .catch(err=>console.error(err));
  // get first element
  API.api_access({limit : 1})
    .then(an_object=>console.log(an_object))
    .catch(err=>console.error(err));
  // get one element
  API.api_access({id : 1})
    .then(an_object=>console.log(an_object))
    .catch(err=>console.error(err));
  // get one page of elements
  API.api_access({limit : 10, page : 2}) // page start by 0, also set page to 0 for the first page, page to 1 for the second page
    .then(an_array_of_object=>console.log(an_array_of_object))
    .catch(err=>console.error(err));
  // get filtered elements , you can use page, limit, sort, etc. with filter
  API.api_access({filter: {
    published : true
  }}) // page start by 0, also set page to 0 for the first page, page to 1 for the second page
    .then(an_array_of_object=>console.log(an_array_of_object))
    .catch(err=>console.error(err));
  
  // get singleton
  API.singleton()
    .then(an_object=>console.log(an_object))
    .catch(err=>console.error(err));
  
  // post data to collection
  API.api_access.save({
    published : false,
    title : "Cool",
    description : "I'm juste a test :-p"
  });

  API.post("api_access", {
    published : false,
    title : "Cool",
    description : "I'm juste a test :-p"
  });

  // post data to a form same as post data to collection
  API.post("another_access_key", {
    published : false,
    title : "Cool",
    description : "I'm juste a test :-p"
  });

*/
let CONFIG = undefined;
let endWithSlash = /\/$/;
var templateEngine = (function(){
  "use strict";

  var start   = "{{",
      end     = "}}",
      path    = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
      pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
      undef;
  
  return function(template, data){
      // Merge data into the template string
      return template in data ? data[template] : template.replace(pattern, function(tag, token){
          var path = token.split("."),
              len = path.length,
              lookup = data,
              i = 0;

          for (; i < len; i++){
              lookup = lookup[path[i]];
              
              // Property not found
              if (lookup === undef){
                  throw "tim: '" + path[i] + "' not found in " + tag;
              }
              
              // Return the required value
              if (i === len - 1){
                  return lookup;
              }
          }
      });
  };
}());
var postData = (prop, value)=>{
  if(!CONFIG)
    return Promise.reject(new ReferenceError("config is not defined"));
  let obj =CONFIG.api;
  var api = obj[prop] || {};
  if(api){
    if(api.isSingleton)
      return Promise.reject(new TypeError(`${prop} is a singleton`));
    api.url = api.url || prop;
    var url = new URL((api.isForm ? "/api/forms/submit/" : "/api/collections/save/")+api.url+'?token='+(api.token || CONFIG.token),(api.server || CONFIG.server)+(api.baseUrl || CONFIG.baseUrl || ""));
    return fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(api.isForm ? {
          form: value
        } : {
          data:  value
        })
    })
    .then(async results => {
      var ret = await results.text();
      // console.log("\n\nBODY [",api.url, "] ==> ",ret,"\n\n");
      return JSON.parse(ret);
    });
  }
  return Promise.reject(new ReferenceError(`${prop} not found`));
}
var API = new Proxy({
  post(prop,value){
    return postData(prop,value);
  },
  init(config){
    //  console.log(config);
    if(typeof config != 'object' || typeof config == 'object' && Array.isArray(config))
      return Promise.reject(new TypeError(`Config is not a object`));
      let tmp = {
        "server": typeof '',
        "baseUrl": typeof '',
        "token": typeof '',
        "api": typeof {}
      };
      let err= null;
      Object.keys(tmp).forEach(e=>{
        if(typeof config[e] != tmp[e])
          err = `${e} must be ${tmp[e]}`;
      });
      // console.log("error ", err);
      if(err)
        return Promise.reject(new TypeError(err))

      // console.log("set config", config);
      if(CONFIG == undefined && config != undefined)
        CONFIG = config;
      if(endWithSlash.test(CONFIG.baseUrl))
        CONFIG.baseUrl = CONFIG.baseUrl.substr(0,CONFIG.baseUrl.length -1);
      if(endWithSlash.test(CONFIG.baseUrl))
        CONFIG.server = CONFIG.server.substr(0,CONFIG.server.length -1);
      return Promise.resolve(undefined);
  },
  getAssetUri(asset){
    if(/^http(s)?:\/\//.test(asset))
      return asset;
    return (CONFIG.server + ((CONFIG?.baseUrl ? CONFIG.baseUrl : "") + "/" + asset.replace(new RegExp(`^${CONFIG.baseUrl}`), ""))).replace(/\/+/g,"/").replace(/^(http(s)?:\/)/, "$1/");
  },
  template(tmpl, data){
    return templateEngine(tmpl,{...(typeof data == "object" && !Array.isArray(data)  ? data : {}), "@" : data});
  },
  get CONFIG(){
    return CONFIG;
  } 
},{
  set: function(_,prop,value){
    return postData(prop,value);
  },
  get: function(_, prop){
    if(["$$typeof"].indexOf(prop) != -1)
      return ({
        "$$typeof": "RestAPIClient"
      })["$$typeof"];
    if(prop in  _) return _[prop];
    // console.log("CONFIG",prop," - ",CONFIG);
    if(CONFIG===undefined){
      console.log("CONFIG ERROR",prop,CONFIG);
      throw new ReferenceError(prop+" >> config is not defined");
      // return Promise.reject();
    }
      let obj =CONFIG.api;
      var api = obj[prop] || {};
    if(api){
      var _ret = async ({limit,page,id, remove, fields,populate, filter, ignoreDefaultFilter}={}) => {
        api.url = api.url || prop;
        
        if(api.isForm){
            return Promise.reject(new TypeError(`${prop} is a form`));
        }
        if(remove && api.isSingleton){
          return Promise.reject(new TypeError(`${prop} is a singleton`));
        }
        // var method = api.method || "post";
        fields = fields || (id ? api.findOneFields : api.fields) || {};
        if(Array.isArray(fields)){
          fields = fields.reduce((a,b)=>{
            a[b] = true;
            return a;
          },{});
        } else if (typeof fields == 'string'){
          fields = {[fields] : true};
        } else if (typeof fields != 'object'){
          fields = {};
        }
        var filter = id ? 
        {_id : id} : 
        (
          !(ignoreDefaultFilter ?? false) ? {
            $and : [
            (CONFIG["filter"] != null) ? CONFIG["filter"] : {},
            (api["filter"] != null) ? api["filter"] : {},
            filter
            ].filter(x=>x && Object.keys(x).length)
          } : filter);
        limit = limit || api.limit || 10;
        var params = {
          limit : limit == -1 || id ? undefined : limit,
          skip : limit == -1 || id ? undefined : (
            page ? ( (page+1) *  (limit)) : 0
          ),
          sort: id ? undefined : api.sort || {_created:-1},
          simple : 1,
          populate : populate || api.populate || 1,
          fields,
          filter
        };
        var url = new URL('/api/'+( api.isSingleton ? 'singletons' : 'collections')+'/'+(remove? 'remove' :'get')+'/'+api.url+'?token='+(api.token || CONFIG.token),(api.server || CONFIG.server)+(api.baseUrl || CONFIG.baseUrl || ""));
        var map = (el)=>{
          if(el){
            var map = api.map || {};
            Object.keys(map).forEach(e=>{
              if(map[e] in el)
                el[e] = el[map[e]];
              else if(/\{\{/.test(map[e])){
                el[e] = templateEngine(map[e],{...el,SERVER : (api.server || CONFIG.server), BASEURL : (api.baseUrl || CONFIG.baseUrl || "")});
              }
            });
          }
          return el;
        };
        return fetch(url,{
          method : api.isSingleton ? 'get' : 'post',
          headers:  api.isSingleton ? undefined : { 'Content-Type': 'application/json' },
          body:  api.isSingleton ? undefined : JSON.stringify(remove ? {filter}: params)
      })
        .then(async results => {
          var ret = await results.text();
          // console.log("\n\nBODY [",api.url, (remove ? " - remove" :"") ,"] ==> ",ret,"\n\n");
          return JSON.parse(ret);
        })
        // .then(results => results.json())
        .then(res=>{
           if(Object.keys(res).length == 1 && Object.keys(res)[0] == "error")
            throw new Error(res.error);
          return res;
        })
        .then(res=>{
          return (api.isSingleton) ? [res] : res;
        })
        .then(res=>{
          if(remove)
            return res;
          res= (api.isSingleton || params.limit==1 ||  id) ? map(res[0] || undefined) : res.map(map);
          // console.log("Params    : ",api.url, " ==> ", params);
          // console.log("Resultats : ",api.url, " ==> ",res);
          return res;
        });
      };
      _ret.find = ({limit,page, fields,populate, filter,ignoreDefaultFilter}={}) => _ret({limit,page, fields,populate, filter,ignoreDefaultFilter});
      _ret.findOne = ({fields,populate, filter, ignoreDefaultFilter}={}) => _ret({limit:1,fields,populate, filter, ignoreDefaultFilter});
      _ret.get = ({id, fields,populate, ignoreDefaultFilter}={}) => _ret({id, limit : 1, fields, populate,ignoreDefaultFilter});
      _ret.save = async (value) =>postData(prop,value);
      _ret.delete = ({id,filter,ignoreDefaultFilter}={}) => _ret({remove:true,id,filter,ignoreDefaultFilter});
      
      return _ret;
    }
    return _[prop];
  }
});
export default API;
