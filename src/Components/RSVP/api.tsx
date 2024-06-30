import constants from '../../constants';

// lookup name
export  const lookup = async(addresse : string) => {
    var xhr = new XMLHttpRequest();
    
    const resp = await new Promise((resolve, reject) => {
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            try {
                resolve(JSON.parse(this.responseText).body);
            } catch(e) {
                reject(e)
            }
        }
        });
        
        xhr.open("GET", `${constants.LOOKUP_ENDPOINT}?guest=${encodeURIComponent(addresse)}`);
        
        xhr.send();
    });

    return resp;
}

// function JSONtoQueryParams(jsonObj) {
//     let params = "";
//     Object.keys(jsonObj).forEach(key => {
//         params += `${key}=${jsonObj[key]}&`;
//     });
//     return params;
// }

// // save response
// export const saveResponse = async(formData) => {
//     var xhr = new XMLHttpRequest();

    
//     const resp = await new Promise((resolve, reject) => {
//         xhr.addEventListener("readystatechange", function() {
//         if(this.readyState === 4) {
//             try {
//                 let response = JSON.parse(this.responseText);
//                 resolve(response);
//             } catch(e) {
//                 reject(e)
//             }
//         }
//         });
        
//         xhr.open("POST", `${constants.SAVE_RESPONSE_ENDPOINT}?${JSONtoQueryParams(formData)}`);
        
//         xhr.send();
//     });

//     return resp;
// }

// // get rsvps
// export const getRSVPS = async() => {
//     var xhr = new XMLHttpRequest();

    
//     const resp = await new Promise((resolve, reject) => {
//         xhr.open("GET", constants.GET_RSVPS_ENDPOINT);
//         xhr.onload = function() {
//             if (xhr.status !== 200) { // analyze HTTP status of the response
//               reject(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
//             } else { // show the result
//                 try {
//                     const data = JSON.parse(this.responseText);
//                     resolve(data); // response is the server
//                 } catch(e) {
//                     reject('Error parsing response')
//                 }
//             }
//           };
        
//         xhr.send();
//     });

//     return resp;
// }
