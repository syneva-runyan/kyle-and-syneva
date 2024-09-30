import { guestInfoType } from '../Components/RSVP/Questionaire';
import constants from '../constants';


interface saveResponseReturnObject {
    success: string | null
};


// save provided response
export default function saveResponse(guestResponse: guestInfoType): Promise<saveResponseReturnObject> {
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
        
        xhr.open("POST", `${constants.SAVE_RESPONSE_ENDPOINT}`);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(guestResponse));
    });
}

export type { saveResponseReturnObject }
