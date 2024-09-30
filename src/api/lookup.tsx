import constants from '../constants';

interface LookupResponse {
    guestData?: {
        match?: string
        suggestion?: string
    }
}

// lookup invitation from name
export  const lookup = (addressee: string): Promise<LookupResponse> => {
    var xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
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
}

export type { LookupResponse }
