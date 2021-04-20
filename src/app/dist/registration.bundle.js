(()=>{"use strict";function e(){var e,r,a,t,n,s,o,l,u,i,c=(a=document.querySelector("#first-name").value,t=document.querySelector("#last-name").value,n=document.querySelector("#username").value,s=document.querySelector("#email").value,o=document.querySelector("#password").value,l=document.querySelector("#confirm-password").value,e={"first-name":{val:(u={first_name:a,last_name:t,username:n,email:s,password:o,confirm_password:l}).first_name,regex:/^[A-Z][a-z]{1,30}$/},"last-name":{val:u.last_name,regex:/^[A-Z][a-z]{1,30}$/},username:{val:u.username,regex:/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/},email:{val:u.email},password:{val:u.password,regex:i=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/},"confirm-password":{val:u.confirm_password,regex:i}},r={},Object.keys(e).forEach((function(a){var t;0==function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return r?e&&new RegExp(r).test(e):!!e}(e[a].val,null===(t=e[a])||void 0===t?void 0:t.regex)&&(r[a]="invalid")})),r);return console.log("🚀 ~ file: registration.js ~ line 5 ~ getValuesFromRegistrationFormAndValidate ~ testObj",c),Object.keys(c).length>0?Object.keys(c).forEach((function(e){var r=document.querySelector("#"+e);r.classList.add("ring-1"),r.classList.add("ring-red-500")})):alert("SVE OK SADAAAAA"),c}document.querySelector("form#registration-form").addEventListener("submit",(function(r){r.preventDefault(),e()}))})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9zcmMvanMvcmVnaXN0cmF0aW9uLmpzIiwid2VicGFjazovL2FwcC8uL3NyYy9qcy91dGlscy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbImdldFZhbHVlc0Zyb21SZWdpc3RyYXRpb25Gb3JtQW5kVmFsaWRhdGUiLCJmb3JtT2JqZWN0IiwicmV0dXJuT2JqIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsInVzZXJuYW1lIiwiZW1haWwiLCJwYXNzd29yZCIsImNvbmZpcm1fcGFzc3dvcmQiLCJwYXNzd29yZFJlZ2V4IiwidGVzdE9iaiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInZhbHVlIiwidmFsIiwicmVnZXgiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsIlJlZ0V4cCIsInRlc3QiLCJ2YWxpZGF0ZUlucHV0IiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsImVyckZpZWxkS2V5IiwiZWwiLCJjbGFzc0xpc3QiLCJhZGQiLCJhbGVydCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiJtQkFFQSxTQUFTQSxJQUNQLElDSGdDQyxFQUMxQkMsRURzRUFDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEVBeERSLEVBVVFDLEVBM0JBQyxHQW9FQVAsRUFBYVEsU0FBU0MsY0FBYyxlQUFlQyxNQUNuRFQsRUFBWU8sU0FBU0MsY0FBYyxjQUFjQyxNQUNqRFIsRUFBV00sU0FBU0MsY0FBYyxhQUFhQyxNQUMvQ1AsRUFBUUssU0FBU0MsY0FBYyxVQUFVQyxNQUN6Q04sRUFBV0ksU0FBU0MsY0FBYyxhQUFhQyxNQUMvQ0wsRUFBbUJHLFNBQVNDLGNBQWMscUJBQXFCQyxNQzVFckNaLEVEMkN6QixDQUNMLGFBQWMsQ0FDWmEsS0F6Qk4sRUEwRFMsQ0FDTFgsYUFDQUMsWUFDQUMsV0FDQUMsUUFDQUMsV0FDQUMscUJBL0RGTCxXQXlCSVksTUFsQm1CLHNCQW9CckIsWUFBYSxDQUNYRCxJQXRCSCxFQUxEVixVQTRCSVcsTUFyQmtCLHNCQXVCcEJWLFNBQVUsQ0FDUlMsSUExQkgsRUFKRFQsU0ErQklVLE1BdkJrQiw4REF5QnBCVCxNQUFPLENBQ0xRLElBOUJILEVBSERSLE9BbUNFQyxTQUFVLENBQ1JPLElBakNILEVBRkRQLFNBb0NJUSxNQS9CRU4sRUFBZ0IsMENBaUNwQixtQkFBb0IsQ0FDbEJLLElBckNILEVBREROLGlCQXVDSU8sTUFBT04sSUNoRUxQLEVBQVksR0FDbEJjLE9BQU9DLEtBQUtoQixHQUNUaUIsU0FBUSxTQUFBQyxHQUFPLE1BQ1YsR0FRWSxTQUFDTCxHQUFzQixJQUFqQkMsRUFBaUIsdURBQVQsS0FDbEMsT0FBS0EsRUFHRUQsR0FBTyxJQUFJTSxPQUFPTCxHQUFPTSxLQUFLUCxLQUYxQkEsRUFWTVEsQ0FBY3JCLEVBQVdrQixHQUFLTCxJQUFqQixVQUFzQmIsRUFBV2tCLFVBQWpDLGFBQXNCLEVBQWlCSixTQUMvRGIsRUFBVWlCLEdBQU8sY0FJaEJqQixHRFFQLE9BYkFxQixRQUFRQyxJQUFJLDJGQUE0RmQsR0FFcEdNLE9BQU9DLEtBQUtQLEdBQVNlLE9BQVMsRUFDaENULE9BQU9DLEtBQUtQLEdBQ1RRLFNBQVEsU0FBQVEsR0FDUCxJQUFNQyxFQUFLaEIsU0FBU0MsY0FBYyxJQUFNYyxHQUN4Q0MsRUFBR0MsVUFBVUMsSUFBSSxVQUNqQkYsRUFBR0MsVUFBVUMsSUFBSSxtQkFHckJDLE1BQU0sbUJBR0RwQixFQTJFVEMsU0FBU0MsY0FBYywwQkFDcEJtQixpQkFBaUIsVUFBVSxTQUFBQyxHQUMxQkEsRUFBRUMsaUJBTEpqQyxRIiwiZmlsZSI6InJlZ2lzdHJhdGlvbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB2YWxpZGF0ZVJlZ2lzdHJhdGlvbkZvcm0gfSBmcm9tICcuL3V0aWxzL3ZhbGlkYXRpb24nO1xyXG5cclxuZnVuY3Rpb24gZ2V0VmFsdWVzRnJvbVJlZ2lzdHJhdGlvbkZvcm1BbmRWYWxpZGF0ZSgpIHtcclxuICBjb25zdCB0ZXN0T2JqID0gdmFsaWRhdGVSZWdpc3RyYXRpb25Gb3JtKGdlbmVyYXRlRm9ybU9iamVjdFdpdGhSZWdleChnZXRWYWx1ZXNGcm9tRm9ybSgpKSlcclxuICBjb25zb2xlLmxvZyhcIvCfmoAgfiBmaWxlOiByZWdpc3RyYXRpb24uanMgfiBsaW5lIDUgfiBnZXRWYWx1ZXNGcm9tUmVnaXN0cmF0aW9uRm9ybUFuZFZhbGlkYXRlIH4gdGVzdE9ialwiLCB0ZXN0T2JqKVxyXG5cclxuICBpZiAoT2JqZWN0LmtleXModGVzdE9iaikubGVuZ3RoID4gMCkge1xyXG4gICAgT2JqZWN0LmtleXModGVzdE9iailcclxuICAgICAgLmZvckVhY2goZXJyRmllbGRLZXkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyBlcnJGaWVsZEtleSlcclxuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKCdyaW5nLTEnKVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoJ3JpbmctcmVkLTUwMCcpXHJcbiAgICAgIH0pXHJcbiAgfSBlbHNlIHtcclxuICAgIGFsZXJ0KFwiU1ZFIE9LIFNBREFBQUFBXCIpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGVzdE9ialxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZUZvcm1PYmplY3RXaXRoUmVnZXgoe1xyXG4gIGZpcnN0X25hbWUsXHJcbiAgbGFzdF9uYW1lLFxyXG4gIHVzZXJuYW1lLFxyXG4gIGVtYWlsLFxyXG4gIHBhc3N3b3JkLFxyXG4gIGNvbmZpcm1fcGFzc3dvcmRcclxufSkge1xyXG4gIGNvbnN0IGZpcnN0TmFtZVJlZ2V4ID0gL15bQS1aXVthLXpdezEsMzB9JC87XHJcbiAgY29uc3QgbGFzdE5hbWVSZWdleCA9IC9eW0EtWl1bYS16XXsxLDMwfSQvO1xyXG4gIGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qW0EtWmEtel0pKD89LipcXGQpW0EtWmEtelxcZF17OCx9JC8gLy9NaW5pbXVtIGVpZ2h0IGNoYXJhY3RlcnMsIGF0IGxlYXN0IG9uZSBsZXR0ZXIgYW5kIG9uZSBudW1iZXI6XHJcbiAgY29uc3QgdXNlcm5hbWVSZWdleCA9IC9eKD89LnszLDIwfSQpKD8hW18uXSkoPyEuKltfLl17Mn0pW2EtekEtWjAtOS5fXSsoPzwhW18uXSkkL1xyXG4gIC8vIOKUlOKUgOKUgOKUgOKUgOKUgOKUrOKUgOKUgOKUgOKUgOKUmOKUlOKUgOKUgOKUgOKUrOKUgOKUgOKUmOKUlOKUgOKUgOKUgOKUgOKUgOKUrOKUgOKUgOKUgOKUgOKUgOKUmOKUlOKUgOKUgOKUgOKUgOKUgOKUrOKUgOKUgOKUgOKUgOKUgOKUmCDilJTilIDilIDilIDilKzilIDilIDilIDilJhcclxuICAvLyDilIIgICAgICAgICDilIIgICAgICAgICDilIIgICAgICAgICAgICDilIIgICAgICAgICAgIG5vIF8gb3IgLiBhdCB0aGUgZW5kXHJcbiAgLy8g4pSCICAgICAgICAg4pSCICAgICAgICAg4pSCICAgICAgICAgICAg4pSCXHJcbiAgLy8g4pSCICAgICAgICAg4pSCICAgICAgICAg4pSCICAgICAgICAgICAgYWxsb3dlZCBjaGFyYWN0ZXJzXHJcbiAgLy8g4pSCICAgICAgICAg4pSCICAgICAgICAg4pSCXHJcbiAgLy8g4pSCICAgICAgICAg4pSCICAgICAgICAgbm8gX18gb3IgXy4gb3IgLl8gb3IgLi4gaW5zaWRlXHJcbiAgLy8g4pSCICAgICAgICAg4pSCXHJcbiAgLy8g4pSCICAgICAgICAgbm8gXyBvciAuIGF0IHRoZSBiZWdpbm5pbmdcclxuICAvLyDilIJcclxuICAvLyB1c2VybmFtZSBpcyA4LTIwIGNoYXJhY3RlcnMgbG9uZ1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgJ2ZpcnN0LW5hbWUnOiB7XHJcbiAgICAgIHZhbDogZmlyc3RfbmFtZSxcclxuICAgICAgcmVnZXg6IGZpcnN0TmFtZVJlZ2V4XHJcbiAgICB9LFxyXG4gICAgJ2xhc3QtbmFtZSc6IHtcclxuICAgICAgdmFsOiBsYXN0X25hbWUsXHJcbiAgICAgIHJlZ2V4OiBsYXN0TmFtZVJlZ2V4XHJcbiAgICB9LFxyXG4gICAgdXNlcm5hbWU6IHtcclxuICAgICAgdmFsOiB1c2VybmFtZSxcclxuICAgICAgcmVnZXg6IHVzZXJuYW1lUmVnZXhcclxuICAgIH0sXHJcbiAgICBlbWFpbDoge1xyXG4gICAgICB2YWw6IGVtYWlsXHJcbiAgICB9LFxyXG4gICAgcGFzc3dvcmQ6IHtcclxuICAgICAgdmFsOiBwYXNzd29yZCxcclxuICAgICAgcmVnZXg6IHBhc3N3b3JkUmVnZXhcclxuICAgIH0sXHJcbiAgICBcImNvbmZpcm0tcGFzc3dvcmRcIjoge1xyXG4gICAgICB2YWw6IGNvbmZpcm1fcGFzc3dvcmQsXHJcbiAgICAgIHJlZ2V4OiBwYXNzd29yZFJlZ2V4XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZXNGcm9tRm9ybSgpIHtcclxuICBjb25zdCBmaXJzdF9uYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpcnN0LW5hbWUnKS52YWx1ZVxyXG4gIGNvbnN0IGxhc3RfbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsYXN0LW5hbWUnKS52YWx1ZVxyXG4gIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VzZXJuYW1lJykudmFsdWVcclxuICBjb25zdCBlbWFpbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbWFpbCcpLnZhbHVlXHJcbiAgY29uc3QgcGFzc3dvcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFzc3dvcmQnKS52YWx1ZVxyXG4gIGNvbnN0IGNvbmZpcm1fcGFzc3dvcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29uZmlybS1wYXNzd29yZCcpLnZhbHVlXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBmaXJzdF9uYW1lLFxyXG4gICAgbGFzdF9uYW1lLFxyXG4gICAgdXNlcm5hbWUsXHJcbiAgICBlbWFpbCxcclxuICAgIHBhc3N3b3JkLFxyXG4gICAgY29uZmlybV9wYXNzd29yZFxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVSZWdpc3RyYXRpb24oKSB7XHJcbiAgZ2V0VmFsdWVzRnJvbVJlZ2lzdHJhdGlvbkZvcm1BbmRWYWxpZGF0ZSgpXHJcbn1cclxuXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0jcmVnaXN0cmF0aW9uLWZvcm0nKVxyXG4gIC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBlID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YWxpZGF0ZVJlZ2lzdHJhdGlvbigpXHJcbiAgfSk7XHJcblxyXG5leHBvcnQge1xyXG4gIHZhbGlkYXRlUmVnaXN0cmF0aW9uLFxyXG4gIGdldFZhbHVlc0Zyb21SZWdpc3RyYXRpb25Gb3JtQW5kVmFsaWRhdGVcclxufSIsImNvbnN0IHZhbGlkYXRlUmVnaXN0cmF0aW9uRm9ybSA9IChmb3JtT2JqZWN0KSA9PiB7XHJcbiAgY29uc3QgcmV0dXJuT2JqID0ge31cclxuICBPYmplY3Qua2V5cyhmb3JtT2JqZWN0KVxyXG4gICAgLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgaWYgKGZhbHNlID09IHZhbGlkYXRlSW5wdXQoZm9ybU9iamVjdFtrZXldLnZhbCwgZm9ybU9iamVjdFtrZXldPy5yZWdleCkpIHtcclxuICAgICAgICByZXR1cm5PYmpba2V5XSA9ICdpbnZhbGlkJ1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICByZXR1cm4gcmV0dXJuT2JqXHJcbn1cclxuXHJcbmNvbnN0IHZhbGlkYXRlSW5wdXQgPSAodmFsLCByZWdleCA9IG51bGwpID0+IHtcclxuICBpZiAoIXJlZ2V4KSB7XHJcbiAgICByZXR1cm4gISF2YWw7XHJcbiAgfVxyXG4gIHJldHVybiB2YWwgJiYgbmV3IFJlZ0V4cChyZWdleCkudGVzdCh2YWwpXHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgdmFsaWRhdGVSZWdpc3RyYXRpb25Gb3JtXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9