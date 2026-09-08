import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createContactHandler} from '../api/contact.js';

const body={name:'A visitor',email:'visitor@example.com',subject:'Portrait session',message:'I would like to discuss a portrait session.',website:''};
const headers={'origin':'https://lakshyajitphotography.vercel.app','content-type':'application/json','idempotency-key':'00000000-0000-4000-8000-000000000001'};
const configured={RESEND_API_KEY:'test-only-key',CONTACT_FROM:'sender@example.com',CONTACT_TO:'photographer@example.com',NODE_ENV:'production'};
async function invoke({data=body,method='POST',requestHeaders=headers,env={},provider}={}) {
  let calls=0;
  const handler=createContactHandler({env,fetchImpl:async(...args)=>{calls++;return provider ? provider(...args) : {ok:true,json:async()=>({id:'test-email-id'})};}});
  const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(value){this.value=value;return this;}};
  await handler({method,headers:requestHeaders,body:data},response);
  return {...response,calls};
}
test('missing configuration fails gracefully, never pretends to send',async()=>{
  const r=await invoke();assert.equal(r.code,503);assert.equal(r.value.ok,false);assert.match(r.value.message,/Instagram/);assert.equal(r.calls,0);
});
test('only POST accepted',async()=>{const r=await invoke({method:'GET'});assert.equal(r.code,405);assert.equal(r.headers.Allow,'POST');});
test('cross-origin and absent-origin submissions rejected',async()=>{
  for(const origin of ['https://unrelated.example',undefined]) assert.equal((await invoke({requestHeaders:{...headers,origin}})).code,403);
});
test('custom production origin is configurable',async()=>{assert.equal((await invoke({env:{...configured,CONTACT_ORIGIN:'https://photos.example.com'},requestHeaders:{...headers,origin:'https://photos.example.com'}})).code,200);});
test('Vercel preview origin accepted; localhost rejected in production',async()=>{
  assert.equal((await invoke({env:{...configured,VERCEL_URL:'preview.example.vercel.app'},requestHeaders:{...headers,origin:'https://preview.example.vercel.app'}})).code,200);
  assert.equal((await invoke({env:configured,requestHeaders:{...headers,origin:'http://localhost:4173'}})).code,403);
});
test('wrong media type rejected',async()=>{assert.equal((await invoke({requestHeaders:{...headers,'content-type':'application/x-www-form-urlencoded'}})).code,415);});
test('malformed and non-object bodies rejected',async()=>{
  for(const data of ['{',null,[],42]) assert.equal((await invoke({data})).code,400);
});
test('payload and field limits enforced',async()=>{
  assert.equal((await invoke({requestHeaders:{...headers,'content-length':'25000'}})).code,413);
  assert.equal((await invoke({data:{...body,message:'x'.repeat(25000)}})).code,413);
  for(const data of [{...body,name:' '},{...body,name:'a'.repeat(101)},{...body,name:'a\r\nBcc: attacker@example.com'},{...body,email:'bad'},{...body,email:'a@example.com\r\nBcc: other@example.com'},{...body,subject:'unexpected'},{...body,message:'short'},{...body,message:'x'.repeat(5001)},{...body,website:'spam'}]) {
    const r=await invoke({data,env:configured});assert.equal(r.code,400);assert.equal(r.calls,0);
  }
});
test('idempotency key required and bounded',async()=>{
  for(const key of ['',undefined,'x'.repeat(100),'bad key']) assert.equal((await invoke({requestHeaders:{...headers,'idempotency-key':key}})).code,400);
});
test('validated message submitted only to configured inbox as plain text',async()=>{
  const r=await invoke({env:configured,provider:async(url,options)=>{
    assert.equal(url,'https://api.resend.com/emails');
    const sent=JSON.parse(options.body);assert.deepEqual(sent.to,[configured.CONTACT_TO]);assert.equal(sent.reply_to,body.email);assert.equal(sent.from,configured.CONTACT_FROM);assert.equal(sent.html,undefined);assert.match(sent.text,/A visitor/);assert.ok(options.signal);assert.match(options.headers['Idempotency-Key'],/^contact-/);
    return {ok:true,json:async()=>({id:'provider-accepted'})};
  }});assert.equal(r.code,200);assert.equal(r.value.ok,true);assert.equal(r.calls,1);assert.equal(r.headers['Cache-Control'],'no-store');
});
test('provider rejection, throttling, malformed responses and timeout never report success',async()=>{
  for(const [provider,code] of [[async()=>({ok:false,status:500}),502],[async()=>({ok:false,status:429}),429],[async()=>({ok:true,json:async()=>({})}),502],[async()=>{throw new Error('secret provider details');},502]]) {
    const r=await invoke({env:configured,provider});assert.equal(r.code,code);assert.equal(r.value.ok,false);assert.doesNotMatch(JSON.stringify(r.value),/test-only-key|secret provider details/);
  }
});
test('retry with same input uses the same provider idempotency key',async()=>{
  const keys=[];
  const provider=async(url,opts)=>{keys.push(opts.headers['Idempotency-Key']);return {ok:true,json:async()=>({id:'ok'})};};
  await invoke({env:configured,provider});await invoke({env:configured,provider});assert.equal(keys[0],keys[1]);
});
