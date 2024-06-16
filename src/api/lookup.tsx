import constants from './constants';

// lookup invitation from name
export  const lookup = async(addressee: String) => {
    var xhr = new XMLHttpRequest();
    
    const resp = await new Promise((resolve, reject) => {
        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            try {
                resolve(JSON.parse(this.responseText));
            } catch(e) {
                reject(e)
            }
        }
        });
        
        xhr.open("GET", `${constants.LOOKUP_ENDPOINT}?guest=${encodeURIComponent(addressee)}`);
        
        xhr.send();
    });

    return resp;
}